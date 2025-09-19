import type { 
  User, 
  Sweet, 
  AuthResponse, 
  LoginDto, 
  RegisterDto,
  CreateSweetDto,
  UpdateSweetDto,
  SearchParams,
  PurchaseDto,
  RestockDto
} from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

// Using httpOnly cookies; no token persisted on client

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    credentials: 'include',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Request failed: ${response.statusText}`);
  }

  return response.json();
}

// Auth API
export const authApi = {
  async register(userData: RegisterDto): Promise<AuthResponse> {
    const response = await apiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return response;
  },

  async login(loginData: LoginDto): Promise<AuthResponse> {
    const response = await apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(loginData),
    });
    return response;
  },

  logout() {
    return apiRequest('/auth/logout', { method: 'POST' });
  },
  me() {
    return apiRequest<AuthResponse>('/auth/me');
  }
};

// Sweets API
export const sweetsApi = {
  async getAll(): Promise<Sweet[]> {
    return apiRequest<Sweet[]>('/sweets');
  },

  async create(sweetData: CreateSweetDto): Promise<Sweet> {
    return apiRequest<Sweet>('/sweets', {
      method: 'POST',
      body: JSON.stringify(sweetData),
    });
  },

  async getById(id: string): Promise<Sweet> {
    return apiRequest<Sweet>(`/sweets/${id}`);
  },

  async update(id: string, updateData: UpdateSweetDto): Promise<Sweet> {
    return apiRequest<Sweet>(`/sweets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },

  async delete(id: string): Promise<void> {
    await apiRequest<void>(`/sweets/${id}`, {
      method: 'DELETE',
    });
  },

  async search(params: SearchParams): Promise<Sweet[]> {
    const searchParams = new URLSearchParams();
    if (params.name) searchParams.append('name', params.name);
    if (params.category) searchParams.append('category', params.category);
    if (params.minPrice !== undefined) searchParams.append('minPrice', params.minPrice.toString());
    if (params.maxPrice !== undefined) searchParams.append('maxPrice', params.maxPrice.toString());

    const queryString = searchParams.toString();
    return apiRequest<Sweet[]>(`/sweets/search${queryString ? `?${queryString}` : ''}`);
  },

  async purchase(id: string, purchaseData: PurchaseDto): Promise<Sweet> {
    return apiRequest<Sweet>(`/sweets/${id}/purchase`, {
      method: 'POST',
      body: JSON.stringify(purchaseData),
    });
  },

  async restock(id: string, restockData: RestockDto): Promise<Sweet> {
    return apiRequest<Sweet>(`/sweets/${id}/restock`, {
      method: 'POST',
      body: JSON.stringify(restockData),
    });
  },
};