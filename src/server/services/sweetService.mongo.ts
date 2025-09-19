import { Sweet } from '../models/Sweet';
import type { Sweet as SweetType, CreateSweetDto, UpdateSweetDto, SearchParams } from '../../types';

/**
 * Get all sweets from the database with pagination
 */
export async function getAllSweets(page: number = 1, limit: number = 10): Promise<SweetType[]> {
  const skip = (page - 1) * limit;
  
  const sweets = await Sweet.find()
    .sort({ createdAt: -1 })
   

  return sweets.map(sweet => ({
    _id: sweet._id.toString(),
    name: sweet.name,
    category: sweet.category,
    price: sweet.price,
    quantity: sweet.quantity,
    description: sweet.description,
    createdAt: sweet.createdAt.toISOString(),
    updatedAt: sweet.updatedAt.toISOString(),
  }))||[];
}

/**
 * Create a new sweet
 */
export async function createSweet(sweetData: CreateSweetDto): Promise<SweetType> {
  // Check if sweet with same name already exists
  const existingSweet = await Sweet.findOne({ name: sweetData.name });
  if (existingSweet) {
    throw new Error('Sweet with this name already exists');
  }

  const sweet = await Sweet.create(sweetData);

  return {
    _id: sweet._id.toString(),
    name: sweet.name,
    category: sweet.category,
    price: sweet.price,
    quantity: sweet.quantity,
    description: sweet.description,
    createdAt: sweet.createdAt.toISOString(),
    updatedAt: sweet.updatedAt.toISOString(),
  };
}

/**
 * Get a sweet by ID
 */
export async function getSweetById(id: string): Promise<SweetType> {
  const sweet = await Sweet.findById(id);
  if (!sweet) {
    throw new Error('Sweet not found');
  }

  return {
    _id: sweet._id.toString(),
    name: sweet.name,
    category: sweet.category,
    price: sweet.price,
    quantity: sweet.quantity,
    description: sweet.description,
    createdAt: sweet.createdAt.toISOString(),
    updatedAt: sweet.updatedAt.toISOString(),
  };
}

/**
 * Update a sweet
 */
export async function updateSweet(id: string, updateData: UpdateSweetDto): Promise<SweetType> {
  // Check if name is being updated and if it conflicts
  if (updateData.name) {
    const existingSweet = await Sweet.findOne({ name: updateData.name, _id: { $ne: id } });
    if (existingSweet) {
      throw new Error('Sweet with this name already exists');
    }
  }

  const sweet = await Sweet.findByIdAndUpdate(
    id,
    { ...updateData, updatedAt: new Date() },
    { new: true, runValidators: true }
  );

  if (!sweet) {
    throw new Error('Sweet not found');
  }

  return {
    _id: sweet._id.toString(),
    name: sweet.name,
    category: sweet.category,
    price: sweet.price,
    quantity: sweet.quantity,
    description: sweet.description,
    createdAt: sweet.createdAt.toISOString(),
    updatedAt: sweet.updatedAt.toISOString(),
  };
}

/**
 * Delete a sweet
 */
export async function deleteSweet(id: string): Promise<void> {
  const result = await Sweet.findByIdAndDelete(id);
  if (!result) {
    throw new Error('Sweet not found');
  }
}

/**
 * Search sweets based on parameters
 */
export async function searchSweets(params: SearchParams & { page?: number; limit?: number }): Promise<SweetType[]> {
  const { page = 1, limit = 10, ...searchParams } = params;
  const skip = (page - 1) * limit;

  let query: any = {};

  if (searchParams.name) {
    query.name = { $regex: searchParams.name, $options: 'i' };
  }

  if (searchParams.category) {
    query.category = { $regex: searchParams.category, $options: 'i' };
  }

  if (searchParams.minPrice !== undefined || searchParams.maxPrice !== undefined) {
    query.price = {};
    if (searchParams.minPrice !== undefined) {
      query.price.$gte = searchParams.minPrice;
    }
    if (searchParams.maxPrice !== undefined) {
      query.price.$lte = searchParams.maxPrice;
    }
  }

  const sweets = await Sweet.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return sweets.map(sweet => ({
    _id: sweet._id.toString(),
    name: sweet.name,
    category: sweet.category,
    price: sweet.price,
    quantity: sweet.quantity,
    description: sweet.description,
    createdAt: sweet.createdAt.toISOString(),
    updatedAt: sweet.updatedAt.toISOString(),
  }));
}

/**
 * Purchase a sweet (atomic decrement)
 */
export async function purchaseSweet(id: string, quantity: number): Promise<SweetType> {
  // Atomic operation to prevent overselling
  const sweet = await Sweet.findOneAndUpdate(
    { _id: id, quantity: { $gte: quantity } },
    { $inc: { quantity: -quantity }, updatedAt: new Date() },
    { new: true }
  );

  if (!sweet) {
    throw new Error('Insufficient stock or sweet not found');
  }

  return {
    _id: sweet._id.toString(),
    name: sweet.name,
    category: sweet.category,
    price: sweet.price,
    quantity: sweet.quantity,
    description: sweet.description,
    createdAt: sweet.createdAt.toISOString(),
    updatedAt: sweet.updatedAt.toISOString(),
  };
}

/**
 * Restock a sweet (increment quantity)
 */
export async function restockSweet(id: string, quantity: number): Promise<SweetType> {
  const sweet = await Sweet.findByIdAndUpdate(
    id,
    { $inc: { quantity }, updatedAt: new Date() },
    { new: true }
  );

  if (!sweet) {
    throw new Error('Sweet not found');
  }

  return {
    _id: sweet._id.toString(),
    name: sweet.name,
    category: sweet.category,
    price: sweet.price,
    quantity: sweet.quantity,
    description: sweet.description,
    createdAt: sweet.createdAt.toISOString(),
    updatedAt: sweet.updatedAt.toISOString(),
  };
}

