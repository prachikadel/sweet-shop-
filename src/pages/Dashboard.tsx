import  { useState } from 'react';
import { Plus, LogOut, User, Crown } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useSweets } from '../hooks/useSweets';
import { SweetCard } from '../components/SweetCard';
import { SweetForm } from '../components/SweetForm';
import { SearchBar } from '../components/SearchBar';
import type { Sweet, CreateSweetDto, SearchParams } from '../types';

export function Dashboard() {
  const { user, logout, isAdmin } = useAuth();
  const { 
    sweets, 
    loading, 
    error, 
    createSweet, 
    updateSweet, 
    deleteSweet, 
    purchaseSweet, 
    restockSweet, 
    searchSweets, 
    fetchSweets 
  } = useSweets();
  
  const [showForm, setShowForm] = useState(false);
  const [editingSweet, setEditingSweet] = useState<Sweet | undefined>();
  const [isSearching, setIsSearching] = useState(false);

  const handleCreateSweet = async (sweetData: CreateSweetDto) => {
    try {
      await createSweet(sweetData);
      setShowForm(false);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  

  const handleUpdateSweet = async (sweetData: CreateSweetDto) => {
    if (!editingSweet) return;
    
    try {
      await updateSweet(editingSweet._id, sweetData);
      setEditingSweet(undefined);
      setShowForm(false);
    } catch (error) {
      // Error is handled by the hook
    }
  };

 

  const handleEditSweet = (sweet: Sweet) => {
    setEditingSweet(sweet);
    setShowForm(true);
  };

  const handleDeleteSweet = async (id: string) => {
    try {
      await deleteSweet(id);

    } catch (error) {
      // Error is handled by the hook
    }
  };



  const handlePurchaseSweet = async (id: string, quantity: number) => {
    try {
      await purchaseSweet(id, quantity);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleRestockSweet = async (id: string, quantity: number) => {
    try {
      await restockSweet(id, quantity);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleSearch = async (params: SearchParams) => {
    setIsSearching(true);
    try {
      await searchSweets(params);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleClearSearch = async () => {
    setIsSearching(false);
    try {
      await fetchSweets();
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingSweet(undefined);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/70 backdrop-blur-sm border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">🍬</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Sweet Shop</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-700">
                <User size={20} />
                <span className="font-medium">{user?.email}</span>
                {isAdmin && <Crown size={16} className="text-yellow-500" />}
              </div>
              
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 
                         border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} onClear={handleClearSearch} />

        {/* Actions */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              {isSearching ? 'Search Results' : 'Available Sweets'}
            </h2>
            <p className="text-gray-600 mt-1">
              {sweets.length} sweet{sweets.length !== 1 ? 's' : ''} available
            </p>
          </div>
          
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 
                     text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 
                     transform hover:scale-105 active:scale-95 flex items-center gap-2 shadow-lg"
          >
            <Plus size={20} />
            Add Sweet
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4"></div>
                <div className="h-20 bg-gray-100 rounded mb-4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : sweets.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🍭</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {isSearching ? 'No sweets found' : 'No sweets available'}
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {isSearching 
                ? 'Try adjusting your search criteria to find what you\'re looking for.'
                : 'Be the first to add some delicious sweets to the shop!'
              }
            </p>
          </div>
        ) : (
          /* Sweet Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
            {sweets.map((sweet) => (
              <SweetCard
                key={sweet._id}
                sweet={sweet}
                onPurchase={handlePurchaseSweet}
                onEdit={handleEditSweet}
                onDelete={handleDeleteSweet}
                onRestock={handleRestockSweet}
              />
            ))}
          </div>
        )}
      </main>

      {/* Sweet Form Modal */}
      {showForm && (
        <SweetForm
          sweet={editingSweet}
          onSave={editingSweet ? handleUpdateSweet : handleCreateSweet}
          onCancel={handleCloseForm}
        />
      )}
    </div>
  );
}