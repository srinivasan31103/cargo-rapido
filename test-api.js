/**
 * Simple API Test Script (No Cypress needed)
 * Run with: node test-api.js
 */

const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
let authToken = '';
let driverToken = '';
let bookingId = '';

// Test results
const results = {
  passed: 0,
  failed: 0,
  tests: []
};

function pass(testName) {
  results.passed++;
  results.tests.push({ name: testName, status: '✅ PASS' });
  console.log(`✅ PASS: ${testName}`);
}

function fail(testName, error) {
  results.failed++;
  results.tests.push({ name: testName, status: '❌ FAIL', error: error.message });
  console.log(`❌ FAIL: ${testName} - ${error.message}`);
}

async function test(name, fn) {
  try {
    await fn();
    pass(name);
  } catch (error) {
    fail(name, error);
  }
}

// Test 1: User Registration
async function testUserRegistration() {
  const response = await axios.post(`${API_URL}/auth/register`, {
    name: 'Test User API',
    email: `test.api.${Date.now()}@test.com`,
    phone: `9${Math.floor(Math.random() * 1000000000)}`,
    password: 'Test@1234'
  });

  if (response.data.success && response.data.data.token) {
    authToken = response.data.data.token;
    return true;
  }
  throw new Error('Registration failed');
}

// Test 2: User Login
async function testUserLogin() {
  const response = await axios.post(`${API_URL}/auth/login`, {
    email: 'test@test.com',
    password: 'Test@1234'
  });

  if (response.data.success && response.data.data.token) {
    authToken = response.data.data.token;
    return true;
  }
  throw new Error('Login failed');
}

// Test 3: Get User Profile
async function testGetProfile() {
  const response = await axios.get(`${API_URL}/auth/profile`, {
    headers: { Authorization: `Bearer ${authToken}` }
  });

  if (response.data.success) {
    return true;
  }
  throw new Error('Get profile failed');
}

// Test 4: Create Booking
async function testCreateBooking() {
  const response = await axios.post(`${API_URL}/bookings`, {
    pickup: {
      address: '123 MG Road, Koramangala, Bangalore, Karnataka 560034',
      coordinates: {
        type: 'Point',
        coordinates: [77.5946, 12.9716]
      }
    },
    drop: {
      address: '456 Brigade Road, MG Road, Bangalore, Karnataka 560001',
      coordinates: {
        type: 'Point',
        coordinates: [77.6088, 12.9698]
      }
    },
    distance: 15,
    cargoDetails: {
      size: 'small',
      weight: 25,
      description: 'Test Package - API'
    }
  }, {
    headers: { Authorization: `Bearer ${authToken}` }
  });

  if (response.data.success && response.data.data._id) {
    bookingId = response.data.data._id;
    console.log(`   📦 Booking Created: ${response.data.data.bookingId}`);
    return true;
  }
  throw new Error('Create booking failed');
}

// Test 5: Get Booking
async function testGetBooking() {
  const response = await axios.get(`${API_URL}/bookings/${bookingId}`, {
    headers: { Authorization: `Bearer ${authToken}` }
  });

  if (response.data.success) {
    return true;
  }
  throw new Error('Get booking failed');
}

// Test 6: Driver Login
async function testDriverLogin() {
  const response = await axios.post(`${API_URL}/auth/driver/login`, {
    email: 'driver@test.com',
    password: 'Test@1234'
  });

  if (response.data.success && response.data.data.token) {
    driverToken = response.data.data.token;
    return true;
  }
  throw new Error('Driver login failed');
}

// Test 7: Get Pending Bookings (Driver)
async function testGetPendingBookings() {
  const response = await axios.get(`${API_URL}/driver-assignment/pending-bookings`, {
    headers: { Authorization: `Bearer ${driverToken}` }
  });

  if (response.data.success) {
    console.log(`   🚚 Pending Bookings: ${response.data.data.length}`);
    return true;
  }
  throw new Error('Get pending bookings failed');
}

// Test 8: Get Wallet Balance
async function testGetWalletBalance() {
  const response = await axios.get(`${API_URL}/pay/wallet/balance`, {
    headers: { Authorization: `Bearer ${authToken}` }
  });

  if (response.data.success) {
    console.log(`   💰 Wallet Balance: ₹${response.data.data.balance}`);
    return true;
  }
  throw new Error('Get wallet balance failed');
}

// Test 9: Estimate Price
async function testEstimatePrice() {
  const response = await axios.post(`${API_URL}/bookings/estimate`, {
    distance: 10,
    cargoSize: 'small',
    addOns: []
  }, {
    headers: { Authorization: `Bearer ${authToken}` }
  });

  if (response.data.success) {
    console.log(`   💵 Estimated Price: ₹${response.data.data.total}`);
    return true;
  }
  throw new Error('Estimate price failed');
}

// Test 10: Get User Bookings
async function testGetUserBookings() {
  const userId = 'current'; // Will use token to get current user's bookings
  const response = await axios.get(`${API_URL}/bookings/user/${userId}`, {
    headers: { Authorization: `Bearer ${authToken}` }
  });

  if (response.data.success) {
    console.log(`   📋 Total Bookings: ${response.data.data.length}`);
    return true;
  }
  throw new Error('Get user bookings failed');
}

// Run all tests
async function runTests() {
  console.log('\n🧪 CargoRapido API Tests\n');
  console.log('=' .repeat(50));

  await test('1. User Registration', testUserRegistration);
  await test('2. User Login', testUserLogin);
  await test('3. Get User Profile', testGetProfile);
  await test('4. Estimate Price', testEstimatePrice);
  await test('5. Create Booking', testCreateBooking);
  await test('6. Get Booking Details', testGetBooking);
  await test('7. Get User Bookings', testGetUserBookings);
  await test('8. Get Wallet Balance', testGetWalletBalance);
  await test('9. Driver Login', testDriverLogin);
  await test('10. Get Pending Bookings (Driver)', testGetPendingBookings);

  console.log('\n' + '='.repeat(50));
  console.log(`\n📊 Test Results:`);
  console.log(`   ✅ Passed: ${results.passed}`);
  console.log(`   ❌ Failed: ${results.failed}`);
  console.log(`   Total: ${results.passed + results.failed}\n`);

  if (results.failed > 0) {
    console.log('Failed Tests:');
    results.tests.filter(t => t.status.includes('FAIL')).forEach(t => {
      console.log(`   ${t.name}: ${t.error}`);
    });
  }

  process.exit(results.failed > 0 ? 1 : 0);
}

// Check if server is running
axios.get('http://localhost:5000/health')
  .then(() => {
    console.log('✅ Backend server is running\n');
    runTests();
  })
  .catch(() => {
    console.error('❌ Backend server is not running!');
    console.error('Please start the backend: cd backend && npm start');
    process.exit(1);
  });
