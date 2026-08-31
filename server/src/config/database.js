// Prisma client singleton — prevents multiple instances during hot-reload
import { PrismaClient } from '@prisma/client';
import { env } from './env.js';

/** @type {PrismaClient} */
let prisma;

if (env.isProd) {
  prisma = new PrismaClient({
    log: ['error'],
  });
} else {
  // In development, reuse the client across hot-reloads
  if (!globalThis.__prisma) {
    globalThis.__prisma = new PrismaClient({
      log: ['query', 'error', 'warn'],
    });
  }
  prisma = globalThis.__prisma;
}

export { prisma };
