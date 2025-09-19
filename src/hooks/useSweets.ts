import { useState, useEffect } from 'react';
import { sweetsApi } from '../services/api';
import type { Sweet, CreateSweetDto, UpdateSweetDto, SearchParams } from '../types';

export function useSweets() {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSweets = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await sweetsApi.getAll();
      setSweets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch sweets');
    } finally {
      setLoading(false);
    }
  };

  const createSweet = async (sweetData: CreateSweetDto): Promise<Sweet> => {
    try {
      const newSweet = await sweetsApi.create(sweetData);
      setSweets(prev => [newSweet, ...prev]);
      return newSweet;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create sweet';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateSweet = async (id: string, updateData: UpdateSweetDto): Promise<Sweet> => {
    try {
      const updatedSweet = await sweetsApi.update(id, updateData);
      setSweets(prev => prev.map(sweet => 
        (sweet._id === id) ? updatedSweet : sweet
      ));
      return updatedSweet;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update sweet';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteSweet = async (id: string): Promise<void> => {
    try {
      await sweetsApi.delete(id);
      setSweets(prev => prev.filter(sweet => sweet._id !== id));
    } catch (err) {
      console.log(err)
      window.location.reload();
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete sweet';
      setError(errorMessage);
      throw new Error(errorMessage);

    }
  };

  const purchaseSweet = async (id: string, quantity: number): Promise<Sweet> => {
    try {
      const updatedSweet = await sweetsApi.purchase(id, { quantity });
      setSweets(prev => prev.map(sweet => 
        (sweet._id === id) ? updatedSweet : sweet
      ));
      return updatedSweet;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to purchase sweet';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const restockSweet = async (id: string, quantity: number): Promise<Sweet> => {
    try {
      const updatedSweet = await sweetsApi.restock(id, { quantity });
      setSweets(prev => prev.map(sweet => 
        (sweet._id === id) ? updatedSweet : sweet
      ));
      return updatedSweet;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to restock sweet';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const searchSweets = async (params: SearchParams): Promise<Sweet[]> => {
    try {
      setLoading(true);
      setError(null);
      const results = await sweetsApi.search(params);
      setSweets(results);
      return results;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search sweets';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSweets();
  }, []);

  return {
    sweets,
    loading,
    error,
    fetchSweets,
    createSweet,
    updateSweet,
    deleteSweet,
    purchaseSweet,
    restockSweet,
    searchSweets,
  };
}