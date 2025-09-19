import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SweetCard } from '../SweetCard';
import type { Sweet } from '../../types';

const mockSweet: Sweet = {
  id: '1',
  name: 'Chocolate Bar',
  category: 'Chocolate',
  price: 2.50,
  quantity: 10,
  description: 'Delicious milk chocolate bar',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

// Mock the useAuth hook
vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: '1', email: 'test@example.com', role: 'user' },
    isAdmin: false,
  }),
}));

describe('SweetCard', () => {
  const mockOnPurchase = vi.fn();
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnRestock = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders sweet information correctly', () => {
    render(
      <SweetCard
        sweet={mockSweet}
        onPurchase={mockOnPurchase}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onRestock={mockOnRestock}
      />
    );

    expect(screen.getByText('Chocolate Bar')).toBeInTheDocument();
    expect(screen.getByText('Chocolate')).toBeInTheDocument();
    expect(screen.getByText('$2.50')).toBeInTheDocument();
    expect(screen.getByText('10 in stock')).toBeInTheDocument();
    expect(screen.getByText('Delicious milk chocolate bar')).toBeInTheDocument();
  });

  it('shows purchase button when item is in stock', () => {
    render(
      <SweetCard
        sweet={mockSweet}
        onPurchase={mockOnPurchase}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onRestock={mockOnRestock}
      />
    );

    expect(screen.getByText(/purchase/i)).toBeInTheDocument();
    expect(screen.getByText(/purchase/i)).not.toBeDisabled();
  });

  it('disables purchase button when out of stock', () => {
    const outOfStockSweet = { ...mockSweet, quantity: 0 };

    render(
      <SweetCard
        sweet={outOfStockSweet}
        onPurchase={mockOnPurchase}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onRestock={mockOnRestock}
      />
    );

    expect(screen.getByText(/out of stock/i)).toBeInTheDocument();
    expect(screen.getByText(/out of stock/i)).toBeDisabled();
  });

  it('calls onPurchase when purchase button is clicked', async () => {
    render(
      <SweetCard
        sweet={mockSweet}
        onPurchase={mockOnPurchase}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onRestock={mockOnRestock}
      />
    );

    const purchaseButton = screen.getByText(/purchase/i);
    fireEvent.click(purchaseButton);

    await waitFor(() => {
      expect(mockOnPurchase).toHaveBeenCalledWith(mockSweet.id, 1);
    });
  });
});