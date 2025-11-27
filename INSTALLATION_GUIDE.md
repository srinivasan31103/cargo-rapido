# 📦 Installation Guide - Advanced Features

## Quick Start

Follow these steps to install all new dependencies and run the enhanced CargoRapido application.

---

## 🔧 Prerequisites

Ensure you have:
- Node.js v18+ installed
- MongoDB running (local or Atlas)
- Git installed

---

## 🚀 Installation Steps

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

**New packages that will be installed:**
- helmet (Security headers)
- express-rate-limit (Rate limiting)
- express-mongo-sanitize (NoSQL injection prevention)
- xss-clean (XSS protection)
- hpp (HTTP Parameter Pollution prevention)
- compression (Response compression)
- cookie-parser (Cookie handling)
- express-session (Session management)

### 2. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

**New packages that will be installed:**
- framer-motion (Advanced animations)
- react-intersection-observer (Scroll animations)
- dompurify (XSS sanitization)
- @headlessui/react (Accessible UI components)
- react-confetti (Celebrations)
- chart.js (Charts)
- react-chartjs-2 (React chart wrapper)
- qrcode.react (QR code generation)
- react-countdown-circle-timer (Countdown timers)

---

## ⚙️ Configuration

### Backend Configuration

1. **Copy environment file:**
```bash
cd backend
cp .env.example .env
```

2. **Edit `.env` file:**
```env
# Existing variables (keep them)
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cargorapido
JWT_SECRET=your_jwt_secret_here
CLAUDE_API_KEY=your_claude_api_key

# NEW: Add encryption key (optional but recommended)
ENCRYPTION_KEY=your_32_character_random_string_here

# Generate encryption key:
# node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

3. **No other changes needed!** All security features are enabled by default.

### Frontend Configuration

1. **Copy environment file:**
```bash
cd frontend
cp .env.example .env
```

2. **Edit `.env` file:**
```env
# Existing variables (keep them)
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_MAPBOX_TOKEN=your_mapbox_token
VITE_RAZORPAY_KEY_ID=your_razorpay_key
```

No new frontend environment variables required!

---

## 🏃 Running the Application

### Start MongoDB

```bash
# If using local MongoDB
sudo systemctl start mongod

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Start Backend Server

```bash
cd backend
npm run dev
```

**You should see:**
```
╔═══════════════════════════════════════════════════════╗
║           🚚  CargoRapido Server Running  🚚          ║
║   Mode: development                                   ║
║   Port: 5000                                          ║
║   Database: Connected                                 ║
║   API: http://localhost:5000                          ║
╚═══════════════════════════════════════════════════════╝
```

**New security features are now active!**

### Start Frontend

```bash
cd frontend
npm run dev
```

**You should see:**
```
  VITE v5.0.8  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

## ✅ Verification

### Test Security Features

1. **Rate Limiting:**
```bash
# Try making rapid requests (should get rate limited)
for i in {1..10}; do curl http://localhost:5000/api/auth/login -X POST -H "Content-Type: application/json" -d '{"email":"test@test.com","password":"test"}'; done
```

You should get "Too many requests" error after 5 attempts.

2. **Security Headers:**
```bash
# Check security headers
curl -I http://localhost:5000
```

You should see headers like:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Strict-Transport-Security: ...`

3. **Input Sanitization:**
```bash
# Try NoSQL injection (should be sanitized)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":{"$gt":""},"password":"test"}'
```

Should return "Invalid credentials" instead of bypassing authentication.

### Test Animations

1. **Open frontend:** http://localhost:5173
2. **Navigate pages** - Notice smooth transitions
3. **Scroll down** - See scroll-reveal animations
4. **Hover over cards** - See lift/scale effects
5. **Create a booking** - See step animations

### Test Notifications

1. **Open two browser tabs**
2. **Login as user in tab 1**
3. **Login as driver in tab 2**
4. **Create booking in tab 1**
5. **Accept booking in tab 2**
6. **See real-time notifications in both tabs**

---

## 🐛 Troubleshooting

### "Module not found" errors

**Solution:**
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Rate limiting errors during development

**Solution:** Increase rate limits in `backend/middleware/security.js`:
```javascript
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000, // Increased for development
});
```

### Animations not smooth

**Solution 1:** Check browser performance
- Open DevTools → Performance
- Record and analyze

**Solution 2:** Enable hardware acceleration
- Chrome: chrome://settings → System → "Use hardware acceleration"

**Solution 3:** Disable animations for testing
```jsx
// In your component
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReducedMotion) {
  // Don't use animations
}
```

### MongoDB connection errors

