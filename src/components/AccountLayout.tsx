import { ReactNode, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { 
  Package, 
  User, 
  MapPin, 
  CreditCard, 
  Tag, 
  FileText, 
  Heart, 
  LogOut,
  PackageSearch,
  HelpCircle,
  ChevronRight,
  Star,
  Globe,
  Bell,
  Shield,
  Edit
} from 'lucide-react';
import { Button } from './ui/button';

interface AccountLayoutProps {
  children: ReactNode;
}

interface NavItem {
  label: string;
  path: string;
  icon: ReactNode;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

export const AccountLayout = ({ children }: AccountLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [displayName, setDisplayName] = useState<string>('User');

  // Fetch and listen to user profile changes in real-time
  useEffect(() => {
    if (!user) return;

    // Set up real-time listener for user profile
    const userDocRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();
        
        // Try to get full name from firstName + lastName
        if (userData.firstName && userData.lastName) {
          setDisplayName(`${userData.firstName} ${userData.lastName}`.trim());
        }
        // Fallback to username field
        else if (userData.username) {
          setDisplayName(userData.username);
        }
        // Last fallback to email username
        else {
          setDisplayName(user.email?.split('@')[0] || 'User');
        }
      } else {
        // If no document exists, fallback to email
        setDisplayName(user.email?.split('@')[0] || 'User');
      }
    }, (error) => {
      console.error('Error listening to user profile:', error);
      // Fallback on error
      setDisplayName(user.email?.split('@')[0] || 'User');
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const navGroups: NavGroup[] = [
    {
      title: 'MY ORDERS',
      items: [
        { label: 'My Orders', path: '/account/orders', icon: <Package className="h-4 w-4" /> }
      ]
    },
    {
      title: 'ACCOUNT SETTINGS',
      items: [
        { label: 'Venkat Plus', path: '/account/plus', icon: <Star className="h-4 w-4" /> },
        { label: 'Edit Profile', path: '/account/profile', icon: <User className="h-4 w-4" /> },
        { label: 'Saved Credit / Debit & Gift Cards', path: '/account/cards', icon: <CreditCard className="h-4 w-4" /> },
        { label: 'Saved Addresses', path: '/account/addresses', icon: <MapPin className="h-4 w-4" /> },
        { label: 'Select Language', path: '/account/language', icon: <Globe className="h-4 w-4" /> },
        { label: 'Notification Settings', path: '/account/notifications', icon: <Bell className="h-4 w-4" /> },
        { label: 'Privacy Center', path: '/account/privacy', icon: <Shield className="h-4 w-4" /> }
      ]
    },
    {
      title: 'MY ACTIVITY',
      items: [
        { label: 'Reviews', path: '/account/reviews', icon: <Edit className="h-4 w-4" /> },
        { label: 'Questions & Answers', path: '/account/questions', icon: <HelpCircle className="h-4 w-4" /> }
      ]
    },
    {
      title: 'MY STUFF',
      items: [
        { label: 'My Coupons', path: '/account/coupons', icon: <Tag className="h-4 w-4" /> },
        { label: 'My Product Requests', path: '/account/requests', icon: <FileText className="h-4 w-4" /> },
        { label: 'My Wishlist', path: '/wishlist', icon: <Heart className="h-4 w-4" /> }
      ]
    }
  ];

  const frequentlyVisited = [
    { label: 'Track Order', path: '/track-order', icon: <PackageSearch className="h-4 w-4" /> },
    { label: 'Help Center', path: '/services', icon: <HelpCircle className="h-4 w-4" /> }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile View - Keep Original Dashboard */}
      <div className="md:hidden">
        {children}
      </div>

      {/* Desktop View - Two Column Layout */}
      <div className="hidden md:block">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="flex gap-6 items-start h-[calc(100vh-3rem)]">
            {/* Left Sidebar */}
            <aside className="w-64 flex-shrink-0 h-full">
              <div className="bg-white rounded-lg shadow-sm sticky top-6 max-h-[calc(100vh-3rem)] overflow-y-auto scrollbar-hide">
                {/* User Profile Header */}
                <Link to="/account" className="block p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500">Hello,</p>
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {displayName}
                      </p>
                    </div>
                  </div>
                </Link>

                {/* Navigation Groups */}
                <nav className="p-2">
                  {navGroups.map((group, groupIndex) => (
                    <div key={groupIndex} className="mb-4 last:mb-0">
                      <h3 className="text-xs font-semibold text-gray-500 px-3 py-2 uppercase tracking-wide">
                        {group.title}
                      </h3>
                      <div className="space-y-0.5">
                        {group.items.map((item, itemIndex) => (
                          <Link
                            key={itemIndex}
                            to={item.path}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                              isActive(item.path)
                                ? 'bg-blue-50 text-blue-600 font-medium'
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <span className={isActive(item.path) ? 'text-blue-600' : 'text-gray-400'}>
                              {item.icon}
                            </span>
                            <span className="flex-1">{item.label}</span>
                            {isActive(item.path) && (
                              <ChevronRight className="h-4 w-4 text-blue-600" />
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Logout Button */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4 text-gray-400" />
                      <span>Logout</span>
                    </button>
                  </div>

                  {/* Frequently Visited */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h3 className="text-xs font-semibold text-gray-500 px-3 py-2 uppercase tracking-wide">
                      Frequently Visited
                    </h3>
                    <div className="space-y-0.5">
                      {frequentlyVisited.map((item, index) => (
                        <Link
                          key={index}
                          to={item.path}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <span className="text-gray-400">{item.icon}</span>
                          <span className="flex-1">{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </nav>
              </div>
            </aside>

            {/* Right Content Area */}
            <main className="flex-1 min-w-0 h-full overflow-y-auto scrollbar-hide">
              <div className="bg-white rounded-lg shadow-sm">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};
