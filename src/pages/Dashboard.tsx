import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Package, User, ShoppingBag, LogOut, Loader2, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface UserData {
  username: string;
  email: string;
  role: string;
  createdAt: any;
}

const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, signOut, loading: authLoading } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }

    if (user) {
      const fetchUserData = async () => {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data() as UserData);
          } else {
            console.error('User document not found in Firestore');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchUserData();
    }
  }, [user, authLoading, navigate]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">{t('dashboard.loadingDashboard')}</p>
        </div>
      </div>
    );
  }

  if (!user || !userData) {
    return null;
  }

  return (
    <>
      {/* Mobile Header with Back Button */}
      <div className="md:hidden bg-white sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link to="/">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-base font-medium text-gray-900">{t('dashboard.profile')}</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-0 md:py-6">
        <div className="container mx-auto px-0 md:px-4 max-w-4xl">
          {/* Profile Header - Unified for Mobile and Desktop */}
          <div className="px-4 pt-4 pb-6">
            <div className="bg-blue-50 rounded-lg p-4 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 mb-1.5">
                    {userData.username}
                  </h2>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    {t('dashboard.explorePlusSilver').split('✨')[0]} <span className="font-semibold text-gray-700">✨{t('dashboard.explorePlusSilver').split('✨')[1]}</span> <span className="text-gray-400">→</span>
                  </p>
                </div>
                <div className="flex items-center gap-1.5 bg-orange-50 rounded-full px-3 py-1.5 border border-orange-200">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-white">₹</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">0</span>
                </div>
              </div>
            </div>
          </div>

          {/* Menu Cards - Mobile Only (hidden on desktop since they're in sidebar) */}
          <div className="px-4 pb-6 md:hidden">
            <div className="grid grid-cols-2 gap-3">
              {/* Orders Card */}
              <button 
                onClick={() => navigate('/account/orders')}
                className="bg-white border border-gray-300 p-3 hover:shadow-sm transition-shadow text-left flex items-center gap-3 rounded-lg"
              >
                <Package className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <h3 className="text-sm font-semibold text-gray-900">{t('dashboard.orders')}</h3>
              </button>

              {/* Wishlist Card */}
              <button 
                onClick={() => navigate('/wishlist')}
                className="bg-white border border-gray-300 p-3 hover:shadow-sm transition-shadow text-left flex items-center gap-3 rounded-lg"
              >
                <ShoppingBag className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <h3 className="text-sm font-semibold text-gray-900">{t('dashboard.wishlist')}</h3>
              </button>

              {/* Coupons Card */}
              <button 
                onClick={() => navigate('/products')}
                className="bg-white border border-gray-300 p-3 hover:shadow-sm transition-shadow text-left flex items-center gap-3 rounded-lg"
              >
                <svg className="h-5 w-5 text-blue-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
                <h3 className="text-sm font-semibold text-gray-900">{t('dashboard.coupons')}</h3>
              </button>

              {/* Help Center Card */}
              <button 
                onClick={() => navigate('/services')}
                className="bg-white border border-gray-300 p-3 hover:shadow-sm transition-shadow text-left flex items-center gap-3 rounded-lg"
              >
                <svg className="h-5 w-5 text-blue-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <h3 className="text-sm font-semibold text-gray-900">{t('dashboard.helpCenter')}</h3>
              </button>
            </div>
          </div>

          {/* Promotional Banner - Unified for Mobile and Desktop */}
          <div className="px-4 pb-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 overflow-hidden shadow-md rounded-lg">
              <img 
                src="https://i.ibb.co/SDsVbkQ9/IMG-20251005-001924.webp" 
                alt="Promotional Banner" 
                className="w-full h-56 object-cover"
              />
            </div>
          </div>

          {/* Account Settings Section - Mobile Only */}
          <div className="px-4 pb-6 md:hidden">
            <h3 className="text-base font-bold text-gray-900 mb-3">{t('dashboard.accountSettings')}</h3>
            <div className="bg-white rounded-lg divide-y divide-gray-100 shadow-sm">
              {/* Venkat Plus */}
              <Link to="/account/plus" className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <svg className="h-5 w-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-900">{t('dashboard.venkatPlus')}</span>
                </div>
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>

              {/* Edit Profile */}
              <Link to="/account/profile" className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-900">{t('dashboard.editProfile')}</span>
                </div>
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>

              {/* Saved Credit / Debit & Gift Cards */}
              <Link to="/account/cards" className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <svg className="h-5 w-5 text-blue-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-900">{t('dashboard.savedCards')}</span>
                </div>
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>

              {/* Saved Addresses */}
              <Link to="/account/addresses" className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <svg className="h-5 w-5 text-blue-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-900">{t('dashboard.savedAddresses')}</span>
                </div>
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>

              {/* Select Language */}
              <Link to="/account/language" className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <svg className="h-5 w-5 text-blue-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                  <span className="text-sm font-medium text-gray-900">{t('dashboard.selectLanguage')}</span>
                </div>
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>

              {/* Notification Settings */}
              <Link to="/account/notifications" className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <svg className="h-5 w-5 text-blue-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="text-sm font-medium text-gray-900">{t('dashboard.notificationSettings')}</span>
                </div>
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>

              {/* Privacy Center */}
              <Link to="/account/privacy" className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <svg className="h-5 w-5 text-blue-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-900">{t('dashboard.privacyCenter')}</span>
                </div>
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* My Activity Section - Mobile Only */}
          <div className="px-4 pb-6 md:hidden">
            <h3 className="text-base font-bold text-gray-900 mb-3">{t('dashboard.myActivity')}</h3>
            <div className="bg-white rounded-lg divide-y divide-gray-100 shadow-sm">
              {/* Reviews */}
              <Link to="/account/reviews" className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <svg className="h-5 w-5 text-blue-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-900">{t('dashboard.reviews')}</span>
                </div>
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>

              {/* Questions & Answers */}
              <Link to="/account/questions" className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <svg className="h-5 w-5 text-blue-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-900">{t('dashboard.questionsAndAnswers')}</span>
                </div>
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Sign Out Button - Mobile Only */}
          <div className="px-4 pb-6 md:hidden">
            <Button 
              onClick={handleSignOut} 
              variant="outline" 
              className="w-full mt-2 gap-2 h-12"
            >
              <LogOut className="h-4 w-4" />
              {t('dashboard.signOut')}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
