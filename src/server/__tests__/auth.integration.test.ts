import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../index';
import { connectDB, disconnectDB } from '../config/database';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';

describe('Auth Integration Tests', () => {
  beforeAll(async () => {
    // Connect to test database
    const testMongoUri = process.env.TEST_MONGO_URI || 'mongodb://localhost:27017/sweet-shop-test';
    await mongoose.connect(testMongoUri);
  });

  afterAll(async () => {
    // Clean up and disconnect
    await User.deleteMany({});
    await disconnectDB();
  });

  beforeEach(async () => {
    // Clean up users before each test
    await User.deleteMany({});
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toMatchObject({
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user'
      });
      expect(response.body.user).not.toHaveProperty('passwordHash');

      // Verify user was created in database
      const user = await User.findOne({ email: 'john@example.com' });
      expect(user).toBeTruthy();
      expect(user?.name).toBe('John Doe');
      expect(user?.role).toBe('user');
    });

    it('should return 400 for missing required fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com'
          // missing name and password
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 for invalid email format', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'John Doe',
          email: 'invalid-email',
          password: 'password123'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Valid email is required');
    });

    it('should return 400 for short password', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'John Doe',
          email: 'test@example.com',
          password: '123'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Password must be at least 6 characters');
    });

    it('should return 409 for duplicate email', async () => {
      // Create first user
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'John Doe',
          email: 'test@example.com',
          password: 'password123'
        });

      // Try to create second user with same email
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Jane Doe',
          email: 'test@example.com',
          password: 'password456'
        });

      expect(response.status).toBe(409);
      expect(response.body.message).toContain('User with this email already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a test user
      const hashedPassword = await bcrypt.hash('password123', 12);
      await User.create({
        name: 'John Doe',
        email: 'john@example.com',
        passwordHash: hashedPassword,
        role: 'user'
      });
    });

    it('should login user with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'john@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toMatchObject({
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user'
      });
      expect(response.body.user).not.toHaveProperty('passwordHash');
    });

    it('should return 401 for invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toContain('Invalid credentials');
    });

    it('should return 401 for wrong password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'john@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toContain('Invalid credentials');
    });

    it('should return 400 for missing credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });
  });
});

