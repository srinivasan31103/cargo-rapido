import Driver from '../models/Driver.js';
import Vehicle from '../models/Vehicle.js';
import { findNearestDrivers, updateDriverLocation } from '../utils/driverMatcher.js';
import { uploadImage } from '../utils/cloudinary.js';

export const getNearbyDrivers = async (req, res) => {
  try {
    const { lat, lng, radius = 10 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    const drivers = await findNearestDrivers(
      { lat: parseFloat(lat), lng: parseFloat(lng) },
      parseFloat(radius)
    );

    res.json({
      success: true,
      count: drivers.length,
      data: drivers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateDriverStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const driverId = req.driver._id;

    if (!['online', 'offline', 'busy'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const driver = await Driver.findByIdAndUpdate(
      driverId,
      { status },
      { new: true }
    );

    res.json({
      success: true,
      data: driver,
      message: `Status updated to ${status}`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateLocation = async (req, res) => {
  try {
    const { lat, lng, heading, speed, accuracy } = req.body;
    const driverId = req.driver._id;

    const location = await updateDriverLocation(driverId, {
      lat,
      lng,
      heading,
      speed,
      accuracy
    });

    res.json({
      success: true,
      data: location
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadDocuments = async (req, res) => {
  try {
    const driverId = req.driver._id;
    const files = req.files;

    if (!files || Object.keys(files).length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const documents = {};

    // Upload each document to cloudinary
    for (const [key, fileArray] of Object.entries(files)) {
      if (fileArray && fileArray[0]) {
        const result = await uploadImage(fileArray[0].path, `cargorapido/documents/${driverId}`);
        documents[key] = result.url;
      }
    }

    const driver = await Driver.findByIdAndUpdate(
      driverId,
      { documents, kycStatus: 'under_review' },
      { new: true }
    );

    res.json({
      success: true,
      data: driver,
      message: 'Documents uploaded successfully. KYC under review.'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const registerVehicle = async (req, res) => {
  try {
    const driverId = req.driver._id;
    const {
      vehicleType,
      vehicleModel,
      vehicleNumber,
      vehicleColor,
      maxCapacity,
      cargoSizes,
      registrationExpiry,
      insuranceExpiry,
      pollutionCertExpiry
    } = req.body;

    // Check if driver already has a vehicle
    const existingVehicle = await Vehicle.findOne({ driver: driverId });
    if (existingVehicle) {
      return res.status(400).json({ message: 'Driver already has a registered vehicle' });
    }

    const vehicle = await Vehicle.create({
      driver: driverId,
      vehicleType,
      vehicleModel,
      vehicleNumber,
      vehicleColor,
      maxCapacity,
      cargoSizes,
      registrationExpiry,
      insuranceExpiry,
      pollutionCertExpiry
    });

    // Update driver with vehicle reference
    await Driver.findByIdAndUpdate(driverId, { vehicle: vehicle._id });

    res.status(201).json({
      success: true,
      data: vehicle,
      message: 'Vehicle registered successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDriverStats = async (req, res) => {
  try {
    const driverId = req.driver._id;

    const driver = await Driver.findById(driverId).populate('vehicle');

    const stats = {
      totalDeliveries: driver.stats.totalDeliveries,
      completedDeliveries: driver.stats.completedDeliveries,
      cancelledDeliveries: driver.stats.cancelledDeliveries,
      completionRate: driver.stats.totalDeliveries > 0
        ? ((driver.stats.completedDeliveries / driver.stats.totalDeliveries) * 100).toFixed(2)
        : 0,
      totalEarnings: driver.stats.totalEarnings,
      pendingPayout: driver.stats.pendingPayout,
      rating: driver.rating,
      status: driver.status,
      kycStatus: driver.kycStatus
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllDrivers = async (req, res) => {
  try {
    const { status, kycStatus, page = 1, limit = 20 } = req.query;

    const query = {};
    if (status) query.status = status;
    if (kycStatus) query.kycStatus = kycStatus;

    const drivers = await Driver.find(query)
      .populate('vehicle')
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Driver.countDocuments(query);

    res.json({
      success: true,
      data: drivers,
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

export const approveKYC = async (req, res) => {
  try {
    const { id } = req.params;
    const { approved, reason } = req.body;

    const driver = await Driver.findById(id);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    if (approved) {
      driver.kycStatus = 'approved';
      driver.kycRejectionReason = null;
    } else {
      driver.kycStatus = 'rejected';
      driver.kycRejectionReason = reason;
    }

    await driver.save();

    res.json({
      success: true,
      data: driver,
      message: `KYC ${approved ? 'approved' : 'rejected'} successfully`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleDriverBlock = async (req, res) => {
  try {
    const { id } = req.params;
    const { block, reason } = req.body;

    const driver = await Driver.findById(id);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    driver.isBlocked = block;
    driver.blockedReason = block ? reason : null;
    if (block) {
      driver.status = 'offline';
    }

    await driver.save();

    res.json({
      success: true,
      data: driver,
      message: `Driver ${block ? 'blocked' : 'unblocked'} successfully`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
