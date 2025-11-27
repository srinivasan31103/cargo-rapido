# 🚚 CargoRapido - On-Demand Micro-Logistics Platform

**CargoRapido** is a production-ready full-stack application for on-demand goods delivery, featuring live tracking, driver matching, dynamic pricing, proof of delivery (POD), and Claude AI capabilities.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Claude AI Integration](#claude-ai-integration)
- [Database Models](#database-models)
- [Socket.IO Events](#socketio-events)
- [Payment Integration](#payment-integration)
- [Deployment](#deployment)

---

## ✨ Features

### Core Features
- **User Authentication**: JWT-based auth for users, drivers, business accounts, and admins
- **Smart Booking System**: Create deliveries with pickup/drop locations, cargo size selection, and fare estimation
- **Dynamic Pricing Engine**:
  - Base fare + distance-based pricing
  - Cargo size multipliers (XS/S/M/L/XL)
  - Surge pricing based on time, driver availability, demand, and weather
  - Add-ons: Express delivery, insurance, fragile handling
  - Promo code support
- **Intelligent Driver Matching**:
  - Geospatial queries to find nearest drivers
  - Driver ranking based on rating, distance, and experience
  - Auto-reassignment on timeout
- **Live Tracking**: Real-time GPS tracking via Socket.IO
- **Proof of Delivery (POD)**:
  - OTP verification for pickup and drop
  - Photo upload capability
  - Digital signature support
  - Geolocation stamping
- **Wallet & Payments**:
  - Razorpay integration (test mode)
  - Wallet balance and recharge
  - Cashback system
  - Transaction history
  - Driver payouts
- **Business Dashboard**:
  - Bulk scheduling
  - Recurring deliveries (CRON jobs)
  - Subscription plans
  - Analytics and insights
- **Admin Panel**:
  - User and driver management
  - KYC verification
  - Live rides heatmap
  - Revenue statistics
  - Refund center

### 🤖 Claude AI Features

Four AI-powered endpoints for intelligent operations:

1. **AI Pricing Adjuster** (`POST /api/ai/pricing`)
   - Analyzes traffic, driver availability, cargo size, time of day, weather
   - Recommends optimal surge multiplier
   - Provides reasoning and estimated fare

2. **AI Cargo Classifier** (`POST /api/ai/cargo-classify`)
   - Classifies cargo from description or photo
   - Suggests optimal cargo size
   - Identifies fragility and insurance needs
   - Estimates weight and special handling requirements

3. **AI Route Advisor** (`POST /api/ai/route`)
   - Recommends safest/fastest routes
   - Considers traffic, weather, time of day
   - Provides alternate routes and safety ratings
   - Driver-specific tips

4. **AI Business Insights** (`GET /api/ai/business-insights`)
   - Weekly delivery analytics
   - Growth metrics and completion rates
   - Actionable recommendations
   - Business opportunity identification

---

## 🛠 Tech Stack

### Backend
- **Node.js** + **Express.js**: REST API server
- **MongoDB** + **Mongoose**: Database and ODM
- **Socket.IO**: Real-time bidirectional communication
- **JWT**: Authentication and authorization
- **Bcrypt**: Password hashing
- **Multer**: File upload handling
- **Cloudinary**: Image storage
- **Razorpay**: Payment gateway
- **Axios**: HTTP client for Claude AI API
- **Node-Cron**: Scheduled jobs for recurring deliveries

### Frontend
- **React 18** + **Vite**: Modern UI framework
- **React Router**: Client-side routing
- **Zustand**: State management
- **Tailwind CSS**: Utility-first styling
- **Socket.IO Client**: Real-time updates
- **Axios**: API communication
- **React Hot Toast**: Notifications
- **Lucide React**: Icons
- **Mapbox GL / Google Maps**: Map integration
- **Signature Pad**: Digital signatures

### AI Integration
- **Claude 3.5 Sonnet**: Anthropic's latest model via API

---

## 📁 Project Structure

```
cargorapido/
├── backend/
│   ├── server.js                 # Main server file
│   ├── socket.js                 # Socket.IO configuration
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── middleware/
│   │   ├── auth.js               # JWT authentication
│   │   └── error.js              # Error handling
│   ├── models/
│   │   ├── User.js
│   │   ├── Driver.js
│   │   ├── Vehicle.js
│   │   ├── Booking.js
│   │   ├── DeliveryRecord.js
│   │   ├── DriverLocation.js
│   │   ├── PricingRule.js
│   │   ├── Transaction.js
│   │   └── SubscriptionPlan.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── bookingController.js
│   │   ├── driverController.js
│   │   ├── podController.js
│   │   ├── paymentController.js
│   │   └── aiController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── driverRoutes.js
│   │   ├── podRoutes.js
│   │   ├── paymentRoutes.js
│   │   └── aiRoutes.js
│   ├── utils/
│   │   ├── aiService.js          # Claude AI integration
│   │   ├── pricingEngine.js      # Dynamic pricing logic
│   │   ├── driverMatcher.js      # Driver matching algorithm
│   │   └── cloudinary.js         # Image upload utility
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── src/
    │   ├── main.jsx
    │   ├── App.jsx
    │   ├── router.jsx
    │   ├── store/
    │   │   ├── authStore.js
    │   │   └── bookingStore.js
    │   ├── utils/
    │   │   ├── api.js
    │   │   └── socket.js
    │   ├── components/
    │   │   └── layouts/
    │   │       ├── MainLayout.jsx
    │   │       ├── DriverLayout.jsx
    │   │       └── AdminLayout.jsx
    │   ├── pages/
    │   │   ├── auth/              # Login, Register pages
    │   │   ├── user/              # User pages
    │   │   ├── driver/            # Driver pages
    │   │   └── admin/             # Admin pages
    │   └── styles/
    │       └── index.css
    ├── .env.example
    └── package.json
```

---

## 🚀 Installation

### Prerequisites
- Node.js v18+
- MongoDB v5+
- npm or yarn
- Cloudinary account (for image uploads)
- Razorpay account (for payments)
- Claude API key (for AI features)

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your credentials
nano .env
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your API URLs
nano .env
```

---

## ⚙️ Configuration

### Backend Environment Variables (`.env`)

```env
NODE_ENV=development
PORT=5000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/cargorapido

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d

# Claude AI
CLAUDE_API_KEY=your_claude_api_key_here

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Google Maps (Optional)
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Driver Matching
DRIVER_SEARCH_RADIUS=10
DRIVER_ASSIGNMENT_TIMEOUT=60000

# Pricing
BASE_FARE=50
PER_KM_RATE=12
SURGE_MULTIPLIER_MAX=2.5
```

### Frontend Environment Variables (`.env`)

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_MAPBOX_TOKEN=your_mapbox_access_token_here
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

---

## 🏃 Running the Application

### Start MongoDB

```bash
# Using MongoDB service
sudo systemctl start mongod

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Start Backend Server

```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

### Start Frontend

```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:5173
```

### Access the Application

- **User Portal**: http://localhost:5173
- **Driver Portal**: http://localhost:5173/driver/login
- **Admin Panel**: http://localhost:5173/admin (create admin user manually in DB)
- **API Docs**: http://localhost:5000

---

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "password123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Register Driver
```http
POST /api/auth/driver/register
Content-Type: application/json

{
  "name": "Driver Name",
  "email": "driver@example.com",
  "phone": "9876543210",
  "password": "password123",
  "licenseNumber": "DL1234567890",
  "licenseExpiry": "2025-12-31",
  "aadharNumber": "123456789012"
}
```

### Booking Endpoints

#### Create Booking
```http
POST /api/bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "pickup": {
    "address": "123 Main St, Bangalore",
    "coordinates": { "coordinates": [77.5946, 12.9716] },
    "contactPhone": "9876543210"
  },
  "drop": {
    "address": "456 Park Ave, Bangalore",
    "coordinates": { "coordinates": [77.6411, 12.9141] },
    "contactPhone": "9876543210"
  },
  "distance": 5.2,
  "cargoDetails": {
    "size": "M",
    "description": "Electronics package",
    "fragile": true
  },
  "addOns": {
    "express": true,
    "insurance": true,
    "fragile": true
  }
}
```

#### Estimate Price
```http
POST /api/bookings/estimate
Authorization: Bearer <token>
Content-Type: application/json

{
  "distance": 5.2,
  "cargoSize": "M",
  "addOns": {
    "express": true,
    "insurance": true
  }
}
```

#### Track Booking
```http
GET /api/bookings/:bookingId
Authorization: Bearer <token>
```

#### Update Booking Status
```http
PUT /api/bookings/:bookingId/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "picked_up",
  "location": { "coordinates": [77.5946, 12.9716] },
  "note": "Package picked up"
}
```

### Driver Endpoints

#### Get Nearby Drivers
```http
GET /api/drivers/nearby?lat=12.9716&lng=77.5946&radius=10
```

#### Update Driver Status
```http
PUT /api/drivers/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "online"
}
```

#### Update Location
```http
PUT /api/drivers/location
Authorization: Bearer <token>
Content-Type: application/json

{
  "lat": 12.9716,
  "lng": 77.5946,
  "heading": 90,
  "speed": 40
}
```

### POD Endpoints

#### Upload Pickup Proof
```http
POST /api/pod/pickup
Authorization: Bearer <token>
Content-Type: multipart/form-data

bookingId: <booking-id>
photo: <file>
location: {"coordinates": [77.5946, 12.9716]}
```

#### Verify Pickup OTP
```http
POST /api/pod/pickup/verify
Authorization: Bearer <token>
Content-Type: application/json

{
  "bookingId": "<booking-id>",
  "otp": "1234"
}
```

### Payment Endpoints

#### Create Payment Order
```http
POST /api/pay/create-order
Authorization: Bearer <token>
Content-Type: application/json

{
  "bookingId": "<booking-id>",
  "amount": 250
}
```

#### Pay with Wallet
```http
POST /api/pay/wallet/pay
Authorization: Bearer <token>
Content-Type: application/json

{
  "bookingId": "<booking-id>"
}
```

#### Recharge Wallet
```http
POST /api/pay/wallet/recharge
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 1000
}
```

### AI Endpoints

#### AI Pricing Suggestion
```http
POST /api/ai/pricing
Authorization: Bearer <token>
Content-Type: application/json

{
  "distance": 5.2,
  "cargoSize": "M",
  "weather": "rain"
}
```

#### AI Cargo Classification
```http
POST /api/ai/cargo-classify
Authorization: Bearer <token>
Content-Type: application/json

{
  "description": "Laptop in original packaging",
  "photoUrl": "https://..."
}
```

#### AI Route Advice
```http
POST /api/ai/route
Authorization: Bearer <token>
Content-Type: application/json

{
  "pickup": {
    "address": "123 Main St",
    "lat": 12.9716,
    "lng": 77.5946
  },
  "drop": {
    "address": "456 Park Ave",
    "lat": 12.9141,
    "lng": 77.6411
  },
  "currentTraffic": "heavy",
  "weather": "clear"
}
```

#### AI Business Insights
```http
GET /api/ai/business-insights?startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <token>
```

---

## 🤖 Claude AI Integration

The application uses Claude 3.5 Sonnet via Anthropic's API for intelligent features.

### Implementation Details

Location: [`backend/utils/aiService.js`](backend/utils/aiService.js:1)

```javascript
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const CLAUDE_MODEL = 'claude-3-5-sonnet-20241022';

async function callClaudeAPI(prompt, systemPrompt = '') {
  const response = await axios.post(
    CLAUDE_API_URL,
    {
      model: CLAUDE_MODEL,
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: 'user', content: prompt }]
    },
    {
      headers: {
        'x-api-key': process.env.CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      }
    }
  );
  return response.data.content[0].text;
}
```

### Use Cases

1. **Dynamic Pricing**: Adjusts surge multiplier based on real-time conditions
2. **Cargo Intelligence**: Identifies optimal packaging and handling requirements
3. **Route Optimization**: Suggests safest and fastest delivery routes
4. **Business Analytics**: Generates actionable insights from delivery data

---

## 💾 Database Models

### User Schema
```javascript
{
  name: String,
  email: String (unique),
  phone: String (unique),
  password: String (hashed),
  role: ['user', 'business', 'admin'],
  wallet: {
    balance: Number,
    cashback: Number
  },
  subscriptionPlan: ObjectId,
  address: Object
}
```

### Driver Schema
```javascript
{
  name: String,
  email: String (unique),
  phone: String (unique),
  password: String (hashed),
  vehicle: ObjectId,
  licenseNumber: String,
  licenseExpiry: Date,
  aadharNumber: String,
  kycStatus: ['pending', 'approved', 'rejected'],
  status: ['offline', 'online', 'busy'],
  currentLocation: GeoJSON Point,
  rating: { average: Number, count: Number },
  stats: {
    totalDeliveries: Number,
    completedDeliveries: Number,
    totalEarnings: Number
  }
}
```

### Booking Schema
```javascript
{
  bookingId: String (unique),
  user: ObjectId,
  driver: ObjectId,
  vehicle: ObjectId,
  pickup: {
    address: String,
    coordinates: GeoJSON Point,
    contactPhone: String
  },
  drop: {
    address: String,
    coordinates: GeoJSON Point,
    contactPhone: String
  },
  distance: Number,
  cargoDetails: {
    size: ['XS', 'S', 'M', 'L', 'XL'],
    description: String,
    fragile: Boolean
  },
  pricing: {
    baseFare: Number,
    distanceFare: Number,
    surgeMultiplier: Number,
    total: Number
  },
  status: Enum,
  timeline: Array,
  otp: { pickup: String, drop: String },
  payment: Object
}
```

---

## 🔌 Socket.IO Events

### Driver Events

**Emit from Driver:**
```javascript
socket.emit('driver:updateLocation', {
  lat: 12.9716,
  lng: 77.5946,
  heading: 90,
  speed: 40
});

