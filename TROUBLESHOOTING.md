# 🔧 Troubleshooting Guide - CargoRapido Login Issues

## Common Sign-In Issues & Solutions

### ❌ Issue 1: "Login failed" or No Response

**Symptoms:**
- Click "Sign In" but nothing happens
- Error toast appears saying "Login failed"
- Console shows network errors

**Causes & Solutions:**

#### 1. Backend Server Not Running
```bash
# Check if backend is running
curl http://localhost:5000/api/health

# If not, start the backend
cd backend
npm run dev
```

**Expected output:**
```
Server running on port 5000
MongoDB connected
```

#### 2. MongoDB Not Running
```bash
# Windows
net start MongoDB

# Linux/Mac
sudo systemctl start mongod

# Check if MongoDB is running
mongo --version
```

#### 3. Demo Users Don't Exist in Database

**Solution: Create a database seed script**

Create `backend/scripts/seedUsers.js`:

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const seedUsers = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/cargorapido');

    // Clear existing users (optional)
    await User.deleteMany({});

    // Create demo users
    const users = [
      {
        name: 'Test User',
        email: 'testuser@example.com',
        password: await bcrypt.hash('User@1234', 10),
        phone: '+919876543210',
        role: 'user'
      },
      {
        name: 'Test Driver',
        email: 'testdriver@example.com',
        password: await bcrypt.hash('Driver@1234', 10),
        phone: '+919876543211',
        role: 'driver'
      },
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: await bcrypt.hash('Admin@1234', 10),
        phone: '+919876543212',
        role: 'admin'
      },
      {
        name: 'Business User',
        email: 'business@example.com',
        password: await bcrypt.hash('Business@1234', 10),
        phone: '+919876543213',
        role: 'business'
      }
    ];

    await User.insertMany(users);
    console.log('✅ Demo users created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers();
```

**Run the seed script:**
```bash
cd backend
node scripts/seedUsers.js
```

---

### ❌ Issue 2: CORS Errors

**Symptoms:**
- Console shows "CORS policy" errors
- "Access-Control-Allow-Origin" errors

**Solution: Configure CORS in backend**

In `backend/server.js`:
```javascript
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

---

### ❌ Issue 3: JWT Token Issues

**Symptoms:**
- Login appears successful but redirects back to login
- "Token expired" messages

**Solution: Check JWT configuration**

In `backend/.env`:
```env
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
JWT_EXPIRE=7d
```

---

### ❌ Issue 4: API Endpoint Mismatch

**Symptoms:**
- 404 errors in console
- "Cannot POST /api/auth/login"

**Solution: Verify backend routes**

Check `backend/routes/auth.js` has:
```javascript
router.post('/login', authController.login);
router.post('/register', authController.register);
```

And in `backend/server.js`:
```javascript
app.use('/api/auth', authRoutes);
```

---

### ❌ Issue 5: Password Hashing Mismatch

**Symptoms:**
- Always shows "Invalid credentials"
- Even with correct password

**Solution: Ensure bcrypt is used consistently**

In `backend/controllers/authController.js`:
```javascript
// When creating user
const hashedPassword = await bcrypt.hash(password, 10);

// When logging in
const isPasswordValid = await bcrypt.compare(password, user.password);
```

---

## 🔍 Debugging Steps

### Step 1: Check Console Errors

Open browser DevTools (F12) → Console tab

Look for:
- Network errors (red)
- API endpoint errors
- CORS errors

### Step 2: Check Network Tab

DevTools → Network tab → Try logging in

Check:
- Request URL: Should be `http://localhost:5000/api/auth/login`
- Status Code: Should be 200 (not 404, 500, etc.)
- Response: Should contain `{ success: true, token: "..." }`

### Step 3: Check Backend Logs

In the terminal where backend is running:

Look for:
- "Login attempt for: [email]"
- Any error messages
- MongoDB connection status

### Step 4: Test API Directly

Use curl or Postman:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@example.com","password":"User@1234"}'
```

**Expected response:**
```json
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "id": "...",
    "email": "testuser@example.com",
    "role": "user"
  }
}
```

---

## 🛠️ Quick Fixes

### Fix 1: Reset Everything

```bash
# Stop all servers
# Ctrl+C in both terminals

