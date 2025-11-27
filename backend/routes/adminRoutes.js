import express from 'express';
import {
  // User Management
  getAllUsers,
  getUser,
  updateUser,
  toggleUserBlock,
  deleteUser,

  // Booking Management
  getAllBookings,
  deleteBooking,

  // Driver Management
  getDriver,
  deleteDriver,

  // Vehicle Management
  getAllVehicles,
  updateVehicle,
  deleteVehicle,

  // Dashboard
  getDashboardStats
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require admin authentication
router.use(protect, authorize('admin'));

// Dashboard
router.get('/dashboard/stats', getDashboardStats);

// User Management
router.get('/users', getAllUsers);
router.get('/users/:id', getUser);
router.put('/users/:id', updateUser);
router.put('/users/:id/block', toggleUserBlock);
router.delete('/users/:id', deleteUser);

// Booking Management
router.get('/bookings', getAllBookings);
router.delete('/bookings/:id', deleteBooking);

// Driver Management
router.get('/drivers/:id', getDriver);
router.delete('/drivers/:id', deleteDriver);

// Vehicle Management
router.get('/vehicles', getAllVehicles);
router.put('/vehicles/:id', updateVehicle);
router.delete('/vehicles/:id', deleteVehicle);

export default router;
