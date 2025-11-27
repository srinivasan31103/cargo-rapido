import express from 'express';
import multer from 'multer';
import {
  uploadPickupProof,
  verifyPickupOTP,
  uploadDeliveryProof,
  verifyDeliveryOTP,
  getDeliveryRecord
} from '../controllers/podController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.post('/pickup', protect, authorize('driver'), upload.single('photo'), uploadPickupProof);
router.post('/pickup/verify', protect, authorize('driver'), verifyPickupOTP);
router.post('/delivery', protect, authorize('driver'), upload.single('photo'), uploadDeliveryProof);
router.post('/delivery/verify', protect, authorize('driver'), verifyDeliveryOTP);
router.get('/:bookingId', protect, getDeliveryRecord);

export default router;
