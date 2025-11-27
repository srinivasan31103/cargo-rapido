import express from 'express';
import {
  findNearbyDrivers,
  autoAssignDriver,
  manualAssignDriver,
  broadcastBooking,
  acceptBooking,
  getPendingBookings
} from '../controllers/driverAssignmentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Admin/User routes
router.get('/bookings/:bookingId/nearby-drivers', protect, findNearbyDrivers);
router.post('/bookings/:bookingId/auto-assign', protect, authorize('admin'), autoAssignDriver);
router.post('/bookings/:bookingId/manual-assign', protect, manualAssignDriver);
router.post('/bookings/:bookingId/broadcast', protect, broadcastBooking);

// Driver routes
router.get('/pending-bookings', protect, authorize('driver'), getPendingBookings);
router.post('/bookings/:bookingId/accept', protect, authorize('driver'), acceptBooking);

export default router;
