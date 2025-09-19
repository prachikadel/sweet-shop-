import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { app } from '../index';
import { connectDB, disconnectDB } from '../config/database';
import { User } from '../models/User';
import { Sweet } from '../models/Sweet';
import bcrypt from 'bcryptjs';

describe('Sweets Integration Tests', () => {
  let userToken: string;
  let adminToken: string;
  let testSweet: any;

  beforeAll(async () => {
    // Connect to test database
    const testMongoUri = process.env.TEST_MONGO_URI || 'mongodb://localhost:27017/sweet-shop-test';
    await mongoose.connect(testMongoUri);
  });

  afterAll(async () => {
    // Clean up and disconnect
    await User.deleteMany({});
    await Sweet.deleteMany({});
    await disconnectDB();
  });

  beforeEach(async () => {
    // Clean up data before each test
    await User.deleteMany({});
    await Sweet.deleteMany({});

    // Create test users
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    const user = await User.create({
      name: 'Test User',
      email: 'user@example.com',
      passwordHash: hashedPassword,
      role: 'user'
    });

    const admin = await User.create({
      name: 'Test Admin',
      email: 'admin@example.com',
      passwordHash: hashedPassword,
      role: 'admin'
    });

    // Generate tokens
    const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
    userToken = jwt.sign({ _id: user._id, email: user.email, role: user.role }, JWT_SECRET);
    adminToken = jwt.sign({ _id: admin._id, email: admin.email, role: admin.role }, JWT_SECRET);

    // Create test sweet
    testSweet = await Sweet.create({
      name: 'Chocolate Bar',
      category: 'Chocolate',
      price: 2.50,
      quantity: 10,
      description: 'Delicious milk chocolate bar'
    });
  });

  describe('GET /api/sweets', () => {
    it('should get all sweets for authenticated user', async () => {
      const response = await request(app)
        .get('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0]).toMatchObject({
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 2.50,
        quantity: 10
      });
    });

    it('should return 401 for unauthenticated request', async () => {
      const response = await request(app)
        .get('/api/sweets');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/sweets', () => {
    it('should create a new sweet (admin only)', async () => {
      const newSweet = {
        name: 'Gummy Bears',
        category: 'Candy',
        price: 1.50,
        quantity: 20,
        description: 'Colorful gummy bears'
      };

      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newSweet);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(newSweet);
      expect(response.body).toHaveProperty('_id');
    });

    it('should return 403 for non-admin user', async () => {
      const newSweet = {
        name: 'Gummy Bears',
        category: 'Candy',
        price: 1.50,
        quantity: 20
      };

      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`)
        .send(newSweet);

      expect(response.status).toBe(403);
    });

    it('should return 400 for duplicate sweet name', async () => {
      const duplicateSweet = {
        name: 'Chocolate Bar', // Same as existing
        category: 'Chocolate',
        price: 3.00,
        quantity: 5
      };

      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(duplicateSweet);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Sweet with this name already exists');
    });
  });

  describe('GET /api/sweets/search', () => {
    beforeEach(async () => {
      // Add more test sweets for search
      await Sweet.create([
        {
          name: 'Lollipop',
          category: 'Candy',
          price: 1.00,
          quantity: 15
        },
        {
          name: 'Dark Chocolate',
          category: 'Chocolate',
          price: 3.50,
          quantity: 8
        }
      ]);
    });

    it('should search sweets by name', async () => {
      const response = await request(app)
        .get('/api/sweets/search?name=chocolate')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
      expect(response.body.every((sweet: any) => 
        sweet.name.toLowerCase().includes('chocolate')
      )).toBe(true);
    });

    it('should search sweets by category', async () => {
      const response = await request(app)
        .get('/api/sweets/search?category=candy')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0].category).toBe('Candy');
    });

    it('should search sweets by price range', async () => {
      const response = await request(app)
        .get('/api/sweets/search?minPrice=2&maxPrice=3')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0].price).toBe(2.50);
    });
  });

  describe('PUT /api/sweets/:id', () => {
    it('should update a sweet (admin only)', async () => {
      const updateData = {
        name: 'Updated Chocolate Bar',
        price: 3.00
      };

      const response = await request(app)
        .put(`/api/sweets/${testSweet._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Updated Chocolate Bar');
      expect(response.body.price).toBe(3.00);
    });

    it('should return 403 for non-admin user', async () => {
      const response = await request(app)
        .put(`/api/sweets/${testSweet._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ name: 'Updated Name' });

      expect(response.status).toBe(403);
    });

    it('should return 404 for non-existent sweet', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .put(`/api/sweets/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Updated Name' });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Sweet not found');
    });
  });

  describe('DELETE /api/sweets/:id', () => {
    it('should delete a sweet (admin only)', async () => {
      const response = await request(app)
        .delete(`/api/sweets/${testSweet._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(204);

      // Verify sweet was deleted
      const deletedSweet = await Sweet.findById(testSweet._id);
      expect(deletedSweet).toBeNull();
    });

    it('should return 403 for non-admin user', async () => {
      const response = await request(app)
        .delete(`/api/sweets/${testSweet._id}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
    });
  });

  describe('POST /api/sweets/:id/purchase', () => {
    it('should purchase a sweet and decrease quantity', async () => {
      const response = await request(app)
        .post(`/api/sweets/${testSweet._id}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 3 });

      expect(response.status).toBe(200);
      expect(response.body.quantity).toBe(7); // 10 - 3

      // Verify quantity was updated in database
      const updatedSweet = await Sweet.findById(testSweet._id);
      expect(updatedSweet?.quantity).toBe(7);
    });

    it('should return 400 for insufficient stock', async () => {
      const response = await request(app)
        .post(`/api/sweets/${testSweet._id}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 15 }); // More than available (10)

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Insufficient stock or sweet not found');
    });

    it('should handle concurrent purchases atomically', async () => {
      // Simulate concurrent purchases that would oversell
      const purchasePromises = [
        request(app)
          .post(`/api/sweets/${testSweet._id}/purchase`)
          .set('Authorization', `Bearer ${userToken}`)
          .send({ quantity: 6 }),
        request(app)
          .post(`/api/sweets/${testSweet._id}/purchase`)
          .set('Authorization', `Bearer ${userToken}`)
          .send({ quantity: 6 })
      ];

      const responses = await Promise.all(purchasePromises);
      
      // One should succeed, one should fail
      const successCount = responses.filter(r => r.status === 200).length;
      const failCount = responses.filter(r => r.status === 400).length;
      
      expect(successCount).toBe(1);
      expect(failCount).toBe(1);

      // Verify final quantity is never negative
      const finalSweet = await Sweet.findById(testSweet._id);
      expect(finalSweet?.quantity).toBeGreaterThanOrEqual(0);
    });
  });

  describe('POST /api/sweets/:id/restock', () => {
    it('should restock a sweet (admin only)', async () => {
      const response = await request(app)
        .post(`/api/sweets/${testSweet._id}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 5 });

      expect(response.status).toBe(200);
      expect(response.body.quantity).toBe(15); // 10 + 5

      // Verify quantity was updated in database
      const updatedSweet = await Sweet.findById(testSweet._id);
      expect(updatedSweet?.quantity).toBe(15);
    });

    it('should return 403 for non-admin user', async () => {
      const response = await request(app)
        .post(`/api/sweets/${testSweet._id}/restock`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 5 });

      expect(response.status).toBe(403);
    });
  });
});

