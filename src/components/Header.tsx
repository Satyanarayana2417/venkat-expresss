import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LocationSelector } from './LocationSelector';
import { ShoppingCart, User, Menu, Package, Shield, Search, Heart, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useUserRole } from '@/hooks/useUserRole';
import { MiniCart } from './MiniCart';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { loadLocationFromStorage, getDefaultLocation } from '@/lib/locationService';
import { useTranslation } from 'react-i18next';
import { SearchSuggestions } from './SearchSuggestions';
import { useSearchSuggestions } from '@/hooks/useSearchSuggestions';
import { Product } from './ProductCard';
import { MobileSearchScreen } from './MobileSearchScreen';
import { useVoiceSearch } from '@/hooks/useVoiceSearch';
import { VoiceSearchOverlay } from './VoiceSearchOverlay';

export const Header = () => {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const { isAdmin } = useUserRole();
  const { totalItems, subtotal } = useCart();
  const navigate = useNavigate();
  const [showMiniCart, setShowMiniCart] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileLocation, setMobileLocation] = useState(getDefaultLocation());
  const location = useLocation();
  
  // Search suggestions state
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  
  // Mobile search screen state
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  
  // Use search suggestions hook
  const { suggestions, loading, error, popularProducts } = useSearchSuggestions({
    searchQuery,
    enabled: showSuggestions,
    maxResults: 7
  });
  
  // Voice search hook - for mobile only
  const {
    isListening,
    transcript,
    error: voiceError,
    isSupported: isVoiceSupported,
    startListening,
    stopListening,
    resetTranscript
  } = useVoiceSearch({
    onResult: (transcribedText) => {
      // When speech recognition completes, navigate to search results
      if (transcribedText.trim()) {
        navigate(`/search?q=${encodeURIComponent(transcribedText.trim())}`);
        stopListening();
        resetTranscript();
      }
    },
    onError: (errorMessage) => {
      console.error('Voice search error:', errorMessage);
      // Error is handled by the overlay component
    },
    language: 'en-IN' // Indian English
  });
  
  // Check if we're on the track order page or cart page
  const isTrackOrderPage = location.pathname === '/track-order';
  const isCartPage = location.pathname === '/cart';

  // Load location on mount and listen for updates
  useEffect(() => {
    const savedLocation = loadLocationFromStorage();
    if (savedLocation) {
      setMobileLocation(savedLocation);
    }

    // Listen for location updates
    const handleLocationUpdate = () => {
      const updatedLocation = loadLocationFromStorage();
      if (updatedLocation) {
        setMobileLocation(updatedLocation);
      }
    };

    window.addEventListener('locationUpdated', handleLocationUpdate);
    
    return () => {
      window.removeEventListener('locationUpdated', handleLocationUpdate);
    };
  }, []);

  // Listen for custom event from bottom navbar
  useEffect(() => {
    const handleToggleMobileMenu = () => {
      setShowMobileMenu(prev => !prev);
    };
    
    window.addEventListener('toggleMobileMenu', handleToggleMobileMenu);
    
    return () => {
      window.removeEventListener('toggleMobileMenu', handleToggleMobileMenu);
    };
  }, []);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
      setIsFocused(false);
    }
  };

  const handleSearchFocus = () => {
    setIsFocused(true);
    setShowSuggestions(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (product: Product) => {
    navigate(`/product/${product.slug}`);
    setShowSuggestions(false);
    setIsFocused(false);
    setSearchQuery('');
  };

  const handleCloseSuggestions = () => {
    setShowSuggestions(false);
    setIsFocused(false);
  };

  // Handle mobile search screen open
  const handleMobileSearchOpen = () => {
    setShowMobileSearch(true);
  };

  // Handle mobile search screen close
  const handleMobileSearchClose = () => {
    setShowMobileSearch(false);
  };
  
  // Handle voice search button click
  const handleVoiceSearchClick = () => {
    if (!isVoiceSupported) {
      alert('Voice search is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }
    
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };
  
  // Handle voice search overlay close
  const handleVoiceSearchClose = () => {
    stopListening();
    resetTranscript();
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
        {/* Desktop Header - Two Tier Design */}
        <div className="hidden lg:block">
          {/* Tier 1 - Main Header Bar */}
          <div className="container mx-auto px-4 lg:px-6 py-2.5">
            <div className="flex items-center justify-between gap-4">
              {/* Logo & Location Pill - Left Section */}
              <div className="flex items-center gap-3 flex-shrink-0">
                {/* Logo */}
                <Link to="/" className="flex-shrink-0">
                  <img 
                    src="https://i.ibb.co/Lzj866ZR/IMG-20250916-103734-1.webp" 
                    alt="Logo" 
                    className="h-12 w-auto object-contain"
                  />
                </Link>

                {/* Location Pill */}
                <LocationSelector />
              </div>
              
              {/* Search Bar - Center Section */}
              <div className="flex-1 max-w-2xl mx-4" ref={searchContainerRef}>
                <form onSubmit={handleSearch} className="relative">
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      placeholder={t('header.searchPlaceholder')}
                      value={searchQuery}
                      onChange={handleSearchChange}
                      onFocus={handleSearchFocus}
                      className="w-full h-11 pl-5 pr-14 rounded-full border-2 border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all"
                    />
                    <button
                      type="submit"
                      className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black hover:bg-gray-800 flex items-center justify-center transition-colors"
                    >
                      <Search className="h-5 w-5 text-white" />
                    </button>
                  </div>
                  
                  {/* Search Suggestions Dropdown */}
                  <SearchSuggestions
                    suggestions={suggestions}
                    popularProducts={popularProducts}
                    loading={loading}
                    error={error}
                    searchQuery={searchQuery}
                    showPopular={isFocused}
                    onSuggestionClick={handleSuggestionClick}
                    onClose={handleCloseSuggestions}
                  />
                </form>
              </div>

              {/* User Actions - Right Section */}
              <div className="flex items-center gap-8 flex-shrink-0">
                {/* Track Order */}
                <Link to="/track-order" className="flex flex-col items-center gap-1 hover:text-primary transition-colors group">
                  <Package className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs">{t('header.trackOrder')}</span>
                </Link>

                {/* Wishlist */}
                <Link to="/wishlist" className="flex flex-col items-center gap-1 hover:text-primary transition-colors group">
                  <Heart className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs">{t('header.wishlist')}</span>
                </Link>

                {/* Sign In / User */}
                {!isTrackOrderPage && user ? (
                  <Link to="/dashboard" className="flex flex-col items-center gap-1 hover:text-primary transition-colors group">
                    <User className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    <span className="text-xs">{t('header.account')}</span>
                  </Link>
                ) : !isTrackOrderPage && (
                  <Link to="/welcome" className="flex flex-col items-center gap-1 hover:text-primary transition-colors group">
                    <User className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    <span className="text-xs">{t('header.signIn')}</span>
                  </Link>
                )}

                {/* Cart */}
                <button
                  onClick={() => setShowMiniCart(!showMiniCart)}
                  className="flex flex-col items-center gap-1 hover:text-primary transition-colors group relative"
                >
                  <div className="relative">
                    <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    {totalItems > 0 && (
                      <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-accent text-xs font-bold flex items-center justify-center text-white">
                        {totalItems}
                      </span>
                    )}
                  </div>
                  <span className="text-xs">{t('common.currency')}{subtotal.toFixed(2)}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Tier 2 - Secondary Navigation Bar */}
          {!isCartPage && (
            <div className="border-t border-gray-200 bg-gray-50/50">
              <div className="container mx-auto px-4 lg:px-6 py-1">
                <nav className="flex items-center justify-start gap-3 flex-wrap">
                  <Link
                    to="/products"
                    className="px-4 py-1.5 rounded-full bg-white border border-gray-200 hover:border-primary hover:shadow-md text-sm font-medium transition-all"
                  >
                    {t('header.shopProducts')}
                  </Link>
                  <Link
                    to="/services"
                    className="px-4 py-1.5 rounded-full bg-white border border-gray-200 hover:border-primary hover:shadow-md text-sm font-medium transition-all"
                  >
                    {t('header.courierServices')}
                  </Link>
                  <Link
                    to="/track-order"
                    className="px-4 py-1.5 rounded-full bg-white border border-gray-200 hover:border-primary hover:shadow-md text-sm font-medium transition-all"
                  >
                    {t('header.trackOrder')}
                  </Link>
                  <Link
                    to="/food-items"
                    className="px-4 py-1.5 rounded-full bg-white border border-gray-200 hover:border-primary hover:shadow-md text-sm font-medium transition-all"
                  >
                    {t('header.foodItems')}
                  </Link>
                  <Link
                    to="/decorative-items"
                    className="px-4 py-1.5 rounded-full bg-white border border-gray-200 hover:border-primary hover:shadow-md text-sm font-medium transition-all"
                  >
                    {t('header.decorativeItems')}
                  </Link>
                  <Link
                    to="/about"
                    className="px-4 py-1.5 rounded-full bg-white border border-gray-200 hover:border-primary hover:shadow-md text-sm font-medium transition-all"
                  >
                    {t('header.aboutUs')}
                  </Link>
                  <Link
                    to="/prohibited"
                    className="px-4 py-1.5 rounded-full bg-white border border-gray-200 hover:border-primary hover:shadow-md text-sm font-medium transition-all"
                  >
                    {t('header.prohibitedItems')}
                  </Link>
                </nav>
              </div>
            </div>
          )}
        </div>

        {/* Tablet Header - Simplified */}
        <div className="hidden md:block lg:hidden">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              {/* Logo */}
              <Link to="/" className="flex-shrink-0">
                <img 
                  src="https://i.ibb.co/Lzj866ZR/IMG-20250916-103734-1.webp" 
                  alt="Logo" 
                  className="h-10 w-auto object-contain"
                />
              </Link>

              {/* Search Bar - Compact */}
              <div className="flex-1 max-w-md" ref={searchContainerRef}>
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={handleSearchFocus}
                    className="w-full h-10 pl-4 pr-12 rounded-full border-2 border-gray-300 focus:border-primary focus:outline-none text-sm"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-primary flex items-center justify-center"
                  >
                    <Search className="h-4 w-4 text-white" />
                  </button>
                  
                  {/* Search Suggestions Dropdown */}
                  <SearchSuggestions
                    suggestions={suggestions}
                    popularProducts={popularProducts}
                    loading={loading}
                    error={error}
                    searchQuery={searchQuery}
                    showPopular={isFocused}
                    onSuggestionClick={handleSuggestionClick}
                    onClose={handleCloseSuggestions}
                  />
                </form>
              </div>

              {/* Icons Only */}
              <div className="flex items-center gap-3">
                <Link to="/dashboard">
                  <Button variant="ghost" size="icon">
                    <Package className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/wishlist">
                  <Button variant="ghost" size="icon">
                    <Heart className="h-5 w-5" />
                  </Button>
                </Link>
                {user ? (
                  <Link to="/dashboard">
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </Link>
                ) : (
                  <Link to="/welcome">
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  onClick={() => setShowMiniCart(!showMiniCart)}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent text-xs font-bold flex items-center justify-center text-white">
                      {totalItems}
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Navigation Pills - Tablet */}
          {!isCartPage && (
            <div className="border-t border-gray-200 bg-gray-50/50">
              <div className="container mx-auto px-4 py-2">
                <nav className="flex items-center justify-center gap-2 flex-wrap">
                  <Link
                    to="/products"
                    className="px-4 py-1.5 rounded-full bg-white border border-gray-200 hover:border-primary text-xs font-medium transition-all"
                  >
                    Shop Products
                  </Link>
                  <Link
                    to="/services"
                    className="px-4 py-1.5 rounded-full bg-white border border-gray-200 hover:border-primary text-xs font-medium transition-all"
                  >
                    Courier Services
                  </Link>
                  <Link
                    to="/track-order"
                    className="px-4 py-1.5 rounded-full bg-white border border-gray-200 hover:border-primary text-xs font-medium transition-all"
                  >
                    Track Order
                  </Link>
                  <Link
                    to="/about"
                    className="px-4 py-1.5 rounded-full bg-white border border-gray-200 hover:border-primary text-xs font-medium transition-all"
                  >
                    About Us
                  </Link>
                </nav>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Header - Compact Single Bar */}
        <div className="md:hidden bg-[#7B89C2]">
          {/* Top Bar - Logo, Search, Voice */}
          <div className="bg-[#7B89C2]">
            <div className="container mx-auto px-3 py-2.5">
              <div className="flex items-center gap-2">
                {/* Logo */}
                <Link to="/" className="flex-shrink-0">
                  <img 
                    src="https://i.ibb.co/Lzj866ZR/IMG-20250916-103734-1.webp" 
                    alt="Logo" 
                    className="h-9 w-auto object-contain brightness-0 invert"
                  />
                </Link>

                {/* Search Bar */}
                <div className="flex-1">
                  <div 
                    onClick={handleMobileSearchOpen}
                    className="w-full h-10 pl-4 pr-10 rounded-full border-0 bg-white text-sm flex items-center text-gray-500 cursor-pointer relative"
                  >
                    search venkat express
                    <Search className="h-4 w-4 text-gray-400 absolute right-3" />
                  </div>
                </div>

                {/* Voice Search Icon */}
                <button 
                  onClick={handleVoiceSearchClick}
                  className={`flex-shrink-0 w-10 h-10 flex items-center justify-center transition-all ${
                    isListening 
                      ? 'bg-white/20 rounded-full animate-pulse' 
                      : 'hover:bg-white/10 rounded-full'
                  }`}
                  aria-label="Voice Search"
                >
                  <svg viewBox="0 0 24 24" className="h-6 w-6 text-white" fill="currentColor">
                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                    <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Location & Pickup Row */}
          <div className="bg-[#7B89C2] border-b border-[#6B79B2]">
            <div className="container mx-auto px-3 py-2.5">
              <div className="flex items-center justify-between text-sm">
                {/* Pickup or Delivery */}
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-white" />
                  <span className="font-medium text-white">Pickup or delivery?</span>
                </div>
                
                {/* Location Display */}
                <button 
                  onClick={() => {
                    // Trigger location selector dialog
                    const event = new Event('openLocationDialog');
                    window.dispatchEvent(event);
                  }}
                  className="flex items-center gap-1 text-white"
                >
                  <span className="font-medium truncate max-w-[120px]">
                    {mobileLocation?.city || 'Select Location'}
                  </span>
                  <ChevronDown className="h-4 w-4 flex-shrink-0" />
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          {!isCartPage && (
            <div className="bg-white border-b border-gray-200">
              <div className="container mx-auto px-3 py-3">
                <nav className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
                  <Link
                    to="/products"
                    className="px-3 py-2 text-sm font-medium whitespace-nowrap border border-gray-300 rounded-full bg-white text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Shop Products
                  </Link>
                  <Link
                    to="/services"
                    className="px-3 py-2 text-sm font-medium whitespace-nowrap border border-gray-300 rounded-full bg-white text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Courier Services
                  </Link>
                  <Link
                    to="/food-items"
                    className="px-3 py-2 text-sm font-medium whitespace-nowrap border border-gray-300 rounded-full bg-white text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Food Items
                  </Link>
                  <Link
                    to="/decorative-items"
                    className="px-3 py-2 text-sm font-medium whitespace-nowrap border border-gray-300 rounded-full bg-white text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Decorative Items
                  </Link>
                  <Link
                    to="/prohibited"
                    className="px-3 py-2 text-sm font-medium whitespace-nowrap border border-gray-300 rounded-full bg-white text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Prohibited Items
                  </Link>
                </nav>
              </div>
            </div>
          )}

          {/* Mobile Menu Drawer */}
          <AnimatePresence>
            {showMobileMenu && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 z-40"
                  onClick={() => setShowMobileMenu(false)}
                />

                {/* Drawer */}
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 25 }}
                  className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-50 overflow-y-auto"
                >
                  <div className="p-6">
                    {/* Close Button */}
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-heading font-bold text-lg">Menu</h2>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        <span className="text-2xl">&times;</span>
                      </Button>
                    </div>

                    {/* Search - Hidden on mobile */}
                    <div className="mb-6 hidden">
                      <form onSubmit={handleSearch}>
                        <input
                          type="text"
                          placeholder="Search..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full h-10 px-4 rounded-full border-2 border-gray-300 focus:border-primary focus:outline-none text-sm"
                        />
                      </form>
                    </div>

                    {/* User Section - Hidden on mobile */}
                    {!isTrackOrderPage && user ? (
                      <div className="mb-6 p-4 bg-gray-50 rounded-lg hidden">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                            <User className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">Welcome back!</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Link
                            to="/dashboard"
                            className="block text-sm hover:text-primary transition-colors"
                            onClick={() => setShowMobileMenu(false)}
                          >
                            Dashboard
                          </Link>
                          <Link
                            to="/history"
                            className="block text-sm hover:text-primary transition-colors"
                            onClick={() => setShowMobileMenu(false)}
                          >
                            Order History
                          </Link>
                          {isAdmin && (
                            <Link
                              to="/admin"
                              className="block text-sm hover:text-primary transition-colors"
                              onClick={() => setShowMobileMenu(false)}
                            >
                              <Shield className="h-4 w-4 inline mr-2" />
                              Admin Panel
                            </Link>
                          )}
                        </div>
                      </div>
                    ) : !isTrackOrderPage && (
                      <Link
                        to="/welcome"
                        onClick={() => setShowMobileMenu(false)}
                        className="block mb-6 p-4 bg-primary text-white rounded-lg text-center font-medium hover:bg-primary-hover transition-colors"
                      >
                        Sign In / Sign Up
                      </Link>
                    )}

                    {/* Navigation Links */}
                    <nav className="space-y-1">
                      <Link
                        to="/products"
                        className="block px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        Shop Products
                      </Link>
                      <Link
                        to="/services"
                        className="block px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        Courier Services
                      </Link>
                      <Link
                        to="/track-order"
                        className="hidden"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        Track Order
                      </Link>
                      <Link
                        to="/food-items"
                        className="block px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        Food Items
                      </Link>
                      <Link
                        to="/decorative-items"
                        className="block px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        Decorative Items
                      </Link>
                      <Link
                        to="/about"
                        className="block px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        About Us
                      </Link>
                      <Link
                        to="/prohibited"
                        className="block px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        Prohibited Items
                      </Link>
                      <Link
                        to="/wishlist"
                        className="block px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        <Heart className="h-4 w-4 inline mr-2" />
                        Wishlist
                      </Link>
                    </nav>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Mini Cart Drawer */}
      <MiniCart open={showMiniCart} onClose={() => setShowMiniCart(false)} />
      
      {/* Mobile Search Screen */}
      <MobileSearchScreen 
        isOpen={showMobileSearch} 
        onClose={handleMobileSearchClose} 
      />
      
      {/* Voice Search Overlay - Mobile Only */}
      <VoiceSearchOverlay
        isListening={isListening}
        transcript={transcript}
        error={voiceError}
        onClose={handleVoiceSearchClose}
      />
      
      {/* Hidden Location Selector for Mobile (triggered by event) */}
      <div className="md:hidden">
        <LocationSelector isMobileOnly={true} />
      </div>
    </>
  );
};
