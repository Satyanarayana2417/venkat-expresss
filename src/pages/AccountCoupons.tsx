import { Tag, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AccountCoupons = () => {
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
          <h1 className="text-base font-medium text-gray-900">My Coupons</h1>
        </div>
      </div>

      <div className="p-6 md:p-8">
        <div className="mb-6 hidden md:block">
          <h1 className="text-2xl font-bold text-gray-900">My Coupons</h1>
          <p className="text-sm text-gray-500 mt-1">View and manage your available coupons</p>
        </div>

      {/* Empty State */}
      <div className="text-center py-12">
        <Gift className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No coupons available</h3>
        <p className="text-gray-500 mb-6">Coupons and offers will appear here when available</p>
        <button
          onClick={() => window.location.href = '/products'}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Explore Products
        </button>
      </div>

      {/* Example of how coupons would look when available */}
      {/* <div className="grid gap-4">
        <div className="border-2 border-dashed border-blue-300 rounded-lg p-5 bg-blue-50">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Tag className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">SAVE20</h3>
              <p className="text-sm text-gray-600 mb-2">Get 20% off on orders above ₹1000</p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>Valid till: Dec 31, 2025</span>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded">Active</span>
              </div>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
              Apply
            </button>
          </div>
        </div>
      </div> */}
      </div>
    </>
  );
};

export default AccountCoupons;
