import { HelpCircle, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AccountQuestions = () => {
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
          <h1 className="text-base font-medium text-gray-900">Questions & Answers</h1>
        </div>
      </div>

      <div className="p-6 md:p-8">
        <div className="mb-6 hidden md:block">
          <h1 className="text-2xl font-bold text-gray-900">Questions & Answers</h1>
          <p className="text-sm text-gray-500 mt-1">Your questions and answers about products</p>
        </div>

      {/* Empty State */}
      <div className="text-center py-12">
        <HelpCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No questions yet</h3>
        <p className="text-gray-500 mb-6">Ask questions about products you're interested in</p>
        <button
          onClick={() => window.location.href = '/products'}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Browse Products
        </button>
      </div>

      {/* Example of how Q&A would look */}
      {/* <div className="space-y-4">
        <div className="border border-gray-200 rounded-lg p-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <MessageSquare className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="mb-3">
                <h4 className="font-medium text-gray-900 mb-1">Your Question:</h4>
                <p className="text-gray-700">Is this product available in different colors?</p>
                <p className="text-sm text-gray-500 mt-1">Asked on Oct 5, 2025</p>
              </div>
              <div className="pl-4 border-l-2 border-green-200 bg-green-50 p-3 rounded">
                <h4 className="font-medium text-green-900 mb-1">Seller's Answer:</h4>
                <p className="text-green-800">Yes, this product is available in 5 different colors. Please check the product page for all available options.</p>
                <p className="text-sm text-green-600 mt-1">Answered on Oct 6, 2025</p>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      </div>
    </>
  );
};

export default AccountQuestions;
