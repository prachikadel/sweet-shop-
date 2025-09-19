import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/authService.mongo';
import type { User } from '../../types';

interface AuthenticatedRequest extends Request {
  user?: Omit<User, 'createdAt'>;
}

/**
 * Middleware to authenticate JWT token
 */
export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = (req as any).cookies?.token as string | undefined;
  console.log(token)
  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token is required' });
  }

  try {
    const user = verifyToken(token);
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: 'Invalid or expired token' });
  }
}

/**
 * Middleware to require admin role
 */
export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  next();
}



