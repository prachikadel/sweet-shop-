import { Router } from 'express';
import { register, login } from '../services/authService.mongo';
import { validateLogin } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';

const router = Router();

/**
 * Register a new user
 * POST /api/auth/register
 */
router.post('/register', async (req, res) => {
  try {
    const result = await register(req.body);
    const { user, token } = result as any;
    if (token) {
      res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        //sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000,
      });
    }
    res.status(201).json({ user });
  } catch (error) {
    const statusCode = error instanceof Error && error.message.includes('already exists') ? 409 : 400;
    res.status(statusCode).json({
      success: false,
      message: error instanceof Error ? error.message : 'Registration failed',
    });
  }
});

/**
 * Login user
 * POST /api/auth/login
 */
router.post('/login', validateLogin, async (req, res) => {
  try {
    const result = await login(req.body);
    const { user, token } = result as any;
    if (token) {
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000,
      });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error instanceof Error ? error.message : 'Login failed',
    });
  }
});

/**
 * Get current user
 * GET /api/auth/me
 */
router.get('/me', authenticateToken, (req: any, res) => {
  return res.status(200).json({ user: req.user });
});

/**
 * Logout
 * POST /api/auth/logout
 */
router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
  return res.status(200).json({ success: true });
});

export default router;