# CargoRapido - CRUD Operations & Testing Guide

## Table of Contents
1. [CRUD Operations Overview](#crud-operations-overview)
2. [API Endpoints](#api-endpoints)
3. [Testing with Cypress](#testing-with-cypress)
4. [Route Configuration](#route-configuration)

---

## CRUD Operations Overview

### 1. **Bookings** ([bookingController.js](backend/controllers/bookingController.js))

| Operation | Endpoint | Method | Auth | Description |
|-----------|----------|--------|------|-------------|
| **Create** | `/api/bookings` | POST | User/Business | Create new booking |
| **Read** | `/api/bookings/:id` | GET | Authenticated | Get single booking |
| **Read** | `/api/bookings/user/:userId` | GET | Authenticated | Get user's bookings |
| **Read** | `/api/bookings/driver/:driverId` | GET | Driver/Admin | Get driver's bookings |
| **Update** | `/api/bookings/:id/status` | PUT | Authenticated | Update booking status |
| **Update** | `/api/bookings/:id/rate` | POST | Authenticated | Rate completed booking |
| **Delete** | `/api/bookings/:id/cancel` | PUT | Authenticated | Cancel booking (soft delete) |

**Additional Operations:**
- `POST /api/bookings/estimate` - Get price estimate

---

### 2. **Users** ([authController.js](backend/controllers/authController.js) + [adminController.js](backend/controllers/adminController.js))

| Operation | Endpoint | Method | Auth | Description |
|-----------|----------|--------|------|-------------|
| **Create** | `/api/auth/register` | POST | Public | Register new user |
| **Read** | `/api/auth/profile` | GET | Authenticated | Get own profile |
| **Read** | `/api/admin/users` | GET | Admin | Get all users (admin) |
| **Read** | `/api/admin/users/:id` | GET | Admin | Get single user (admin) |
| **Update** | `/api/auth/profile` | PUT | Authenticated | Update own profile |
| **Update** | `/api/admin/users/:id` | PUT | Admin | Update user (admin) |
| **Update** | `/api/admin/users/:id/block` | PUT | Admin | Block/unblock user |
| **Delete** | `/api/admin/users/:id` | DELETE | Admin | Delete user (soft delete) |

**Additional Operations:**
- `POST /api/auth/login` - User login
- `POST /api/auth/driver/register` - Driver registration
- `POST /api/auth/driver/login` - Driver login

---

### 3. **Drivers** ([driverController.js](backend/controllers/driverController.js) + [adminController.js](backend/controllers/adminController.js))

| Operation | Endpoint | Method | Auth | Description |
|-----------|----------|--------|------|-------------|
| **Create** | `/api/drivers/vehicle` | POST | Driver | Register vehicle |
| **Read** | `/api/drivers/nearby` | GET | Public | Find nearby drivers |
| **Read** | `/api/drivers/stats` | GET | Driver | Get driver stats |
| **Read** | `/api/drivers/all` | GET | Admin | Get all drivers |
| **Read** | `/api/admin/drivers/:id` | GET | Admin | Get single driver details |
| **Update** | `/api/drivers/status` | PUT | Driver | Update driver status |
| **Update** | `/api/drivers/location` | PUT | Driver | Update driver location |
| **Update** | `/api/drivers/:id/kyc` | PUT | Admin | Approve/reject KYC |
| **Update** | `/api/drivers/:id/block` | PUT | Admin | Block/unblock driver |
| **Delete** | `/api/admin/drivers/:id` | DELETE | Admin | Delete driver (soft delete) |

**Additional Operations:**
- `POST /api/drivers/documents` - Upload KYC documents

---

### 4. **Vehicles** ([driverController.js](backend/controllers/driverController.js) + [adminController.js](backend/controllers/adminController.js))

| Operation | Endpoint | Method | Auth | Description |
|-----------|----------|--------|------|-------------|
| **Create** | `/api/drivers/vehicle` | POST | Driver | Register new vehicle |
| **Read** | `/api/admin/vehicles` | GET | Admin | Get all vehicles |
| **Update** | `/api/admin/vehicles/:id` | PUT | Admin | Update vehicle details |
| **Delete** | `/api/admin/vehicles/:id` | DELETE | Admin | Delete vehicle |

---

### 5. **Payments & Wallet** ([paymentController.js](backend/controllers/paymentController.js))

| Operation | Endpoint | Method | Auth | Description |
|-----------|----------|--------|------|-------------|
| **Create** | `/api/pay/order` | POST | User | Create payment order |
| **Create** | `/api/pay/wallet/recharge` | POST | User | Create wallet recharge order |
| **Read** | `/api/pay/transactions` | GET | User | Get transaction history |
| **Read** | `/api/pay/wallet/balance` | GET | User | Get wallet balance |
| **Update** | `/api/pay/verify` | POST | User | Verify payment |
| **Update** | `/api/pay/wallet/verify` | POST | User | Verify wallet recharge |
| **Update** | `/api/pay/wallet/pay` | POST | User | Pay with wallet |

---

### 6. **Proof of Delivery (POD)** ([podController.js](backend/controllers/podController.js))

| Operation | Endpoint | Method | Auth | Description |
|-----------|----------|--------|------|-------------|
| **Create** | `/api/pod/pickup/upload` | POST | Driver | Upload pickup proof |
| **Create** | `/api/pod/delivery/upload` | POST | Driver | Upload delivery proof |
| **Read** | `/api/pod/:bookingId` | GET | Authenticated | Get delivery record |
| **Update** | `/api/pod/pickup/verify` | POST | Driver | Verify pickup OTP |
| **Update** | `/api/pod/delivery/verify` | POST | Driver | Verify delivery OTP |

---

### 7. **Driver Assignment** ([driverAssignmentController.js](backend/controllers/driverAssignmentController.js))

| Operation | Endpoint | Method | Auth | Description |
|-----------|----------|--------|------|-------------|
| **Read** | `/api/driver-assignment/bookings/:bookingId/nearby-drivers` | GET | Authenticated | Find nearby drivers for booking |
| **Read** | `/api/driver-assignment/pending-bookings` | GET | Driver | Get pending bookings for driver |
| **Update** | `/api/driver-assignment/bookings/:bookingId/auto-assign` | POST | Admin | Auto-assign nearest driver |
| **Update** | `/api/driver-assignment/bookings/:bookingId/manual-assign` | POST | Authenticated | Manually assign driver |
| **Update** | `/api/driver-assignment/bookings/:bookingId/broadcast` | POST | Authenticated | Broadcast booking to nearby drivers |
| **Update** | `/api/driver-assignment/bookings/:bookingId/accept` | POST | Driver | Accept broadcasted booking |

---

### 8. **Admin Dashboard** ([adminController.js](backend/controllers/adminController.js))

| Operation | Endpoint | Method | Auth | Description |
|-----------|----------|--------|------|-------------|
| **Read** | `/api/admin/dashboard/stats` | GET | Admin | Get dashboard statistics |
| **Read** | `/api/admin/bookings` | GET | Admin | Get all bookings (admin view) |
| **Delete** | `/api/admin/bookings/:id` | DELETE | Admin | Delete booking |

---

## API Endpoints Summary

### Backend Routes (registered in [server.js](backend/server.js:76-83))

```javascript
app.use('/api/auth', authRoutes);              // Authentication
app.use('/api/bookings', bookingRoutes);        // Booking management
app.use('/api/drivers', driverRoutes);          // Driver operations
app.use('/api/pod', podRoutes);                 // Proof of delivery
app.use('/api/pay', paymentRoutes);             // Payments & wallet
app.use('/api/ai', aiRoutes);                   // AI features
app.use('/api/driver-assignment', driverAssignmentRoutes); // Driver assignment
app.use('/api/admin', adminRoutes);             // Admin operations
```

### Frontend Routes ([router.jsx](frontend/src/router.jsx))

**User Routes** (`/dashboard/*`)
- `/dashboard` - Home dashboard
- `/dashboard/new-booking` - Create new booking
- `/dashboard/tracking/:bookingId` - Live tracking
- `/dashboard/deliveries` - My deliveries
- `/dashboard/wallet` - Wallet & transactions
- `/dashboard/profile` - User profile

**Driver Routes** (`/driver/*`)
- `/driver` - Driver dashboard
- `/driver/requests` - Incoming booking requests
- `/driver/ride/:bookingId` - Active ride management
- `/driver/pod/:bookingId` - Upload proof of delivery
- `/driver/earnings` - Earnings summary

**Admin Routes** (`/admin/*`)
- `/admin` - Admin dashboard
- `/admin/users` - User management
- `/admin/drivers` - Driver management
- `/admin/live-map` - Live bookings map
- `/admin/revenue` - Revenue statistics

**Public Routes**
- `/login` - User login
- `/register` - User registration
- `/driver/login` - Driver login
- `/driver/register` - Driver registration
- `/forgot-password` - Password recovery

---

## Testing with Cypress

### Setup

Cypress is already installed and configured. The configuration file is at [cypress.config.js](cypress.config.js).

### Running Tests

```bash
# Open Cypress Test Runner (interactive)
cd frontend
npm run test

# Run all tests in headless mode
npm run test:headless

# Run tests in specific browser
npm run test:chrome
npm run test:firefox
npm run test:edge
```

### Test Suites

#### 1. Authentication Tests ([cypress/e2e/01-authentication.cy.js](cypress/e2e/01-authentication.cy.js))

- User registration
- User login
- Driver registration
- Driver login
- Logout functionality
- Protected route redirects
- Validation error handling

#### 2. Booking Creation Tests ([cypress/e2e/02-booking-creation.cy.js](cypress/e2e/02-booking-creation.cy.js))

- Create booking with all required fields
- Price estimation
- Form validation
- Add-ons selection
- View all deliveries
- Filter bookings by status
- Navigate to tracking page

#### 3. Driver Workflow Tests ([cypress/e2e/03-driver-workflow.cy.js](cypress/e2e/03-driver-workflow.cy.js))

- Driver dashboard display
- Online/offline toggle
- View incoming requests
- Accept booking requests
- Auto-refresh functionality
- Active ride management
- Update ride status
- Upload pickup proof with OTP
- Upload delivery proof
- Complete delivery
- View earnings

#### 4. End-to-End Flow ([cypress/e2e/04-end-to-end.cy.js](cypress/e2e/04-end-to-end.cy.js))

Complete booking lifecycle:
1. User creates booking
2. Driver sees request
3. Driver accepts booking
4. Driver marks as arrived
5. Driver uploads pickup proof & verifies OTP
6. Driver marks in transit
7. Driver reaches destination
8. Driver uploads delivery proof & completes
9. User sees completed booking

#### 5. Wallet & Payment Tests ([cypress/e2e/05-wallet-payment.cy.js](cypress/e2e/05-wallet-payment.cy.js))

- Display wallet balance
- View transaction history
- Wallet recharge
- Minimum amount validation
- Pay with wallet
- Insufficient balance handling
- Filter transactions by type

### Custom Cypress Commands ([cypress/support/commands.js](cypress/support/commands.js))

```javascript
// Login commands
cy.loginUser(email, password)
cy.loginDriver(email, password)
cy.loginViaAPI(email, password, userType)

// Booking operations
cy.createBooking(bookingData)

// UI helpers
cy.clickElement(selector, options)
cy.typeRealistic(text, options)
cy.checkToast(message, type)

// Data seeding
cy.seedTestUser()
cy.seedTestDriver()

// Cleanup
cy.clearAuth()
```

### Test Data Setup

Before running tests, ensure you have test users:

```javascript
// Test User
Email: test@test.com
Password: Test@1234

// Test Driver
Email: driver@test.com
Password: Test@1234
```

### Environment Variables

Cypress configuration ([cypress.config.js](cypress.config.js:13-15)):

```javascript
env: {
  apiUrl: 'http://localhost:5000/api'
}
```

---

## Route Configuration

### Authentication Middleware

All protected routes use the `protect` middleware from [auth.js](backend/middleware/auth.js:5-36).

### Role-Based Authorization

The `authorize(...roles)` middleware restricts access to specific user roles:

```javascript
// Examples:
router.post('/', protect, authorize('user', 'business'), createBooking);
router.get('/all', protect, authorize('admin'), getAllDrivers);
router.put('/status', protect, authorize('driver'), updateDriverStatus);
```

### Supported Roles
- `user` - Regular customers
- `business` - Business accounts
- `driver` - Delivery drivers
- `admin` - System administrators

---

## Missing CRUD Operations (Now Implemented)

Previously missing operations that have been added:

### User Management
✅ Delete user (admin)
✅ Get all users (admin)
✅ Block/unblock user (admin)
✅ Update user by admin

### Booking Management
✅ Get all bookings (admin view)
✅ Delete booking (admin)

### Vehicle Management
✅ Update vehicle details (admin)
✅ Delete vehicle (admin)
✅ Get all vehicles (admin)

### Driver Management
✅ Delete driver (admin)
✅ Get single driver details (admin)

### Admin Dashboard
✅ Dashboard statistics endpoint

---

## Testing Checklist

### Before Running Tests

1. ✅ Backend server running (`cd backend && npm start`)
2. ✅ Frontend dev server running (`cd frontend && npm run dev`)
3. ✅ MongoDB connected
4. ✅ Test users created
5. ✅ Environment variables configured

### Test Execution Order

1. Authentication tests (creates foundation)
2. Booking creation tests (requires auth)
3. Driver workflow tests (requires auth)
4. Wallet/payment tests (requires bookings)
5. End-to-end flow (requires everything)

### Continuous Integration

To run tests in CI/CD pipeline:

```bash
# In CI environment
npm run test:headless -- --record --key YOUR_CYPRESS_KEY
```

---

## API Testing with Postman/Thunder Client

### Base URL
```
http://localhost:5000/api
```

### Sample Requests

#### 1. User Registration
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "SecurePass@123"
}
```

#### 2. Create Booking
```http
POST /bookings
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "pickup": {
    "address": "123 MG Road, Bangalore",
    "coordinates": {
      "type": "Point",
      "coordinates": [77.5946, 12.9716]
    }
  },
  "drop": {
    "address": "456 Brigade Road, Bangalore",
    "coordinates": {
      "type": "Point",
      "coordinates": [77.6088, 12.9698]
    }
  },
  "distance": 15,
  "cargoDetails": {
    "size": "small",
    "weight": 25,
    "description": "Electronics"
  }
}
```

#### 3. Get Pending Bookings (Driver)
```http
GET /driver-assignment/pending-bookings
Authorization: Bearer DRIVER_TOKEN
```

#### 4. Accept Booking (Driver)
```http
POST /driver-assignment/bookings/:bookingId/accept
Authorization: Bearer DRIVER_TOKEN
```

---

## Notes

- All timestamps are in ISO 8601 format
- Coordinates follow GeoJSON [longitude, latitude] format
- File uploads use `multipart/form-data`
- All responses follow the format: `{ success: boolean, data: any, message?: string }`
- Pagination is supported on list endpoints: `?page=1&limit=20`
- Soft deletes are used for users, drivers, and bookings
- Socket.IO is used for real-time notifications (bookings, driver assignments)

---

## Support

For issues or questions:
- Check backend logs: `cd backend && npm start`
- Check frontend console in browser DevTools
- Review Cypress test videos in `cypress/videos/`
- Check screenshots in `cypress/screenshots/` for failed tests
