// JWT utility — sign & verify access and refresh tokens
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

/**
 * @param {{ id: string, email: string, role: string }} user
 * @returns {string}
 */
export function signAccessToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    env.JWT_ACCESS_SECRET,
    { expiresIn: env.JWT_ACCESS_EXPIRY }
  );
}

/**
 * @param {string} userId
 * @returns {string}
 */
export function signRefreshToken(userId) {
  return jwt.sign(
    { sub: userId, type: 'refresh' },
    env.JWT_REFRESH_SECRET,
    { expiresIn: env.JWT_REFRESH_EXPIRY }
  );
}

/**
 * @param {string} token
 * @returns {object|null}
 */
export function verifyAccessToken(token) {
  try {
    return jwt.verify(token, env.JWT_ACCESS_SECRET);
  } catch {
    return null;
  }
}

/**
 * @param {string} token
 * @returns {object|null}
 */
export function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, env.JWT_REFRESH_SECRET);
  } catch {
    return null;
  }
}
