import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle } from 'lucide-react';

const CancelOrderPending = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Icon */}
        <div className="mb-6 relative">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
            <Clock className="h-10 w-10 text-yellow-600" />
          </div>
          <div className="absolute -bottom-1 -right-1 left-0 mx-auto w-fit">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center border-4 border-white">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Request Submitted
        </h1>

        {/* Message */}
        <p className="text-lg text-gray-700 mb-2">
          Your cancellation request is in pending.
        </p>
        <p className="text-sm text-gray-600 mb-8">
          Our team will review your request shortly and update the order status. You will be notified once a decision is made.
        </p>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={() => navigate('/account/orders')}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            View My Orders
          </Button>
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="w-full"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CancelOrderPending;
