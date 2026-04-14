import { User } from '../models/index.js';

export async function getProfile(req, res) {
  const user = await User.findById(req.user.sub).lean();
  return res.json(user);
}

export async function getSubscriptionStatus(req, res) {
  const user = await User.findById(req.user.sub).lean();
  const end = user?.subscription_end ? new Date(user.subscription_end) : null;
  const now = new Date();
  const active = !!end && end > now;
  const remainingDays = active ? Math.ceil((end - now) / (1000 * 60 * 60 * 24)) : 0;
  return res.json({
    status: active ? 'active' : 'inactive',
    remainingDays,
    subscription_start: user?.subscription_start,
    subscription_end: user?.subscription_end
  });
}
