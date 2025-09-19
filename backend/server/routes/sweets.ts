import { Router } from 'express';
import mongoose from 'mongoose';
import {
  getAllSweets,
  createSweet,
  getSweetById,
  updateSweet,
  deleteSweet,
  searchSweets,
  purchaseSweet,
  restockSweet,
} from '../services/sweetService.mongo';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import {
  validateCreateSweet,
  validatePurchase,
  validateRestock,
} from '../middleware/validation';

const router = Router();

// Validate :id params to prevent invalid ObjectId casts
router.param('id', (req, res, next, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid sweet id' });
  }
  next();
});

// Apply authentication to all routes
router.use(authenticateToken);

/**
 * Get all sweets
 * GET /api/sweets
 */
router.get('/', async (req, res) => {
  try {
    //const page = req.query.page ? parseInt(String(req.query.page), 10) : 1;
    //const limit = req.query.limit ? parseInt(String(req.query.limit), 10) : 10;
    const sweets = await getAllSweets();
    res.json(sweets);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch sweets',
    });
  }
});

/**
 * Create a new sweet
 * POST /api/sweets
 */
router.post('/', requireAdmin, validateCreateSweet, async (req, res) => {
  try {
    const sweet = await createSweet(req.body);
    res.status(201).json(sweet);
  } catch (error) {
    const statusCode = error instanceof Error && error.message.includes('already exists') ? 409 : 400;
    res.status(statusCode).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create sweet',
    });
  }
});

/**
 * Search sweets
 * GET /api/sweets/search
 */
router.get('/search', async (req, res) => {
  try {
    const { name, category, minPrice, maxPrice, page, limit } = req.query;
    
    const searchParams: any = {};
    if (name) searchParams.name = name as string;
    if (category) searchParams.category = category as string;
    if (minPrice) searchParams.minPrice = parseFloat(minPrice as string);
    if (maxPrice) searchParams.maxPrice = parseFloat(maxPrice as string);
    if (page) searchParams.page = parseInt(String(page), 10);
    if (limit) searchParams.limit = parseInt(String(limit), 10);

    const sweets = await searchSweets(searchParams);
    res.json(sweets);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to search sweets',
    });
  }
});

/**
 * Get sweet by ID
 * GET /api/sweets/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const sweet = await getSweetById(req.params.id);
    res.json(sweet);
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error instanceof Error ? error.message : 'Sweet not found',
    });
  }
});

/**
 * Update sweet
 * PUT /api/sweets/:id
 */
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const sweet = await updateSweet(req.params.id, req.body);
    res.json(sweet);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update sweet',
    });
  }
});

/**
 * Delete sweet (Admin only)
 * DELETE /api/sweets/:id
 */
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await deleteSweet(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to delete sweet',
    });
    console.log(error);
    
  }
});

/**
 * Purchase sweet
 * POST /api/sweets/:id/purchase
 */
router.post('/:id/purchase', validatePurchase, async (req, res) => {
  try {
    const { quantity } = req.body;
    const sweet = await purchaseSweet(req.params.id, quantity);
    res.json(sweet);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to purchase sweet',
    });
  }
});

/**
 * Restock sweet (Admin only)
 * POST /api/sweets/:id/restock
 */
router.post('/:id/restock', requireAdmin, validateRestock, async (req, res) => {
  try {
    const { quantity } = req.body;
    const sweet = await restockSweet(req.params.id, quantity);
    res.json(sweet);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to restock sweet',
    });
  }
});

export default router;