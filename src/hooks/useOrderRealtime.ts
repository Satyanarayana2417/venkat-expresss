import { useEffect, useState } from 'react';
import { doc, onSnapshot, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface TrackingEvent {
  status: string;
  location: string;
  timestamp: any;
  description?: string;
}

interface OrderRealtimeData {
  id: string;
  status: 'pending' | 'processing' | 'shipped' | 'out-for-delivery' | 'delivered' | 'cancelled' | 'returned';
  trackingHistory: TrackingEvent[];
  lastUpdated?: Date;
}

interface UseOrderRealtimeOptions {
  orderId: string;
  enabled?: boolean;
  onUpdate?: (data: OrderRealtimeData) => void;
}

/**
 * Custom hook that establishes a real-time Firestore listener for a specific order.
 * Automatically updates when admin changes order status or tracking information.
 * 
 * @param orderId - The ID of the order to track
 * @param enabled - Whether the listener should be active (default: true)
 * @param onUpdate - Optional callback when order data updates
 * @returns Object containing order data, loading state, and error
 */
export const useOrderRealtime = ({ 
  orderId, 
  enabled = true,
  onUpdate 
}: UseOrderRealtimeOptions) => {
  const [data, setData] = useState<OrderRealtimeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Don't set up listener if disabled or no orderId
    if (!enabled || !orderId) {
      setLoading(false);
      return;
    }

    let unsubscribe: (() => void) | undefined;

    const setupListener = () => {
      try {
        const orderRef = doc(db, 'orders', orderId);

        // Set up real-time listener with onSnapshot
        unsubscribe = onSnapshot(
          orderRef,
          (docSnapshot) => {
            if (docSnapshot.exists()) {
              const docData = docSnapshot.data() as DocumentData;
              
              const orderData: OrderRealtimeData = {
                id: docSnapshot.id,
                status: docData.status || 'pending',
                trackingHistory: docData.trackingHistory || [],
                lastUpdated: new Date(),
              };

              setData(orderData);
              setIsConnected(true);
              setError(null);
              
              // Call optional update callback
              if (onUpdate) {
                onUpdate(orderData);
              }
            } else {
              setError('Order not found');
              setIsConnected(false);
            }
            setLoading(false);
          },
          (err) => {
            console.error('Error in order real-time listener:', err);
            setError(err.message);
            setIsConnected(false);
            setLoading(false);
          }
        );
      } catch (err: any) {
        console.error('Error setting up order listener:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    setupListener();

    // Cleanup: Unsubscribe from listener when component unmounts or orderId changes
    return () => {
      if (unsubscribe) {
        unsubscribe();
        setIsConnected(false);
      }
    };
  }, [orderId, enabled, onUpdate]);

  return {
    data,
    loading,
    error,
    isConnected,
  };
};
