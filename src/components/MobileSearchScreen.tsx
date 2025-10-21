import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchSuggestions } from '@/hooks/useSearchSuggestions';
import { Product } from '@/components/ProductCard';

interface MobileSearchScreenProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileSearchScreen = ({ isOpen, onClose }: MobileSearchScreenProps) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Use search suggestions hook
  const { suggestions, loading, popularProducts } = useSearchSuggestions({
    searchQuery,
    enabled: isOpen,
    maxResults: 7
  });

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle back button
  const handleBack = () => {
    setSearchQuery('');
    onClose();
  };

  // Handle clear button
  const handleClear = () => {
    setSearchQuery('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      onClose();
      setSearchQuery('');
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (product: Product) => {
    navigate(`/product/${product.slug}`);
    onClose();
    setSearchQuery('');
  };

  // Handle category button click
  const handleCategoryClick = (category: 'food' | 'decorative') => {
    if (category === 'food') {
      navigate('/food-items');
    } else {
      navigate('/decorative-items');
    }
    onClose();
  };

  // Display products based on search query
  const displayProducts = searchQuery.trim() ? suggestions : popularProducts;
  const showSuggestions = displayProducts.length > 0 || loading;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'tween', duration: 0.3 }}
          className="fixed inset-0 z-[100] bg-white md:hidden"
        >
          {/* Search Header */}
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
            <div className="flex items-center gap-3 px-3 py-3">
              {/* Back Button */}
              <button
                onClick={handleBack}
                className="flex-shrink-0 w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-700" />
              </button>

              {/* Search Input */}
              <form onSubmit={handleSearch} className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search for Products, Brands and More"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-11 pl-4 pr-10 rounded-md border-0 focus:outline-none text-sm bg-gray-50"
                />
                
                {/* Clear Button - Only show when there's text */}
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="h-4 w-4 text-gray-500" />
                  </button>
                )}
              </form>
            </div>
          </div>

          {/* Content Area */}
          <div className="overflow-y-auto h-[calc(100vh-68px)]">
            {/* Discover More Section - Only show when no search query */}
            {!searchQuery.trim() && (
              <div className="px-4 py-4">
                <h2 className="text-base font-semibold text-gray-900 mb-3">
                  Discover More
                </h2>
                <div className="flex flex-wrap gap-2">
                  {/* Food Items Button */}
                  <button
                    onClick={() => handleCategoryClick('food')}
                    className="px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 transition-colors text-sm font-medium text-gray-700"
                  >
                    Food Items
                  </button>

                  {/* Decorative Items Button */}
                  <button
                    onClick={() => handleCategoryClick('decorative')}
                    className="px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 transition-colors text-sm font-medium text-gray-700"
                  >
                    Decorative Items
                  </button>
                </div>
              </div>
            )}

            {/* Search Suggestions */}
            {showSuggestions && (
              <div className="px-4 py-2">
                {/* Header */}
                <div className="mb-2">
                  <h3 className="text-sm font-medium text-gray-600">
                    {loading ? 'Searching...' : searchQuery.trim() ? 'Search Results' : 'Popular Products'}
                  </h3>
                </div>

                {/* Loading State */}
                {loading && (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                )}

                {/* Suggestions List */}
                {!loading && displayProducts.length > 0 && (
                  <div className="space-y-1">
                    {displayProducts.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleSuggestionClick(product)}
                        className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 active:bg-gray-100 rounded-lg transition-colors"
                      >
                        {/* Product Image */}
                        <div className="flex-shrink-0 w-12 h-12 rounded-md overflow-hidden bg-gray-100">
                          <img
                            src={product.images[0] || product.thumbnails[0]}
                            alt={product.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://via.placeholder.com/48?text=No+Image';
                            }}
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 text-left min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {product.title}
                          </p>
                        </div>

                        {/* Arrow */}
                        <div className="flex-shrink-0">
                          <svg
                            className="h-5 w-5 text-gray-400"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* No Results */}
                {!loading && searchQuery.trim() && displayProducts.length === 0 && (
                  <div className="text-center py-8">
                    <Search className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-sm text-gray-600">No products found</p>
                    <p className="text-xs text-gray-500 mt-1">Try a different search term</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