**Solution:**
```bash
# Check MongoDB is running
sudo systemctl status mongod

# Check MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log

# Restart MongoDB
sudo systemctl restart mongod
```

### Port already in use

**Backend (5000):**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

**Frontend (5173):**
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

---

## 📊 Package Sizes

### Backend (Approximate)

| Package | Size | Purpose |
|---------|------|---------|
| helmet | 500KB | Security headers |
| express-rate-limit | 50KB | Rate limiting |
| express-mongo-sanitize | 20KB | NoSQL injection |
| xss-clean | 100KB | XSS protection |
| hpp | 10KB | HPP protection |
| compression | 50KB | Compression |
| cookie-parser | 20KB | Cookies |

**Total added:** ~750KB

### Frontend (Approximate)

| Package | Size | Purpose |
|---------|------|---------|
| framer-motion | 150KB | Animations |
| react-intersection-observer | 20KB | Scroll detection |
| dompurify | 50KB | XSS sanitization |
| @headlessui/react | 100KB | Accessible UI |
| react-confetti | 30KB | Celebrations |
| chart.js | 200KB | Charts |
| react-chartjs-2 | 50KB | React wrapper |
| qrcode.react | 30KB | QR codes |
| react-countdown-circle-timer | 20KB | Timers |

**Total added:** ~650KB (will be tree-shaken and compressed)

---

## 🔄 Update Existing Installation

If you already have CargoRapido installed:

### 1. Pull latest changes

```bash
git pull origin main
```

### 2. Update backend

```bash
cd backend
npm install  # Install new packages
# .env file will remain unchanged
npm run dev  # Restart server
```

### 3. Update frontend

```bash
cd frontend
npm install  # Install new packages
# .env file will remain unchanged
npm run dev  # Restart dev server
```

**That's it!** All new features are now enabled.

---

## 🧪 Testing New Features

### Security Testing

```bash
# Install testing tools
npm install -g artillery  # Load testing
npm install -g snyk      # Security scanning

# Run security scan
cd backend
snyk test

# Run load test
artillery quick --count 100 --num 10 http://localhost:5000/api/auth/login
```

### Animation Testing

```bash
# Install lighthouse
npm install -g lighthouse

# Test performance with animations
lighthouse http://localhost:5173 --view
```

---

## 📚 Next Steps

After installation:

1. **Read Documentation:**
   - `SECURITY.md` - Security features guide
   - `ADVANCED_FEATURES.md` - All features explained
   - `IMPROVEMENTS_SUMMARY.md` - What's new

2. **Customize:**
   - Adjust rate limits in `backend/middleware/security.js`
   - Customize animations in `frontend/src/components/AnimatedComponents.jsx`
   - Modify styles in `frontend/src/styles/index.css`

3. **Deploy:**
   - Set up production environment
   - Configure HTTPS/SSL
   - Set up MongoDB Atlas
   - Deploy to cloud (Railway, Vercel, etc.)

---

## 🚀 Production Deployment

### Additional Steps for Production

1. **Set NODE_ENV:**
```env
NODE_ENV=production
```

2. **Use strong secrets:**
```bash
# Generate strong JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Generate encryption key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

3. **Enable HTTPS:**
- Get SSL certificate (Let's Encrypt)
- Configure reverse proxy (Nginx)
- Force HTTPS redirect

4. **Set up monitoring:**
- Error tracking (Sentry)
- Performance monitoring (New Relic)
- Uptime monitoring (UptimeRobot)

5. **Configure firewall:**
- Only allow ports 80, 443
- Whitelist specific IPs for admin
- Enable DDoS protection

---

## ✅ Installation Checklist

- [ ] Node.js v18+ installed
- [ ] MongoDB running
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] Environment variables configured
- [ ] Backend server running
- [ ] Frontend dev server running
- [ ] Security features verified
- [ ] Animations working
- [ ] Notifications working
- [ ] Documentation read

---

## 📞 Need Help?

**Common Issues:**
- Check all existing GitHub issues
- Read troubleshooting section above
- Check documentation files

**Still stuck?**
- Email: support@cargorapido.com
- Discord: discord.gg/cargorapido
- Create GitHub issue with:
  - Error message
  - Steps to reproduce
  - Your environment (OS, Node version, etc.)

---

## 🎉 Success!

If everything is working:
- ✅ Backend running with security features
- ✅ Frontend with beautiful animations
- ✅ Real-time notifications working
- ✅ All pages loading smoothly

**You're ready to use the enhanced CargoRapido!** 🚀

---

**Version:** 2.0.0
**Last Updated:** January 2025
**Installation Time:** ~10 minutes

Happy coding! 🎉
