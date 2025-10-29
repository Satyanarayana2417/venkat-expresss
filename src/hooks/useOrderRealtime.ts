import { useEffect, useState, useRef } from 'react';
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
  
  // Use ref to store the latest onUpdate callback without triggering re-subscription
  const onUpdateRef = useRef(onUpdate);
  
  // Update ref when onUpdate changes
  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);

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
        
        console.log(`[useOrderRealtime] Setting up listener for order: ${orderId}`);

        // Set up real-time listener with onSnapshot
        unsubscribe = onSnapshot(
          orderRef,
          (docSnapshot) => {
            console.log(`[useOrderRealtime] Snapshot received for order: ${orderId}`, {
              exists: docSnapshot.exists(),
              status: docSnapshot.data()?.status
            });
            
            if (docSnapshot.exists()) {
              const docData = docSnapshot.data() as DocumentData;
              
              const orderData: OrderRealtimeData = {
                id: docSnapshot.id,
                status: docData.status || 'pending',
                trackingHistory: docData.trackingHistory || [],
                lastUpdated: new Date(),
              };

              console.log(`[useOrderRealtime] Order data updated:`, orderData.status);
              
              setData(orderData);
              setIsConnected(true);
              setError(null);
              
              // Call optional update callback using ref
              if (onUpdateRef.current) {
                console.log(`[useOrderRealtime] Calling onUpdate callback`);
                onUpdateRef.current(orderData);
              }
            } else {
              console.warn(`[useOrderRealtime] Order not found: ${orderId}`);
              setError('Order not found');
              setIsConnected(false);
            }
            setLoading(false);
          },
          (err) => {
            console.error(`[useOrderRealtime] Error in listener for order ${orderId}:`, err);
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
        console.log(`[useOrderRealtime] Cleaning up listener for order: ${orderId}`);
        unsubscribe();
        setIsConnected(false);
      }
    };
  }, [orderId, enabled]); // Removed onUpdate from dependencies

  return {
    data,
    loading,
    error,
    isConnected,
  };
};
