export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface Sweet {
  _id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSweetDto {
  name: string;
  category: string;
  price: number;
  quantity: number;
  description?: string;
}

export interface UpdateSweetDto {
  name?: string;
  category?: string;
  price?: number;
  quantity?: number;
  description?: string;
}

export interface SearchParams {
  name?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface AuthResponse {
  user: User;
  token:string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'user';
}

export interface PurchaseDto {
  quantity: number;
}

export interface RestockDto {
  quantity: number;
}