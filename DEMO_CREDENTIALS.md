# 🔐 Demo Login Credentials - CargoRapido

## Overview

This document contains all demo login credentials for testing the CargoRapido application. These accounts are pre-configured with different roles and permissions.

---

## 🧑‍💼 User Accounts

### Test User 1 (Regular User)
```
Email:    testuser@example.com
Password: Test@1234
Role:     User
```
**Features Access:**
- Create bookings
- View booking history
- Track live deliveries
- Make payments
- Manage profile
- View wallet balance
- Rate drivers

### Test User 2 (Premium User)
```
Email:    premium@example.com
Password: Premium@1234
Role:     User (Premium)
```
**Features Access:**
- All regular user features
- Priority support
- Discount on bookings
- Multiple saved addresses
- Booking preferences

### Test User 3 (Business User)
```
Email:    business@example.com
Password: Business@1234
Role:     Business User
```
**Features Access:**
- Bulk bookings
- Business dashboard
- Analytics and reports
- Multiple sub-accounts
- Invoice management
- Custom pricing

---

## 🚗 Driver Accounts

### Test Driver 1 (Bike)
```
Email:    testdriver@example.com
Password: Driver@1234
Role:     Driver
Vehicle:  Bike
Status:   Active
```
**Features Access:**
- View available bookings
- Accept/reject bookings
- Update location
- Complete deliveries (POD)
- View earnings
- Manage profile
- Vehicle details

### Test Driver 2 (Auto Rickshaw)
```
Email:    driver.auto@example.com
Password: Driver@1234
Role:     Driver
Vehicle:  Auto Rickshaw
Status:   Active
```

### Test Driver 3 (Mini Truck)
```
Email:    driver.truck@example.com
Password: Driver@1234
Role:     Driver
Vehicle:  Mini Truck
Status:   Active
```

### Test Driver 4 (Truck - Large)
```
Email:    driver.large@example.com
Password: Driver@1234
Role:     Driver
Vehicle:  Large Truck
Status:   Active
```

---

## 👨‍💼 Admin Accounts

### Super Admin
```
Email:    admin@example.com
Password: Admin@1234
Role:     Super Admin
```
**Features Access:**
- Full system access
- User management
- Driver management
- Booking management
- Analytics dashboard
- System settings
- Payment management
- Reports and exports

### Support Admin
```
Email:    support@example.com
Password: Support@1234
Role:     Support Admin
```
**Features Access:**
- View all bookings
- Customer support
- Resolve disputes
- View user/driver details
- Limited admin access

### Finance Admin
```
Email:    finance@example.com
Password: Finance@1234
Role:     Finance Admin
```
**Features Access:**
- Payment management
- Transaction history
- Refund processing
- Financial reports
- Driver payouts

---

## 🏢 Business Partner Accounts

### Partner 1 (Logistics Company)
```
Email:    partner@logistics.com
Password: Partner@1234
Role:     Business Partner
Company:  FastTrack Logistics
```

### Partner 2 (E-commerce)
```
Email:    partner@ecommerce.com
Password: Partner@1234
Role:     Business Partner
Company:  ShopNow
```

---

## 🧪 Test Accounts (For Development)

### Cypress Test User
```
Email:    cypress_user@test.com
Password: Cypress@1234
Role:     User
Purpose:  Automated testing
```

### Cypress Test Driver
```
Email:    cypress_driver@test.com
Password: Cypress@1234
Role:     Driver
Purpose:  Automated testing
```

---

## 🔑 API Keys (For Testing)

### Claude AI API Key
```
Purpose:  AI route optimization, price suggestions
Note:     Add to backend .env file
```

### Razorpay Test Keys
```
Key ID:     rzp_test_[your_key_here]
Key Secret: [your_secret_here]
Purpose:    Payment testing
Mode:       Test Mode
```

### Mapbox Token
```
Token:    pk.eyJ1... [your_token_here]
Purpose:  Maps and geolocation
```

### Google Maps API Key
```
Key:      AIzaSy... [your_key_here]
Purpose:  Alternative mapping service
```

