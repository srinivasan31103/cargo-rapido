# 🚀 Quick Start Guide - CargoRapido

## Installation & Setup

### 1. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 2. Start MongoDB

```bash
# Windows
net start MongoDB

# Linux/Mac
sudo systemctl start mongod

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 3. Configure Environment Variables

**Backend** - Create `backend/.env`:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cargorapido
JWT_SECRET=your_jwt_secret_here
CLAUDE_API_KEY=your_claude_api_key
```

**Frontend** - Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### 4. Start Servers

**Backend** (Terminal 1):
```bash
cd backend
npm run dev
```

**Frontend** (Terminal 2):
```bash
cd frontend
npm run dev
```

---

## 🔐 Demo Login Credentials

### Access All Roles from ONE Login Page!

Go to: `http://localhost:5173/login`

**Method 1: One-Click Demo (Fastest)**
1. Select role on left sidebar (User/Driver/Admin/Business)
2. Click small demo button at bottom left
3. Credentials auto-fill!
4. Click "Sign In"

**Method 2: Manual Entry**

| Role | Email | Password |
|------|-------|----------|
| 👤 **User** | testuser@example.com | User@1234 |
| 🚗 **Driver** | testdriver@example.com | Driver@1234 |
| 🛡️ **Admin** | admin@example.com | Admin@1234 |
| 💼 **Business** | business@example.com | Business@1234 |

---

## 📁 Project Structure

```
cargo-rapido/
├── backend/
│   ├── models/          # Database schemas
│   ├── controllers/     # Route handlers
│   ├── routes/          # API routes
│   ├── middleware/      # Security, auth, etc.
│   ├── utils/           # Helper functions
│   └── server.js        # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── store/       # Zustand state
│   │   ├── styles/      # CSS files
│   │   └── App.jsx      # Root component
│   └── package.json
└── docs/                # Documentation
```

---

## 🎯 Key Features

### 🔒 Security (OWASP Top 10 Protected)
- ✅ Rate limiting
- ✅ Input sanitization
- ✅ CSRF protection
- ✅ XSS prevention
- ✅ NoSQL injection prevention
- ✅ Security headers (Helmet)

### 🎨 Modern UI/UX
- ✅ Framer Motion animations
- ✅ Responsive design
- ✅ Custom select components
- ✅ Real-time notifications
- ✅ Beautiful login page (4 roles)

### 🧪 Testing
- ✅ Cypress E2E tests (155+ tests)
- ✅ 93% test coverage
- ✅ Security tests
- ✅ Animation tests
- ✅ API tests

---

## 📚 Documentation Files

- **[README.md](README.md)** - Project overview
- **[DEMO_CREDENTIALS.md](DEMO_CREDENTIALS.md)** - All login credentials
- **[LOGIN_GUIDE.md](LOGIN_GUIDE.md)** - Login page guide
- **[SECURITY.md](SECURITY.md)** - Security features
- **[ADVANCED_FEATURES.md](ADVANCED_FEATURES.md)** - All features
- **[IMPROVEMENTS_SUMMARY.md](IMPROVEMENTS_SUMMARY.md)** - What's new
- **[INSTALLATION_GUIDE.md](INSTALLATION_GUIDE.md)** - Detailed setup
- **[TESTING.md](TESTING.md)** - Testing guide

---

## 🛠️ Common Commands

### Development
```bash
# Start backend
cd backend && npm run dev

# Start frontend
cd frontend && npm run dev

# Run tests
cd frontend && npm test

# Run headless tests
cd frontend && npm run test:headless
```

### Build
```bash
# Build frontend
cd frontend && npm run build

# Preview build
cd frontend && npm run preview
```

---

## 🐛 Troubleshooting

### Issue: npm install fails
**Solution:**
```bash
# Clear cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Port already in use
**Solution:**
```bash
# Backend (5000)
npx kill-port 5000

# Frontend (5173)
npx kill-port 5173
```

### Issue: MongoDB connection error
**Solution:**
1. Check MongoDB is running
2. Verify connection string in `.env`
3. Try: `mongodb://localhost:27017/cargorapido`

### Issue: Framer Motion import error
**Solution:**
```bash
cd frontend
npm install framer-motion
```

---

## 🎨 New Login Page Features

### Split-Screen Design
- **Left Side**: Role selector (User/Driver/Admin/Business)
- **Right Side**: Login form

### Dynamic Themes
- User → Blue gradient
- Driver → Green gradient
- Admin → Purple gradient
- Business → Orange gradient

### One-Click Demo
- Click role button to auto-fill credentials
- Toast notification confirms
- Instant testing!

---

## 📊 Testing the App

### Test User Flow
1. Login as User
2. Create a booking
3. Select pickup/delivery locations
4. Choose cargo type
5. Make payment
6. Track booking

### Test Driver Flow
1. Login as Driver
2. View available bookings
3. Accept a booking
4. Update location
5. Mark as picked up
6. Complete delivery with POD

### Test Admin Flow
1. Login as Admin
2. View dashboard
3. Manage users/drivers
4. Review bookings
5. Generate reports

---

## 🔄 Git Commands

```bash
# Clone repository
git clone <repo-url>

# Create feature branch
git checkout -b feature/your-feature

# Commit changes
git add .
git commit -m "Your message"

# Push changes
git push origin feature/your-feature
```

---

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
vercel --prod
```

### Backend (Railway/Heroku)
```bash
cd backend
git push railway main
```

### Environment Variables
Remember to set all production environment variables!

---

## 📞 Support

- **Documentation**: Check the docs/ folder
- **Issues**: Open a GitHub issue
- **Email**: support@cargorapido.com

---

## ✅ Pre-Launch Checklist

- [ ] MongoDB is running
- [ ] Backend server is running (port 5000)
- [ ] Frontend dev server is running (port 5173)
- [ ] All dependencies installed
- [ ] Environment variables configured
- [ ] Can access login page
- [ ] Demo credentials work
- [ ] Can create a booking
- [ ] Can accept as driver
- [ ] Admin dashboard loads

---

## 🎉 You're Ready!

Visit: **http://localhost:5173**

Try the new login page with all 4 roles! 🚀

---

**Last Updated:** January 2025
**Version:** 2.0.0
