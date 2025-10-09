import { Link } from 'react-router-dom';
import { LocationSelector } from './LocationSelector';
import { ShoppingCart, User, Menu, Package, Shield, Search, Heart, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useUserRole } from '@/hooks/useUserRole';
import { MiniCart } from './MiniCart';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { loadLocationFromStorage, getDefaultLocation } from '@/lib/locationService';

export const Header = () => {
  const { user, signOut } = useAuth();
  const { isAdmin } = useUserRole();
  const { totalItems, subtotal } = useCart();
  const [showMiniCart, setShowMiniCart] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileLocation, setMobileLocation] = useState(getDefaultLocation());

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Searching for:', searchQuery);
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
              <div className="flex-1 max-w-2xl mx-4">
                <form onSubmit={handleSearch} className="relative">
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      placeholder="Search for Indian food, spices, decorative items.."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-11 pl-5 pr-14 rounded-full border-2 border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all"
                    />
                    <button
                      type="submit"
                      className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black hover:bg-gray-800 flex items-center justify-center transition-colors"
                    >
                      <Search className="h-5 w-5 text-white" />
                    </button>
                  </div>
                </form>
              </div>

              {/* User Actions - Right Section */}
              <div className="flex items-center gap-8 flex-shrink-0">
                {/* Track Order */}
                <Link to="/dashboard" className="flex flex-col items-center gap-1 hover:text-primary transition-colors group">
                  <Package className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs">Track Order</span>
                </Link>

                {/* Wishlist */}
                <Link to="/wishlist" className="flex flex-col items-center gap-1 hover:text-primary transition-colors group">
                  <Heart className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs">Wishlist</span>
                </Link>

                {/* Sign In / User */}
                {user ? (
                  <div className="relative group">
                    <button className="flex flex-col items-center gap-1 hover:text-primary transition-colors">
                      <User className="h-5 w-5 group-hover:scale-110 transition-transform" />
                      <span className="text-xs">Account</span>
                    </button>
                    {/* Dropdown Menu */}
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                      <div className="py-2">
                        <Link to="/dashboard" className="block px-4 py-2 text-sm hover:bg-gray-50 transition-colors">
                          Dashboard
                        </Link>
                        <Link to="/history" className="block px-4 py-2 text-sm hover:bg-gray-50 transition-colors">
                          Order History
                        </Link>
                        {isAdmin && (
                          <Link to="/admin" className="block px-4 py-2 text-sm hover:bg-gray-50 transition-colors">
                            <Shield className="h-4 w-4 inline mr-2" />
                            Admin Panel
                          </Link>
                        )}
                        <hr className="my-2" />
                        <button
                          onClick={signOut}
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors text-red-600"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link to="/auth" className="flex flex-col items-center gap-1 hover:text-primary transition-colors group">
                    <User className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    <span className="text-xs">Sign In</span>
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
                  <span className="text-xs">₹{subtotal.toFixed(2)}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Tier 2 - Secondary Navigation Bar */}
          <div className="border-t border-gray-200 bg-gray-50/50">
            <div className="container mx-auto px-4 lg:px-6 py-1">
              <nav className="flex items-center justify-start gap-3 flex-wrap">
                <Link
                  to="/products"
                  className="px-4 py-1.5 rounded-full bg-white border border-gray-200 hover:border-primary hover:shadow-md text-sm font-medium transition-all"
                >
                  Shop Products
                </Link>
                <Link
                  to="/services"
                  className="px-4 py-1.5 rounded-full bg-white border border-gray-200 hover:border-primary hover:shadow-md text-sm font-medium transition-all"
                >
                  Courier Services
                </Link>
                <Link
                  to="/dashboard"
                  className="px-4 py-1.5 rounded-full bg-white border border-gray-200 hover:border-primary hover:shadow-md text-sm font-medium transition-all"
                >
                  Track Order
                </Link>
                <Link
                  to="/food-items"
                  className="px-4 py-1.5 rounded-full bg-white border border-gray-200 hover:border-primary hover:shadow-md text-sm font-medium transition-all"
                >
                  Food Items
                </Link>
                <Link
                  to="/decorative-items"
                  className="px-4 py-1.5 rounded-full bg-white border border-gray-200 hover:border-primary hover:shadow-md text-sm font-medium transition-all"
                >
                  Decorative Items
                </Link>
                <Link
                  to="/about"
                  className="px-4 py-1.5 rounded-full bg-white border border-gray-200 hover:border-primary hover:shadow-md text-sm font-medium transition-all"
                >
                  About Us
                </Link>
                <Link
                  to="/prohibited"
                  className="px-4 py-1.5 rounded-full bg-white border border-gray-200 hover:border-primary hover:shadow-md text-sm font-medium transition-all"
                >
                  Prohibited Items
                </Link>
              </nav>
            </div>
          </div>
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
              <div className="flex-1 max-w-md">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-10 pl-4 pr-12 rounded-full border-2 border-gray-300 focus:border-primary focus:outline-none text-sm"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-primary flex items-center justify-center"
                  >
                    <Search className="h-4 w-4 text-white" />
                  </button>
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
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                ) : (
                  <Link to="/auth">
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
                  to="/dashboard"
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
        </div>

        {/* Mobile Header - Compact Single Bar */}
        <div className="md:hidden bg-[#1976D2]">
          {/* Top Bar - Logo, Search, Voice */}
          <div className="bg-[#1976D2]">
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
                  <form onSubmit={handleSearch} className="relative">
                    <input
                      type="text"
                      placeholder="search venkat expres"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-10 pl-4 pr-10 rounded-full border-0 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center"
                    >
                      <Search className="h-4 w-4 text-gray-500" />
                    </button>
                  </form>
                </div>

                {/* Voice Search Icon */}
                <button className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="h-6 w-6 text-white" fill="currentColor">
                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                    <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Location & Pickup Row */}
          <div className="bg-[#1976D2] border-b border-[#1565C0]">
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
              </nav>
            </div>
          </div>

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
                    {user ? (
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
                    ) : (
                      <Link
                        to="/auth"
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
                        to="/dashboard"
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

                    {/* Sign Out */}
                    {user && (
                      <button
                        onClick={() => {
                          signOut();
                          setShowMobileMenu(false);
                        }}
                        className="w-full mt-6 px-4 py-3 rounded-lg bg-red-50 text-red-600 font-medium hover:bg-red-100 transition-colors"
                      >
                        Sign Out
                      </button>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Mini Cart Drawer */}
      <MiniCart open={showMiniCart} onClose={() => setShowMiniCart(false)} />
      
      {/* Hidden Location Selector for Mobile (triggered by event) */}
      <div className="md:hidden">
        <LocationSelector />
      </div>
    </>
  );
};
