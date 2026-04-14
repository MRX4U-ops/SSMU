import jwt from 'jsonwebtoken';
import { body } from 'express-validator';
import { env } from '../config/env.js';
import { User } from '../models/index.js';

export const googleLoginValidation = [
  body('email').isEmail(),
  body('name').isString().notEmpty(),
  body('google_id').isString().notEmpty()
];

export async function googleLogin(req, res) {
  const { email, name, google_id } = req.body;
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({ email, name, google_id });
  }
  user.last_login_at = new Date();
  await user.save();

  const token = jwt.sign({ sub: user.id, role: user.role, email: user.email }, env.jwtSecret, { expiresIn: env.jwtExpiry });
  return res.json({ token, user });
}
