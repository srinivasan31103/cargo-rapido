import express from 'express';
import {
  createBooking,
  getBooking,
  getUserBookings,
  getDriverBookings,
  updateBookingStatus,
  cancelBooking,
  estimatePrice,
  rateBooking
} from '../controllers/bookingController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, authorize('user', 'business'), createBooking);
router.post('/estimate', protect, estimatePrice);
router.get('/:id', protect, getBooking);
router.get('/user/:userId', protect, getUserBookings);
router.get('/driver/:driverId', protect, authorize('driver', 'admin'), getDriverBookings);
router.put('/:id/status', protect, updateBookingStatus);
router.put('/:id/cancel', protect, cancelBooking);
router.post('/:id/rate', protect, rateBooking);

export default router;
