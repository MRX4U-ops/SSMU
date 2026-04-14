import { Router } from 'express';
import { createOrder, createOrderValidation, verifyPayment, verifyValidation } from '../controllers/paymentController.js';
import { validate } from '../middlewares/validate.js';

const router = Router();
router.post('/create-order', createOrderValidation, validate, createOrder);
router.post('/verify', verifyValidation, validate, verifyPayment);
export default router;
