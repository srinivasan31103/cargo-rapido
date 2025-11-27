import express from 'express';
import {
  getPricingSuggestion,
  classifyCargo,
  getRouteAdvice,
  getBusinessInsights
} from '../controllers/aiController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/pricing', protect, getPricingSuggestion);
router.post('/cargo-classify', protect, classifyCargo);
router.post('/route', protect, authorize('driver'), getRouteAdvice);
router.get('/business-insights', protect, authorize('user', 'business', 'admin'), getBusinessInsights);

export default router;
