import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import xss from 'xss-clean';
import hpp from 'hpp';

// Rate limiting
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many requests. Please try again later.',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
    });
  }
});

// Stricter rate limit for authentication endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Only 5 login attempts per 15 minutes
  message: 'Too many login attempts, please try again later.',
  skipSuccessfulRequests: true
});

// Rate limit for payment endpoints
export const paymentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: 'Too many payment requests, please try again later.'
});

// Security headers middleware
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://api.mapbox.com'],
      scriptSrc: ["'self'", "'unsafe-inline'", 'https://checkout.razorpay.com', 'https://api.mapbox.com'],
      imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
      connectSrc: ["'self'", 'https://api.mapbox.com', 'wss:', 'ws:'],
      fontSrc: ["'self'", 'https:', 'data:'],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'self'", 'https://api.razorpay.com']
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
});

// Sanitize data to prevent NoSQL injection
export const sanitizeData = mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    console.warn(`Sanitized field: ${key} in request from ${req.ip}`);
  }
});

// Prevent XSS attacks
export const preventXSS = xss();

// Prevent HTTP Parameter Pollution
export const preventHPP = hpp({
  whitelist: ['status', 'role', 'cargoSize', 'vehicleType']
});

// Request logging for security monitoring
export const securityLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const ip = req.ip || req.connection.remoteAddress;
  const userAgent = req.get('user-agent');

  // Log suspicious patterns
  const suspiciousPatterns = [
    /(\<script|javascript:|onerror=|onload=)/i,
    /(union.*select|insert.*into|drop.*table)/i,
    /(\.\.\/|\.\.\\)/,
    /(%27|%22|%3C|%3E)/
  ];

  const isSuspicious = suspiciousPatterns.some(pattern =>
    pattern.test(url) || pattern.test(JSON.stringify(req.body))
  );

  if (isSuspicious) {
    console.warn(`[SECURITY WARNING] ${timestamp} - Suspicious request detected`);
    console.warn(`IP: ${ip}, Method: ${method}, URL: ${url}`);
    console.warn(`User-Agent: ${userAgent}`);
  }

  next();
};

// Input validation helper
export const validateInput = {
  email: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  phone: (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  },

  password: (password) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  },

  sanitizeString: (str) => {
    return str.replace(/[<>\"']/g, '');
  },

  isValidObjectId: (id) => {
    return /^[0-9a-fA-F]{24}$/.test(id);
  }
};

// CSRF Token generation and validation
import crypto from 'crypto';

const csrfTokens = new Map();

export const generateCSRFToken = (req, res, next) => {
  const token = crypto.randomBytes(32).toString('hex');
  const userId = req.user?._id?.toString() || req.ip;

  csrfTokens.set(userId, {
    token,
    expires: Date.now() + 3600000 // 1 hour
  });

  res.cookie('XSRF-TOKEN', token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 3600000
  });

  next();
};

export const validateCSRFToken = (req, res, next) => {
  // Skip CSRF for GET requests
  if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
    return next();
  }

  const token = req.headers['x-xsrf-token'] || req.body._csrf;
  const userId = req.user?._id?.toString() || req.ip;

  const storedToken = csrfTokens.get(userId);

  if (!storedToken || storedToken.expires < Date.now()) {
    csrfTokens.delete(userId);
    return res.status(403).json({ message: 'CSRF token expired' });
  }

  if (storedToken.token !== token) {
    return res.status(403).json({ message: 'Invalid CSRF token' });
  }

  next();
};

// Clean up expired CSRF tokens every hour
setInterval(() => {
  const now = Date.now();
  for (const [userId, data] of csrfTokens.entries()) {
    if (data.expires < now) {
      csrfTokens.delete(userId);
    }
  }
}, 3600000);

// File upload validation
export const validateFileUpload = {
  allowedImageTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  maxFileSize: 5 * 1024 * 1024, // 5MB

  isValidImage: (file) => {
    return validateFileUpload.allowedImageTypes.includes(file.mimetype) &&
           file.size <= validateFileUpload.maxFileSize;
  }
};

// Encryption utilities
export const encryptionUtils = {
  encrypt: (text) => {
    const algorithm = 'aes-256-cbc';
    const key = crypto.scryptSync(process.env.ENCRYPTION_KEY || 'secret', 'salt', 32);
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return `${iv.toString('hex')}:${encrypted}`;
  },

  decrypt: (encryptedText) => {
    const algorithm = 'aes-256-cbc';
    const key = crypto.scryptSync(process.env.ENCRYPTION_KEY || 'secret', 'salt', 32);

    const [ivHex, encrypted] = encryptedText.split(':');
    const iv = Buffer.from(ivHex, 'hex');

    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }
};

// IP Whitelist/Blacklist
const blacklistedIPs = new Set();
const whitelistedIPs = new Set(['127.0.0.1', '::1']); // Localhost always whitelisted

export const ipFilter = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;

  if (blacklistedIPs.has(ip)) {
    return res.status(403).json({ message: 'Access denied' });
  }

  next();
};

export const blockIP = (ip) => {
  blacklistedIPs.add(ip);
  console.log(`IP ${ip} has been blacklisted`);
};

export const unblockIP = (ip) => {
  blacklistedIPs.delete(ip);
  console.log(`IP ${ip} has been removed from blacklist`);
};