socket.emit('driver:acceptBooking', { bookingId: '...' });
socket.emit('driver:rejectBooking', { bookingId: '...', reason: '...' });
```

**Listen on Driver:**
```javascript
socket.on('booking:new', (data) => { /* New booking available */ });
socket.on('booking:cancelled', (data) => { /* User cancelled */ });
```

### User Events

**Emit from User:**
```javascript
socket.emit('booking:track', { bookingId: '...' });
socket.emit('booking:cancel', { bookingId: '...', reason: '...' });
```

**Listen on User:**
```javascript
socket.on('driver:locationUpdate', (data) => {
  // Update map with new driver location
});

socket.on('booking:driverAssigned', (data) => {
  // Driver assigned notification
});

socket.on('booking:statusUpdate', (data) => {
  // Booking status changed
});
```

---

## 💳 Payment Integration

### Razorpay Setup

1. Sign up at [Razorpay](https://razorpay.com/)
2. Get API keys from Dashboard
3. Add to `.env`:
```env
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
```

### Payment Flow

1. **Create Order**: Backend creates Razorpay order
2. **Open Checkout**: Frontend opens Razorpay modal
3. **Payment**: User completes payment
4. **Verify**: Backend verifies signature
5. **Update**: Update booking/wallet status

---

## 🚀 Deployment

### Backend Deployment (Railway/Render)

```bash
# Install dependencies
npm install

