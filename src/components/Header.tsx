import { Link } from 'react-router-dom';
import { LocationSelector } from './LocationSelector';
import { ShoppingCart, User, Menu, Package, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useUserRole } from '@/hooks/useUserRole';
import { MiniCart } from './MiniCart';
import { useState } from 'react';

export const Header = () => {
  const { user, signOut } = useAuth();
  const { isAdmin } = useUserRole();
  const { totalItems } = useCart();
  const [showMiniCart, setShowMiniCart] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container mx-auto px-4 lg:px-6">
          {/* Top Bar with Location */}
          <div className="hidden md:flex h-10 items-center justify-end border-b">
            <LocationSelector />
          </div>
          
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 font-heading font-bold text-xl text-primary hover:text-accent transition-colors">
              <Package className="h-6 w-6" />
              <span>Venkat Express</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
              <Link to="/products" className="hover:text-accent transition-colors">
                Products
              </Link>
              <Link to="/services" className="hover:text-accent transition-colors">
                Services
              </Link>
              <Link to="/branch" className="hover:text-accent transition-colors">
                Hyderabad Branch
              </Link>
              <Link to="/about" className="hover:text-accent transition-colors">
                About
              </Link>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center space-x-2">
              {user ? (
                <>
                  {isAdmin && (
                    <Link to="/admin">
                      <Button variant="ghost" size="sm" className="hidden md:flex">
                        <Shield className="h-4 w-4 mr-2" />
                        Admin
                      </Button>
                    </Link>
                  )}
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <User className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => signOut()} className="hidden md:flex">
                    Sign Out
                  </Button>
                </>
              ) : (
                <Link to="/auth">
                  <Button variant="ghost" size="sm">Sign In</Button>
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
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent text-xs font-bold flex items-center justify-center text-accent-foreground">
                    {totalItems}
                  </span>
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <nav className="md:hidden py-4 border-t flex flex-col space-y-3">
              <Link to="/products" className="hover:text-accent transition-colors" onClick={() => setShowMobileMenu(false)}>
                Products
              </Link>
              <Link to="/services" className="hover:text-accent transition-colors" onClick={() => setShowMobileMenu(false)}>
                Services
              </Link>
              <Link to="/branch" className="hover:text-accent transition-colors" onClick={() => setShowMobileMenu(false)}>
                Hyderabad Branch
              </Link>
              <Link to="/about" className="hover:text-accent transition-colors" onClick={() => setShowMobileMenu(false)}>
                About
              </Link>
              {user && (
                <>
                  {isAdmin && (
                    <Link to="/admin" className="hover:text-accent transition-colors font-medium" onClick={() => setShowMobileMenu(false)}>
                      <Shield className="h-4 w-4 inline mr-2" />
                      Admin Panel
                    </Link>
                  )}
                  <button onClick={() => { signOut(); setShowMobileMenu(false); }} className="hover:text-accent transition-colors text-left">
                    Sign Out
                  </button>
                </>
              )}
            </nav>
          )}
        </div>
      </header>

      {/* Mini Cart Drawer */}
      <MiniCart open={showMiniCart} onClose={() => setShowMiniCart(false)} />
    </>
  );
};
