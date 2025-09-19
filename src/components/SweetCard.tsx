import { useState } from 'react';
import { ShoppingCart, Edit3, Trash2, Plus } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import type { Sweet } from '../types';

interface SweetCardProps {
  sweet: Sweet;
  onPurchase: (id: string, quantity: number) => Promise<void>;
  onEdit: (sweet: Sweet) => void;
  onDelete: (id: string) => Promise<void>;
  onRestock: (id: string, quantity: number) => Promise<void>;
}

export function SweetCard({ sweet, onPurchase, onEdit, onDelete, onRestock }: SweetCardProps) {
  const { isAdmin } = useAuth();
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);
  const [restockQuantity, setRestockQuantity] = useState(10);
  const [loading, setLoading] = useState(false);

  // Guard against missing or invalid props
  if (!sweet || !onPurchase || !onEdit || !onDelete || !onRestock) {
    console.error('SweetCard: Missing required props', { sweet, onPurchase, onEdit, onDelete, onRestock });
    return <div className="text-red-500 p-4">Error: Missing required props</div>;
  }

  const handlePurchase = async () => {
    if (sweet.quantity < purchaseQuantity) return;

    setLoading(true);
    try {
      await onPurchase(String(sweet._id), purchaseQuantity);
    } catch (error) {
      console.error('Purchase failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestock = async () => {
    setLoading(true);
    try {
      await onRestock(String(sweet._id), restockQuantity);
    } catch (error) {
      console.error('Restock failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${sweet.name}"?`)) {
      setLoading(true);
      try {
        await onDelete(String(sweet._id));
      } catch (error) {
        console.error('Delete failed:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300   group">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
              {sweet.name}
            </h3>
            <p className="text-sm text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-full inline-block mt-1">
              {sweet.category}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-green-600">${sweet.price.toFixed(2)}</p>
            <p
              className={`text-sm font-medium ${
                sweet.quantity > 0 ? 'text-gray-600' : 'text-red-500'
              }`}
            >
              {sweet.quantity > 0 ? `${sweet.quantity} in stock` : 'Out of stock'}
            </p>
          </div>
        </div>

        <p className="text-gray-600 text-sm leading-relaxed mb-4">{sweet.description}</p>
      </div>

      {/* Actions */}
      <div className="px-6 pb-6 pt-2 border-t border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          {sweet.quantity > 0 ? (
            <>
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="number"
                  min="1"
                  max={sweet.quantity}
                  value={purchaseQuantity}
                  onChange={(e) => {
                    const value = e.target.value;
                    setPurchaseQuantity(value === '' ? 1 : Math.max(1, parseInt(value) || 1));
                  }}
                  className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                />
                <button
                  onClick={handlePurchase}
                  disabled={loading || sweet.quantity < purchaseQuantity}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart size={16} />
                  Purchase
                </button>
              </div>
            </>
          ) : (
            <button
              disabled
              className="flex-1 bg-gray-300 text-gray-500 font-medium py-2 px-4 rounded-lg cursor-not-allowed flex items-center justify-center gap-2"
            >
              <ShoppingCart size={16} />
              Out of Stock
            </button>
          )}
        </div>

        {/* Admin Actions */}
        {isAdmin && (
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(sweet)}
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <Edit3 size={16} />
              Edit
            </button>

            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                value={restockQuantity}
                onChange={(e) => {
                  const value = e.target.value;
                  setRestockQuantity(value === '' ? 10 : Math.max(1, parseInt(value) || 10));
                }}
                className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm"
              />
              <button
                onClick={handleRestock}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-3 rounded-lg transition-colors duration-200 flex items-center gap-1"
              >
                <Plus size={16} />
                Restock
              </button>
            </div>

            <button
              onClick={handleDelete}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}

export default SweetCard;