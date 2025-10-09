import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Loader2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { toast } from 'sonner';

interface Order {
  id: string;
  customer: string;
  customerName?: string;
  total: number;
  totalAmount?: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  orderStatus?: string;
  date: string;
  orderDate?: string;
  createdAt?: any;
}

interface RecentOrdersProps {
  orders?: Order[];
}

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  processing: { label: 'Processing', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  shipped: { label: 'Shipped', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800 border-green-200' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800 border-red-200' },
};

export const RecentOrders = ({ orders: propOrders }: RecentOrdersProps) => {
  const [realtimeOrders, setRealtimeOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);

  // Real-time listener for the 5 most recent orders with proper auth check
  useEffect(() => {
    setLoading(true);
    setAuthError(false);

    // Wait for authentication to complete before fetching data
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is authenticated - proceed with data fetching
        const ordersRef = collection(db, 'orders');
        // Query for 5 most recent orders, sorted by creation date (newest first)
        const q = query(
          ordersRef,
          orderBy('createdAt', 'desc'),
          limit(5)
        );

        // Set up real-time listener with onSnapshot
        const unsubscribeSnapshot = onSnapshot(
          q,
          (snapshot) => {
            const fetchedOrders: Order[] = [];

            snapshot.forEach((doc) => {
              const data = doc.data();
              
              // Normalize order status
              let normalizedStatus: Order['status'] = 'pending';
              const rawStatus = (data.status || data.orderStatus || 'pending').toLowerCase();
              
              if (['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(rawStatus)) {
                normalizedStatus = rawStatus as Order['status'];
              }

              fetchedOrders.push({
                id: doc.id,
                customer: data.customer || data.customerName || 'Unknown',
                customerName: data.customer || data.customerName,
                total: data.total || data.totalAmount || 0,
                totalAmount: data.total || data.totalAmount,
                status: normalizedStatus,
                orderStatus: data.status || data.orderStatus,
                date: data.date || data.orderDate || data.createdAt?.toDate().toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
                orderDate: data.date || data.orderDate,
                createdAt: data.createdAt
              });
            });

            setRealtimeOrders(fetchedOrders);
            setLoading(false);

            // Show toast for new orders (only after initial load)
            if (!loading && snapshot.docChanges().some(change => change.type === 'added')) {
              const newOrders = snapshot.docChanges().filter(change => change.type === 'added');
              if (newOrders.length > 0) {
                toast.success(`${newOrders.length} new order${newOrders.length > 1 ? 's' : ''} received!`, {
                  description: 'Recent orders updated automatically'
                });
              }
            }
          },
          (error) => {
            console.error('Error fetching recent orders:', error);
            toast.error('Failed to load recent orders');
            setLoading(false);
          }
        );

        // Cleanup snapshot listener when auth changes or component unmounts
        return () => {
          unsubscribeSnapshot();
        };
      } else {
        // No user authenticated
        setAuthError(true);
        setLoading(false);
        console.warn('User not authenticated - cannot fetch recent orders');
      }
    });

    // Cleanup auth listener on unmount
    return () => {
      unsubscribeAuth();
    };
  }, []);

  // Use prop orders if provided, otherwise use real-time orders
  const displayOrders = propOrders && propOrders.length > 0 ? propOrders.slice(0, 5) : realtimeOrders;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Latest customer orders from your store</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/admin/orders">
            View All
            <ExternalLink className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {authError ? (
          <div className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <p className="text-lg font-semibold text-gray-900">Authentication Required</p>
            <p className="text-sm text-muted-foreground mt-2">Please log in to view recent orders</p>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-yellow-600" />
            <span className="ml-3 text-muted-foreground">Loading recent orders...</span>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayOrders.length > 0 ? (
                  displayOrders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        <Link 
                          to={`/admin/orders`}
                          className="text-blue-600 hover:underline"
                        >
                          {order.id}
                        </Link>
                      </TableCell>
                      <TableCell>{order.customer || order.customerName || 'Unknown'}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={statusConfig[order.status].color}
                        >
                          {statusConfig[order.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {new Date(order.date).toLocaleDateString('en-IN', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ₹{(order.total || order.totalAmount || 0).toLocaleString('en-IN')}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      No orders found. New orders will appear here automatically.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
