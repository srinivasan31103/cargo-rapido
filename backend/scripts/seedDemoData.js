import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Driver from '../models/Driver.js';
import Booking from '../models/Booking.js';
import Transaction from '../models/Transaction.js';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cargorapido')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

const seedDemoData = async () => {
  try {
    console.log('\n🌱 Starting comprehensive demo data seeding...\n');

    // Clear existing demo data (keep the 4 main accounts)
    const mainEmails = ['testuser@example.com', 'admin@example.com', 'business@example.com'];
    const mainDriverEmail = 'testdriver@example.com';

    await Booking.deleteMany({});
    await Transaction.deleteMany({});
    console.log('✅ Cleared existing bookings and transactions');

    // Get existing users
    const testUser = await User.findOne({ email: 'testuser@example.com' });
    const businessUser = await User.findOne({ email: 'business@example.com' });
    const testDriver = await Driver.findOne({ email: 'testdriver@example.com' });

    if (!testUser || !businessUser || !testDriver) {
      console.error('❌ Main demo accounts not found. Please run seedUsers.js first.');
      process.exit(1);
    }

    console.log('✅ Found main demo accounts');

    // Delete additional users first if they exist
    await User.deleteMany({
      email: { $nin: mainEmails }
    });

    // Create additional users
    const additionalUsers = [
      {
        name: 'Rajesh Kumar',
        email: 'rajesh.k@example.com',
        phone: '9876543211',
        password: 'User@1234',
        role: 'user',
        address: {
          city: 'Mumbai',
          state: 'Maharashtra',
          coordinates: { type: 'Point', coordinates: [72.8777, 19.0760] }
        },
        wallet: { balance: 1500 }
      },
      {
        name: 'Priya Sharma',
        email: 'priya.s@example.com',
        phone: '9876543214',
        password: 'User@1234',
        role: 'user',
        address: {
          city: 'Delhi',
          state: 'Delhi',
          coordinates: { type: 'Point', coordinates: [77.1025, 28.7041] }
        },
        wallet: { balance: 800 }
      },
      {
        name: 'Arjun Patel',
        email: 'arjun.p@example.com',
        phone: '9876543215',
        password: 'User@1234',
        role: 'user',
        address: {
          city: 'Bangalore',
          state: 'Karnataka',
          coordinates: { type: 'Point', coordinates: [77.5946, 12.9716] }
        },
        wallet: { balance: 2000 }
      }
    ];

    await User.insertMany(additionalUsers);
    console.log('✅ Created additional users');

    // Get all users for bookings
    const allUsers = await User.find({ role: { $in: ['user', 'business'] } });

    // Delete additional drivers first if they exist
    await Driver.deleteMany({
      email: { $ne: mainDriverEmail }
    });

    // Create additional drivers
    const additionalDrivers = [
      {
        name: 'Vikram Singh',
        email: 'vikram.driver@example.com',
        phone: '9876543221',
        password: 'Driver@1234',
        licenseNumber: 'MH02ABC1235',
        licenseExpiry: new Date('2026-12-31'),
        aadharNumber: '123456789013',
        address: {
          city: 'Mumbai',
          state: 'Maharashtra',
          coordinates: { type: 'Point', coordinates: [72.8777, 19.0760] }
        },
        currentLocation: {
          type: 'Point',
          coordinates: [72.8777, 19.0760],
          address: 'Mumbai, Maharashtra'
        },
        vehicleDetails: {
          type: 'pickup',
          number: 'MH02XY1234',
          capacity: '500kg'
        },
        wallet: { balance: 5000 },
        rating: 4.7,
        totalTrips: 145
      },
      {
        name: 'Ramesh Yadav',
        email: 'ramesh.driver@example.com',
        phone: '9876543222',
        password: 'Driver@1234',
        licenseNumber: 'DL05XYZ9876',
        licenseExpiry: new Date('2027-06-30'),
        aadharNumber: '123456789014',
        address: {
          city: 'Delhi',
          state: 'Delhi',
          coordinates: { type: 'Point', coordinates: [77.1025, 28.7041] }
        },
        currentLocation: {
          type: 'Point',
          coordinates: [77.1025, 28.7041],
          address: 'Delhi'
        },
        vehicleDetails: {
          type: 'truck',
          number: 'DL05AB5678',
          capacity: '1000kg'
        },
        wallet: { balance: 7500 },
        rating: 4.9,
        totalTrips: 230
      },
      {
        name: 'Suresh Reddy',
        email: 'suresh.driver@example.com',
        phone: '9876543223',
        password: 'Driver@1234',
        licenseNumber: 'KA03LMN4567',
        licenseExpiry: new Date('2026-09-30'),
        aadharNumber: '123456789015',
        address: {
          city: 'Bangalore',
          state: 'Karnataka',
          coordinates: { type: 'Point', coordinates: [77.5946, 12.9716] }
        },
        currentLocation: {
          type: 'Point',
          coordinates: [77.5946, 12.9716],
          address: 'Bangalore, Karnataka'
        },
        vehicleDetails: {
          type: 'van',
          number: 'KA03CD7890',
          capacity: '750kg'
        },
        wallet: { balance: 6200 },
        rating: 4.6,
        totalTrips: 180
      }
    ];

    await Driver.insertMany(additionalDrivers);
    console.log('✅ Created additional drivers');

    // Get all drivers
    const allDrivers = await Driver.find({});

    // Create realistic bookings with various statuses
    const bookings = [];

    // Completed bookings
    const completedBookings = [
      {
        user: testUser._id,
        driver: testDriver._id,
        pickupLocation: {
          address: 'Andheri West, Mumbai',
          coordinates: { type: 'Point', coordinates: [72.8347, 19.1136] }
        },
        dropLocation: {
          address: 'Bandra East, Mumbai',
          coordinates: { type: 'Point', coordinates: [72.8479, 19.0596] }
        },
        cargoDetails: {
          size: 'M',
          weight: 25,
          description: 'Electronics - LED TV',
          isFragile: true
        },
        pricing: {
          baseFare: 50,
          distanceFare: 84,
          cargoSizeMultiplier: 1.5,
          surgeMultiplier: 1,
          addons: { express: 50, insurance: 20, fragileHandling: 30 },
          totalAmount: 234
        },
        estimatedDistance: 7,
        status: 'delivered',
        paymentMethod: 'wallet',
        paymentStatus: 'completed',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000)
      },
      {
        user: testUser._id,
        driver: allDrivers[1]?._id || testDriver._id,
        pickupLocation: {
          address: 'Juhu, Mumbai',
          coordinates: { type: 'Point', coordinates: [72.8264, 19.0990] }
        },
        dropLocation: {
          address: 'Powai, Mumbai',
          coordinates: { type: 'Point', coordinates: [72.9050, 19.1176] }
        },
        cargoDetails: {
          size: 'L',
          weight: 45,
          description: 'Furniture - Wooden Chair Set',
          isFragile: false
        },
        pricing: {
          baseFare: 50,
          distanceFare: 120,
          cargoSizeMultiplier: 2,
          surgeMultiplier: 1,
          addons: { express: 0, insurance: 0, fragileHandling: 0 },
          totalAmount: 340
        },
        estimatedDistance: 10,
        status: 'delivered',
        paymentMethod: 'wallet',
        paymentStatus: 'completed',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000)
      },
      {
        user: businessUser._id,
        driver: testDriver._id,
        pickupLocation: {
          address: 'Goregaon East, Mumbai',
          coordinates: { type: 'Point', coordinates: [72.8479, 19.1659] }
        },
        dropLocation: {
          address: 'Vashi, Navi Mumbai',
          coordinates: { type: 'Point', coordinates: [72.9988, 19.0759] }
        },
        cargoDetails: {
          size: 'XL',
          weight: 80,
          description: 'Office Equipment - Desktop Computers (5 units)',
          isFragile: true
        },
        pricing: {
          baseFare: 50,
          distanceFare: 180,
          cargoSizeMultiplier: 3,
          surgeMultiplier: 1,
          addons: { express: 50, insurance: 50, fragileHandling: 30 },
          totalAmount: 820
        },
        estimatedDistance: 15,
        status: 'delivered',
        paymentMethod: 'wallet',
        paymentStatus: 'completed',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000)
      }
    ];

    // In-transit bookings
    const inTransitBookings = [
      {
        user: testUser._id,
        driver: allDrivers[2]?._id || testDriver._id,
        pickupLocation: {
          address: 'Malad West, Mumbai',
          coordinates: { type: 'Point', coordinates: [72.8355, 19.1862] }
        },
        dropLocation: {
          address: 'Dadar East, Mumbai',
          coordinates: { type: 'Point', coordinates: [72.8479, 19.0176] }
        },
        cargoDetails: {
          size: 'S',
          weight: 10,
          description: 'Documents and Files',
          isFragile: false
        },
        pricing: {
          baseFare: 50,
          distanceFare: 108,
          cargoSizeMultiplier: 1,
          surgeMultiplier: 1,
          addons: { express: 50, insurance: 0, fragileHandling: 0 },
          totalAmount: 208
        },
        estimatedDistance: 9,
        status: 'in_transit',
        paymentMethod: 'wallet',
        paymentStatus: 'completed',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      },
      {
        user: businessUser._id,
        driver: allDrivers[1]?._id || testDriver._id,
        pickupLocation: {
          address: 'Lower Parel, Mumbai',
          coordinates: { type: 'Point', coordinates: [72.8311, 18.9958] }
        },
        dropLocation: {
          address: 'BKC, Mumbai',
          coordinates: { type: 'Point', coordinates: [72.8681, 19.0659] }
        },
        cargoDetails: {
          size: 'M',
          weight: 30,
          description: 'Marketing Materials - Brochures and Banners',
          isFragile: false
        },
        pricing: {
          baseFare: 50,
          distanceFare: 60,
          cargoSizeMultiplier: 1.5,
          surgeMultiplier: 1.2,
          addons: { express: 0, insurance: 0, fragileHandling: 0 },
          totalAmount: 132
        },
        estimatedDistance: 5,
        status: 'in_transit',
        paymentMethod: 'online',
        paymentStatus: 'completed',
        createdAt: new Date(Date.now() - 30 * 60 * 1000) // 30 mins ago
      }
    ];

    // Pending bookings (waiting for driver assignment)
    const pendingBookings = [
      {
        user: allUsers[2]?._id || testUser._id,
        pickupLocation: {
          address: 'Thane West',
          coordinates: { type: 'Point', coordinates: [72.9781, 19.2183] }
        },
        dropLocation: {
          address: 'Mulund East, Mumbai',
          coordinates: { type: 'Point', coordinates: [72.9562, 19.1677] }
        },
        cargoDetails: {
          size: 'M',
          weight: 20,
          description: 'Home Appliances - Microwave Oven',
          isFragile: true
        },
        pricing: {
          baseFare: 50,
          distanceFare: 48,
          cargoSizeMultiplier: 1.5,
          surgeMultiplier: 1,
          addons: { express: 0, insurance: 15, fragileHandling: 30 },
          totalAmount: 143
        },
        estimatedDistance: 4,
        status: 'pending',
        paymentMethod: 'wallet',
        paymentStatus: 'pending',
        createdAt: new Date(Date.now() - 5 * 60 * 1000) // 5 mins ago
      }
    ];

    // Cancelled bookings
    const cancelledBookings = [
      {
        user: testUser._id,
        pickupLocation: {
          address: 'Versova, Mumbai',
          coordinates: { type: 'Point', coordinates: [72.8066, 19.1313] }
        },
        dropLocation: {
          address: 'Goregaon West, Mumbai',
          coordinates: { type: 'Point', coordinates: [72.8489, 19.1550] }
        },
        cargoDetails: {
          size: 'S',
          weight: 5,
          description: 'Books',
          isFragile: false
        },
        pricing: {
          baseFare: 50,
          distanceFare: 36,
          cargoSizeMultiplier: 1,
          surgeMultiplier: 1,
          addons: { express: 0, insurance: 0, fragileHandling: 0 },
          totalAmount: 86
        },
        estimatedDistance: 3,
        status: 'cancelled',
        paymentMethod: 'wallet',
        paymentStatus: 'refunded',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        cancelledAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 10 * 60 * 1000),
        cancellationReason: 'Changed delivery address'
      }
    ];

    // Combine all bookings
    const allBookings = [
      ...completedBookings,
      ...inTransitBookings,
      ...pendingBookings,
      ...cancelledBookings
    ];

    const createdBookings = await Booking.insertMany(allBookings);
    console.log(`✅ Created ${createdBookings.length} demo bookings`);

    // Create transaction records for completed bookings
    const transactions = [];

    for (const booking of completedBookings) {
      transactions.push({
        user: booking.user,
        booking: createdBookings.find(b =>
          b.user.toString() === booking.user.toString() &&
          b.pickupLocation.address === booking.pickupLocation.address
        )?._id,
        amount: booking.pricing.totalAmount,
        type: 'debit',
        description: 'Booking payment',
        status: 'completed',
        createdAt: booking.createdAt
      });
    }

    // Add wallet recharge transactions
    transactions.push(
      {
        user: testUser._id,
        amount: 1000,
        type: 'credit',
        description: 'Wallet recharge',
        status: 'completed',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) // 10 days ago
      },
      {
        user: businessUser._id,
        amount: 5000,
        type: 'credit',
        description: 'Wallet recharge',
        status: 'completed',
        createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000) // 8 days ago
      }
    );

    const createdTransactions = await Transaction.insertMany(transactions);
    console.log(`✅ Created ${createdTransactions.length} demo transaction records`);

    // Update user and driver wallet balances based on transactions
    await User.findByIdAndUpdate(testUser._id, {
      $set: {
        'wallet.balance': 1000 - completedBookings.filter(b => b.user === testUser._id).reduce((sum, b) => sum + b.pricing.totalAmount, 0)
      }
    });

    await User.findByIdAndUpdate(businessUser._id, {
      $set: {
        'wallet.balance': 5000 - completedBookings.filter(b => b.user === businessUser._id).reduce((sum, b) => sum + b.pricing.totalAmount, 0)
      }
    });

    // Update driver stats
    await Driver.findByIdAndUpdate(testDriver._id, {
      $inc: {
        totalTrips: completedBookings.filter(b => b.driver?.toString() === testDriver._id.toString()).length
      },
      $set: {
        'wallet.balance': 500 + completedBookings.filter(b => b.driver?.toString() === testDriver._id.toString()).reduce((sum, b) => sum + b.pricing.totalAmount * 0.8, 0)
      }
    });

    console.log('✅ Updated wallet balances');

    console.log('\n✨ Demo data seeding completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`  - Users: ${allUsers.length}`);
    console.log(`  - Drivers: ${allDrivers.length}`);
    console.log(`  - Bookings: ${createdBookings.length}`);
    console.log(`    • Completed: ${completedBookings.length}`);
    console.log(`    • In Transit: ${inTransitBookings.length}`);
    console.log(`    • Pending: ${pendingBookings.length}`);
    console.log(`    • Cancelled: ${cancelledBookings.length}`);
    console.log(`  - Transactions: ${createdTransactions.length}`);
    console.log('\n🎉 Your demo database is ready!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding demo data:', error);
    process.exit(1);
  }
};

seedDemoData();
