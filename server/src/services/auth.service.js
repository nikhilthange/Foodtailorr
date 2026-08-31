// Auth service — registration, login, refresh, logout
import { prisma } from '../config/database.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { AppError } from '../middleware/errorHandler.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

/**
 * Register a new user (customer or partner)
 */
export async function register(data) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    throw new AppError('An account with this email already exists', 409);
  }

  const passwordHash = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone || null,
      role: data.role || 'CUSTOMER',
      // Create default preferences
      preferences: {
        create: {},
      },
      // If partner registration, create partner profile
      ...(data.role === 'PARTNER' && {
        partner: {
          create: {
            businessName: data.businessName,
            tagline: data.tagline || null,
            description: data.description || null,
            cuisine: data.cuisine || 'General',
            isApproved: false,
          },
        },
      }),
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      partner: data.role === 'PARTNER' ? { select: { id: true, businessName: true, isApproved: true } } : false,
    },
  });

  const tokens = await generateTokens(user);

  return {
    user,
    ...tokens,
  };
}

/**
 * Login with email + password
 */
export async function login(email, password) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      passwordHash: true,
      isActive: true,
      partner: { select: { id: true, businessName: true, isApproved: true } },
    },
  });

  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  if (!user.isActive) {
    throw new AppError('Account has been deactivated', 403);
  }

  const valid = await comparePassword(password, user.passwordHash);
  if (!valid) {
    throw new AppError('Invalid email or password', 401);
  }

  const { passwordHash, isActive, ...safeUser } = user;
  const tokens = await generateTokens(safeUser);

  return {
    user: safeUser,
    ...tokens,
  };
}

/**
 * Refresh access token using a valid refresh token
 */
export async function refreshAccessToken(refreshToken) {
  const payload = verifyRefreshToken(refreshToken);
  if (!payload) {
    throw new AppError('Invalid or expired refresh token', 401);
  }

  // Find and validate the stored refresh token
  const stored = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
    include: { user: { select: { id: true, email: true, role: true, isActive: true } } },
  });

  if (!stored || stored.expiresAt < new Date()) {
    // If token was found but expired, delete it
    if (stored) {
      await prisma.refreshToken.delete({ where: { id: stored.id } });
    }
    throw new AppError('Invalid or expired refresh token', 401);
  }

  if (!stored.user.isActive) {
    throw new AppError('Account has been deactivated', 403);
  }

  // Rotate: delete old token, create new pair
  await prisma.refreshToken.delete({ where: { id: stored.id } });

  const tokens = await generateTokens(stored.user);

  return {
    user: stored.user,
    ...tokens,
  };
}

/**
 * Logout — invalidate refresh token
 */
export async function logout(refreshToken) {
  if (refreshToken) {
    await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
  }
}

/**
 * Generate access + refresh tokens and persist refresh token
 */
async function generateTokens(user) {
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user.id);

  // Store refresh token (expires in 7 days)
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: refreshToken,
      expiresAt,
    },
  });

  // Cleanup old refresh tokens for this user (keep last 5)
  const tokens = await prisma.refreshToken.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  });
  if (tokens.length > 5) {
    const toDelete = tokens.slice(5).map(t => t.id);
    await prisma.refreshToken.deleteMany({ where: { id: { in: toDelete } } });
  }

  return { accessToken, refreshToken };
}

/**
 * Forgot Password — generate a stateless token and log it (MVP)
 */
export async function forgotPassword(email) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    // For security, don't reveal if user exists or not
    return { message: 'If an account exists, a password reset link has been generated.' };
  }
  if (!user.isActive) {
    throw new AppError('Account has been deactivated', 403);
  }

  // Generate a one-time secret using the user's current password hash
  const secret = env.JWT_ACCESS_SECRET + user.passwordHash;
  const token = jwt.sign({ sub: user.id, email: user.email }, secret, { expiresIn: '15m' });

  const resetLink = `http://localhost:5173/reset-password?token=${token}&id=${user.id}`;
  
  // MVP: Log to console instead of sending email
  console.log('\n=============================================');
  console.log('🔒 PASSWORD RESET LINK (MVP - No SMTP configured)');
  console.log(`To: ${user.email}`);
  console.log(`Link: ${resetLink}`);
  console.log('=============================================\n');

  return { message: 'If an account exists, a password reset link has been generated.' };
}

/**
 * Reset Password — consume token and update password
 */
export async function resetPassword(userId, token, newPassword) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError('Invalid or expired reset link', 400);

  const secret = env.JWT_ACCESS_SECRET + user.passwordHash;
  try {
    jwt.verify(token, secret);
  } catch (err) {
    throw new AppError('Invalid or expired reset link', 400);
  }

  const passwordHash = await hashPassword(newPassword);
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });

  return { message: 'Password has been reset successfully. You can now log in.' };
}
