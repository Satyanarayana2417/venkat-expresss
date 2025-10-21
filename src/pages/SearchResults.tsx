import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ProductCard, Product } from '@/components/ProductCard';
import { SearchProductCard } from '@/components/SearchProductCard';
import { SearchProductListItem } from '@/components/SearchProductListItem';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Search, Loader2, SlidersHorizontal, Grid, List, X, ChevronDown, ShoppingCart } from 'lucide-react';
import { collection, query as firestoreQuery, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Slider } from '@/components/ui/slider';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchQuery = searchParams.get('q') || '';
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { totalItems } = useCart();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [openSections, setOpenSections] = useState({
    category: true,
    sortBy: false,
    price: false,
  });
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  const toggleSection = (section: 'category' | 'sortBy' | 'price') => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(localSearchQuery.trim())}`);
    }
  };

  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    if (searchQuery) {
      searchProducts(searchQuery);
    }
  }, [searchQuery, categoryFilter, sortBy, priceRange]);

  const searchProducts = async (query: string) => {
    if (!query.trim()) {
      setProducts([]);
      return;
    }

    setLoading(true);
    try {
      const productsRef = collection(db, 'products');
      const searchLower = query.toLowerCase().trim();
      
      // Fetch all in-stock products
      const q = firestoreQuery(
        productsRef,
        where('inStock', '==', true),
        orderBy('title')
      );
      
      const snapshot = await getDocs(q);
      const allProducts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Product, 'id'>)
      })) as Product[];
      
      // Filter products where title contains search query (case-insensitive)
      // Search is now strictly title-based for more precise results
      let filtered = allProducts.filter(product => 
        product.title.toLowerCase().includes(searchLower)
      );

      // Apply category filter
      if (categoryFilter !== 'all') {
        filtered = filtered.filter(p => p.category === categoryFilter);
      }

      // Apply price range filter
      filtered = filtered.filter(p => p.priceINR >= priceRange[0] && p.priceINR <= priceRange[1]);

      // Apply sorting
      if (sortBy === 'price-low') {
        filtered.sort((a, b) => a.priceINR - b.priceINR);
      } else if (sortBy === 'price-high') {
        filtered.sort((a, b) => b.priceINR - a.priceINR);
      } else if (sortBy === 'name') {
        filtered.sort((a, b) => a.title.localeCompare(b.title));
      }
      
      setProducts(filtered);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value);
  };

  const handleClearFilters = () => {
    setCategoryFilter('all');
    setSortBy('relevance');
    setPriceRange([0, 10000]);
  };

  return (
    <div className="container mx-auto px-0 lg:px-6 py-0 lg:py-4">
      {/* Mobile: Integrated Search Bar with Back and Cart */}
      <div className="md:hidden bg-[#7CA5DC] px-4 py-3 mb-4 flex items-center gap-3">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex-shrink-0 text-white hover:text-white/80 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex-1 relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              placeholder="Search for products..."
              className="w-full h-10 pl-10 pr-4 rounded-lg border-0 bg-white focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
            />
          </div>
        </form>

        {/* Cart Icon */}
        <button
          onClick={() => navigate('/cart')}
          className="flex-shrink-0 relative text-white hover:text-white/80 transition-colors"
          aria-label="View cart"
        >
          <ShoppingCart className="h-6 w-6" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-semibold">
              {totalItems > 9 ? '9+' : totalItems}
            </span>
          )}
        </button>
      </div>

      {/* Content Area with Padding */}
      <div className="px-4 lg:px-0">
        {/* Desktop: Title */}
        <div className="hidden md:block mb-3 md:mb-4">
          <h1 className="font-heading text-lg lg:text-xl font-bold mb-0.5 lg:mb-1">
            Search Results
          </h1>
          {searchQuery && (
            <p className="text-xs text-muted-foreground">
              Showing results for "{searchQuery}"
            </p>
          )}
        </div>

        {/* Mobile Filter/View Controls */}
        <div className="mb-4 md:hidden space-y-3">
        {/* Filter Button and View Mode */}
        <div className="flex gap-2 justify-between items-center">
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 flex-1"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filters</span>
          </Button>
          
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="text-sm text-muted-foreground">
          Showing {products.length} {products.length !== 1 ? 'products' : 'product'}
        </div>
      </div>

      {/* Desktop Controls Bar */}
      <div className="hidden md:flex gap-4 items-center justify-between mb-8">
        <Button 
          variant="outline" 
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span>Filters</span>
        </Button>
        
        {/* View Mode Toggle - Desktop */}
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Right-Side Sliding Sidebar for Filters */}
      <AnimatePresence>
        {showFilters && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowFilters(false)}
            />

            {/* Sidebar */}
            <motion.div
              ref={sidebarRef}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-[60] overflow-y-auto"
            >
              <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between border-b pb-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    Filters
                  </h2>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setShowFilters(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Category Filter */}
                <div className="border-b pb-4">
                  <button
                    onClick={() => toggleSection('category')}
                    className="w-full flex items-center justify-between py-2 text-sm font-semibold uppercase text-gray-700 hover:text-gray-900"
                  >
                    <span>Category</span>
                    <ChevronDown className={cn(
                      "h-4 w-4 transition-transform",
                      openSections.category && "rotate-180"
                    )} />
                  </button>
                  <AnimatePresence>
                    {openSections.category && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="space-y-2 mt-3"
                      >
                        <Button
                          variant={categoryFilter === 'all' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleCategoryChange('all')}
                          className="w-full justify-start"
                        >
                          All Categories
                        </Button>
                        <Button
                          variant={categoryFilter === 'Food' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleCategoryChange('Food')}
                          className="w-full justify-start"
                        >
                          Food
                        </Button>
                        <Button
                          variant={categoryFilter === 'Decorative' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleCategoryChange('Decorative')}
                          className="w-full justify-start"
                        >
                          Decorative
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Price Range Filter */}
                <div className="border-b pb-4">
                  <button
                    onClick={() => toggleSection('price')}
                    className="w-full flex items-center justify-between py-2 text-sm font-semibold uppercase text-gray-700 hover:text-gray-900"
                  >
                    <span>Price Range</span>
                    <ChevronDown className={cn(
                      "h-4 w-4 transition-transform",
                      openSections.price && "rotate-180"
                    )} />
                  </button>
                  <AnimatePresence>
                    {openSections.price && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="space-y-4 mt-3"
                      >
                        <Slider
                          value={priceRange}
                          onValueChange={(value) => setPriceRange(value as [number, number])}
                          max={10000}
                          step={100}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>₹{priceRange[0].toLocaleString()}</span>
                          <span>₹{priceRange[1].toLocaleString()}</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Sort By Filter */}
                <div className="border-b pb-4">
                  <button
                    onClick={() => toggleSection('sortBy')}
                    className="w-full flex items-center justify-between py-2 text-sm font-semibold uppercase text-gray-700 hover:text-gray-900"
                  >
                    <span>Sort By</span>
                    <ChevronDown className={cn(
                      "h-4 w-4 transition-transform",
                      openSections.sortBy && "rotate-180"
                    )} />
                  </button>
                  <AnimatePresence>
                    {openSections.sortBy && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="space-y-2 mt-3"
                      >
                        <Button
                          variant={sortBy === 'relevance' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleSortChange('relevance')}
                          className="w-full justify-start"
                        >
                          Relevance
                        </Button>
                        <Button
                          variant={sortBy === 'price-low' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleSortChange('price-low')}
                          className="w-full justify-start"
                        >
                          Price: Low to High
                        </Button>
                        <Button
                          variant={sortBy === 'price-high' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleSortChange('price-high')}
                          className="w-full justify-start"
                        >
                          Price: High to Low
                        </Button>
                        <Button
                          variant={sortBy === 'name' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleSortChange('name')}
                          className="w-full justify-start"
                        >
                          Name: A to Z
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Clear Filters Button */}
                <Button
                  variant="outline"
                  onClick={handleClearFilters}
                  className="w-full"
                >
                  Clear All Filters
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* No Results */}
      {!loading && searchQuery && products.length === 0 && (
        <div className="text-center py-20">
          <Search className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No products found
          </h2>
          <p className="text-gray-600 mb-6">
            Try adjusting your search or filters to find what you're looking for
          </p>
          <Button onClick={() => navigate('/products')}>
            Browse All Products
          </Button>
        </div>
      )}

      {/* Products Grid */}
      {!loading && products.length > 0 && (
        <>
          {/* Mobile - Grid or List View */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 gap-3 md:hidden">
              {products.map((product) => (
                <SearchProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3 md:hidden">
              {products.map((product) => (
                <SearchProductListItem key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Desktop Grid - Use Original ProductCard */}
          <div className={cn(
            "hidden md:grid gap-4 md:gap-6",
            viewMode === 'grid' 
              ? "md:grid-cols-3 lg:grid-cols-4" 
              : "grid-cols-1"
          )}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}

        {/* Empty State - No Query */}
        {!loading && !searchQuery && (
          <div className="text-center py-20">
            <Search className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Start searching
            </h2>
            <p className="text-gray-600">
              Enter a search term to find products
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
