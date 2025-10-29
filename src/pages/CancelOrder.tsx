import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { ChevronLeft, Loader2, AlertCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';

interface OrderItem {
  name: string;
  image?: string;
  price: number;
  quantity: number;
}

interface OrderData {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  status: string;
  userId: string;
}

const cancellationReasons = [
  "I'm worried about the ratings/reviews",
  "I want to change the payment option",
  "Price of the product has now decreased",
  "My reasons are not listed here",
  "I was hoping for a shorter delivery time",
  "I want to change the contact details",
  "I want to change the delivery address",
  "I want to change the delivery date",
];

const CancelOrder = () => {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();
  const { user, loading: authLoading } = useAuth();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (authLoading) return;

      if (!user) {
        toast.error('Please log in to cancel your order');
        navigate('/login');
        return;
      }

      if (!orderId) {
        toast.error('Invalid order ID');
        navigate('/account/orders');
        return;
      }

      try {
        setLoading(true);
        const orderRef = doc(db, 'orders', orderId);
        const orderSnap = await getDoc(orderRef);

        if (!orderSnap.exists()) {
          toast.error('Order not found');
          navigate('/account/orders');
          return;
        }

        const orderData = orderSnap.data();

        // Verify user owns this order
        if (orderData.userId !== user.uid) {
          toast.error('You do not have permission to cancel this order');
          navigate('/account/orders');
          return;
        }

        // Get the status from either 'status' or 'orderStatus' field
        const currentStatus = orderData.status || orderData.orderStatus || '';
        console.log('Order status:', currentStatus); // Debug log
        
        // Check if order can be cancelled
        const cancellableStatuses = [
          'pending', 
          'processing', 
          'Payment Verification Pending',
          'Pending Verification'
        ];
        
        if (!cancellableStatuses.includes(currentStatus)) {
          toast.error(`This order cannot be cancelled at this stage (Current status: ${currentStatus})`);
          navigate('/account/orders');
          return;
        }

        setOrder({
          id: orderSnap.id,
          orderNumber: orderData.orderNumber || orderSnap.id.slice(0, 8).toUpperCase(),
          items: orderData.items || [],
          status: currentStatus, // Use the currentStatus we already extracted
          userId: orderData.userId,
        });
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to load order details');
        toast.error('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, user, authLoading, navigate]);

  const handleSubmit = async () => {
    if (!selectedReason) {
      toast.error('Please select a reason for cancellation');
      return;
    }

    if (!orderId || !order) {
      toast.error('Invalid order');
      return;
    }

    try {
      setSubmitting(true);

      // Update order to cancellation-pending
      // Update both 'status' and 'orderStatus' fields to ensure compatibility
      const orderRef = doc(db, 'orders', orderId);
      
      const updateData: any = {
        cancellationReason: selectedReason,
        cancellationRequestedAt: Timestamp.now(),
      };
      
      // Only add previousStatus if it exists
      if (order.status) {
        updateData.previousStatus = order.status;
      }
      
      // Update both status fields to be safe
      updateData.status = 'cancellation-pending';
      updateData.orderStatus = 'cancellation-pending';
      
      await updateDoc(orderRef, updateData);

      toast.success('Cancellation request submitted');
      
      // Navigate to confirmation page
      navigate('/order/cancel/pending');
    } catch (err) {
      console.error('Error submitting cancellation request:', err);
      toast.error('Failed to submit cancellation request. Please try again.');
      setSubmitting(false);
    }
  };

  // Show loading state
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-4">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Order</h2>
          <p className="text-gray-600 mb-6">{error || 'Unable to load order details'}</p>
          <Button onClick={() => navigate('/account/orders')}>
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="md:hidden bg-white sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3 px-4 py-3">
          <button 
            onClick={() => navigate('/account/orders')} 
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="h-6 w-6 text-gray-700" />
          </button>
          <h1 className="text-base font-medium text-gray-900">Cancel Order</h1>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link 
            to="/account/orders"
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 mb-2"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Orders
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Cancel Order</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Order Details Section */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Order Details</h2>
            <p className="text-sm text-gray-600 mb-4">
              Order Number: <span className="font-mono font-semibold">{order.orderNumber}</span>
            </p>

            {/* Display first item (or all items if you prefer) */}
            {order.items.slice(0, 1).map((item, index) => (
              <div key={index} className="flex gap-4 items-start">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-1">{item.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">Quantity: {item.quantity}</p>
                  <p className="text-lg font-bold text-gray-900">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            ))}

            {order.items.length > 1 && (
              <p className="text-sm text-gray-600 mt-3">
                + {order.items.length - 1} more item{order.items.length - 1 > 1 ? 's' : ''}
              </p>
            )}
          </div>

          {/* Cancellation Reason Form */}
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Reason For Cancellation
            </h2>

            <RadioGroup value={selectedReason} onValueChange={setSelectedReason}>
              <div className="space-y-3">
                {cancellationReasons.map((reason, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/30 transition-colors cursor-pointer"
                  >
                    <RadioGroupItem value={reason} id={`reason-${index}`} className="mt-0.5" />
                    <Label
                      htmlFor={`reason-${index}`}
                      className="flex-1 text-sm text-gray-700 cursor-pointer font-normal"
                    >
                      {reason}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>

            {/* Submit Button */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <Button
                onClick={handleSubmit}
                disabled={!selectedReason || submitting}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 text-base"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Submitting Request...
                  </>
                ) : (
                  'Continue'
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelOrder;
