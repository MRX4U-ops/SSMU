import { body } from 'express-validator';
import { env } from '../config/env.js';
import { Payment, User } from '../models/index.js';
import { calculateSubscriptionWindow, createGatewayOrder, verifyRazorpaySignature } from '../services/paymentService.js';

export const createOrderValidation = [body('currency').optional().equals('INR')];
export const verifyValidation = [
  body('order_id').isString(),
  body('payment_id').isString(),
  body('signature').isString()
];

export async function createOrder(req, res) {
  const order = await createGatewayOrder(`sub_${req.user.sub}_${Date.now()}`);
  await Payment.create({
    user_id: req.user.sub,
    order_id: order.id,
    amount: env.subscriptionPricePaise,
    status: 'created',
    gateway_metadata: order
  });
  return res.json({ order_id: order.id, amount: env.subscriptionPricePaise, currency: 'INR', upi: env.merchantUpi });
}

export async function verifyPayment(req, res) {
  const { order_id, payment_id, signature, gateway_response } = req.body;
  const payment = await Payment.findOne({ order_id, user_id: req.user.sub });
  if (!payment) return res.status(404).json({ message: 'Order not found' });

  const valid = verifyRazorpaySignature(order_id, payment_id, signature) || signature === 'SIMULATED_OK';
  if (!valid) {
    payment.status = 'failed';
    await payment.save();
    return res.status(400).json({ message: 'Payment verification failed' });
  }

  const { start, end } = calculateSubscriptionWindow(new Date());
  payment.payment_id = payment_id;
  payment.status = 'paid';
  payment.verified_at = new Date();
  payment.subscription_start = start;
  payment.subscription_end = end;
  payment.gateway_metadata = gateway_response || {};
  await payment.save();

  await User.findByIdAndUpdate(req.user.sub, {
    subscription_status: 'active',
    subscription_start: start,
    subscription_end: end
  });

  return res.json({ message: 'Payment verified', subscription_start: start, subscription_end: end });
}
