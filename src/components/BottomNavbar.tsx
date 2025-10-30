import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Grid3x3, ShoppingCart, User, Menu } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

export const BottomNavbar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { totalItems, subtotal } = useCart();
  const { t } = useTranslation();
  
  // Auto-hide on scroll state
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  // Handle scroll to show/hide navbar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show navbar when scrolling down, hide when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling up - hide navbar
        setIsVisible(false);
      } else {
        // Scrolling down or near top - show navbar
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  const handleMenuClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Dispatch custom event to toggle mobile menu
    window.dispatchEvent(new Event('toggleMobileMenu'));
  };

  const navItems = [
    {
      icon: Home,
      label: t('bottomNav.home'),
      path: '/',
    },
    {
      icon: Grid3x3,
      label: t('bottomNav.categories'),
      path: '/products',
    },
    {
      icon: ShoppingCart,
      label: t('bottomNav.cart'),
      path: '/cart',
      isCart: true,
    },
    {
      icon: User,
      label: t('bottomNav.signIn'),
      path: user ? '/dashboard' : '/welcome',
    },
    {
      icon: Menu,
      label: t('bottomNav.menu'),
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
    <nav 
      className={cn(
        "md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white border-t border-gray-200 shadow-lg transition-transform duration-300",
        isVisible ? "translate-y-0" : "translate-y-full"
      )}
    >
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
                  <span className="text-[10px] font-semibold">{t('common.currency')}{subtotal.toFixed(2)}</span>
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
