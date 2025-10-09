import { Link, useLocation } from 'react-router-dom';
import { Home, Grid3x3, ShoppingCart, User, Menu } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';

export const BottomNavbar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { totalItems, subtotal } = useCart();

  const handleMenuClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Dispatch custom event to toggle mobile menu
    window.dispatchEvent(new Event('toggleMobileMenu'));
  };

  const navItems = [
    {
      icon: Home,
      label: 'Home',
      path: '/',
    },
    {
      icon: Grid3x3,
      label: 'Categories',
      path: '/products',
    },
    {
      icon: ShoppingCart,
      label: 'Cart',
      path: '/cart',
      isCart: true,
    },
    {
      icon: User,
      label: 'Sign In',
      path: user ? '/dashboard' : '/auth',
    },
    {
      icon: Menu,
      label: 'Menu',
      path: '/menu',
      isMenu: true,
    },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          // Handle Menu button specially (trigger event instead of navigation)
          if (item.isMenu) {
            return (
              <button
                key={item.path}
                onClick={handleMenuClick}
                className={cn(
                  "flex flex-col items-center justify-center flex-1 h-full transition-colors gap-0.5",
                  "text-gray-600"
                )}
              >
                <Icon className="h-6 w-6" />
                <span className="text-xs mt-1 font-medium">{item.label}</span>
              </button>
            );
          }
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full transition-colors gap-0.5",
                active ? "text-primary" : "text-gray-600"
              )}
            >
              {item.isCart ? (
                <>
                  <div className="relative">
                    <Icon className="h-6 w-6" />
                    {totalItems > 0 && (
                      <span className="absolute -top-1 -right-2 h-5 w-5 rounded-full bg-[#FF6B00] text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                        {totalItems}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-semibold">₹{subtotal.toFixed(2)}</span>
                </>
              ) : (
                <>
                  <Icon className="h-6 w-6" />
                  <span className="text-xs mt-1 font-medium">{item.label}</span>
                </>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