# Build (if needed)
npm run build

# Start production server
npm start
```

**Environment Variables**: Add all variables from `.env.example`

### Frontend Deployment (Vercel/Netlify)

```bash
# Build
npm run build

# Preview
npm run preview
```

**Build Settings:**
- Build Command: `npm run build`
- Output Directory: `dist`
- Node Version: 18+

### Database (MongoDB Atlas)

1. Create cluster at [MongoDB Atlas](https://cloud.mongodb.com/)
2. Whitelist all IPs (0.0.0.0/0) for development
3. Get connection string
4. Update `MONGODB_URI` in backend `.env`

---

## 📝 API Testing

Use the following test credentials:

**User:**
- Email: `user@test.com`
- Password: `test123`

**Driver:**
- Email: `driver@test.com`
- Password: `test123`

**Admin:**
- Create manually in database with `role: 'admin'`

---

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Error:**
```bash
# Check MongoDB is running
sudo systemctl status mongod

# Or restart
sudo systemctl restart mongod
```

**Port Already in Use:**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

**Socket Connection Failed:**
- Ensure backend is running
- Check CORS settings in [`backend/server.js`](backend/server.js:24)
- Verify `VITE_SOCKET_URL` in frontend `.env`

---

## 📄 License

MIT License - feel free to use for personal or commercial projects.

---

## 🙏 Acknowledgments

- **Anthropic** for Claude AI API
- **Razorpay** for payment gateway
- **Cloudinary** for image storage
- **Mapbox/Google** for mapping services

---

## 📞 Support

For issues or questions:
1. Check existing issues
2. Create new issue with detailed description
3. Include error logs and environment details

---

**Built with ❤️ for the logistics industry**

🚚 CargoRapido - Delivering the Future
