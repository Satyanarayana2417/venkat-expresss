import { Star, ThumbsUp, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AccountReviews = () => {
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
          <h1 className="text-base font-medium text-gray-900">Reviews</h1>
        </div>
      </div>

      <div className="p-6 md:p-8">
        <div className="mb-6 hidden md:block">
          <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your product reviews</p>
        </div>

      {/* Empty State */}
      <div className="text-center py-12">
        <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
        <p className="text-gray-500 mb-6">Share your experience with products you've purchased</p>
        <button
          onClick={() => window.location.href = '/account/orders'}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          View Your Orders
        </button>
      </div>

      {/* Example of how reviews would look */}
      {/* <div className="space-y-4">
        <div className="border border-gray-200 rounded-lg p-5">
          <div className="flex items-start gap-4">
            <img
              src="/product-image.jpg"
              alt="Product"
              className="w-20 h-20 object-cover rounded"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">Product Name</h3>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm text-gray-500">5.0</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Great product! Highly recommend it. The quality is excellent and delivery was fast.
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>Reviewed on Oct 1, 2025</span>
                <button className="text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  <ThumbsUp className="h-4 w-4" />
                  Helpful (12)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      </div>
    </>
  );
};

export default AccountReviews;
