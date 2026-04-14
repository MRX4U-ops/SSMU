import crypto from 'crypto';
import Razorpay from 'razorpay';
import { env } from '../config/env.js';

const razorpay = env.razorpayKeyId && env.razorpayKeySecret
  ? new Razorpay({ key_id: env.razorpayKeyId, key_secret: env.razorpayKeySecret })
  : null;

export async function createGatewayOrder(receipt) {
  if (!razorpay) {
    return { id: `sim_${Date.now()}`, amount: env.subscriptionPricePaise, currency: 'INR', status: 'created', simulated: true };
  }
  return razorpay.orders.create({ amount: env.subscriptionPricePaise, currency: 'INR', receipt, payment_capture: 1 });
}

export function verifyRazorpaySignature(orderId, paymentId, signature) {
  if (!env.razorpayKeySecret) return false;
  const body = `${orderId}|${paymentId}`;
  const expected = crypto.createHmac('sha256', env.razorpayKeySecret).update(body).digest('hex');
  return expected === signature;
}

export function calculateSubscriptionWindow(startAt = new Date()) {
  const end = new Date(startAt);
  end.setDate(end.getDate() + env.subscriptionDays);
  return { start: startAt, end };
}
