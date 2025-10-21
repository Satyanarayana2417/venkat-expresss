import { FileText, Plus, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AccountRequests = () => {
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
          <h1 className="text-base font-medium text-gray-900">My Product Requests</h1>
        </div>
      </div>

      <div className="p-6 md:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="hidden md:block">
            <h1 className="text-2xl font-bold text-gray-900">My Product Requests</h1>
            <p className="text-sm text-gray-500 mt-1">Request products you'd like to see in our store</p>
          </div>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            New Request
          </button>
        </div>

      {/* Empty State */}
      <div className="text-center py-12">
        <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No product requests</h3>
        <p className="text-gray-500 mb-6">Request products and we'll try to add them to our catalog</p>
      </div>

      {/* Example of how requests would look when available */}
      {/* <div className="space-y-4">
        <div className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Premium Coffee Beans</h3>
              <p className="text-sm text-gray-600">Looking for organic arabica coffee beans from South India</p>
            </div>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Pending
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>Requested on: Oct 1, 2025</span>
            <span>Category: Food Items</span>
          </div>
        </div>
      </div> */}
      </div>
    </>
  );
};

export default AccountRequests;
