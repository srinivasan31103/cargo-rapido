import express from 'express';
import multer from 'multer';
import {
  getNearbyDrivers,
  updateDriverStatus,
  updateLocation,
  uploadDocuments,
  registerVehicle,
  getDriverStats,
  getAllDrivers,
  approveKYC,
  toggleDriverBlock
} from '../controllers/driverController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Multer configuration for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

router.get('/nearby', getNearbyDrivers);
router.put('/status', protect, authorize('driver'), updateDriverStatus);
router.put('/location', protect, authorize('driver'), updateLocation);
router.post('/documents', protect, authorize('driver'), upload.fields([
  { name: 'licensePhoto', maxCount: 1 },
  { name: 'aadharPhoto', maxCount: 1 },
  { name: 'panPhoto', maxCount: 1 },
  { name: 'vehicleRC', maxCount: 1 },
  { name: 'profilePhoto', maxCount: 1 }
]), uploadDocuments);
router.post('/vehicle', protect, authorize('driver'), registerVehicle);
router.get('/stats', protect, authorize('driver'), getDriverStats);
router.get('/all', protect, authorize('admin'), getAllDrivers);
router.put('/:id/kyc', protect, authorize('admin'), approveKYC);
router.put('/:id/block', protect, authorize('admin'), toggleDriverBlock);

export default router;
