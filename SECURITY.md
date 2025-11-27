# 🔒 Security Features & Best Practices

## Overview

CargoRapido implements comprehensive security measures to protect user data, prevent attacks, and ensure safe operations.

---

## 🛡️ Backend Security Features

### 1. **Rate Limiting**

Prevents brute force and DDoS attacks by limiting request frequency.

**Implementation:**
- **API Routes**: 100 requests per 15 minutes per IP
- **Authentication**: 5 login attempts per 15 minutes
- **Payments**: 10 requests per hour

```javascript
// Usage in server.js
app.use('/api/', apiLimiter);
app.use('/api/auth', authLimiter);
app.use('/api/pay', paymentLimiter);
```

### 2. **Security Headers (Helmet)**

Protects against common web vulnerabilities.

**Headers Applied:**
- `Content-Security-Policy` - Prevents XSS attacks
- `X-Frame-Options` - Prevents clickjacking
- `X-Content-Type-Options` - Prevents MIME sniffing
- `Strict-Transport-Security` - Forces HTTPS
- `Referrer-Policy` - Controls referrer information

### 3. **Input Sanitization**

**NoSQL Injection Prevention:**
```javascript
// Automatically sanitizes MongoDB queries
app.use(mongoSanitize());
```

**XSS Prevention:**
```javascript
// Cleans user input from malicious scripts
app.use(xss());
```

**HTTP Parameter Pollution:**
```javascript
// Prevents duplicate parameters attacks
app.use(hpp());
```

### 4. **CSRF Protection**

Protects against Cross-Site Request Forgery attacks.

```javascript
// Generate token
app.use(generateCSRFToken);

// Validate on state-changing requests
app.use(validateCSRFToken);
```

**Frontend Implementation:**
```javascript
// Include CSRF token in requests
axios.defaults.headers['X-XSRF-TOKEN'] = getCsrfToken();
```

### 5. **Password Security**

- **Bcrypt** hashing with salt rounds: 10
- **Minimum Requirements**:
  - 8+ characters
  - 1 uppercase letter
  - 1 lowercase letter
  - 1 number
- Passwords never stored in plain text
- Passwords excluded from API responses by default

### 6. **JWT Authentication**

**Token Security:**
- Signed with secret key
- 7-day expiration
- Stored in localStorage (httpOnly cookies recommended for production)
- Validated on every protected route

**Token Structure:**
```json
{
  "id": "user_id",
  "role": "user|driver|admin",
  "iat": "issued_at",
  "exp": "expiration"
}
```

### 7. **Role-Based Access Control (RBAC)**

```javascript
// Middleware
protect // Requires authentication
authorize(...roles) // Requires specific roles

// Example
app.post('/api/bookings', protect, authorize('user', 'business'), createBooking);
```

**Roles:**
- `user` - Regular customers
- `business` - Business accounts with bulk features
- `driver` - Delivery drivers
- `admin` - Platform administrators

### 8. **File Upload Security**

**Validations:**
- Allowed types: JPEG, PNG, WebP only
- Maximum size: 5MB
- Automatic virus scanning (recommended for production)
- Files stored on Cloudinary (not local server)

```javascript
const validateFileUpload = {
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
  maxFileSize: 5 * 1024 * 1024
};
```

### 9. **IP Filtering**

**Features:**
- IP blacklist for banned users
- IP whitelist for admin access
- Automatic blocking after suspicious activity
- Rate limit tracking per IP

```javascript
// Block an IP
blockIP('192.168.1.1');

// Unblock
unblockIP('192.168.1.1');
```

### 10. **Security Monitoring & Logging**

**Logged Activities:**
- Failed login attempts
- Suspicious URL patterns
- SQL injection attempts
- XSS attack attempts
- Large request bodies
- Unusual API access patterns

```javascript
// Suspicious patterns detected
[SECURITY WARNING] 2024-01-15T10:30:00Z
IP: 192.168.1.100
Method: POST
URL: /api/auth/login?union=select
User-Agent: Mozilla/5.0...
```

