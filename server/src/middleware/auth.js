// Auth middleware — verifies JWT access token and attaches user to request
import { verifyAccessToken } from '../utils/jwt.js';
import { prisma } from '../config/database.js';

/**
 * Middleware: Require a valid access token.
 * Attaches req.user = { id, email, role }
 */
export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyAccessToken(token);
  if (!payload) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  req.user = { id: payload.sub, email: payload.email, role: payload.role };
  next();
}

/**
 * Middleware: Optional authentication — attaches user if token present, continues either way
 */
export function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const payload = verifyAccessToken(token);
    if (payload) {
      req.user = { id: payload.sub, email: payload.email, role: payload.role };
    }
  }
  next();
}

/**
 * Middleware factory: Require specific role(s).
 * Must be used AFTER authenticate().
 * @param  {...string} roles - Allowed roles (e.g., 'ADMIN', 'PARTNER')
 */
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}
