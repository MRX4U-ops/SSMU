import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import { requireAdmin, requireAuth } from './middlewares/auth.js';
import { errorHandler } from './middlewares/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import mcqRoutes from './routes/mcqRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();
app.use(helmet());
app.use(cors({ origin: [env.frontendUrl, env.adminUrl], credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(morgan('combined'));
app.use(rateLimit({ windowMs: 60 * 1000, limit: 120 }));

app.get('/health', (req, res) => res.json({ status: 'ok', app: env.appName }));
app.use('/auth', authRoutes);
app.use('/', contentRoutes);
app.use('/user', requireAuth, userRoutes);
app.use('/payment', requireAuth, paymentRoutes);
app.use('/mcq', requireAuth, mcqRoutes);
app.use('/admin', requireAuth, requireAdmin, adminRoutes);
app.use(errorHandler);

connectDB()
  .then(() => app.listen(env.port, () => console.log(`Backend running on :${env.port}`)))
  .catch((e) => {
    console.error('Database connection failed', e);
    process.exit(1);
  });
