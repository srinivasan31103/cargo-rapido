import DeliveryRecord from '../models/DeliveryRecord.js';
import Booking from '../models/Booking.js';
import { uploadImage } from '../utils/cloudinary.js';

export const uploadPickupProof = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const driverId = req.driver._id;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.driver.toString() !== driverId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (booking.status !== 'driver_arrived') {
      return res.status(400).json({
        message: 'Can only upload pickup proof when driver has arrived'
      });
    }

    let photoUrl = null;
    if (req.file) {
      const result = await uploadImage(req.file.path, `cargorapido/pod/${bookingId}`);
      photoUrl = result.url;
    }

    // Create or update delivery record
    let deliveryRecord = await DeliveryRecord.findOne({ booking: bookingId });

    if (!deliveryRecord) {
      deliveryRecord = new DeliveryRecord({
        booking: bookingId,
        driver: driverId,
        user: booking.user
      });
    }

    deliveryRecord.pickupProof = {
      timestamp: new Date(),
      location: req.body.location || booking.pickup.coordinates,
      photo: photoUrl,
      otp: booking.otp.pickup
    };

    await deliveryRecord.save();

    res.json({
      success: true,
      data: deliveryRecord,
      message: 'Pickup proof uploaded. Please verify OTP.'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyPickupOTP = async (req, res) => {
  try {
    const { bookingId, otp } = req.body;
    const driverId = req.driver._id;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.driver.toString() !== driverId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (booking.otp.pickup !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    const deliveryRecord = await DeliveryRecord.findOne({ booking: bookingId });
    if (!deliveryRecord) {
      return res.status(404).json({ message: 'Delivery record not found' });
    }

    deliveryRecord.pickupProof.otpVerified = true;
    await deliveryRecord.save();

    // Update booking status
    booking.status = 'picked_up';
    booking.timeline.push({
      status: 'picked_up',
      timestamp: new Date(),
      location: booking.pickup.coordinates,
      note: 'Package picked up and verified'
    });
    await booking.save();

    res.json({
      success: true,
      data: deliveryRecord,
      message: 'Pickup verified successfully. You can now start delivery.'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadDeliveryProof = async (req, res) => {
  try {
    const { bookingId, recipientName, recipientPhone, signature } = req.body;
    const driverId = req.driver._id;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.driver.toString() !== driverId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (booking.status !== 'reached_destination') {
      return res.status(400).json({
        message: 'Can only upload delivery proof when reached destination'
      });
    }

    let photoUrl = null;
    if (req.file) {
      const result = await uploadImage(req.file.path, `cargorapido/pod/${bookingId}`);
      photoUrl = result.url;
    }

    const deliveryRecord = await DeliveryRecord.findOne({ booking: bookingId });
    if (!deliveryRecord) {
      return res.status(404).json({ message: 'Delivery record not found' });
    }

    deliveryRecord.deliveryProof = {
      timestamp: new Date(),
      location: req.body.location || booking.drop.coordinates,
      photo: photoUrl,
      signature,
      otp: booking.otp.drop,
      recipientName,
      recipientPhone
    };

    await deliveryRecord.save();

    res.json({
      success: true,
      data: deliveryRecord,
      message: 'Delivery proof uploaded. Please verify OTP to complete.'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyDeliveryOTP = async (req, res) => {
  try {
    const { bookingId, otp } = req.body;
    const driverId = req.driver._id;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.driver.toString() !== driverId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (booking.otp.drop !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    const deliveryRecord = await DeliveryRecord.findOne({ booking: bookingId });
    if (!deliveryRecord) {
      return res.status(404).json({ message: 'Delivery record not found' });
    }

    deliveryRecord.deliveryProof.otpVerified = true;
    deliveryRecord.verified = true;
    await deliveryRecord.save();

    // Update booking status
    booking.status = 'delivered';
    booking.pod = deliveryRecord._id;
    booking.timeline.push({
      status: 'delivered',
      timestamp: new Date(),
      location: booking.drop.coordinates,
      note: 'Package delivered and verified'
    });

    // Mark payment as completed
    booking.payment.status = 'completed';
    booking.payment.paidAt = new Date();

    await booking.save();

    // After a short delay, mark as completed
    setTimeout(async () => {
      booking.status = 'completed';
      booking.timeline.push({
        status: 'completed',
        timestamp: new Date(),
        note: 'Booking completed'
      });
      await booking.save();
    }, 5000);

    res.json({
      success: true,
      data: deliveryRecord,
      message: 'Delivery completed successfully!'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDeliveryRecord = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const deliveryRecord = await DeliveryRecord.findOne({ booking: bookingId })
      .populate('booking')
      .populate('driver', 'name phone rating')
      .populate('user', 'name phone');

    if (!deliveryRecord) {
      return res.status(404).json({ message: 'Delivery record not found' });
    }

    res.json({
      success: true,
      data: deliveryRecord
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
