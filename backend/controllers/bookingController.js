import Booking from '../models/Booking.js';
import User from '../models/User.js';
import Driver from '../models/Driver.js';
import { calculatePrice } from '../utils/pricingEngine.js';
import { getIO } from '../socket.js';

export const createBooking = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      pickup,
      drop,
      distance,
      cargoDetails,
      addOns,
      scheduledFor,
      recurring
    } = req.body;

    // Calculate pricing
    const pricing = await calculatePrice({
      distance,
      cargoSize: cargoDetails.size,
      vehicleType: 'all',
      addOns
    });

    // Generate OTPs
    const pickupOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const dropOtp = Math.floor(1000 + Math.random() * 9000).toString();

    // Create booking
    const booking = await Booking.create({
      user: userId,
      pickup,
      drop,
      distance,
      cargoDetails,
      pricing,
      otp: {
        pickup: pickupOtp,
        drop: dropOtp
      },
      scheduledFor,
      recurring: recurring || { enabled: false },
      timeline: [
        {
          status: 'pending',
          timestamp: new Date(),
          location: pickup.coordinates
        }
      ]
    });

    // If not scheduled, broadcast to nearby drivers
    if (!scheduledFor) {
      try {
        // Get pickup coordinates
        const [pickupLng, pickupLat] = booking.pickup.coordinates.coordinates;

        // Find nearby online drivers (within 20km)
        const nearbyDrivers = await Driver.find({
          status: 'online',
          'currentLocation.coordinates': {
            $near: {
              $geometry: {
                type: 'Point',
                coordinates: [pickupLng, pickupLat]
              },
              $maxDistance: 20000 // 20km in meters
            }
          }
        }).select('_id name');

        console.log(`Found ${nearbyDrivers.length} nearby drivers for booking ${booking._id}`);

        // Broadcast to nearby drivers via Socket.IO (if available)
        const io = getIO();
        if (io && nearbyDrivers.length > 0) {
          nearbyDrivers.forEach(driver => {
            io.to(`user:${driver._id}`).emit('booking:new', {
              bookingId: booking._id,
              bookingNumber: booking.bookingId,
              pickup: booking.pickup.address,
              drop: booking.drop.address,
              distance: booking.distance,
              cargoSize: booking.cargoDetails.size,
              amount: booking.pricing.total,
              pickupLocation: booking.pickup.coordinates.coordinates,
              createdAt: booking.createdAt
            });
          });
          console.log(`Broadcasted booking to ${nearbyDrivers.length} drivers`);
        }
      } catch (error) {
        console.error('Error broadcasting to drivers:', error);
        // Don't fail booking creation if broadcast fails
      }
    }

    const populatedBooking = await Booking.findById(booking._id)
      .populate('user', 'name phone')
      .populate('driver', 'name phone rating')
      .populate('vehicle');

    res.status(201).json({
      success: true,
      data: populatedBooking,
      message: 'Booking created successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name phone email')
      .populate('driver', 'name phone rating currentLocation')
      .populate('vehicle')
      .populate('pod');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check authorization
    const userId = req.user?._id?.toString();
    const driverId = req.driver?._id?.toString();

    if (
      userId !== booking.user._id.toString() &&
      driverId !== booking.driver?._id?.toString() &&
      req.userRole !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const userId = req.params.userId || req.user._id;
    const { status, page = 1, limit = 10 } = req.query;

    const query = { user: userId };
    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('driver', 'name phone rating')
      .populate('vehicle', 'vehicleType vehicleNumber')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Booking.countDocuments(query);

    res.json({
      success: true,
      data: bookings,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDriverBookings = async (req, res) => {
  try {
    const driverId = req.params.driverId || req.driver._id;
    const { status, page = 1, limit = 10 } = req.query;

    const query = { driver: driverId };
    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('user', 'name phone')
      .populate('vehicle', 'vehicleType vehicleNumber')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Booking.countDocuments(query);

    res.json({
      success: true,
      data: bookings,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, location, note } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Validate status transition
    const validTransitions = {
      pending: ['driver_assigned', 'cancelled'],
      driver_assigned: ['driver_arrived', 'cancelled'],
      driver_arrived: ['picked_up', 'cancelled'],
      picked_up: ['in_transit'],
      in_transit: ['reached_destination'],
      reached_destination: ['delivered'],
      delivered: ['completed']
    };

    if (!validTransitions[booking.status]?.includes(status)) {
      return res.status(400).json({
        message: `Cannot transition from ${booking.status} to ${status}`
      });
    }

    booking.status = status;
    booking.timeline.push({
      status,
      timestamp: new Date(),
      location,
      note
    });

    // Update driver stats on completion
    if (status === 'completed') {
      await Driver.findByIdAndUpdate(booking.driver, {
        $inc: {
          'stats.completedDeliveries': 1,
          'stats.totalEarnings': booking.pricing.total * 0.7 // 70% to driver
        }
      });
    }

    await booking.save();

    res.json({
      success: true,
      data: booking,
      message: `Booking status updated to ${status}`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (!['pending', 'driver_assigned', 'driver_arrived'].includes(booking.status)) {
      return res.status(400).json({
        message: 'Cannot cancel booking at this stage'
      });
    }

    const cancelledBy = req.user ? 'user' : req.driver ? 'driver' : 'admin';

    booking.status = 'cancelled';
    booking.cancellation = {
      cancelledBy,
      reason,
      cancelledAt: new Date(),
      refundAmount: booking.pricing.total
    };

    booking.timeline.push({
      status: 'cancelled',
      timestamp: new Date(),
      note: `Cancelled by ${cancelledBy}: ${reason}`
    });

    await booking.save();

    // Process refund if payment was made
    if (booking.payment.status === 'completed') {
      const user = await User.findById(booking.user);
      user.wallet.balance += booking.pricing.total;
      await user.save();
    }

    res.json({
      success: true,
      data: booking,
      message: 'Booking cancelled successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const estimatePrice = async (req, res) => {
  try {
    const { distance, cargoSize, vehicleType, addOns } = req.body;

    const pricing = await calculatePrice({
      distance,
      cargoSize,
      vehicleType: vehicleType || 'all',
      addOns
    });

    res.json({
      success: true,
      data: pricing
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const rateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { stars, comment } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status !== 'completed') {
      return res.status(400).json({ message: 'Can only rate completed bookings' });
    }

    if (req.user) {
      booking.rating.byUser = { stars, comment };

      // Update driver rating
      const driver = await Driver.findById(booking.driver);
      const totalRatings = driver.rating.count;
      const currentAverage = driver.rating.average;
      const newAverage = ((currentAverage * totalRatings) + stars) / (totalRatings + 1);

      driver.rating.average = newAverage;
      driver.rating.count = totalRatings + 1;
      await driver.save();
    } else if (req.driver) {
      booking.rating.byDriver = { stars, comment };
    }

    await booking.save();

    res.json({
      success: true,
      data: booking,
      message: 'Rating submitted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