# Clear node_modules
cd backend && rm -rf node_modules package-lock.json
cd ../frontend && rm -rf node_modules package-lock.json

# Reinstall
cd backend && npm install
cd ../frontend && npm install

# Restart MongoDB
# (see MongoDB commands above)

# Restart servers
cd backend && npm run dev
cd ../frontend && npm run dev
```

### Fix 2: Clear Browser Data

1. Open DevTools (F12)
2. Application tab → Storage
3. Clear: LocalStorage, SessionStorage, Cookies
4. Reload page (Ctrl+R)

### Fix 3: Check .env Files

**Backend `.env`:**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cargorapido
JWT_SECRET=your_jwt_secret_minimum_32_characters_long
```

**Frontend `.env`:**
```env
VITE_API_URL=http://localhost:5000/api
```

---

## ✅ Verification Checklist

Before trying to login, verify:

- [ ] MongoDB is running
- [ ] Backend server is running on port 5000
- [ ] Frontend dev server is running on port 5173
- [ ] No CORS errors in console
- [ ] Demo users exist in database
- [ ] .env files are configured
- [ ] No port conflicts

---

## 🔬 Advanced Debugging

### Enable Detailed Logging

In `backend/server.js`:
```javascript
// Add request logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});
```

### Check Database Connection

```javascript
// In backend/server.js
mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB connected');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB error:', err);
});
```

### Test Individual Components

**Test 1: Database Query**
```bash
mongo cargorapido
db.users.find({ email: 'testuser@example.com' })
```

**Test 2: API Health Check**
```bash
curl http://localhost:5000/api/health
```

**Test 3: Frontend Connection**
```javascript
// In browser console
fetch('http://localhost:5000/api/health')
  .then(r => r.json())
  .then(console.log)
```

---

## 🚨 Common Error Messages

### "Network Error"
- Backend is not running
- Wrong API URL in frontend .env
- Firewall blocking connection

### "401 Unauthorized"
- Wrong credentials
- User doesn't exist in database
- Password hashing mismatch

### "404 Not Found"
- Wrong API endpoint
- Routes not registered correctly
- Backend route file missing

### "500 Internal Server Error"
- Database connection failed
- Error in backend controller
- Check backend console for details

---

## 📞 Still Not Working?

### Collect This Information:

1. **Error Message** (exact text)
2. **Console Errors** (screenshot)
3. **Network Tab** (failed request details)
4. **Backend Logs** (terminal output)
5. **Environment**:
   - Node version: `node --version`
   - npm version: `npm --version`
   - MongoDB version: `mongo --version`
   - OS: Windows/Mac/Linux

### Create Minimal Test Case:

1. Fresh database:
```bash
mongo
use cargorapido
db.dropDatabase()
```

2. Run seed script
3. Restart backend
4. Clear browser data
5. Try login again

---

## 💡 Pro Tips

1. **Always check backend logs first**
2. **Use browser DevTools Network tab**
3. **Test API with curl/Postman before frontend**
4. **Keep MongoDB running in separate terminal**
5. **Use `console.log` liberally during debugging**

---

## 🎯 Quick Test Script

Save as `test-login.sh`:

```bash
#!/bin/bash

echo "🔍 Testing CargoRapido Login System..."

echo "\n1. Checking MongoDB..."
if pgrep -x "mongod" > /dev/null; then
    echo "✅ MongoDB is running"
else
    echo "❌ MongoDB is NOT running"
fi

echo "\n2. Checking Backend..."
if curl -s http://localhost:5000/api/health > /dev/null; then
    echo "✅ Backend is running"
else
    echo "❌ Backend is NOT running"
fi

echo "\n3. Checking Frontend..."
if curl -s http://localhost:5173 > /dev/null; then
    echo "✅ Frontend is running"
else
    echo "❌ Frontend is NOT running"
fi

echo "\n4. Testing Login API..."
response=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@example.com","password":"User@1234"}')

if echo "$response" | grep -q "token"; then
    echo "✅ Login API works!"
else
    echo "❌ Login API failed"
    echo "Response: $response"
fi

echo "\n✅ Done!"
```

Run:
```bash
chmod +x test-login.sh
./test-login.sh
```

---

**Last Updated:** January 2025
**For More Help:** Check [QUICK_START.md](QUICK_START.md)
