import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { collection, query, orderBy, getDocs, where, DocumentData, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Package, Clock, CheckCircle, XCircle, Truck, Loader2, Search, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { RealtimeOrderCard } from '@/components/RealtimeOrderCard';

interface Order {
  id: string;
  orderNumber: string;
  items: any[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned' | 'cancellation-pending';
  createdAt: Date;
  deliveryAddress?: any;
  sharedBy?: string;
}

const AccountOrders = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [statusFilters, setStatusFilters] = useState({
    onTheWay: false,
    delivered: false,
    cancelled: false,
    returned: false,
  });
  
  const [timeFilters, setTimeFilters] = useState({
    last30Days: false,
    year2024: false,
    year2023: false,
    year2022: false,
    year2021: false,
    older: false,
  });

  useEffect(() => {
    console.log('AccountOrders useEffect - authLoading:', authLoading, 'user:', user?.uid);
    
    if (authLoading) {
      console.log('Still loading auth, waiting...');
      return;
    }

    if (!user) {
      console.log('No user found, redirecting to login');
      toast.error('Please log in to view your orders');
      navigate('/login');
      return;
    }

    console.log('User authenticated, setting up real-time orders listener');
    
    // Set up real-time listener for orders
    setLoading(true);
    setError(null);
    
    const ordersRef = collection(db, 'orders');
    let unsubscribe: (() => void) | undefined;
    
    try {
      // Try with composite query first
      const q = query(
        ordersRef,
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      
      // Set up real-time listener with onSnapshot
      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          console.log('[AccountOrders] Real-time update received:', snapshot.size, 'orders');
          
          const ordersData: Order[] = snapshot.docs.map(doc => {
            const data = doc.data() as DocumentData;
            
            // Sanitize items to ensure they have proper structure
            const sanitizedItems = (data.items || []).map((item: any) => ({
              name: item.name || item.title || 'Product',
              image: item.image || item.imageUrl || item.img,
              price: item.price || item.totalPrice || item.amount || 0,
              color: item.color || item.variant,
              quantity: item.quantity || 1
            }));
            
            return {
              id: doc.id,
              orderNumber: data.orderNumber || doc.id.slice(0, 8).toUpperCase(),
              items: sanitizedItems,
              totalAmount: data.totalAmount || data.total || 0,
              status: data.status || data.orderStatus || 'pending',
              createdAt: data.createdAt?.toDate() || new Date(),
              deliveryAddress: data.deliveryAddress,
              sharedBy: data.sharedBy
            };
          });

          setOrders(ordersData);
          setError(null);
          setLoading(false);
          
          if (ordersData.length === 0) {
            console.log('No orders found for user');
          }
          
          // Log deletions for debugging
          snapshot.docChanges().forEach((change) => {
            if (change.type === 'removed') {
              console.log('[AccountOrders] Order removed:', change.doc.id);
            }
          });
        },
        (error) => {
          console.error('[AccountOrders] Error in real-time listener:', error);
          
          // Fallback to simple query if composite index doesn't exist
          if (error.code === 'failed-precondition') {
            console.log('[AccountOrders] Composite index not found, using simple query');
            
            const simpleQuery = query(ordersRef, where('userId', '==', user.uid));
            
            unsubscribe = onSnapshot(
              simpleQuery,
              (snapshot) => {
                console.log('[AccountOrders] Real-time update (simple query):', snapshot.size, 'orders');
                
                const ordersData: Order[] = snapshot.docs.map(doc => {
                  const data = doc.data() as DocumentData;
                  
                  // Sanitize items to ensure they have proper structure
                  const sanitizedItems = (data.items || []).map((item: any) => ({
                    name: item.name || item.title || 'Product',
                    image: item.image || item.imageUrl || item.img,
                    price: item.price || item.totalPrice || item.amount || 0,
                    color: item.color || item.variant,
                    quantity: item.quantity || 1
                  }));
                  
                  return {
                    id: doc.id,
                    orderNumber: data.orderNumber || doc.id.slice(0, 8).toUpperCase(),
                    items: sanitizedItems,
                    totalAmount: data.totalAmount || data.total || 0,
                    status: data.status || data.orderStatus || 'pending',
                    createdAt: data.createdAt?.toDate() || new Date(),
                    deliveryAddress: data.deliveryAddress,
                    sharedBy: data.sharedBy
                  };
                });

                // Sort in memory by createdAt descending
                ordersData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

                setOrders(ordersData);
                setError(null);
                setLoading(false);
                
                // Log deletions for debugging
                snapshot.docChanges().forEach((change) => {
                  if (change.type === 'removed') {
                    console.log('[AccountOrders] Order removed:', change.doc.id);
                  }
                });
              },
              (err) => {
                console.error('[AccountOrders] Error in fallback listener:', err);
                const errorMessage = err.message || 'Unknown error';
                setError(errorMessage);
                toast.error('Failed to load orders: ' + errorMessage);
                setOrders([]);
                setLoading(false);
              }
            );
            
            toast.warning('Using fallback query. Consider creating a Firestore composite index for better performance.');
          } else {
            const errorMessage = error.message || 'Unknown error';
            setError(errorMessage);
            toast.error('Failed to load orders: ' + errorMessage);
            setOrders([]);
            setLoading(false);
          }
        }
      );
    } catch (error: any) {
      console.error('[AccountOrders] Error setting up listener:', error);
      const errorMessage = error.message || 'Unknown error';
      setError(errorMessage);
      toast.error('Failed to load orders: ' + errorMessage);
      setOrders([]);
      setLoading(false);
    }
    
    // Cleanup: Unsubscribe from listener when component unmounts or user changes
    return () => {
      if (unsubscribe) {
        console.log('[AccountOrders] Cleaning up real-time listener');
        unsubscribe();
      }
    };
  }, [user, authLoading, navigate]);

  const handleStatusFilterChange = (filter: keyof typeof statusFilters) => {
    setStatusFilters(prev => ({ ...prev, [filter]: !prev[filter] }));
  };

  const handleTimeFilterChange = (filter: keyof typeof timeFilters) => {
    setTimeFilters(prev => ({ ...prev, [filter]: !prev[filter] }));
  };

  const filterOrders = () => {
    let filtered = [...orders];

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(order =>
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.items.some(item => 
          item.name?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Apply status filters
    const activeStatusFilters = Object.entries(statusFilters)
      .filter(([_, isActive]) => isActive)
      .map(([key]) => key);

    if (activeStatusFilters.length > 0) {
      filtered = filtered.filter(order => {
        if (statusFilters.onTheWay && (order.status === 'shipped' || order.status === 'processing')) return true;
        if (statusFilters.delivered && order.status === 'delivered') return true;
        if (statusFilters.cancelled && order.status === 'cancelled') return true;
        if (statusFilters.returned && order.status === 'returned') return true;
        return false;
      });
    }

    // Apply time filters
    const now = new Date();
    const activeTimeFilters = Object.entries(timeFilters)
      .filter(([_, isActive]) => isActive)
      .map(([key]) => key);

    if (activeTimeFilters.length > 0) {
      filtered = filtered.filter(order => {
        const orderDate = order.createdAt;
        const daysDiff = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
        const orderYear = orderDate.getFullYear();

        if (timeFilters.last30Days && daysDiff <= 30) return true;
        if (timeFilters.year2024 && orderYear === 2024) return true;
        if (timeFilters.year2023 && orderYear === 2023) return true;
        if (timeFilters.year2022 && orderYear === 2022) return true;
        if (timeFilters.year2021 && orderYear === 2021) return true;
        if (timeFilters.older && orderYear < 2021) return true;
        return false;
      });
    }

    return filtered;
  };

  const filteredOrders = filterOrders();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-blue-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'processing':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <Package className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'Delivered';
      case 'shipped':
        return 'On the way';
      case 'cancelled':
        return 'Cancelled';
      case 'returned':
        return 'Returned';
      case 'processing':
        return 'On the way';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'shipped':
      case 'processing':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'returned':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="mt-4 text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  // Show error state if there's an error
  if (error) {
    return (
      <div className="p-8">
        <div className="flex flex-col items-center justify-center py-12">
          <XCircle className="h-16 w-16 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Orders</h3>
          <p className="text-gray-600 text-center max-w-md">{error}</p>
          <p className="text-sm text-gray-500 mt-2">The connection will retry automatically.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Header with Back Button */}
      <div className="md:hidden bg-white sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3 px-4 py-3">
          <button onClick={() => navigate('/account')} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-base font-medium text-gray-900">My Orders</h1>
        </div>
      </div>

      {/* Mobile View - New Design with Filters */}
      <div className="md:hidden">
        {/* Search Bar */}
        <div className="px-4 pt-4 pb-3 bg-white border-b border-gray-200">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search your orders here"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
              <Search className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Filters - Collapsible */}
        <div className="bg-white border-b border-gray-200">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full px-4 py-3 flex items-center justify-between text-left"
          >
            <span className="text-sm font-semibold text-gray-900">Filters</span>
            <svg
              className={`h-5 w-5 text-gray-500 transition-transform ${showFilters ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showFilters && (
            <div className="px-4 pb-4 space-y-4">
              {/* ORDER STATUS */}
              <div>
                <h3 className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                  Order Status
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={statusFilters.onTheWay}
                      onChange={() => handleStatusFilterChange('onTheWay')}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">On the way</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={statusFilters.delivered}
                      onChange={() => handleStatusFilterChange('delivered')}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Delivered</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={statusFilters.cancelled}
                      onChange={() => handleStatusFilterChange('cancelled')}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Cancelled</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={statusFilters.returned}
                      onChange={() => handleStatusFilterChange('returned')}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Returned</span>
                  </label>
                </div>
              </div>

              {/* ORDER TIME */}
              <div>
                <h3 className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                  Order Time
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={timeFilters.last30Days}
                      onChange={() => handleTimeFilterChange('last30Days')}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Last 30 days</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={timeFilters.year2024}
                      onChange={() => handleTimeFilterChange('year2024')}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">2024</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={timeFilters.year2023}
                      onChange={() => handleTimeFilterChange('year2023')}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">2023</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={timeFilters.year2022}
                      onChange={() => handleTimeFilterChange('year2022')}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">2022</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={timeFilters.year2021}
                      onChange={() => handleTimeFilterChange('year2021')}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">2021</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={timeFilters.older}
                      onChange={() => handleTimeFilterChange('older')}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Older</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Orders List */}
        <div className="p-4">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {orders.length === 0 ? 'No orders yet' : 'No orders found'}
              </h3>
              <p className="text-gray-500 mb-6">
                {orders.length === 0 
                  ? 'Start shopping to see your orders here'
                  : 'Try adjusting your filters or search query'
                }
              </p>
              {orders.length === 0 && (
                <button
                  onClick={() => navigate('/products')}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Shop Now
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredOrders.map((order) => (
                order && order.id ? (
                  <RealtimeOrderCard
                    key={order.id}
                    orderId={order.id}
                    orderNumber={order.orderNumber}
                    items={order.items || []}
                    totalAmount={order.totalAmount || 0}
                    status={order.status}
                    createdAt={order.createdAt}
                    sharedBy={order.sharedBy}
                    isMobile={true}
                  />
                ) : null
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Desktop View - New Design */}
      <div className="hidden md:block">
        {/* Breadcrumb Navigation */}
        <div className="px-8 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link to="/account" className="hover:text-blue-600 transition-colors">My Account</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900 font-medium">My Orders</span>
          </div>
        </div>

        <div className="flex h-[calc(100vh-200px)]">
          {/* Left Sidebar - Filters */}
          <aside className="w-64 border-r border-gray-200 p-6 overflow-y-auto scrollbar-hide">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Filters</h2>

            {/* ORDER STATUS */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                Order Status
              </h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={statusFilters.onTheWay}
                    onChange={() => handleStatusFilterChange('onTheWay')}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">On the way</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={statusFilters.delivered}
                    onChange={() => handleStatusFilterChange('delivered')}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Delivered</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={statusFilters.cancelled}
                    onChange={() => handleStatusFilterChange('cancelled')}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Cancelled</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={statusFilters.returned}
                    onChange={() => handleStatusFilterChange('returned')}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Returned</span>
                </label>
              </div>
            </div>

            {/* ORDER TIME */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                Order Time
              </h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={timeFilters.last30Days}
                    onChange={() => handleTimeFilterChange('last30Days')}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Last 30 days</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={timeFilters.year2024}
                    onChange={() => handleTimeFilterChange('year2024')}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">2024</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={timeFilters.year2023}
                    onChange={() => handleTimeFilterChange('year2023')}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">2023</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={timeFilters.year2022}
                    onChange={() => handleTimeFilterChange('year2022')}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">2022</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={timeFilters.year2021}
                    onChange={() => handleTimeFilterChange('year2021')}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">2021</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={timeFilters.older}
                    onChange={() => handleTimeFilterChange('older')}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Older</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 p-8 overflow-y-auto scrollbar-hide">
            {/* Search Bar */}
            <div className="mb-6 flex gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search your orders here"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search Orders
              </button>
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
              <div className="text-center py-16">
                <Package className="h-20 w-20 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  {orders.length === 0 ? 'No orders yet' : 'No orders found'}
                </h3>
                <p className="text-gray-500 mb-6">
                  {orders.length === 0 
                    ? 'Start shopping to see your orders here'
                    : 'Try adjusting your filters or search query'
                  }
                </p>
                {orders.length === 0 && (
                  <button
                    onClick={() => navigate('/products')}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Shop Now
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  order && order.id ? (
                    <RealtimeOrderCard
                      key={order.id}
                      orderId={order.id}
                      orderNumber={order.orderNumber}
                      items={order.items || []}
                      totalAmount={order.totalAmount || 0}
                      status={order.status}
                      createdAt={order.createdAt}
                      sharedBy={order.sharedBy}
                      isMobile={false}
                    />
                  ) : null
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default AccountOrders;
