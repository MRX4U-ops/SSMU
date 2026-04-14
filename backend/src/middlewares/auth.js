import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/index.js';

export async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing auth token' });
  }

  try {
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(decoded.sub).lean();
    if (!user) return res.status(401).json({ message: 'User not found' });

    const requestDevice = req.headers['x-device-id'];
    const tokenDevice = decoded.device_id;
    const activeDevice = user.active_device_id;

    if (!activeDevice || tokenDevice !== activeDevice || (requestDevice && requestDevice !== activeDevice)) {
      return res.status(401).json({ message: 'Session expired: account is active on another device' });
    }

    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  return next();
}
