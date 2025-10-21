import { CreditCard, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AccountCards = () => {
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
          <h1 className="text-base font-medium text-gray-900">Saved Cards</h1>
        </div>
      </div>

      <div className="p-6 md:p-8">
        <div className="mb-6 hidden md:block">
          <h1 className="text-2xl font-bold text-gray-900">Saved Cards</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your saved payment cards</p>
        </div>

      {/* Empty State */}
      <div className="text-center py-12">
        <CreditCard className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No saved cards</h3>
        <p className="text-gray-500 mb-6">Add a payment card to checkout faster</p>
        <button
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Add Card
        </button>
      </div>

      {/* Example of how cards would look when added */}
      {/* <div className="space-y-4">
        <div className="border border-gray-200 rounded-lg p-5 flex items-center justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Visa •••• 4242</p>
              <p className="text-sm text-gray-500">Expires 12/2025</p>
            </div>
          </div>
          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div> */}
      </div>
    </>
  );
};

export default AccountCards;
