import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import { app } from '../index';
import * as authService from '../services/authService';

// Mock the auth service
vi.mock('../services/authService');

describe('Auth Endpoints', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        role: 'user' as const,
        created_at: new Date().toISOString(),
      };
      const mockToken = 'mock-jwt-token';

      vi.mocked(authService.register).mockResolvedValue({
        user: mockUser,
        token: mockToken,
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        user: mockUser,
        token: mockToken,
      });
      expect(authService.register).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should return 400 for invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: 'password123',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Valid email is required');
    });

    it('should return 400 for short password', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: '123',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Password must be at least 6 characters');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login user successfully', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        role: 'user' as const,
        created_at: new Date().toISOString(),
      };
      const mockToken = 'mock-jwt-token';

      vi.mocked(authService.login).mockResolvedValue({
        user: mockUser,
        token: mockToken,
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        user: mockUser,
        token: mockToken,
      });
      expect(authService.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should return 400 for missing credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({});

      expect(response.status).toBe(400);
    });
  });
});