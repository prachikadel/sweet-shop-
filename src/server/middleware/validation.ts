import { Request, Response, NextFunction } from 'express';

/**
 * Validate email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate registration data
 */
export function validateRegistration(req: Request, res: Response, next: NextFunction) {
  const { name, email, password, role } = req.body;

  const errors: string[] = [];

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push('Name is required and must be at least 2 characters');
  }

  if (!email || typeof email !== 'string') {
    errors.push('Valid email is required');
  } else if (!isValidEmail(email)) {
    errors.push('Valid email is required');
  }

  if (!password || typeof password !== 'string') {
    errors.push('Password is required');
  } else if (password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }

  if (role && !['admin', 'user'].includes(role)) {
    errors.push('Role must be either "admin" or "user"');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  next();
}

/**
 * Validate login data
 */
export function validateLogin(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body;

  const errors: string[] = [];

  if (!email || typeof email !== 'string') {
    errors.push('Email is required');
  }

  if (!password || typeof password !== 'string') {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  next();
}

/**
 * Validate sweet creation data
 */
export function validateCreateSweet(req: Request, res: Response, next: NextFunction) {
  const { name, category, price, quantity, description } = req.body;

  const errors: string[] = [];

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('Sweet name is required');
  }

  if (!category || typeof category !== 'string' || category.trim().length === 0) {
    errors.push('Category is required');
  }

  if (typeof price !== 'number' || price <= 0) {
    errors.push('Price must be a positive number');
  }

  if (typeof quantity !== 'number' || quantity < 0 || !Number.isInteger(quantity)) {
    errors.push('Quantity must be a non-negative integer');
  }

  // Description is optional

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  next();
}

/**
 * Validate purchase data
 */
export function validatePurchase(req: Request, res: Response, next: NextFunction) {
  const { quantity } = req.body;

  if (typeof quantity !== 'number' || quantity <= 0 || !Number.isInteger(quantity)) {
    return res.status(400).json({
      success: false,
      message: 'Quantity must be a positive integer',
    });
  }

  next();
}

/**
 * Validate restock data
 */
export function validateRestock(req: Request, res: Response, next: NextFunction) {
  const { quantity } = req.body;

  if (typeof quantity !== 'number' || quantity <= 0 || !Number.isInteger(quantity)) {
    return res.status(400).json({
      success: false,
      message: 'Quantity must be a positive integer',
    });
  }

  next();
}