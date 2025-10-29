import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, RefreshCw, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, deleteDoc, addDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';
import { AdminOrderDetail } from './AdminOrderDetail';
import { DeleteOrderModal } from '@/components/admin/DeleteOrderModal';
import { useAuth } from '@/contexts/AuthContext';

interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  email: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'out-for-delivery' | 'delivered' | 'cancelled' | 'returned' | 'cancellation-pending';
  date: string;
  items: number;
  createdAt?: any;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  processing: { label: 'Processing', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  shipped: { label: 'Shipped', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  'out-for-delivery': { label: 'Out for Delivery', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800 border-green-200' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800 border-red-200' },
  returned: { label: 'Returned', color: 'bg-orange-100 text-orange-800 border-orange-200' },
  'cancellation-pending': { label: 'Cancellation Pending', color: 'bg-amber-100 text-amber-800 border-amber-200' },
};

export const AdminOrders = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalOrderCount, setTotalOrderCount] = useState(0);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<{ id: string; orderNumber: string; customer: string } | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Real-time listener for orders
  useEffect(() => {
    setLoading(true);
    
    // Create query to fetch orders ordered by creation date (newest first)
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, orderBy('createdAt', 'desc'));
    
    // Set up real-time listener with onSnapshot
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedOrders: Order[] = [];
        
        snapshot.forEach((doc) => {
          const data = doc.data();
          fetchedOrders.push({
            id: doc.id,
            orderNumber: data.orderNumber || data.orderId || doc.id,
            customer: data.customer || data.customerName || 'Unknown',
            email: data.email || data.customerEmail || 'N/A',
            total: data.total || data.totalAmount || 0,
            status: data.status || 'pending',
            date: data.date || data.orderDate || data.createdAt?.toDate().toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
            items: data.items?.length || data.itemCount || 0,
            createdAt: data.createdAt
          });
        });
        
        setOrders(fetchedOrders);
        setTotalOrderCount(snapshot.size); // Real-time order count
        setLoading(false);
        
        // Show toast notification for new orders (only after initial load)
        if (!loading && snapshot.docChanges().some(change => change.type === 'added')) {
          const newOrders = snapshot.docChanges().filter(change => change.type === 'added');
          if (newOrders.length > 0) {
            toast.success(`${newOrders.length} new order${newOrders.length > 1 ? 's' : ''} received!`, {
              description: 'The order list has been updated automatically'
            });
          }
        }
      },
      (error) => {
        console.error('Error fetching orders:', error);
        toast.error('Failed to load orders');
        setLoading(false);
      }
    );
    
    // Cleanup: Unsubscribe from the listener when component unmounts
    return () => {
      unsubscribe();
    };
  }, []); // Empty dependency array - listener stays active while on page

  // Handle Delete Order with Audit Trail
  const handleDeleteOrder = async (deletionReason: string) => {
    if (!orderToDelete || !user) {
      toast.error('Unable to delete order. Please try again.');
      return;
    }

    try {
      // Step 1: Fetch the complete order data before deletion
      const orderRef = doc(db, 'orders', orderToDelete.id);
      const orderSnapshot = await getDoc(orderRef);
      
      if (!orderSnapshot.exists()) {
        toast.error('Order not found');
        return;
      }

      const orderData = orderSnapshot.data();

      // Step 2: Create audit log FIRST (before deletion)
      const auditRef = collection(db, 'deletionAudit');
      await addDoc(auditRef, {
        orderId: orderToDelete.id,
        orderNumber: orderToDelete.orderNumber,
        customerName: orderToDelete.customer,
        customerEmail: orderData.email || orderData.customerEmail || 'N/A',
        orderTotal: orderData.total || orderData.totalAmount || 0,
        orderStatus: orderData.status || 'unknown',
        orderDate: orderData.date || orderData.createdAt?.toDate().toISOString() || new Date().toISOString(),
        deletedByUid: user.uid,
        deletedByEmail: user.email || 'N/A',
        deletionTimestamp: serverTimestamp(),
        deletionReason: deletionReason,
        orderDataSnapshot: orderData, // Store complete order data for reference
      });

      console.log('[DeleteOrder] Audit log created successfully');

      // Step 3: Delete the order from orders collection
      await deleteDoc(orderRef);

      console.log('[DeleteOrder] Order deleted successfully');

      toast.success('Order deleted successfully', {
        description: `Order ${orderToDelete.orderNumber} has been permanently removed and logged in the audit trail.`,
        duration: 5000,
      });

      // Reset state
      setOrderToDelete(null);
      setIsDeleteModalOpen(false);
    } catch (error: any) {
      console.error('[DeleteOrder] Error:', error);
      
      if (error.code === 'permission-denied') {
        toast.error('Permission denied', {
          description: 'You do not have permission to delete orders. Please contact the system administrator.',
        });
      } else {
        toast.error('Failed to delete order', {
          description: error.message || 'An unexpected error occurred. Please try again.',
        });
      }
      
      throw error; // Re-throw to prevent modal from closing
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (order: Order) => {
    setOrderToDelete({
      id: order.id,
      orderNumber: order.orderNumber,
      customer: order.customer
    });
    setIsDeleteModalOpen(true);
  };

  // Filter orders based on search and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout title="Orders">
      <div className="space-y-6">
        {/* Header with Order Count */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              Orders
              {!loading && (
                <Badge variant="secondary" className="text-base font-semibold">
                  {totalOrderCount}
                </Badge>
              )}
            </h2>
            <p className="text-muted-foreground">
              {loading ? 'Loading orders...' : 'Real-time order management with live updates'}
            </p>
          </div>
          {!loading && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Live</span>
            </div>
          )}
        </div>
        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="out-for-delivery">Out for Delivery</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancellation-pending">Cancellation Pending</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="returned">Returned</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Order Management</CardTitle>
            <CardDescription>
              {loading 
                ? 'Loading orders...' 
                : `Viewing ${filteredOrders.length} of ${totalOrderCount} total orders`
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-12 text-center">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-yellow-600" />
                <p className="text-gray-500">Loading orders from database...</p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.length > 0 ? (
                      filteredOrders.map((order) => (
                        <TableRow key={order.id} className="hover:bg-gray-50">
                          <TableCell className="font-medium">{order.orderNumber}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{order.customer}</div>
                              <div className="text-sm text-gray-500">{order.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>{order.items} items</TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline" 
                              className={statusConfig[order.status]?.color || 'bg-gray-100 text-gray-800 border-gray-200'}
                            >
                              {statusConfig[order.status]?.label || order.status.charAt(0).toUpperCase() + order.status.slice(1)}
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
                            ₹{order.total.toLocaleString('en-IN')}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  setSelectedOrderId(order.id);
                                  setIsDetailOpen(true);
                                }}
                              >
                                Manage Tracking
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => openDeleteModal(order)}
                                className="bg-red-600 hover:bg-red-700"
                                title="Delete Order"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                          {orders.length === 0 
                            ? 'No orders in database yet. Orders will appear here automatically when customers place them.'
                            : 'No orders match your search criteria'
                          }
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Detail Dialog */}
        {selectedOrderId && (
          <AdminOrderDetail
            orderId={selectedOrderId}
            isOpen={isDetailOpen}
            onClose={() => {
              setIsDetailOpen(false);
              setSelectedOrderId(null);
            }}
          />
        )}

        {/* Delete Order Confirmation Modal */}
        {orderToDelete && (
          <DeleteOrderModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setOrderToDelete(null);
            }}
            onConfirm={handleDeleteOrder}
            orderNumber={orderToDelete.orderNumber}
            customerName={orderToDelete.customer}
          />
        )}
      </div>
    </AdminLayout>
  );
};