### 11. **Data Encryption**

**Sensitive Data Encryption:**
```javascript
// Encrypt
const encrypted = encryptionUtils.encrypt('sensitive_data');

// Decrypt
const decrypted = encryptionUtils.decrypt(encrypted);
```

**Use Cases:**
- Payment card data
- Personal identification numbers
- API keys stored in database
- Sensitive logs

### 12. **Request Size Limits**

```javascript
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb' }));
```

Prevents memory exhaustion attacks.

### 13. **CORS Configuration**

```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-XSRF-TOKEN']
}));
```

Only allows requests from authorized origins.

### 14. **Compression**

```javascript
app.use(compression());
```

Reduces response size to prevent bandwidth attacks.

---

## 🔐 Frontend Security Features

### 1. **XSS Prevention**

**DOMPurify Integration:**
```javascript
import DOMPurify from 'dompurify';

// Sanitize user input before rendering
const clean = DOMPurify.sanitize(userInput);
```

**Applied to:**
- User-generated content
- Comments and reviews
- Profile information
- Search queries

### 2. **Secure Data Storage**

**localStorage Security:**
```javascript
// Never store sensitive data in localStorage
// Store only:
- Authentication tokens (short-lived)
- User preferences
- Non-sensitive UI state
```

**Recommended for Production:**
- Use httpOnly cookies for tokens
- Implement refresh token rotation
- Clear storage on logout

### 3. **Content Security Policy (CSP)**

Implemented via Helmet on backend, enforced on frontend.

**Policy:**
- No inline scripts (except whitelisted)
- External resources only from trusted domains
- No eval() or similar functions
- Frame ancestors limited

### 4. **Secure Communication**

**HTTPS Only (Production):**
```javascript
// Redirect HTTP to HTTPS
if (window.location.protocol !== 'https:' && process.env.NODE_ENV === 'production') {
  window.location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
}
```

### 5. **Input Validation**

**Client-side validation:**
```javascript
// Email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Phone validation
const phoneRegex = /^[0-9]{10}$/;

// Password strength
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
```

**Always validated on server as well** (never trust client-side validation alone).

### 6. **Dependency Security**

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Update dependencies regularly
npm update
```

**Automated Scanning:**
- GitHub Dependabot
- Snyk integration
- Regular security audits

---

## 🚨 Attack Prevention

### SQL Injection ✅ PROTECTED

**Method:** Mongoose ORM with parameterized queries
**Additional:** Input sanitization middleware

### NoSQL Injection ✅ PROTECTED

**Method:** `express-mongo-sanitize` removes $ and . characters
**Example Attack Blocked:**
```json
// Attack attempt
{ "email": { "$gt": "" } }

// Sanitized to
{ "email": "_gt_" }
```

### XSS (Cross-Site Scripting) ✅ PROTECTED

**Methods:**
- `xss-clean` middleware
- DOMPurify on frontend
- Content Security Policy headers
- Input validation

### CSRF (Cross-Site Request Forgery) ✅ PROTECTED

**Methods:**
- CSRF tokens on state-changing requests
- SameSite cookie attribute
- Origin/Referer header validation

### Clickjacking ✅ PROTECTED

**Method:** X-Frame-Options header set to DENY

### Brute Force ✅ PROTECTED

**Methods:**
- Rate limiting on auth endpoints
- Account lockout after failed attempts
- CAPTCHA (recommended for production)

### DDoS ✅ PROTECTED

**Methods:**
- Rate limiting
- Request size limits
- Compression
- Cloudflare (recommended for production)

### Man-in-the-Middle ✅ PROTECTED

**Methods:**
- HTTPS enforcement
- HSTS headers
- Certificate pinning (recommended for mobile)

### Session Hijacking ✅ PROTECTED

**Methods:**
- Secure token generation
- Token expiration
- Refresh token rotation
- IP binding (optional)

---

## 📋 Security Checklist

### Development

- [ ] Use environment variables for secrets
- [ ] Never commit `.env` files
- [ ] Use `.gitignore` properly
- [ ] Keep dependencies updated
- [ ] Run security audits regularly
- [ ] Use HTTPS in development (recommended)

### Production

- [ ] Enable HTTPS/SSL certificate
- [ ] Set `NODE_ENV=production`
- [ ] Use strong JWT secret (64+ characters)
- [ ] Enable rate limiting
- [ ] Set up firewall rules
- [ ] Configure WAF (Web Application Firewall)
- [ ] Enable database encryption at rest
- [ ] Set up automated backups
- [ ] Implement logging and monitoring
- [ ] Use httpOnly cookies for tokens
- [ ] Enable 2FA for admin accounts
- [ ] Regular security audits
- [ ] Penetration testing
- [ ] Incident response plan

### Database

- [ ] Enable MongoDB authentication
- [ ] Use strong database passwords
- [ ] Whitelist IP addresses
- [ ] Enable SSL/TLS for connections
- [ ] Regular backups
- [ ] Encryption at rest
- [ ] Audit logging enabled

### API Keys

- [ ] Use separate keys for dev/prod
- [ ] Rotate keys regularly
- [ ] Monitor key usage
- [ ] Set up usage limits
- [ ] Never expose keys in frontend

---

## 🔧 Security Configuration

### Environment Variables

```env
# Security
JWT_SECRET=<64-character-random-string>
ENCRYPTION_KEY=<32-character-random-string>

