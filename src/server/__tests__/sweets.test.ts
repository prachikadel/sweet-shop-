import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import { app } from '../index';
import * as sweetService from '../services/sweetService';
import * as authMiddleware from '../middleware/auth';

// Mock services and middleware
vi.mock('../services/sweetService');
vi.mock('../middleware/auth');

describe('Sweet Endpoints', () => {
  const mockSweet = {
    id: '1',
    name: 'Chocolate Bar',
    category: 'Chocolate',
    price: 2.50,
    quantity: 10,
    description: 'Delicious milk chocolate bar',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    role: 'user' as const,
  };

  beforeEach(() => {
    vi.resetAllMocks();
    // Mock auth middleware to pass through
    vi.mocked(authMiddleware.authenticateToken).mockImplementation((req: any, res: any, next: any) => {
      req.user = mockUser;
      next();
    });
    vi.mocked(authMiddleware.requireAdmin).mockImplementation((req: any, res: any, next: any) => {
      if (req.user?.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
      }
      next();
    });
  });

  describe('GET /api/sweets', () => {
    it('should get all sweets', async () => {
      vi.mocked(sweetService.getAllSweets).mockResolvedValue([mockSweet]);

      const response = await request(app)
        .get('/api/sweets')
        .set('Authorization', 'Bearer mock-token');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([mockSweet]);
      expect(sweetService.getAllSweets).toHaveBeenCalled();
    });
  });

  describe('POST /api/sweets', () => {
    it('should create a new sweet', async () => {
      vi.mocked(sweetService.createSweet).mockResolvedValue(mockSweet);

      const newSweet = {
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 2.50,
        quantity: 10,
        description: 'Delicious milk chocolate bar',
      };

      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', 'Bearer mock-token')
        .send(newSweet);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockSweet);
      expect(sweetService.createSweet).toHaveBeenCalledWith(newSweet);
    });

    it('should return 400 for invalid sweet data', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', 'Bearer mock-token')
        .send({
          name: '',
          price: -1,
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/sweets/search', () => {
    it('should search sweets by name', async () => {
      vi.mocked(sweetService.searchSweets).mockResolvedValue([mockSweet]);

      const response = await request(app)
        .get('/api/sweets/search?name=chocolate')
        .set('Authorization', 'Bearer mock-token');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([mockSweet]);
      expect(sweetService.searchSweets).toHaveBeenCalledWith({ name: 'chocolate' });
    });
  });

  describe('PUT /api/sweets/:id', () => {
    it('should update a sweet', async () => {
      const updatedSweet = { ...mockSweet, name: 'Updated Chocolate' };
      vi.mocked(sweetService.updateSweet).mockResolvedValue(updatedSweet);

      const response = await request(app)
        .put('/api/sweets/1')
        .set('Authorization', 'Bearer mock-token')
        .send({ name: 'Updated Chocolate' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedSweet);
      expect(sweetService.updateSweet).toHaveBeenCalledWith('1', { name: 'Updated Chocolate' });
    });
  });

  describe('DELETE /api/sweets/:id', () => {
    it('should delete a sweet (admin only)', async () => {
      // Mock admin user
      vi.mocked(authMiddleware.authenticateToken).mockImplementation((req: any, res: any, next: any) => {
        req.user = { ...mockUser, role: 'admin' };
        next();
      });

      vi.mocked(sweetService.deleteSweet).mockResolvedValue(undefined);

      const response = await request(app)
        .delete('/api/sweets/1')
        .set('Authorization', 'Bearer mock-token');

      expect(response.status).toBe(204);
      expect(sweetService.deleteSweet).toHaveBeenCalledWith('1');
    });

    it('should return 403 for non-admin user', async () => {
      const response = await request(app)
        .delete('/api/sweets/1')
        .set('Authorization', 'Bearer mock-token');

      expect(response.status).toBe(403);
    });
  });

  describe('POST /api/sweets/:id/purchase', () => {
    it('should purchase a sweet', async () => {
      const updatedSweet = { ...mockSweet, quantity: 9 };
      vi.mocked(sweetService.purchaseSweet).mockResolvedValue(updatedSweet);

      const response = await request(app)
        .post('/api/sweets/1/purchase')
        .set('Authorization', 'Bearer mock-token')
        .send({ quantity: 1 });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedSweet);
      expect(sweetService.purchaseSweet).toHaveBeenCalledWith('1', 1);
    });
  });

  describe('POST /api/sweets/:id/restock', () => {
    it('should restock a sweet (admin only)', async () => {
      // Mock admin user
      vi.mocked(authMiddleware.authenticateToken).mockImplementation((req: any, res: any, next: any) => {
        req.user = { ...mockUser, role: 'admin' };
        next();
      });

      const restockedSweet = { ...mockSweet, quantity: 20 };
      vi.mocked(sweetService.restockSweet).mockResolvedValue(restockedSweet);

      const response = await request(app)
        .post('/api/sweets/1/restock')
        .set('Authorization', 'Bearer mock-token')
        .send({ quantity: 10 });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(restockedSweet);
      expect(sweetService.restockSweet).toHaveBeenCalledWith('1', 10);
    });
  });
});