import { Check, Package, Loader, Truck, Home, Clock, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OrderStage {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface OrderTrackingTimelineProps {
  currentStatus: 'pending' | 'processing' | 'shipped' | 'out-for-delivery' | 'delivered' | 'cancelled' | 'returned' | 'cancellation-pending' | 'Payment Verification Pending' | 'Pending Verification';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const ORDER_STAGES: OrderStage[] = [
  {
    id: 'pending',
    label: 'Order Placed',
    icon: <Package className="h-full w-full" />,
  },
  {
    id: 'processing',
    label: 'Processing',
    icon: <Loader className="h-full w-full" />,
  },
  {
    id: 'shipped',
    label: 'Shipped',
    icon: <Truck className="h-full w-full" />,
  },
  {
    id: 'out-for-delivery',
    label: 'Out for Delivery',
    icon: <Truck className="h-full w-full" />,
  },
  {
    id: 'delivered',
    label: 'Delivered',
    icon: <Home className="h-full w-full" />,
  },
];

const STATUS_PRIORITY = {
  'pending': 0,
  'processing': 1,
  'shipped': 2,
  'out-for-delivery': 3,
  'delivered': 4,
  'cancelled': -1,
  'returned': -1,
  'cancellation-pending': 0, // Same as pending since it's a request state
};

export const OrderTrackingTimeline = ({ 
  currentStatus, 
  className,
  size = 'md' 
}: OrderTrackingTimelineProps) => {
  const currentPriority = STATUS_PRIORITY[currentStatus];
  const isCancelled = currentStatus === 'cancelled';
  const isReturned = currentStatus === 'returned';

  // Size configurations
  const sizeClasses = {
    sm: {
      icon: 'h-6 w-6',
      line: 'h-0.5',
      text: 'text-[10px]',
      spacing: 'gap-1',
    },
    md: {
      icon: 'h-8 w-8',
      line: 'h-1',
      text: 'text-xs',
      spacing: 'gap-2',
    },
    lg: {
      icon: 'h-10 w-10',
      line: 'h-1',
      text: 'text-sm',
      spacing: 'gap-3',
    },
  };

  const config = sizeClasses[size];

  // If order is cancelled or returned, show special state
  if (isCancelled || isReturned) {
    return (
      <div className={cn('py-4', className)}>
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className={cn(
              'mx-auto rounded-full flex items-center justify-center mb-2',
              'bg-red-100 text-red-600',
              config.icon
            )}>
              <XCircle className="h-full w-full p-1.5" />
            </div>
            <p className={cn('font-medium text-red-600', config.text)}>
              {isCancelled ? 'Order Cancelled' : 'Order Returned'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('py-4', className)}>
      <div className="flex items-center justify-between">
        {ORDER_STAGES.map((stage, index) => {
          const stagePriority = STATUS_PRIORITY[stage.id as keyof typeof STATUS_PRIORITY];
          const isCompleted = stagePriority <= currentPriority;
          const isCurrent = stage.id === currentStatus;
          const isLast = index === ORDER_STAGES.length - 1;

          return (
            <div key={stage.id} className="flex items-center flex-1">
              {/* Stage Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'rounded-full flex items-center justify-center transition-all duration-300',
                    config.icon,
                    isCompleted
                      ? 'bg-green-500 text-white'
                      : isCurrent
                      ? 'bg-blue-500 text-white animate-pulse'
                      : 'bg-gray-200 text-gray-400'
                  )}
                >
                  {isCompleted && !isCurrent ? (
                    <Check className="h-full w-full p-1.5" />
                  ) : (
                    <div className="h-full w-full p-1.5">{stage.icon}</div>
                  )}
                </div>
                
                {/* Stage Label */}
                <p
                  className={cn(
                    'mt-2 text-center font-medium transition-colors duration-300 max-w-[80px]',
                    config.text,
                    isCompleted || isCurrent
                      ? 'text-gray-900'
                      : 'text-gray-400'
                  )}
                >
                  {stage.label}
                </p>
              </div>

              {/* Connecting Line */}
              {!isLast && (
                <div className="flex-1 mx-2">
                  <div
                    className={cn(
                      'w-full rounded-full transition-all duration-300',
                      config.line,
                      isCompleted
                        ? 'bg-green-500'
                        : 'bg-gray-200'
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
