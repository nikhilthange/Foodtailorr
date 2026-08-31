// Environment configuration with validation
import dotenv from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../../.env') });

const requiredInProduction = [
  'DATABASE_URL',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
];

function validateEnv() {
  const missing = [];
  if (process.env.NODE_ENV === 'production') {
    for (const key of requiredInProduction) {
      if (!process.env[key]) missing.push(key);
    }
    if (process.env.JWT_ACCESS_SECRET?.includes('dev-')) {
      console.error('FATAL: Do not use development JWT secrets in production');
      process.exit(1);
    }
  }
  if (missing.length > 0) {
    console.error(`FATAL: Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }
}

validateEnv();

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3001', 10),
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://foodtailor:foodtailor@localhost:5432/foodtailor',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',

  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'dev-access-secret-change-in-production-1234567890abcdef',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-in-production-fedcba0987654321',
  JWT_ACCESS_EXPIRY: process.env.JWT_ACCESS_EXPIRY || '15m',
  JWT_REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY || '7d',

  AI_PROVIDER: process.env.AI_PROVIDER || 'fallback',
  AI_MODEL_PRIMARY: process.env.AI_MODEL_PRIMARY || 'mistralai/Mistral-7B-Instruct-v0.3',
  AI_MODEL_FALLBACK: process.env.AI_MODEL_FALLBACK || 'microsoft/Phi-3-mini-4k-instruct',
  HF_TOKEN: process.env.HF_TOKEN || '',
  OLLAMA_BASE_URL: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
  VLLM_BASE_URL: process.env.VLLM_BASE_URL || 'http://localhost:8000',

  PAYMENT_PROVIDER: process.env.PAYMENT_PROVIDER || 'mock',

  isProd: process.env.NODE_ENV === 'production',
  isDev: process.env.NODE_ENV !== 'production',
};
