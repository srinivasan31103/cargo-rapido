import express from 'express';
import {
  createPaymentOrder,
  verifyPayment,
  rechargeWallet,
  verifyWalletRecharge,
  payWithWallet,
  getTransactions,
  getWalletBalance
} from '../controllers/paymentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/create-order', protect, authorize('user', 'business'), createPaymentOrder);
router.post('/verify', protect, authorize('user', 'business'), verifyPayment);
router.post('/wallet/recharge', protect, authorize('user', 'business'), rechargeWallet);
router.post('/wallet/verify', protect, authorize('user', 'business'), verifyWalletRecharge);
router.post('/wallet/pay', protect, authorize('user', 'business'), payWithWallet);
router.get('/transactions', protect, getTransactions);
router.get('/wallet/balance', protect, authorize('user', 'business'), getWalletBalance);

export default router;
