import Booking from '../models/Booking.js';
import Driver from '../models/Driver.js';
import { getIO } from '../socket.js';

/**
 * Find nearby available drivers for a booking
 */
export const findNearbyDrivers = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Get pickup coordinates
    const [pickupLng, pickupLat] = booking.pickup.coordinates.coordinates;

    // Find drivers within 10km radius who are online and available
    const nearbyDrivers = await Driver.find({
      status: 'online',
      'currentLocation.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [pickupLng, pickupLat]
          },
          $maxDistance: 10000 // 10km in meters
        }
      }
    })
    .select('name phone currentLocation rating totalTrips vehicleDetails')
    .limit(10);

    res.json({
      success: true,
      data: {
        booking,
        availableDrivers: nearbyDrivers,
        count: nearbyDrivers.length
      }
    });
  } catch (error) {
    console.error('Find nearby drivers error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * Auto-assign driver to booking (nearest available)
 */
export const autoAssignDriver = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.driver) {
      return res.status(400).json({ success: false, message: 'Booking already has a driver assigned' });
    }

    // Get pickup coordinates
    const [pickupLng, pickupLat] = booking.pickup.coordinates.coordinates;

    // Find nearest available driver
    const driver = await Driver.findOne({
      status: 'online',
      'currentLocation.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [pickupLng, pickupLat]
          }
        }
      }
    });

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'No available drivers found nearby'
      });
    }

    // Assign driver to booking
    booking.driver = driver._id;
    booking.status = 'driver_assigned';
    booking.timeline.push({
      status: 'driver_assigned',
      timestamp: new Date(),
      note: `Driver ${driver.name} assigned automatically`
    });

    // Generate OTPs
    booking.otp = {
      pickup: Math.floor(100000 + Math.random() * 900000).toString(),
      drop: Math.floor(100000 + Math.random() * 900000).toString()
    };

    await booking.save();

    // Update driver status
    driver.status = 'busy';
    await driver.save();

    // Notify driver via socket
    const io = getIO();
    if (io) {
      io.to(`user:${driver._id}`).emit('booking:assigned', {
        booking: await booking.populate('user vehicle')
      });
    }

    res.json({
      success: true,
      message: 'Driver assigned successfully',
      data: await booking.populate('driver user')
    });
  } catch (error) {
    console.error('Auto-assign driver error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * Manually assign specific driver to booking (Admin/User)
 */
export const manualAssignDriver = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { driverId } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.driver) {
      return res.status(400).json({ success: false, message: 'Booking already has a driver assigned' });
    }

    const driver = await Driver.findById(driverId);
    if (!driver) {
      return res.status(404).json({ success: false, message: 'Driver not found' });
    }

    if (driver.status !== 'online') {
      return res.status(400).json({ success: false, message: 'Driver is not available' });
    }

    // Assign driver
    booking.driver = driver._id;
    booking.status = 'driver_assigned';
    booking.timeline.push({
      status: 'driver_assigned',
      timestamp: new Date(),
      note: `Driver ${driver.name} assigned manually`
    });

    // Generate OTPs
    booking.otp = {
      pickup: Math.floor(100000 + Math.random() * 900000).toString(),
      drop: Math.floor(100000 + Math.random() * 900000).toString()
    };

    await booking.save();

    // Update driver status
    driver.status = 'busy';
    await driver.save();

    // Notify driver
    const io2 = getIO();
    if (io2) {
      io2.to(`user:${driver._id}`).emit('booking:assigned', {
        booking: await booking.populate('user vehicle')
      });
    }

    res.json({
      success: true,
      message: 'Driver assigned successfully',
      data: await booking.populate('driver user')
    });
  } catch (error) {
    console.error('Manual assign driver error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * Broadcast booking to nearby drivers (they can accept)
 */
export const broadcastBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId).populate('user');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.driver) {
      return res.status(400).json({ success: false, message: 'Booking already has a driver assigned' });
    }

    // Get pickup coordinates
    const [pickupLng, pickupLat] = booking.pickup.coordinates.coordinates;

    // Find nearby drivers
    const nearbyDrivers = await Driver.find({
      status: 'online',
      'currentLocation.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [pickupLng, pickupLat]
          },
          $maxDistance: 15000 // 15km
        }
      }
    });

    // Broadcast to all nearby drivers via socket
    const io3 = getIO();
    if (io3) {
      nearbyDrivers.forEach(driver => {
        io3.to(`user:${driver._id}`).emit('booking:available', {
          bookingId: booking._id,
          pickup: booking.pickup.address,
          drop: booking.drop.address,
          distance: booking.distance,
          cargoSize: booking.cargoDetails.size,
          amount: booking.pricing.total,
          pickupLocation: booking.pickup.coordinates.coordinates
        });
      });
    }

    res.json({
      success: true,
      message: `Booking broadcasted to ${nearbyDrivers.length} nearby drivers`,
      data: {
        driversNotified: nearbyDrivers.length
      }
    });
  } catch (error) {
    console.error('Broadcast booking error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * Driver accepts broadcasted booking
 */
export const acceptBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const driverId = req.driver?._id || req.driver?.id;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Check if already assigned
    if (booking.driver) {
      return res.status(400).json({
        success: false,
        message: 'Booking already accepted by another driver'
      });
    }

    const driver = await Driver.findById(driverId);
    if (!driver) {
      return res.status(404).json({ success: false, message: 'Driver not found' });
    }

    // Assign driver
    booking.driver = driver._id;
    booking.status = 'driver_assigned';
    booking.timeline.push({
      status: 'driver_assigned',
      timestamp: new Date(),
      note: `Driver ${driver.name} accepted the booking`
    });

    // Generate OTPs
    booking.otp = {
      pickup: Math.floor(100000 + Math.random() * 900000).toString(),
      drop: Math.floor(100000 + Math.random() * 900000).toString()
    };

    await booking.save();

    // Update driver status
    driver.status = 'busy';
    await driver.save();

    // Notify user
    const io4 = getIO();
    if (io4) {
      io4.to(`user:${booking.user}`).emit('booking:driverAssigned', {
        booking: await booking.populate('driver')
      });
    }

    res.json({
      success: true,
      message: 'Booking accepted successfully',
      data: await booking.populate('user')
    });
  } catch (error) {
    console.error('Accept booking error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * Get all pending bookings for drivers to see
 */
export const getPendingBookings = async (req, res) => {
  try {
    const driverId = req.driver?._id || req.driver?.id;
    const driver = await Driver.findById(driverId);

    if (!driver) {
      return res.status(404).json({ success: false, message: 'Driver not found' });
    }

    // Get driver's current location
    const [driverLng, driverLat] = driver.currentLocation.coordinates;

    // Find pending bookings within 20km
    const pendingBookings = await Booking.find({
      status: 'pending',
      driver: null,
      'pickup.coordinates.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [driverLng, driverLat]
          },
          $maxDistance: 20000 // 20km
        }
      }
    })
    .populate('user', 'name phone')
    .sort({ createdAt: -1 })
    .limit(20);

    res.json({
      success: true,
      data: pendingBookings
    });
  } catch (error) {
    console.error('Get pending bookings error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
