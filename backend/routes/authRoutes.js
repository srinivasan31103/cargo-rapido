import express from 'express';
import {
  registerUser,
  loginUser,
  registerDriver,
  loginDriver,
  getProfile,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/driver/register', registerDriver);
router.post('/driver/login', loginDriver);
router.get('/profile', protect, getProfile);
router.get('/me', protect, getProfile); // Alias for /profile
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
