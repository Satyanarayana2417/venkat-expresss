import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';
import { AdminOrderDetail } from './AdminOrderDetail';

interface Order {
  id: string;
  customer: string;
  email: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
  items: number;
  createdAt?: any;
}

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  processing: { label: 'Processing', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  shipped: { label: 'Shipped', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800 border-green-200' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800 border-red-200' },
};

export const AdminOrders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalOrderCount, setTotalOrderCount] = useState(0);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

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

  // Filter orders based on search and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
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
                          <TableCell className="font-medium">{order.id}</TableCell>
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
                            ₹{order.total.toLocaleString('en-IN')}
                          </TableCell>
                          <TableCell className="text-right">
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
      </div>
    </AdminLayout>
  );
};
