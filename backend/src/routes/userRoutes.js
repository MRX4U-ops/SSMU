import { Router } from 'express';
import { getProfile, getSubscriptionStatus } from '../controllers/userController.js';

const router = Router();
router.get('/profile', getProfile);
router.get('/subscription-status', getSubscriptionStatus);
export default router;
