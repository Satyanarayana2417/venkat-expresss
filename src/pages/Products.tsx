import { useState, useRef, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Search, SlidersHorizontal, Loader2, Heart, Grid, List, X, ArrowLeft, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const Products = () => {
  const { t } = useTranslation();
  const { products, loading } = useProducts();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Dynamic price limits based on actual product prices
  const priceLimits = useMemo(() => {
    if (!products || products.length === 0) {
      return { min: 0, max: 1000 }; // Default fallback when no products
    }
    
    const prices = products.map(p => p.priceINR).filter(price => typeof price === 'number' && !isNaN(price));
    
    if (prices.length === 0) {
      return { min: 0, max: 1000 }; // Fallback if no valid prices
    }
    
    if (prices.length === 1) {
      // Single product: set min to 0 and max to product price (or slightly higher)
      return { min: 0, max: Math.max(prices[0], 100) };
    }
    
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    return { min: minPrice, max: maxPrice };
  }, [products]);
  
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  
  // Update price range when price limits change
  useEffect(() => {
    setPriceRange([priceLimits.min, priceLimits.max]);
  }, [priceLimits]);
  
  const [openSections, setOpenSections] = useState({
    category: true,
    sortBy: false,
    price: false,
  });

  const toggleSection = (section: 'category' | 'sortBy' | 'price') => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleAddToCart = (product: any) => {
    addToCart({
      productId: product.id,
      title: product.title,
      priceINR: product.priceINR,
      image: product.images[0],
    });
  };

  const handleToggleWishlist = (product: any) => {
    toggleWishlist({
      productId: product.id,
      title: product.title,
      priceINR: product.priceINR,
      image: product.images[0],
      slug: product.slug,
    });
  };

  const filteredProducts = products
    .filter((p) => {
      const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      const matchesPrice = p.priceINR >= priceRange[0] && p.priceINR <= priceRange[1];
      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.priceINR - b.priceINR;
      if (sortBy === 'price-high') return b.priceINR - a.priceINR;
      return 0;
    });

  return (
    <div className="container mx-auto px-4 lg:px-6 py-4">
      {/* Mobile: Back Button and Title */}
      <div className="md:hidden mb-3">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="-ml-2 shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="font-heading text-lg font-bold">
            {t('products.title')}
          </h1>
        </div>
      </div>

      {/* Header with Title */}
      <div className="mb-3 md:mb-4">
        {/* Desktop: Title */}
        <div className="hidden md:block">
          <h1 className="font-heading text-lg lg:text-xl font-bold mb-0.5 lg:mb-1">{t('products.title')}</h1>
          <p className="text-xs text-muted-foreground">{t('products.subtitle')}</p>
        </div>
      </div>

      {/* Mobile Filter/View Controls */}
      <div className="mb-4 md:hidden space-y-3">
        {/* First Row: Search Bar and Filter Button */}
        <div className="flex gap-3 items-center">
          {/* Search Bar - Mobile Only */}
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder={t('products.searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-sm"
            />
          </div>
          
          {/* Filter Button - Mobile */}
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">{t('products.filters')}</span>
          </Button>
        </div>

        {/* Second Row: Results Count and View Mode Toggle */}
        <div className="flex gap-2 justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {t('products.showing')} {filteredProducts.length} {filteredProducts.length !== 1 ? t('products.items') : t('products.item')}
          </div>
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
      </div>

      {/* Desktop Search and Filters Bar */}
      <div className="hidden md:block mb-8 space-y-4">
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('products.searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 shrink-0"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>{t('products.filters')}</span>
          </Button>
          
          {/* View Mode Toggle - Desktop */}
          <div className="flex gap-2 shrink-0">
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

        {/* Desktop Filters */}
        <div className="hidden md:flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Label className="text-sm font-medium mb-2 block">{t('products.category')}</Label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
              >
                {t('products.all')}
              </Button>
              <Button
                variant={selectedCategory === 'Food' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('Food')}
              >
                {t('products.food')}
              </Button>
              <Button
                variant={selectedCategory === 'Decorative' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('Decorative')}
              >
                {t('products.decorative')}
              </Button>
            </div>
          </div>

          <div className="w-full md:w-64">
            <Label className="text-sm font-medium mb-2 block">{t('products.priceRange')}</Label>
            <div className="space-y-2">
              <Slider
                value={priceRange}
                onValueChange={(value) => setPriceRange(value as [number, number])}
                min={priceLimits.min}
                max={priceLimits.max}
                step={Math.max(1, Math.floor((priceLimits.max - priceLimits.min) / 100))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-600">
                <span>₹{priceLimits.min.toLocaleString()}</span>
                <span>₹{priceLimits.max.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="w-full md:w-48">
            <Label className="text-sm font-medium mb-2 block">{t('products.sortBy')}</Label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">{t('products.featured')}</SelectItem>
                <SelectItem value="price-low">{t('products.priceLowToHigh')}</SelectItem>
                <SelectItem value="price-high">{t('products.priceHighToLow')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
                    {t('products.filters')}
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
                    <span>{t('products.category')}</span>
                    <ChevronDown className={cn(
                      "h-4 w-4 transition-transform",
                      openSections.category && "rotate-180"
                    )} />
                  </button>
                  {openSections.category && (
                    <div className="mt-3 flex flex-col gap-2">
                      <Button
                        variant={selectedCategory === 'all' ? 'default' : 'outline'}
                        className="justify-start"
                        onClick={() => setSelectedCategory('all')}
                      >
                        {t('products.all')}
                      </Button>
                      <Button
                        variant={selectedCategory === 'Food' ? 'default' : 'outline'}
                        className="justify-start"
                        onClick={() => setSelectedCategory('Food')}
                      >
                        {t('products.food')}
                      </Button>
                      <Button
                        variant={selectedCategory === 'Decorative' ? 'default' : 'outline'}
                        className="justify-start"
                        onClick={() => setSelectedCategory('Decorative')}
                      >
                        {t('products.decorative')}
                      </Button>
                    </div>
                  )}
                </div>

                {/* Sort By */}
                <div className="border-b pb-4">
                  <button
                    onClick={() => toggleSection('sortBy')}
                    className="w-full flex items-center justify-between py-2 text-sm font-semibold uppercase text-gray-700 hover:text-gray-900"
                  >
                    <span>{t('products.sortBy')}</span>
                    <ChevronDown className={cn(
                      "h-4 w-4 transition-transform",
                      openSections.sortBy && "rotate-180"
                    )} />
                  </button>
                  {openSections.sortBy && (
                    <div className="mt-3 space-y-2">
                      <button
                        onClick={() => setSortBy('featured')}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                          sortBy === 'featured' 
                            ? "bg-primary text-primary-foreground" 
                            : "hover:bg-gray-100"
                        )}
                      >
                        {t('products.featured')}
                      </button>
                      <button
                        onClick={() => setSortBy('price-low')}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                          sortBy === 'price-low' 
                            ? "bg-primary text-primary-foreground" 
                            : "hover:bg-gray-100"
                        )}
                      >
                        {t('products.priceLowToHigh')}
                      </button>
                      <button
                        onClick={() => setSortBy('price-high')}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                          sortBy === 'price-high' 
                            ? "bg-primary text-primary-foreground" 
                            : "hover:bg-gray-100"
                        )}
                      >
                        {t('products.priceHighToLow')}
                      </button>
                    </div>
                  )}
                </div>

                {/* Price Range Filter */}
                <div className="border-b pb-4">
                  <button
                    onClick={() => toggleSection('price')}
                    className="w-full flex items-center justify-between py-2 text-sm font-semibold uppercase text-gray-700 hover:text-gray-900"
                  >
                    <span>{t('products.priceRange')}</span>
                    <ChevronDown className={cn(
                      "h-4 w-4 transition-transform",
                      openSections.price && "rotate-180"
                    )} />
                  </button>
                  {openSections.price && (
                    <div className="mt-3 space-y-4">
                      <Slider
                        value={priceRange}
                        onValueChange={(value) => setPriceRange(value as [number, number])}
                        min={priceLimits.min}
                        max={priceLimits.max}
                        step={Math.max(1, Math.floor((priceLimits.max - priceLimits.min) / 100))}
                        className="w-full"
                      />
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">₹{priceLimits.min.toLocaleString()}</span>
                        <span className="text-muted-foreground">₹{priceLimits.max.toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Apply Button */}
                <Button 
                  className="w-full"
                  onClick={() => setShowFilters(false)}
                >
                  {t('products.applyFilters')}
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Results Count - Desktop Only */}
      <div className="hidden md:block mb-4 text-sm text-muted-foreground">
        {t('products.showing')} {filteredProducts.length} {filteredProducts.length !== 1 ? t('products.products') : t('products.product')}
      </div>

      {/* Products Grid/List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t('products.noProducts')}</p>
        </div>
      ) : (
        <div
          className={cn(
            'grid gap-3 md:gap-4',
            viewMode === 'grid'
              ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
              : 'grid-cols-1'
          )}
        >
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={cn(
                'bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col',
                viewMode === 'list' && 'flex-row gap-3'
              )}
            >
              {/* Product Image */}
              <div
                className={cn(
                  'relative overflow-hidden bg-gray-100',
                  viewMode === 'grid' ? 'aspect-square rounded-t-lg' : 'w-24 sm:w-32 h-24 sm:h-32 rounded-l-lg shrink-0'
                )}
              >
                <Link to={`/product/${product.slug}`}>
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </Link>
                <button
                  onClick={() => handleToggleWishlist(product)}
                  className="absolute top-1.5 right-1.5 bg-white rounded-full p-1.5 shadow-sm hover:scale-110 transition-transform"
                >
                  <Heart
                    className={cn(
                      'h-3.5 w-3.5',
                      isInWishlist(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'
                    )}
                  />
                </button>
              </div>

              {/* Product Info */}
              <div className={cn('p-2.5 flex flex-col justify-between flex-1', viewMode === 'list' && 'flex-1 flex flex-col justify-between')}>
                <div className="flex-1">
                  <p className={cn(
                    'font-semibold text-gray-900 mb-0.5',
                    viewMode === 'grid' ? 'text-sm sm:text-base' : 'text-base sm:text-lg'
                  )}>
                    ₹{product.priceINR.toLocaleString()}
                  </p>
                  <Link to={`/product/${product.slug}`}>
                    <h3 className={cn(
                      'text-gray-600 mb-1 hover:text-primary transition-colors truncate',
                      viewMode === 'grid' ? 'text-xs sm:text-sm' : 'text-sm line-clamp-2'
                    )}>
                      {product.title}
                    </h3>
                  </Link>
                  <div className="min-h-[16px]">
                    {product.stock < 10 && product.stock > 0 && (
                      <p className="text-[10px] sm:text-xs text-orange-600">{t('products.onlyLeft', { count: product.stock })}</p>
                    )}
                    {product.stock === 0 && (
                      <p className="text-[10px] sm:text-xs text-red-600">{t('products.outOfStock')}</p>
                    )}
                  </div>
                </div>
                <Button
                  onClick={() => handleAddToCart(product)}
                  variant="outline"
                  size="sm"
                  className={cn(
                    'w-full mt-2',
                    viewMode === 'grid' ? 'text-[10px] sm:text-xs h-7 sm:h-8' : 'text-xs h-8'
                  )}
                  disabled={!product.inStock || product.stock <= 0}
                >
                  {product.stock <= 0 ? t('products.outOfStock') : t('products.addToCart')}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
