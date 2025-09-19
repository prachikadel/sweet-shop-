import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { Secret, SignOptions } from 'jsonwebtoken';
import { User } from '../models/User';
import type { User as UserType, AuthResponse, LoginDto, RegisterDto } from '../../types';

const JWT_SECRET: Secret = process.env.JWT_SECRET || 'fallback-secret-key';
const JWT_EXPIRES_IN: SignOptions['expiresIn'] = (process.env.JWT_EXPIRES_IN as SignOptions['expiresIn']) || '24h';

/**
 * Generate JWT token for authenticated user
 */
function generateToken(user: Omit<UserType, 'createdAt'>): string {
  const options: SignOptions = { expiresIn: JWT_EXPIRES_IN };
  return jwt.sign({ _id: user._id, email: user.email, role: user.role }, JWT_SECRET, options);
}

/**
 * Register a new user
 */
export async function register(userData: RegisterDto): Promise<AuthResponse> {
  const { name, email, password, role = 'user' } = userData;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 12);
  
  // Create user in database
  const user = await User.create({
    name,
    email,
    passwordHash,
    role,
  });

  // Generate JWT token
  const token = generateToken({ 
    _id: user._id.toString(), 
    name: user.name, 
    email: user.email, 
    role: user.role 
  });

  return {
    user: {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
    },
    token,
  };
}

/**
 * Login user with email and password
 */
export async function login(loginData: LoginDto): Promise<AuthResponse> {
  const { email, password } = loginData;

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  // Generate JWT token
  const token = generateToken({ 
    _id: user._id.toString(), 
    name: user.name, 
    email: user.email, 
    role: user.role 
  });

  return {
    user: {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
    },
    token,
  };
}

/**
 * Verify JWT token and return user data
 */
export function verifyToken(token: string): Omit<UserType, 'createdAt'> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return {
      _id: decoded._id,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
    };
  } catch (error) {
    throw new Error('Invalid token');
  }
}