# Generate strong secrets
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### MongoDB Security

```javascript
// Enable authentication
mongod --auth

// Create admin user
use admin
db.createUser({
  user: "admin",
  pwd: "strong_password",
  roles: ["root"]
})

// Create app user
use cargorapido
db.createUser({
  user: "cargorapido_app",
  pwd: "strong_password",
  roles: ["readWrite"]
})
```

### SSL/TLS Setup (Production)

```javascript
import https from 'https';
import fs from 'fs';

const options = {
  key: fs.readFileSync('private-key.pem'),
  cert: fs.readFileSync('certificate.pem')
};

https.createServer(options, app).listen(443);
```

---

## 🔍 Security Monitoring

### Logging

**What to Log:**
- Authentication attempts (success/failure)
- Authorization failures
- Input validation failures
- Rate limit triggers
- Suspicious patterns
- API errors
- Database queries (sanitized)

**What NOT to Log:**
- Passwords (even hashed)
- Credit card numbers
- Personal identification numbers
- API keys
- Session tokens

### Monitoring Tools (Recommended)

- **Sentry** - Error tracking
- **LogRocket** - Session replay
- **Datadog** - Infrastructure monitoring
- **New Relic** - Application performance
- **AWS GuardDuty** - Threat detection

---

## 📞 Security Incident Response

### If You Detect a Breach:

1. **Isolate** - Immediately block the attack vector
2. **Assess** - Determine scope and impact
3. **Contain** - Prevent further damage
4. **Notify** - Inform affected users (if required by law)
5. **Remediate** - Fix the vulnerability
6. **Review** - Analyze how it happened
7. **Improve** - Update security measures

### Emergency Contacts:

- Security Team: security@cargorapido.com
- On-call Engineer: +1-XXX-XXX-XXXX
- Legal Team: legal@cargorapido.com

---

## 🎓 Security Resources

### Learning

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [MongoDB Security Checklist](https://docs.mongodb.com/manual/administration/security-checklist/)

### Tools

- **npm audit** - Vulnerability scanning
- **Snyk** - Continuous security monitoring
- **ZAP** - Penetration testing
- **Burp Suite** - Security testing

---

## ✅ Security Compliance

### GDPR Compliance

- User data encryption
- Right to erasure
- Data portability
- Consent management
- Privacy policy

### PCI DSS (If handling cards directly)

- Never store CVV
- Tokenize card data
- Use PCI-compliant payment gateway (Razorpay)
- Regular security audits

---

**Last Updated:** January 2025
**Version:** 1.0.0
**Security Team:** security@cargorapido.com

🔒 **Remember:** Security is an ongoing process, not a one-time setup. Stay vigilant!
