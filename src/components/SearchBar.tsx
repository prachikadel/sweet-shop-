import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import type { SearchParams } from '../types';

interface SearchBarProps {
  onSearch: (params: SearchParams) => void;
  onClear: () => void;
}

export function SearchBar({ onSearch, onClear }: SearchBarProps) {
  const [searchParams, setSearchParams] = useState<SearchParams>({});
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = () => {
    onSearch(searchParams);
  };

  const handleClear = () => {
    setSearchParams({});
    setShowFilters(false);
    onClear();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const hasActiveFilters = searchParams.name || searchParams.category || 
                          searchParams.minPrice !== undefined || searchParams.maxPrice !== undefined;

  const categories = [
    'Chocolate',
    'Gummy',
    'Hard Candy',
    'Lollipops',
    'Jelly',
    'Specialty',
    'Other',
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search sweets by name..."
            value={searchParams.name || ''}
            onChange={(e) => setSearchParams(prev => ({ ...prev, name: e.target.value }))}
            onKeyPress={handleKeyPress}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 
                     focus:ring-blue-200 focus:outline-none focus:ring-2 transition-colors duration-200"
          />
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`p-3 rounded-lg border transition-colors duration-200 ${
            showFilters || hasActiveFilters
              ? 'bg-blue-50 border-blue-300 text-blue-600'
              : 'border-gray-300 text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Filter size={20} />
        </button>
        
        <button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg 
                   transition-colors duration-200 font-medium"
        >
          Search
        </button>

        {hasActiveFilters && (
          <button
            onClick={handleClear}
            className="p-3 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 
                     transition-colors duration-200"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {showFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={searchParams.category || ''}
                onChange={(e) => setSearchParams(prev => ({ 
                  ...prev, 
                  category: e.target.value || undefined 
                }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 
                         focus:ring-blue-200 focus:outline-none focus:ring-2"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Price ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={searchParams.minPrice || ''}
                onChange={(e) => setSearchParams(prev => ({ 
                  ...prev, 
                  minPrice: e.target.value ? parseFloat(e.target.value) : undefined 
                }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 
                         focus:ring-blue-200 focus:outline-none focus:ring-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Price ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="999.99"
                value={searchParams.maxPrice || ''}
                onChange={(e) => setSearchParams(prev => ({ 
                  ...prev, 
                  maxPrice: e.target.value ? parseFloat(e.target.value) : undefined 
                }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 
                         focus:ring-blue-200 focus:outline-none focus:ring-2"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}