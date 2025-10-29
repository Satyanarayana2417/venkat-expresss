import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, onSnapshot, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ArrowLeft, 
  Loader2, 
  XCircle, 
  ChevronRight,
  Clock,
  MapPin,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Share2,
  MessageCircle,
  Home,
  Info
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface OrderItem {
  name: string;
  image?: string;
  price?: number;
  color?: string;
  quantity?: number;
}

interface TrackingEvent {
  status: string;
  location: string;
  timestamp: any;
  description?: string;
}

interface OrderDetails {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'out-for-delivery' | 'delivered' | 'cancelled' | 'returned' | 'cancellation-pending';
  createdAt: any;
  trackingHistory: TrackingEvent[];
  deliveryAddress?: any;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
}

const AccountOrderDetails = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllUpdates, setShowAllUpdates] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      toast.error('Please log in to view order details');
      navigate('/login');
      return;
    }

    if (!orderId) {
      toast.error('Invalid order ID');
      navigate('/account/orders');
      return;
    }

    const orderRef = doc(db, 'orders', orderId);
    
    const unsubscribe = onSnapshot(
      orderRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data() as DocumentData;
          
          if (data.userId !== user.uid) {
            setError('You do not have permission to view this order');
            setLoading(false);
            toast.error('Order not found or unauthorized');
            setTimeout(() => navigate('/account/orders'), 2000);
            return;
          }

          const orderData: OrderDetails = {
            id: docSnapshot.id,
            orderNumber: data.orderNumber || docSnapshot.id,
            items: data.items || [],
            totalAmount: data.totalAmount || data.total || 0,
            status: data.status || 'pending',
            createdAt: data.createdAt,
            trackingHistory: data.trackingHistory || [],
            deliveryAddress: data.deliveryAddress,
            customerName: data.customerName || data.customer,
            customerEmail: data.customerEmail || data.email,
            customerPhone: data.customerPhone || data.phone,
          };

          console.log('Order Data:', orderData);
          console.log('Delivery Address:', orderData.deliveryAddress);

          setOrder(orderData);
          setError(null);
        } else {
          setError('Order not found');
          toast.error('Order not found');
          setTimeout(() => navigate('/account/orders'), 2000);
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching order:', err);
        setError('Failed to load order details');
        toast.error('Failed to load order details');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [orderId, user, authLoading, navigate]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'text-green-700';
      case 'out-for-delivery':
        return 'text-blue-700';
      case 'shipped':
      case 'processing':
        return 'text-orange-700';
      case 'cancelled':
        return 'text-red-700';
      default:
        return 'text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    return status
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatTimestamp = (timestamp: any) => {
    try {
      if (!timestamp) return '';
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return format(date, 'MMM dd, yyyy • hh:mm a');
    } catch (error) {
      return '';
    }
  };

  const formatDate = (timestamp: any) => {
    try {
      if (!timestamp) return '';
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return format(date, 'MMM dd');
    } catch (error) {
      return '';
    }
  };

  const getSortedHistory = () => {
    if (!order?.trackingHistory) return [];
    
    return [...order.trackingHistory].sort((a, b) => {
      const timeA = a.timestamp?.toDate?.() || new Date(0);
      const timeB = b.timestamp?.toDate?.() || new Date(0);
      return timeB.getTime() - timeA.getTime();
    });
  };

  const getStageIcon = (stageName: string, isCompleted: boolean, isCurrent: boolean) => {
    if (isCompleted) {
      return <CheckCircle className="h-4 w-4 md:h-6 md:w-6 text-white" />;
    }
    return <div className="h-2 w-2 md:h-3 md:w-3 rounded-full bg-white" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'Unable to load order details'}</p>
          <button
            onClick={() => navigate('/account/orders')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const sortedHistory = getSortedHistory();
  const latestUpdate = sortedHistory[0];

  // Define tracking stages
  const trackingStages = [
    { id: 'pending', label: 'Order Placed', value: 0 },
    { id: 'processing', label: 'Processing', value: 1 },
    { id: 'shipped', label: 'Shipped', value: 2 },
    { id: 'out-for-delivery', label: 'Out for Delivery', value: 3 },
    { id: 'delivered', label: 'Delivered', value: 4 },
  ];

  const currentStageValue = trackingStages.find(s => s.id === order.status)?.value || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-3 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/account/orders')}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </button>
          <h1 className="text-base font-medium text-gray-900">Order Details</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 py-3 space-y-3 md:p-4 md:space-y-4">
        {/* Order Tracking Info Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-3">
          <div className="text-sm text-gray-600">
            Order can be tracked by {order.orderNumber}.
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 gap-3 md:gap-4">
          {/* Left Column - Tracking & Product */}
          <div className="space-y-3 md:space-y-4">
            {/* Product Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-3 md:p-4">
              <div className="flex gap-3 mb-3">
                {order.items[0]?.image && (
                  <img
                    src={order.items[0].image}
                    alt={order.items[0].name}
                    className="w-16 h-16 md:w-20 md:h-20 object-cover rounded border border-gray-200 flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm md:text-base text-gray-900 mb-1 line-clamp-2">
                    {order.items[0]?.name || 'Product'}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-600">
                    {order.items[0]?.color && `Color: ${order.items[0].color}`}
                  </p>
                  <p className="text-sm md:text-base font-medium text-gray-900 mt-1">
                    ₹{order.items[0]?.price?.toLocaleString('en-IN') || 0}
                  </p>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between mb-4 overflow-x-auto">
                  {trackingStages.map((stage, index) => (
                    <div key={stage.id} className="flex items-center flex-shrink-0">
                      <div className="flex flex-col items-center">
                        <div
                          className={cn(
                            'h-8 w-8 md:h-10 md:w-10 rounded-full flex items-center justify-center',
                            stage.value <= currentStageValue
                              ? 'bg-green-600'
                              : 'bg-gray-300'
                          )}
                        >
                          {getStageIcon(
                            stage.label,
                            stage.value < currentStageValue,
                            stage.value === currentStageValue
                          )}
                        </div>
                        <p className="text-[10px] md:text-xs text-gray-600 mt-1 md:mt-2 text-center w-12 md:w-16 leading-tight">
                          {stage.label}
                        </p>
                      </div>
                      {index < trackingStages.length - 1 && (
                        <div
                          className={cn(
                            'h-1 w-4 md:w-8',
                            stage.value < currentStageValue
                              ? 'bg-green-600'
                              : 'bg-gray-300'
                          )}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Latest Update */}
              {latestUpdate && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-start gap-2 md:gap-3">
                    <div className="h-9 w-9 md:h-10 md:w-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm md:text-base text-gray-900">
                        {getStatusText(latestUpdate.status)}
                      </h4>
                      <div className="flex items-center gap-1 text-xs md:text-sm text-gray-600 mt-1">
                        <MapPin className="h-3 w-3 md:h-3.5 md:w-3.5 flex-shrink-0" />
                        <span className="line-clamp-1">{latestUpdate.location}</span>
                      </div>
                      {latestUpdate.description && (
                        <p className="text-xs md:text-sm text-gray-700 mt-1">
                          {latestUpdate.description}
                        </p>
                      )}
                      <div className="flex items-center gap-1 text-xs md:text-sm text-gray-500 mt-1.5 md:mt-2">
                        <Clock className="h-3 w-3 md:h-3.5 md:w-3.5 flex-shrink-0" />
                        <span className="text-xs">{formatTimestamp(latestUpdate.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* See All Updates */}
              {sortedHistory.length > 1 && (
                <button
                  onClick={() => setShowAllUpdates(!showAllUpdates)}
                  className="w-full mt-3 py-2 text-sm text-blue-600 flex items-center justify-center gap-1 hover:bg-blue-50 rounded transition-colors"
                >
                  <span>See All Updates ({sortedHistory.length} events)</span>
                  {showAllUpdates ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
              )}

              {/* All Updates Expanded */}
              {showAllUpdates && sortedHistory.length > 1 && (
                <div className="mt-4 space-y-3 pt-4 border-t border-gray-200">
                  {sortedHistory.slice(1).map((event, index) => (
                    <div key={index} className="flex gap-3 pb-3 border-b border-gray-100 last:border-0">
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="h-5 w-5 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {getStatusText(event.status)}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-gray-600 mt-1">
                          <MapPin className="h-3 w-3" />
                          <span>{event.location}</span>
                        </div>
                        {event.description && (
                          <p className="text-xs text-gray-600 mt-1">
                            {event.description}
                          </p>
                        )}
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatTimestamp(event.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Delivery Info Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5 md:p-3">
              <p className="text-xs md:text-sm text-gray-700">
                Yayy! your item is on the way. It is shipped and will reach you by{' '}
                <span className="font-medium">Thu Oct 30</span>.
              </p>
            </div>

            {/* Delivery Executive Info */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-2.5 md:p-3">
              <p className="text-xs md:text-sm text-gray-700">
                Delivery Executive details <span className="font-medium">will be available</span> once the order is out for delivery
              </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 md:gap-3">
              <button 
                onClick={() => navigate(`/order/cancel/${orderId}`)}
                className="py-2.5 md:py-3 border border-gray-300 rounded-lg text-xs md:text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button className="py-2.5 md:py-3 border border-gray-300 rounded-lg text-xs md:text-sm font-medium text-gray-700 flex items-center justify-center gap-1.5 md:gap-2 hover:bg-gray-50 transition-colors">
                <MessageCircle className="h-3.5 w-3.5 md:h-4 md:w-4" />
                Chat with us
              </button>
            </div>
          </div>

          {/* Right Column - Delivery Details & Price */}
          <div className="space-y-3 md:space-y-4">
            {/* Delivery Details */}
            <div className="bg-white rounded-lg border border-gray-200 p-3 md:p-4">
              <h3 className="font-medium text-sm md:text-base text-gray-900 mb-3">Delivery details</h3>
              
              <div className="space-y-2.5 md:space-y-3">
                <div className="flex items-start gap-2.5 md:gap-3">
                  <div className="h-9 w-9 md:h-10 md:w-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Home className="h-4 w-4 md:h-5 md:w-5 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs md:text-sm text-gray-600 capitalize">
                      {order.deliveryAddress?.type || 'Delivery Address'}
                    </p>
                    {order.deliveryAddress ? (
                      <p className="text-xs md:text-sm font-medium text-gray-900 line-clamp-3">
                        {order.deliveryAddress.flatBuilding && `${order.deliveryAddress.flatBuilding}, `}
                        {order.deliveryAddress.areaStreet && `${order.deliveryAddress.areaStreet}`}
                        {order.deliveryAddress.landmark && `, ${order.deliveryAddress.landmark}`}
                        {order.deliveryAddress.city && `, ${order.deliveryAddress.city}`}
                        {order.deliveryAddress.state && `, ${order.deliveryAddress.state}`}
                        {order.deliveryAddress.pincode && ` - ${order.deliveryAddress.pincode}`}
                      </p>
                    ) : (
                      <p className="text-xs md:text-sm text-gray-500 italic">
                        Address not available
                      </p>
                    )}
                  </div>
                  <ChevronRight className="h-4 w-4 md:h-5 md:w-5 text-gray-400 flex-shrink-0" />
                </div>

                <div className="flex items-start gap-2.5 md:gap-3 pt-2.5 md:pt-3 border-t border-gray-200">
                  <div className="h-9 w-9 md:h-10 md:w-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <div className="h-5 w-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                      {order.deliveryAddress?.fullName?.charAt(0).toUpperCase() || order.customerName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs md:text-sm font-medium text-gray-900 truncate">
                      {order.deliveryAddress?.fullName || order.customerName || 'Customer'}
                    </p>
                    <p className="text-xs md:text-sm text-gray-600 truncate">
                      {order.deliveryAddress?.mobileNumber || order.customerPhone || order.orderNumber}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 md:h-5 md:w-5 text-gray-400 flex-shrink-0" />
                </div>
              </div>
            </div>

            {/* Price Details */}
            <div className="bg-white rounded-lg border border-gray-200 p-3 md:p-4">
              <h3 className="font-medium text-sm md:text-base text-gray-900 mb-3">Price details</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs md:text-sm">
                  <span className="text-gray-600">Selling price</span>
                  <span className="text-gray-900">₹{order.totalAmount.toLocaleString('en-IN')}</span>
                </div>
                
                <div className="flex justify-between text-xs md:text-sm">
                  <span className="text-gray-600">Total fees</span>
                  <span className="text-gray-900">₹8</span>
                </div>

                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between text-sm md:text-base font-medium">
                    <span className="text-gray-900">Total amount</span>
                    <span className="text-gray-900">₹{order.totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Share & Rate */}
            <div className="space-y-2">
              <button className="w-full py-2 text-xs md:text-sm text-gray-700 flex items-center justify-center gap-1.5 md:gap-2 hover:bg-gray-100 rounded transition-colors">
                <Share2 className="h-3.5 w-3.5 md:h-4 md:w-4" />
                Send Order Details
              </button>
              
              <button className="w-full py-2 text-xs md:text-sm text-gray-700 flex items-center justify-center gap-1.5 md:gap-2 hover:bg-gray-100 rounded transition-colors">
                <span>Did you find this page helpful?</span>
                <ChevronRight className="h-3.5 w-3.5 md:h-4 md:w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountOrderDetails;
