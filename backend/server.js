import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import connectDB from './config/db.js';
import { initializeSocket } from './socket.js';
import { errorHandler, notFound } from './middleware/error.js';
import {
  securityHeaders,
  sanitizeData,
  preventXSS,
  preventHPP,
  apiLimiter,
  authLimiter,
  securityLogger,
  ipFilter
} from './middleware/security.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
const httpServer = createServer(app);

// Initialize Socket.IO
initializeSocket(httpServer);

// Trust proxy (for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

// Security Middleware (applied in order)
app.use(securityHeaders); // Helmet - Security headers
app.use(ipFilter); // IP filtering
app.use(securityLogger); // Security logging

// CORS
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-XSRF-TOKEN']
}));

// Body parsing & compression
app.use(compression()); // Compress responses
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Data sanitization & security
app.use(sanitizeData); // Prevent NoSQL injection
app.use(preventXSS); // Prevent XSS attacks
app.use(preventHPP); // Prevent HTTP Parameter Pollution

// Routes
import authRoutes from './routes/authRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import driverRoutes from './routes/driverRoutes.js';
import podRoutes from './routes/podRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import driverAssignmentRoutes from './routes/driverAssignment.js';
import adminRoutes from './routes/adminRoutes.js';

// Apply rate limiting to API routes
app.use('/api/', apiLimiter);

// Apply stricter rate limiting to auth routes
app.use('/api/auth', authLimiter, authRoutes);

// Other routes
app.use('/api/bookings', bookingRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/pod', podRoutes);
app.use('/api/pay', paymentRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/driver-assignment', driverAssignmentRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'CargoRapido API is running',
    timestamp: new Date().toISOString()
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to CargoRapido API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      bookings: '/api/bookings',
      drivers: '/api/drivers',
      pod: '/api/pod',
      payments: '/api/pay',
      ai: '/api/ai'
    }
  });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

httpServer.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║           🚚  CargoRapido Server Running  🚚          ║
║                                                       ║
║   Mode: ${process.env.NODE_ENV || 'development'}
║   Port: ${PORT}
║   Database: ${process.env.MONGODB_URI ? 'Connected' : 'Not Connected'}
║                                                       ║
║   API: http://localhost:${PORT}
║   Docs: http://localhost:${PORT}/api-docs
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  httpServer.close(() => process.exit(1));
});

export default app;
