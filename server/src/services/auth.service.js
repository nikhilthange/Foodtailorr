// Auth service — registration, login, refresh, logout using DynamoDB Repositories
import { userRepository, partnerRepository } from '../repositories/dynamodb/index.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { AppError } from '../middleware/errorHandler.js';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

/**
 * Register a new user (customer or partner)
 */
export async function register(data) {
  const existing = await userRepository.findByEmail(data.email);
  if (existing) {
    throw new AppError('An account with this email already exists', 409);
  }

  const passwordHash = await hashPassword(data.password);

  const user = await userRepository.create({
    email: data.email,
    passwordHash,
    firstName: data.firstName,
    lastName: data.lastName,
    phone: data.phone || null,
    role: data.role || 'CUSTOMER',
    isActive: true,
  });

  let partner = null;
  if (data.role === 'PARTNER') {
    partner = await partnerRepository.create({
      userId: user.id,
      businessName: data.businessName || `${data.firstName}'s Kitchen`,
      tagline: data.tagline || null,
      description: data.description || null,
      cuisine: data.cuisine || 'General',
      isApproved: false,
    });
  }

  const safeUser = {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    ...(partner ? { partner: { id: partner.id, businessName: partner.businessName, isApproved: partner.isApproved } } : {}),
  };

  const tokens = await generateTokens(safeUser);

  return {
    user: safeUser,
    ...tokens,
  };
}

/**
 * Login with email + password
 */
export async function login(email, password) {
  const user = await userRepository.findByEmail(email);

  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  if (user.isActive === false) {
    throw new AppError('Account has been deactivated', 403);
  }

  const valid = await comparePassword(password, user.passwordHash);
  if (!valid) {
    throw new AppError('Invalid email or password', 401);
  }

  let partner = null;
  if (user.role === 'PARTNER') {
    partner = await partnerRepository.findByUserId(user.id);
  }

  const safeUser = {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    ...(partner ? { partner: { id: partner.id, businessName: partner.businessName, isApproved: partner.isApproved } } : {}),
  };

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
  const stored = await userRepository.findRefreshToken(refreshToken);

  if (!stored || new Date(stored.expiresAt) < new Date()) {
    if (stored) {
      await userRepository.deleteRefreshToken(stored.id, stored.userId);
    }
    throw new AppError('Invalid or expired refresh token', 401);
  }

  if (!stored.user || stored.user.isActive === false) {
    throw new AppError('Account has been deactivated', 403);
  }

  // Rotate: delete old token, create new pair
  await userRepository.deleteRefreshToken(stored.id, stored.userId);

  const safeUser = {
    id: stored.user.id,
    email: stored.user.email,
    role: stored.user.role,
    isActive: stored.user.isActive,
  };

  const tokens = await generateTokens(safeUser);

  return {
    user: safeUser,
    ...tokens,
  };
}

/**
 * Logout — invalidate refresh token
 */
export async function logout(refreshToken) {
  if (refreshToken) {
    await userRepository.deleteRefreshTokenByToken(refreshToken);
  }
}

/**
 * Generate access + refresh tokens and persist refresh token in DynamoDB
 */
async function generateTokens(user) {
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user.id);

  // Store refresh token (expires in 7 days)
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await userRepository.createRefreshToken({
    userId: user.id,
    token: refreshToken,
    expiresAt,
  });

  // Cleanup old refresh tokens for this user (keep last 5)
  await userRepository.deleteRefreshTokensForUser(user.id, 5);

  return { accessToken, refreshToken };
}

/**
 * Forgot Password — generate a stateless token and log it (MVP)
 */
export async function forgotPassword(email) {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    return { message: 'If an account exists, a password reset link has been generated.' };
  }
  if (user.isActive === false) {
    throw new AppError('Account has been deactivated', 403);
  }

  const secret = env.JWT_ACCESS_SECRET + user.passwordHash;
  const token = jwt.sign({ sub: user.id, email: user.email }, secret, { expiresIn: '15m' });

  const resetLink = `${env.FRONTEND_URL}/reset-password?token=${token}&id=${user.id}`;
  
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
  const user = await userRepository.findById(userId);
  if (!user) throw new AppError('Invalid or expired reset link', 400);

  const secret = env.JWT_ACCESS_SECRET + user.passwordHash;
  try {
    jwt.verify(token, secret);
  } catch {
    throw new AppError('Invalid or expired reset link', 400);
  }

  const passwordHash = await hashPassword(newPassword);
  await userRepository.update(userId, { passwordHash });

  return { message: 'Password has been reset successfully. You can now log in.' };
}
