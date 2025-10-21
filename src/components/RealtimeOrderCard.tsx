import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useOrderRealtime } from '@/hooks/useOrderRealtime';
import { OrderTrackingTimeline } from './OrderTrackingTimeline';
import { TrackingHistoryDetails } from './TrackingHistoryDetails';
import { toast } from 'sonner';

interface OrderCardItem {
  name: string;
  image?: string;
  price?: number;
  color?: string;
  quantity?: number;
}

interface RealtimeOrderCardProps {
  orderId: string;
  orderNumber: string;
  items: OrderCardItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'out-for-delivery' | 'delivered' | 'cancelled' | 'returned';
  createdAt: Date;
  sharedBy?: string;
  className?: string;
  isMobile?: boolean;
}

export const RealtimeOrderCard = ({
  orderId,
  orderNumber,
  items,
  totalAmount,
  status: initialStatus,
  createdAt,
  sharedBy,
  className,
  isMobile = false,
}: RealtimeOrderCardProps) => {
  const [currentStatus, setCurrentStatus] = useState(initialStatus);
  const [trackingHistory, setTrackingHistory] = useState<any[]>([]);
  const [showUpdateIndicator, setShowUpdateIndicator] = useState(false);

  // Set up real-time listener for this specific order
  const { data: realtimeData, isConnected, error } = useOrderRealtime({
    orderId,
    enabled: true,
    onUpdate: (data) => {
      // Show toast notification when status changes
      if (data.status !== currentStatus) {
        toast.success('Order status updated!', {
          description: `Your order is now ${data.status.replace(/-/g, ' ')}`,
          duration: 5000,
        });
        
        // Show visual indicator
        setShowUpdateIndicator(true);
        setTimeout(() => setShowUpdateIndicator(false), 3000);
      }
      
      setCurrentStatus(data.status);
      setTrackingHistory(data.trackingHistory || []);
    },
  });

  // Update status if realtime data changes
  useEffect(() => {
    if (realtimeData) {
      setCurrentStatus(realtimeData.status);
      setTrackingHistory(realtimeData.trackingHistory || []);
    }
  }, [realtimeData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'shipped':
      case 'processing':
      case 'out-for-delivery':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'returned':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'Delivered';
      case 'shipped':
        return 'Shipped';
      case 'out-for-delivery':
        return 'Out for Delivery';
      case 'cancelled':
        return 'Cancelled';
      case 'returned':
        return 'Returned';
      case 'processing':
        return 'Processing';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <div className={cn('relative', className)}>
      {/* Real-time Connection Indicator */}
      {isConnected && !error && (
        <div className="absolute top-2 right-2 z-10">
          <div className="flex items-center gap-1.5 px-2 py-1 bg-green-50 border border-green-200 rounded-full">
            <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-medium text-green-700">Live</span>
          </div>
        </div>
      )}

      {/* Update Indicator */}
      {showUpdateIndicator && (
        <div className="absolute top-2 right-20 z-10 animate-bounce">
          <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 border border-blue-200 rounded-full">
            <RefreshCw className="h-3 w-3 text-blue-600 animate-spin" />
            <span className="text-[10px] font-medium text-blue-700">Updated!</span>
          </div>
        </div>
      )}

      {/* Shared Order Banner */}
      {sharedBy && (
        <div className="bg-amber-50 border border-amber-200 rounded-t-lg px-3 py-2">
          <p className="text-xs text-amber-800">
            {sharedBy} shared this order with you.
          </p>
        </div>
      )}

      {/* Order Card */}
      <div
        className={cn(
          'border border-gray-200 bg-white',
          sharedBy ? 'rounded-b-lg border-t-0' : 'rounded-lg',
          !isMobile && 'hover:shadow-md transition-shadow'
        )}
      >
        {/* Order Items */}
        {items.map((item, index) => (
          <div
            key={index}
            className={cn(
              isMobile ? 'p-4' : 'flex items-center gap-6 p-6',
              index < items.length - 1 ? 'border-b border-gray-100' : ''
            )}
          >
            <div className={cn('flex gap-3', !isMobile && 'flex-1')}>
              {/* Product Image */}
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  className={cn(
                    'object-cover rounded-lg flex-shrink-0',
                    isMobile ? 'w-16 h-16' : 'w-24 h-24'
                  )}
                />
              )}

              {/* Product Details */}
              <div className="flex-1 min-w-0">
                <h3
                  className={cn(
                    'font-medium text-gray-900 mb-1',
                    isMobile ? 'text-sm line-clamp-2' : 'text-base truncate'
                  )}
                >
                  {item.name}
                </h3>
                {item.color && (
                  <p className="text-xs text-gray-600 mb-1">Color: {item.color}</p>
                )}
                {item.quantity && (
                  <p className="text-xs text-gray-600 mb-1">Quantity: {item.quantity}</p>
                )}
                <p className={cn('font-bold text-gray-900', isMobile ? 'text-base' : 'text-lg')}>
                  ₹{(item.price || 0).toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            {/* Status Badge - Desktop Only in Item Row */}
            {!isMobile && index === 0 && (
              <div className="text-right flex-shrink-0">
                <span
                  className={cn(
                    'inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold',
                    getStatusColor(currentStatus)
                  )}
                >
                  {currentStatus === 'delivered' && <span className="mr-1.5">●</span>}
                  {currentStatus === 'cancelled' && <span className="mr-1.5">●</span>}
                  {getStatusText(currentStatus)}
                  {currentStatus === 'delivered' && (
                    <span className="ml-2">{format(createdAt, 'MMM dd').toUpperCase()}</span>
                  )}
                </span>
              </div>
            )}
          </div>
        ))}

        {/* Mobile Status Badge */}
        {isMobile && (
          <div className="px-4 pb-3">
            <span
              className={cn(
                'inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold',
                getStatusColor(currentStatus)
              )}
            >
              {currentStatus === 'delivered' && <span className="mr-1">●</span>}
              {currentStatus === 'cancelled' && <span className="mr-1">●</span>}
              {getStatusText(currentStatus)}
              {(currentStatus === 'delivered' || currentStatus === 'cancelled') && (
                <span className="ml-1.5">{format(createdAt, 'MMM dd').toUpperCase()}</span>
              )}
            </span>
          </div>
        )}

        {/* Real-Time Tracking Timeline */}
        {currentStatus !== 'cancelled' && currentStatus !== 'returned' && (
          <div className="px-4 py-2 border-t border-gray-200 bg-gray-50/30">
            <OrderTrackingTimeline
              currentStatus={currentStatus}
              size={isMobile ? 'sm' : 'md'}
            />
          </div>
        )}

        {/* Tracking History Details */}
        {trackingHistory.length > 0 && (
          <TrackingHistoryDetails trackingHistory={trackingHistory} />
        )}
      </div>
    </div>
  );
};
