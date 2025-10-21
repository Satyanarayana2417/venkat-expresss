import { Star, Gift, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AccountPlus = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* Mobile Header with Back Button */}
      <div className="md:hidden bg-white sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3 px-4 py-3">
          <button onClick={() => navigate('/account')} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-base font-medium text-gray-900">Venkat Plus</h1>
        </div>
      </div>

      <div className="p-6 md:p-8">
        <div className="mb-6 hidden md:block">
          <h1 className="text-2xl font-bold text-gray-900">Venkat Plus</h1>
          <p className="text-sm text-gray-500 mt-1">Exclusive benefits and rewards program</p>
        </div>

      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-8 text-white mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Crown className="h-10 w-10" />
          <div>
            <h2 className="text-2xl font-bold">Plus Silver</h2>
            <p className="text-blue-100">Your current membership</p>
          </div>
        </div>
        <p className="text-blue-50 mb-4">
          Enjoy exclusive benefits, early access to sales, and special rewards
        </p>
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-white/10 rounded-lg p-4">
            <Gift className="h-6 w-6 mb-2" />
            <p className="text-sm">Free Shipping</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <Star className="h-6 w-6 mb-2" />
            <p className="text-sm">Extra Rewards</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Benefits</h3>
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Star className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Priority Support</h4>
              <p className="text-sm text-gray-600">Get faster response times from our customer service team</p>
            </div>
          </div>
        </div>
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Gift className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Exclusive Offers</h4>
              <p className="text-sm text-gray-600">Access special deals and promotions only for Plus members</p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default AccountPlus;
