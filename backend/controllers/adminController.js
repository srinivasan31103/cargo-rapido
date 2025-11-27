import User from '../models/User.js';
import Driver from '../models/Driver.js';
import Booking from '../models/Booking.js';
import Vehicle from '../models/Vehicle.js';
import Transaction from '../models/Transaction.js';

/**
 * USER MANAGEMENT
 */

// Get all users with pagination and filters
export const getAllUsers = async (req, res) => {
  try {
    const { role, isBlocked, page = 1, limit = 20, search } = req.query;

    const query = {};
    if (role) query.role = role;
    if (isBlocked !== undefined) query.isBlocked = isBlocked === 'true';

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await User.countDocuments(query);

    res.json({
      success: true,
      data: users,
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

// Get single user details
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's booking stats
    const bookingStats = await Booking.aggregate([
      { $match: { user: user._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        user,
        bookingStats
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user details (Admin)
export const updateUser = async (req, res) => {
  try {
    const updates = req.body;

    // Prevent updating sensitive fields
    delete updates.password;
    delete updates.wallet;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      data: user,
      message: 'User updated successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Block/Unblock user
export const toggleUserBlock = async (req, res) => {
  try {
    const { block, reason } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isBlocked = block;
    user.blockedReason = block ? reason : null;
    await user.save();

    res.json({
      success: true,
      data: user,
      message: `User ${block ? 'blocked' : 'unblocked'} successfully`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete user (soft delete - mark as deleted)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check for active bookings
    const activeBookings = await Booking.countDocuments({
      user: user._id,
      status: { $in: ['pending', 'driver_assigned', 'picked_up', 'in_transit'] }
    });

    if (activeBookings > 0) {
      return res.status(400).json({
        message: 'Cannot delete user with active bookings',
        activeBookings
      });
    }

    // Soft delete
    user.isBlocked = true;
    user.blockedReason = 'Account deleted';
    user.email = `deleted_${user._id}@deleted.com`;
    user.phone = `deleted_${user._id}`;
    await user.save();

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * BOOKING MANAGEMENT
 */

// Get all bookings (Admin view)
export const getAllBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 20, search, startDate, endDate } = req.query;

    const query = {};
    if (status) query.status = status;

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    if (search) {
      query.bookingId = { $regex: search, $options: 'i' };
    }

    const bookings = await Booking.find(query)
      .populate('user', 'name phone email')
      .populate('driver', 'name phone rating')
      .populate('vehicle', 'vehicleType vehicleNumber')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Booking.countDocuments(query);

    // Get statistics
    const stats = await Booking.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$pricing.total' },
          totalBookings: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: bookings,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit)
      },
      stats: stats[0] || { totalRevenue: 0, totalBookings: 0 }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete booking (Admin only)
export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Only allow deleting cancelled or completed bookings
    if (!['cancelled', 'completed'].includes(booking.status)) {
      return res.status(400).json({
        message: 'Can only delete cancelled or completed bookings'
      });
    }

    await Booking.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * DRIVER MANAGEMENT (Additional)
 */

// Delete driver
export const deleteDriver = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    // Check for active bookings
    const activeBookings = await Booking.countDocuments({
      driver: driver._id,
      status: { $in: ['driver_assigned', 'driver_arrived', 'picked_up', 'in_transit'] }
    });

    if (activeBookings > 0) {
      return res.status(400).json({
        message: 'Cannot delete driver with active bookings',
        activeBookings
      });
    }

    // Delete associated vehicle
    if (driver.vehicle) {
      await Vehicle.findByIdAndDelete(driver.vehicle);
    }

    // Soft delete driver
    driver.isBlocked = true;
    driver.blockedReason = 'Account deleted';
    driver.email = `deleted_${driver._id}@deleted.com`;
    driver.phone = `deleted_${driver._id}`;
    driver.status = 'offline';
    await driver.save();

    res.json({
      success: true,
      message: 'Driver deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single driver details (Admin)
export const getDriver = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id)
      .populate('vehicle')
      .select('-password');

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    // Get driver's booking stats
    const bookingStats = await Booking.aggregate([
      { $match: { driver: driver._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalEarnings: { $sum: { $multiply: ['$pricing.total', 0.7] } }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        driver,
        bookingStats
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * VEHICLE MANAGEMENT
 */

// Get all vehicles
export const getAllVehicles = async (req, res) => {
  try {
    const { vehicleType, isVerified, page = 1, limit = 20 } = req.query;

    const query = {};
    if (vehicleType) query.vehicleType = vehicleType;
    if (isVerified !== undefined) query.isVerified = isVerified === 'true';

    const vehicles = await Vehicle.find(query)
      .populate('driver', 'name phone rating status')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Vehicle.countDocuments(query);

    res.json({
      success: true,
      data: vehicles,
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

// Update vehicle
export const updateVehicle = async (req, res) => {
  try {
    const updates = req.body;

    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('driver', 'name phone');

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.json({
      success: true,
      data: vehicle,
      message: 'Vehicle updated successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete vehicle
export const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // Remove vehicle reference from driver
    if (vehicle.driver) {
      await Driver.findByIdAndUpdate(vehicle.driver, {
        $unset: { vehicle: 1 }
      });
    }

    await Vehicle.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Vehicle deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * DASHBOARD STATISTICS
 */

export const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Total counts
    const totalUsers = await User.countDocuments({ role: { $in: ['user', 'business'] } });
    const totalDrivers = await Driver.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalVehicles = await Vehicle.countDocuments();

    // Today's stats
    const todayBookings = await Booking.countDocuments({
      createdAt: { $gte: today }
    });

    const todayRevenue = await Booking.aggregate([
      { $match: { createdAt: { $gte: today }, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$pricing.total' } } }
    ]);

    // Active bookings
    const activeBookings = await Booking.countDocuments({
      status: { $in: ['pending', 'driver_assigned', 'driver_arrived', 'picked_up', 'in_transit'] }
    });

    // Online drivers
    const onlineDrivers = await Driver.countDocuments({ status: 'online' });

    // Revenue stats
    const totalRevenue = await Booking.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$pricing.total' } } }
    ]);

    // Recent bookings
    const recentBookings = await Booking.find()
      .populate('user', 'name')
      .populate('driver', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalDrivers,
          totalBookings,
          totalVehicles,
          onlineDrivers,
          activeBookings
        },
        today: {
          bookings: todayBookings,
          revenue: todayRevenue[0]?.total || 0
        },
        revenue: {
          total: totalRevenue[0]?.total || 0
        },
        recentBookings
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
