# 🚀 CargoRapido Quick Start Guide

## Complete Setup & Run Instructions

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v5 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **Git** - [Download](https://git-scm.com/)
- **Code Editor** (VS Code recommended)

---

## 🛠️ Installation Steps

### Step 1: Clone or Navigate to Project
```bash
cd "e:\Sri\cargo rapido"
```

### Step 2: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 3: Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

---

## 🔧 Configuration

### Backend Configuration

1. **Create `.env` file** in `backend` folder:
```bash
cd backend
copy .env.example .env  # Windows
# or
cp .env.example .env    # Mac/Linux
```

2. **Edit `.env` file** with your configuration:
```env
NODE_ENV=development
PORT=5000

# Database (use your MongoDB connection string)
MONGODB_URI=mongodb://localhost:27017/cargorapido

# JWT Secret (change this to a random string)
JWT_SECRET=your_super_secret_jwt_key_12345
JWT_EXPIRE=7d

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Cloudinary (for image uploads - optional for testing)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Razorpay (for payments - optional for testing)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Claude AI (optional)
CLAUDE_API_KEY=your_claude_api_key

# Google Maps API (optional)
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Driver Settings
DRIVER_SEARCH_RADIUS=10
DRIVER_ASSIGNMENT_TIMEOUT=60000

# Pricing
BASE_FARE=50
PER_KM_RATE=12
SURGE_MULTIPLIER_MAX=2.5
```

### Frontend Configuration

1. **Create `.env` file** in `frontend` folder:
```bash
cd ../frontend
copy .env.example .env  # Windows
# or
cp .env.example .env    # Mac/Linux
```

2. **Edit `.env` file**:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
VITE_MAPBOX_TOKEN=your_mapbox_token
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

---

## 🗄️ Database Setup

### Option 1: Local MongoDB

1. **Start MongoDB** service:
```bash
# Windows (as Administrator)
net start MongoDB

# Mac/Linux
sudo systemctl start mongod
# or
brew services start mongodb-community
```

2. **Verify MongoDB** is running:
```bash
mongosh
# or
mongo
```

### Option 2: MongoDB Atlas (Cloud)

1. Create free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in backend `.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cargorapido?retryWrites=true&w=majority
```

---

## 🌱 Seed Demo Data (Optional)

Load sample data for testing:

```bash
cd backend
node scripts/seedUsers.js
```

This creates demo accounts:
- **Admin:** admin@example.com / Admin@1234
- **User:** testuser@example.com / User@1234
- **Driver:** testdriver@example.com / Driver@1234
- **Business:** business@example.com / Business@1234

---

## ▶️ Running the Application

### Method 1: Run Both Servers Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Method 2: Run from Root (if configured)

```bash
npm run dev
```

---

## 🌐 Access the Application

After starting both servers:

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **API Health Check:** http://localhost:5000/health

---

## 🧪 Testing the Setup

### 1. Test Backend API
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "success": true,
  "message": "CargoRapido API is running",
  "timestamp": "2025-11-14T..."
}
```

### 2. Test Frontend
Open browser and navigate to: http://localhost:5173

### 3. Test Login
Use demo credentials:
- Email: `testuser@example.com`
- Password: `User@1234`

---

## 📱 Application Pages

### Public Pages
- **Home:** http://localhost:5173/
- **Login:** http://localhost:5173/login
- **Register:** http://localhost:5173/register
- **Driver Login:** http://localhost:5173/driver/login
- **Driver Register:** http://localhost:5173/driver/register
- **Forgot Password:** http://localhost:5173/forgot-password
- **Reset Password:** http://localhost:5173/reset-password

### User Pages (After Login)
- **Dashboard:** http://localhost:5173/user/home
- **New Booking:** http://localhost:5173/user/new-booking
- **My Deliveries:** http://localhost:5173/user/my-deliveries
- **Live Tracking:** http://localhost:5173/user/tracking/:id
- **Wallet:** http://localhost:5173/user/wallet
- **Profile:** http://localhost:5173/user/profile

### Business Pages
- **Business Dashboard:** http://localhost:5173/business/dashboard

### Driver Pages (After Login)
- **Driver Dashboard:** http://localhost:5173/driver/dashboard
- **Incoming Requests:** http://localhost:5173/driver/requests
- **Start Ride:** http://localhost:5173/driver/ride/:id
- **Upload POD:** http://localhost:5173/driver/pod/:id
- **Earnings:** http://localhost:5173/driver/earnings

### Admin Pages (Admin Login)
- **Admin Dashboard:** http://localhost:5173/admin/dashboard
- **Manage Users:** http://localhost:5173/admin/users
- **Manage Drivers:** http://localhost:5173/admin/drivers
- **Live Bookings Map:** http://localhost:5173/admin/live-map
- **Revenue Stats:** http://localhost:5173/admin/revenue
- **Settings:** http://localhost:5173/admin/settings

---

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/driver/register` - Driver registration
- `POST /api/auth/driver/login` - Driver login
- `GET /api/auth/profile` - Get profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/forgot-password` - Forgot password
- `POST /api/auth/reset-password` - Reset password

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/:id` - Get booking
- `POST /api/bookings/estimate` - Estimate price
- `PUT /api/bookings/:id/cancel` - Cancel booking

