// Food Tailor — Express Server Entry Point (DynamoDB Architecture)
import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import crypto from 'crypto';
import { env } from './config/env.js';
import {
  isPortAvailable,
  isFoodTailorHealthy,
  freePortIfOccupied,
} from './utils/portManager.js';
import {
  startLocalDynamoIfRequested,
  ensureTableExists,
  checkDynamoConnection,
  stopLocalDynamo,
  TABLE_NAME,
} from './config/dynamoClient.js';
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
import onboardingRoutes from './routes/onboarding.routes.js';

const app = express();

// ─── Security & Correlation Middleware ────────────────
app.use(helmet({ contentSecurityPolicy: false }));

// Request ID tracking
app.use((req, res, next) => {
  req.id = req.headers['x-request-id'] || crypto.randomUUID();
  res.setHeader('x-request-id', req.id);
  next();
});

const parseAllowedOrigins = () => {
  const defaults = ['http://localhost:3000', 'http://127.0.0.1:3000'];
  if (env.FRONTEND_URL) {
    const custom = env.FRONTEND_URL.split(',').map((u) => u.trim().replace(/\/+$/, ''));
    return [...defaults, ...custom];
  }
  return defaults;
};

const allowedOrigins = parseAllowedOrigins();

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);

    const cleanOrigin = origin.replace(/\/+$/, '');
    
    // Check direct match in allowedOrigins list
    if (allowedOrigins.includes(cleanOrigin)) {
      return callback(null, true);
    }

    // Allow any Vercel preview or production deployment (*.vercel.app)
    if (/\.vercel\.app$/.test(cleanOrigin)) {
      return callback(null, true);
    }

    callback(null, true); // Permissive fallback to prevent breaking deployments
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-request-id'],
  exposedHeaders: ['x-request-id'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json({ limit: '5mb' }));
app.use(cookieParser());
app.use(morgan(env.isProd ? 'combined' : 'dev'));
app.use(apiLimiter);

// ─── Health Check ────────────────────────────────────
app.get('/api/health', async (req, res) => {
  const dbStatus = await checkDynamoConnection();

  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
    database: dbStatus,
    dynamoTable: TABLE_NAME,
    aiProvider: env.AI_PROVIDER,
    paymentProvider: env.PAYMENT_PROVIDER,
    version: '1.0.0',
  });
});

// ─── API Routes ──────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/catalog', catalogRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/partner', partnerRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);

// Legacy compatibility routes
app.use('/api', catalogRoutes);

// ─── Error Handling ──────────────────────────────────
app.use('/api/*', notFoundHandler);
app.use(errorHandler);

// ─── Server Lifecycle & Graceful Shutdown ────────────
let server = null;
const activeConnections = new Set();
let isShuttingDown = false;

export async function startServer() {
  try {
    await startLocalDynamoIfRequested();
    await ensureTableExists();
    const status = await checkDynamoConnection();
    logger.info(`DynamoDB connected. Table "${TABLE_NAME}" status: ${status}`);
  } catch (err) {
    logger.warn('DynamoDB initialization warning:', { error: err.message });
  }

  const port = env.PORT;

  // Check if port is already in use
  const isFree = await isPortAvailable(port);
  if (!isFree) {
    const isHealthy = await isFoodTailorHealthy(port);
    if (isHealthy) {
      logger.info(`ℹ️  Food Tailor API is already running and healthy on http://localhost:${port}.`);
    }

    // In development mode, safely reclaim port if a stale process is occupying it
    if (!env.isProd) {
      const reclaimed = await freePortIfOccupied(port, 3000);
      if (!reclaimed && isHealthy) {
        logger.info(`✅ Existing Food Tailor API instance is handling traffic on port ${port}.`);
        return null;
      }
    }
  }

  return new Promise((resolve, reject) => {
    server = http.createServer(app);

    // Track active sockets for immediate clean close on restart/shutdown
    server.on('connection', (socket) => {
      activeConnections.add(socket);
      socket.on('close', () => activeConnections.delete(socket));
    });

    server.once('listening', () => {
      logger.info(`🍽️  Food Tailor API running on http://localhost:${port}`);
      resolve(server);
    });

    server.once('error', async (err) => {
      if (err.code === 'EADDRINUSE') {
        logger.warn(`Port ${port} is currently in use (EADDRINUSE). Probing health...`);
        const isHealthy = await isFoodTailorHealthy(port);
        if (isHealthy) {
          logger.info(`✅ Food Tailor API is already active and healthy on port ${port}. Idempotent startup verified.`);
          resolve(null);
        } else {
          logger.error(`❌ Port ${port} is occupied by an unresponsive process. Please free port ${port}.`);
          reject(err);
        }
      } else {
        logger.error('Server listen error:', err);
        reject(err);
      }
    });

    server.listen(port);
  });
}

export async function stopServer() {
  if (server) {
    // Destroy lingering keep-alive sockets to immediately release the port
    for (const socket of activeConnections) {
      socket.destroy();
    }
    activeConnections.clear();

    await new Promise((resolve) => server.close(resolve));
    server = null;
    await stopLocalDynamo();
    logger.info('Server stopped gracefully');
  }
}

async function handleShutdown(signal) {
  if (isShuttingDown) return;
  isShuttingDown = true;

  logger.info(`Received ${signal}. Gracefully shutting down...`);

  const timeout = setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 3000).unref();

  try {
    await stopServer();
    clearTimeout(timeout);
    process.exit(0);
  } catch (err) {
    logger.error('Error during shutdown:', err);
    process.exit(1);
  }
}

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGHUP', () => handleShutdown('SIGHUP'));

// Auto-start when executed directly
if (process.argv[1]?.endsWith('src/index.js') || process.argv[1]?.endsWith('src\\index.js')) {
  startServer()
    .then((srv) => {
      if (srv) {
        console.log(`\n🍽️  Food Tailor API running on http://localhost:${env.PORT}`);
        console.log(`   Health:  http://localhost:${env.PORT}/api/health`);
        console.log(`   Catalog: http://localhost:${env.PORT}/api/catalog/partners`);
        console.log(`   AI:      ${env.AI_PROVIDER}`);
        console.log(`   Payment: ${env.PAYMENT_PROVIDER}\n`);
      }
    })
    .catch((err) => {
      logger.error('Failed to start server:', err);
      process.exit(1);
    });
}

export { app };
export default app;
