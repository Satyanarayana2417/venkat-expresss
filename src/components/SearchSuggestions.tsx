import { useNavigate } from 'react-router-dom';
import { Product } from '@/components/ProductCard';
import { Search, TrendingUp, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchSuggestionsProps {
  suggestions: Product[];
  popularProducts: Product[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  showPopular: boolean;
  onSuggestionClick: (product: Product) => void;
  onClose: () => void;
}

export const SearchSuggestions = ({
  suggestions,
  popularProducts,
  loading,
  error,
  searchQuery,
  showPopular,
  onSuggestionClick,
  onClose
}: SearchSuggestionsProps) => {
  const navigate = useNavigate();

  // Determine what to display
  const displayProducts = searchQuery.trim() ? suggestions : (showPopular ? popularProducts : []);
  const shouldShow = (searchQuery.trim() || showPopular) && (displayProducts.length > 0 || loading || error);

  if (!shouldShow) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden z-50 max-h-[400px] overflow-y-auto"
      >
        {/* Header */}
        <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            {showPopular && !searchQuery.trim() ? (
              <>
                <TrendingUp className="h-4 w-4" />
                <span className="font-medium">Popular Products</span>
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                <span className="font-medium">
                  {loading ? 'Searching...' : `Results for "${searchQuery}"`}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="px-4 py-6 text-center text-gray-500">
            <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Suggestions List */}
        {!loading && !error && displayProducts.length > 0 && (
          <div className="py-1">
            {displayProducts.map((product, index) => (
              <button
                key={product.id}
                onClick={() => onSuggestionClick(product)}
                className="w-full px-4 py-2.5 hover:bg-gray-50 transition-colors flex items-center gap-3 border-b border-gray-100 last:border-b-0"
              >
                {/* Product Image */}
                <div className="flex-shrink-0 w-10 h-10 rounded-md overflow-hidden bg-gray-100">
                  <img
                    src={product.images[0] || product.thumbnails[0]}
                    alt={product.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/40?text=No+Image';
                    }}
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {product.title}
                  </p>
                </div>

                {/* Arrow Icon */}
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

        {/* View All Results Footer (only show when searching) */}
        {!loading && searchQuery.trim() && suggestions.length > 0 && (
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
            <button
              onClick={() => {
                navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
                onClose();
              }}
              className="w-full text-center text-sm font-medium text-primary hover:text-primary-dark transition-colors"
            >
              View all results for "{searchQuery}"
            </button>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