---

## 📱 Social Login Test Accounts

### Google Test Account
```
Email:    cargorapido.test@gmail.com
Password: [Contact admin for password]
Purpose:  Google OAuth testing
```

### Facebook Test Account
```
Email:    cargorapido.test@facebook.com
Password: [Contact admin for password]
Purpose:  Facebook OAuth testing
```

---

## 🎭 Role-Based Access Matrix

| Feature | User | Driver | Admin | Business |
|---------|------|--------|-------|----------|
| Create Booking | ✅ | ❌ | ✅ | ✅ |
| Accept Booking | ❌ | ✅ | ✅ | ❌ |
| View All Bookings | ❌ | ❌ | ✅ | ✅ (Own) |
| Manage Users | ❌ | ❌ | ✅ | ❌ |
| Manage Drivers | ❌ | ❌ | ✅ | ❌ |
| View Analytics | ❌ | ✅ (Own) | ✅ | ✅ |
| Process Payments | ✅ | ❌ | ✅ | ✅ |
| View Reports | ❌ | ✅ (Own) | ✅ | ✅ |
| System Settings | ❌ | ❌ | ✅ | ❌ |

---

## 🚀 Quick Login Links

### Frontend (Local)
```
http://localhost:5173/login
```

### Backend API (Local)
```
http://localhost:5000/api/auth/login
```

### Admin Dashboard
```
http://localhost:5173/admin/login
```

---

## 📝 Sample Booking Data

### Sample Pickup Locations
```
1. Mumbai Central, Mumbai - 19.0760° N, 72.8777° E
2. Andheri West, Mumbai - 19.1176° N, 72.8348° E
3. Bandra East, Mumbai - 19.0596° N, 72.8656° E
4. Pune Station, Pune - 18.5204° N, 73.8567° E
5. Koramangala, Bangalore - 12.9352° N, 77.6245° E
```

### Sample Delivery Locations
```
1. Navi Mumbai - 19.0330° N, 73.0297° E
2. Thane West - 19.2183° N, 72.9781° E
3. Vashi, Navi Mumbai - 19.0728° N, 73.0065° E
4. Hinjewadi, Pune - 18.5912° N, 73.7389° E
5. Whitefield, Bangalore - 12.9698° N, 77.7500° E
```

### Sample Cargo Types
```
- Electronics (Phones, Laptops)
- Furniture (Tables, Chairs)
- Documents (Papers, Files)
- Food Items (Perishables)
- Clothing (Apparel)
- Books (Educational)
- General Cargo
```

---

## 🧪 Test Scenarios

### Scenario 1: Complete Booking Flow
```
1. Login as: testuser@example.com / Test@1234
2. Create new booking from Mumbai Central to Andheri
3. Select cargo type: Electronics (15kg)
4. Choose delivery type: Express
5. Make payment (Test mode)
6. Track booking in real-time
```

### Scenario 2: Driver Acceptance
```
1. Login as: testdriver@example.com / Driver@1234
2. View available bookings
3. Accept a booking
4. Update location
5. Mark as picked up
6. Complete delivery with POD
```

### Scenario 3: Admin Management
```
1. Login as: admin@example.com / Admin@1234
2. View dashboard analytics
3. Manage users/drivers
4. Review bookings
5. Process refunds
6. Generate reports
```

---

## 🔒 Security Notes

⚠️ **Important Security Guidelines:**

1. **Never use these credentials in production**
2. **Change all default passwords before deployment**
3. **Use environment variables for API keys**
4. **Enable 2FA for admin accounts in production**
5. **Regularly rotate API keys and secrets**
6. **Use strong, unique passwords in production**
7. **Implement rate limiting on login endpoints**
8. **Monitor for suspicious login attempts**

---

## 📊 Test Payment Cards (Razorpay Test Mode)

### Successful Payment
```
Card Number: 4111 1111 1111 1111
CVV:         123
Expiry:      Any future date
Name:        Any name
```

### Failed Payment
```
Card Number: 4000 0000 0000 0002
CVV:         123
Expiry:      Any future date
```

