import mongoose from 'mongoose';
import User from '../models/User.js';
import Driver from '../models/Driver.js';
import dotenv from 'dotenv';

dotenv.config();

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cargorapido');

    console.log('📦 Connected to MongoDB');

    // Clear existing users to fix password hashing
    await User.deleteMany({});
    await Driver.deleteMany({});
    console.log('🗑️  Cleared existing users and drivers');

    // Create demo users (phone must be 10 digits)
    const users = [
      {
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'User@1234',  // Let model pre-save hook hash it
        phone: '9876543210',
        role: 'user',
        address: {
          city: 'Mumbai',
          state: 'Maharashtra',
          coordinates: {
            type: 'Point',
            coordinates: [72.8777, 19.0760] // [longitude, latitude]
          }
        }
      },
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'Admin@1234',  // Let model pre-save hook hash it
        phone: '9876543212',
        role: 'admin',
        address: {
          city: 'Mumbai',
          state: 'Maharashtra',
          coordinates: {
            type: 'Point',
            coordinates: [72.8700, 19.0700] // [longitude, latitude]
          }
        }
      },
      {
        name: 'Business User',
        email: 'business@example.com',
        password: 'Business@1234',  // Let model pre-save hook hash it
        phone: '9876543213',
        role: 'business',
        address: {
          city: 'Mumbai',
          state: 'Maharashtra',
          coordinates: {
            type: 'Point',
            coordinates: [72.8850, 19.0850] // [longitude, latitude]
          }
        }
      }
    ];

    for (const userData of users) {
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        console.log(`⚠️  User ${userData.email} already exists, skipping...`);
      } else {
        await User.create(userData);
        console.log(`✅ Created ${userData.role}: ${userData.email}`);
      }
    }

    // Create demo driver
    const driverData = {
      name: 'Test Driver',
      email: 'testdriver@example.com',
      password: 'Driver@1234',  // Let model pre-save hook hash it
      phone: '9876543211',
      status: 'online',
      currentLocation: {
        type: 'Point',
        coordinates: [72.8800, 19.0800] // [longitude, latitude]
      },
      vehicleType: 'bike',
      vehicleNumber: 'MH02AB1234',
      vehicleModel: 'Honda Activa',
      licenseNumber: 'DL1234567890',
      licenseExpiry: new Date('2030-12-31'),
      aadharNumber: '123456789012',
      isApproved: true,
      isActive: true
    };

    const existingDriver = await Driver.findOne({ email: driverData.email });
    if (existingDriver) {
      console.log(`⚠️  Driver ${driverData.email} already exists, skipping...`);
    } else {
      await Driver.create(driverData);
      console.log(`✅ Created driver: ${driverData.email}`);
    }

    console.log('\n🎉 Demo users seeded successfully!');
    console.log('\n📝 Login Credentials:');
    console.log('------------------------');
    users.forEach(user => {
      const password = user.email.split('@')[0].split('test')[1] || user.role;
      console.log(`${user.role.toUpperCase()}: ${user.email} / ${password.charAt(0).toUpperCase() + password.slice(1)}@1234`);
    });
    console.log(`DRIVER: testdriver@example.com / Driver@1234`);
    console.log('------------------------\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers();
