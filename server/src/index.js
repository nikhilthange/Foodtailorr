// Food Tailor — Express Server Entry Point
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { prisma } from './config/database.js';
import { logger } from './utils/logger.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';

// Route imports
import authRoutes from './routes/auth.routes.js';
import catalogRoutes from './routes/catalog.routes.js';
import aiRoutes from './routes/ai.routes.js';
import orderRoutes from './routes/order.routes.js';
import partnerRoutes from './routes/partner.routes.js';
import adminRoutes from './routes/admin.routes.js';
import userRoutes from './routes/user.routes.js';

const app = express();

// ─── Security & Middleware ───────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());
app.use(morgan(env.isProd ? 'combined' : 'dev'));
app.use(apiLimiter);

// ─── Health Check ────────────────────────────────────
app.get('/api/health', async (req, res) => {
  let dbStatus = 'unknown';
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = 'connected';
  } catch {
    dbStatus = 'disconnected';
  }

  const aiProvider = env.AI_PROVIDER;

  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
    database: dbStatus,
    aiProvider,
    version: '1.0.0',
  });
});

// ─── API Routes ──────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/catalog', catalogRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/partner', partnerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);

// Legacy compatibility routes
app.use('/api', catalogRoutes);

// ─── Error Handling ──────────────────────────────────
app.use('/api/*', notFoundHandler);
app.use(errorHandler);

// ─── Start Server ────────────────────────────────────
async function start() {
  try {
    // Test database connection
    await prisma.$connect();
    logger.info('Database connected');
  } catch (err) {
    logger.warn('Database connection failed — some features may be limited', { error: err.message });
  }

  app.listen(env.PORT, () => {
    logger.info(`🍽️  Food Tailor API running`, {
      port: env.PORT,
      env: env.NODE_ENV,
      ai: env.AI_PROVIDER,
    });
    console.log(`\n🍽️  Food Tailor API running on http://localhost:${env.PORT}`);
    console.log(`   Health:  http://localhost:${env.PORT}/api/health`);
    console.log(`   Catalog: http://localhost:${env.PORT}/api/catalog/partners`);
    console.log(`   AI:      ${env.AI_PROVIDER}\n`);
  });
}

start();