### 3D Secure Authentication
```
Card Number: 5267 3181 8797 5449
CVV:         123
Expiry:      Any future date
OTP:         1234 (Test OTP)
```

---

## 🔄 Reset Password Testing

To test password reset flow:

1. Go to login page
2. Click "Forgot Password"
3. Enter email: testuser@example.com
4. Check backend console for reset token
5. Use token to reset password

**Note:** In development, password reset links are logged to console.

---

## 🌐 Environment Variables Template

Create `.env` files with these test values:

### Backend `.env`
```env
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/cargorapido_test

# Authentication
JWT_SECRET=test_jwt_secret_key_change_in_production_123456789
JWT_EXPIRE=7d

# API Keys
CLAUDE_API_KEY=your_claude_api_key_here
RAZORPAY_KEY_ID=rzp_test_key_here
RAZORPAY_KEY_SECRET=razorpay_secret_here

# Encryption
ENCRYPTION_KEY=test_encryption_key_32_characters

# Email (for testing - use Mailtrap or similar)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your_mailtrap_user
SMTP_PASS=your_mailtrap_pass
FROM_EMAIL=noreply@cargorapido.com
FROM_NAME=CargoRapido

# Frontend URL
FRONTEND_URL=http://localhost:5173

# File Upload
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend `.env`
```env
# API Configuration
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000

# Maps
VITE_MAPBOX_TOKEN=your_mapbox_token_here
VITE_GOOGLE_MAPS_KEY=your_google_maps_key_here

# Payment
VITE_RAZORPAY_KEY_ID=rzp_test_key_here

# Environment
VITE_ENV=development
```

---

## 📞 Support & Help

### For Testing Issues:
- Check if backend server is running: `http://localhost:5000/api/health`
- Check if frontend is running: `http://localhost:5173`
- Clear browser cache and localStorage
- Check browser console for errors

### For Account Issues:
- Use MongoDB Compass to view/edit test accounts
- Run seed script to recreate test data
- Check backend logs for authentication errors

### For Payment Issues:
- Ensure Razorpay is in test mode
- Use test card numbers only
- Check Razorpay dashboard for test transactions

---

## 🗄️ Database Seed Script

To populate test data:

```bash
cd backend
npm run seed

# Or manually:
node scripts/seedDatabase.js
```

This will create all test users, drivers, and sample bookings.

---

## 📈 Testing Checklist

Before testing, ensure:

- [ ] Backend server is running
- [ ] Frontend dev server is running
- [ ] MongoDB is running
- [ ] All environment variables are set
- [ ] Test accounts exist in database
- [ ] API keys are valid (if using external services)

---

## 🎯 Quick Test Commands

```bash
# Backend health check
curl http://localhost:5000/api/health

# Login test (User)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@example.com","password":"Test@1234"}'

# Login test (Driver)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"testdriver@example.com","password":"Driver@1234"}'

# Login test (Admin)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Admin@1234"}'
```

---

## 📝 Notes

1. All test passwords follow the pattern: `[Role]@1234`
2. Emails follow the pattern: `test[role]@example.com`
3. Test data is reset daily in development
4. API rate limits are relaxed in development mode
5. All test transactions use Razorpay test mode

---

## 🔐 Password Policy

**Development/Testing:**
- Minimum 8 characters
- 1 uppercase letter
- 1 lowercase letter
- 1 number
- Special characters optional

**Production Requirements:**
- Minimum 12 characters
- 1 uppercase letter
- 1 lowercase letter
- 1 number
- 1 special character
- Cannot reuse last 5 passwords
- Expires every 90 days for admin accounts

---

**Version:** 1.0.0
**Last Updated:** January 2025
**Environment:** Development/Testing

⚠️ **WARNING:** These credentials are for testing only. Never use in production!

---

## 📧 Contact

For credential issues or additional test accounts:
- Email: dev@cargorapido.com
- Slack: #cargorapido-dev
- GitHub Issues: github.com/cargorapido/issues

---

**Happy Testing! 🚀**