### Admin
- `GET /api/admin/dashboard/stats` - Dashboard stats
- `GET /api/admin/users` - List users
- `GET /api/admin/drivers` - List drivers
- `GET /api/admin/bookings` - List bookings

### Drivers
- `PUT /api/drivers/status` - Update status
- `PUT /api/drivers/location` - Update location
- `GET /api/drivers/stats` - Get stats

### Payments
- `POST /api/pay/wallet/recharge` - Recharge wallet
- `GET /api/pay/wallet/balance` - Get balance

---

## 🐛 Troubleshooting

### Backend Won't Start

**Issue:** Port 5000 already in use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

**Issue:** MongoDB connection error
- Verify MongoDB is running
- Check `MONGODB_URI` in `.env`
- Ensure network access if using Atlas

### Frontend Won't Start

**Issue:** Port 5173 already in use
```bash
# Kill process using port 5173
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5173 | xargs kill -9
```

**Issue:** API connection error
- Ensure backend is running on port 5000
- Check `VITE_API_URL` in frontend `.env`
- Check CORS settings in backend

### Common Issues

**Issue:** "Module not found" error
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**Issue:** Database connection timeout
- Check MongoDB is running
- Verify connection string
- Check firewall settings (if using Atlas)

---

## 📦 Build for Production

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

---

## 🔒 Security Checklist

Before deploying to production:

- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Update MongoDB credentials
- [ ] Add real Cloudinary credentials
- [ ] Add real Razorpay credentials
- [ ] Configure email service (SendGrid, AWS SES)
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS
- [ ] Configure firewall rules
- [ ] Set up rate limiting
- [ ] Enable monitoring and logging

---

## 📚 Additional Resources

- **Full Documentation:** See `BUG_FIXES_AND_IMPROVEMENTS.md`
- **API Documentation:** http://localhost:5000 (when running)
- **Database Models:** `backend/models/`
- **Routes:** `backend/routes/`
- **Controllers:** `backend/controllers/`

---

## 💡 Quick Tips

1. **Hot Reload:** Both frontend and backend support hot reload - changes reflect automatically
2. **Debug Mode:** Use `console.log()` - all logs appear in terminal
3. **Database GUI:** Use [MongoDB Compass](https://www.mongodb.com/products/compass) for visual database management
4. **API Testing:** Use [Postman](https://www.postman.com/) or [Thunder Client](https://www.thunderclient.com/) VS Code extension
5. **Email Testing:** Check terminal/console for password reset links (in development mode)

---

## 🆘 Need Help?

**Common Commands:**

```bash
# Check Node version
node --version

# Check npm version
npm --version

# Check MongoDB status
mongosh --eval "db.version()"

# View backend logs
cd backend
npm run dev

# View frontend logs
cd frontend
npm run dev

# Clear npm cache
npm cache clean --force

# Reset project
rm -rf node_modules package-lock.json
npm install
```

**Still stuck?**
- Check the error message carefully
- Verify all prerequisites are installed
- Ensure all configuration files are correct
- Check if all required services are running

---

## ✅ Success Checklist

- [ ] MongoDB is running
- [ ] Backend `.env` file configured
- [ ] Frontend `.env` file configured
- [ ] Backend dependencies installed (`npm install`)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Backend server running (port 5000)
- [ ] Frontend server running (port 5173)
- [ ] Can access http://localhost:5173
- [ ] Can login with demo credentials
- [ ] Database connection successful

---

**🎉 You're all set! Happy coding with CargoRapido!**

---

**Last Updated:** November 14, 2025
**Version:** 1.0.0
**Status:** Production Ready ✅
