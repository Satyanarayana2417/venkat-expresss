import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle, 
  Package, 
  Truck, 
  Home, 
  ShoppingBag, 
  MapPin,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  Receipt,
  Loader2,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  ArrowLeft
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/orderUtils';
import { format } from 'date-fns';

interface OrderItem {
  productId: string;
  title: string;
  price: number;
  qty: number;
  image: string;
}

interface OrderData {
  id: string;
  orderId: string;
  orderNumber: string;
  customer: string;
  email: string;
  phone?: string;
  items: OrderItem[];
  total: number;
  subtotal: number;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  upiTransactionId?: string;
  date: string;
  createdAt: any;
  shippingAddress?: {
    address: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
}

const OrderSuccess = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<OrderData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setError('Order ID not found');
        setLoading(false);
        return;
      }

      try {
        const orderRef = doc(db, 'orders', orderId);
        const orderSnap = await getDoc(orderRef);

        if (orderSnap.exists()) {
          const data = orderSnap.data();
          setOrder({
            id: orderSnap.id,
            orderId: data.orderId || data.orderNumber || orderSnap.id,
            orderNumber: data.orderNumber || data.orderId || orderSnap.id,
            customer: data.customer || data.customerName || 'Customer',
            email: data.email || '',
            phone: data.phone || data.phoneNumber || '',
            items: data.items || [],
            total: data.total || 0,
            subtotal: data.subtotal || data.total || 0,
            orderStatus: data.orderStatus || 'Payment Verification Pending',
            paymentStatus: data.paymentStatus || 'Pending Verification',
            paymentMethod: data.paymentMethod || 'UPI',
            upiTransactionId: data.upiTransactionId || '',
            date: data.date || new Date().toISOString().split('T')[0],
            createdAt: data.createdAt,
            shippingAddress: data.shippingAddress,
          });
        } else {
          setError('Order not found');
          toast.error('Order not found');
        }
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to load order details');
        toast.error('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  // Calculate estimated delivery date (7-10 days from order date)
  const getEstimatedDelivery = () => {
    if (!order) return '';
    const orderDate = new Date(order.date);
    const minDate = new Date(orderDate);
    minDate.setDate(minDate.getDate() + 7);
    const maxDate = new Date(orderDate);
    maxDate.setDate(maxDate.getDate() + 10);
    
    return `${format(minDate, 'MMM dd')} - ${format(maxDate, 'MMM dd, yyyy')}`;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {error || 'Order Not Found'}
          </h2>
          <p className="text-gray-600 mb-6">
            We couldn't find the order you're looking for. Please check your order history.
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => navigate('/history')} variant="outline">
              View Order History
            </Button>
            <Button onClick={() => navigate('/')}>
              Go to Home
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Success page
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-8 md:py-12 relative"
      >
        {/* Back Button - Mobile Only */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/')}
          className="md:hidden absolute top-4 left-4 text-white hover:bg-white/20 hover:text-white"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>

        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="shrink-0"
            >
              <div className="bg-white rounded-full p-4 shadow-lg">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
            </motion.div>
            
            <div className="text-center md:text-left">
              <motion.h1 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-3xl md:text-4xl font-bold mb-2"
              >
                Thank You for Your Order! 🎉
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-green-50 text-lg"
              >
                Your order has been placed successfully and is being verified.
              </motion.p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Column 1 - Order Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-6 h-full">
              <div className="flex items-center justify-between mb-4 gap-2">
                <h2 className="text-base md:text-xl font-bold text-gray-900 whitespace-nowrap">Order Details</h2>
                <Badge variant="outline" className="text-xs md:text-base font-semibold">
                  {order.orderNumber}
                </Badge>
              </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Order Date</p>
                      <p className="font-semibold text-gray-900">
                        {format(new Date(order.date), 'MMMM dd, yyyy')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-semibold text-gray-900 break-all">{order.email}</p>
                    </div>
                  </div>

                  {order.phone && (
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-semibold text-gray-900">{order.phone}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <CreditCard className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Payment Method</p>
                      <p className="font-semibold text-gray-900">{order.paymentMethod}</p>
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Order Items */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Items Ordered ({order.items.length})</h3>
                  {order.items.map((item, index) => (
                    <div key={index} className="flex gap-4 p-3 bg-gray-50 rounded-lg">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 line-clamp-2">
                          {item.title}
                        </h4>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-sm text-gray-500">
                            Qty: {item.qty}
                          </p>
                          <p className="text-sm text-gray-600">
                            ₹{Number(item.price || 0).toLocaleString('en-IN')} each
                          </p>
                        </div>
                        <p className="font-semibold text-gray-900 mt-1">
                          Total: ₹{(Number(item.price || 0) * Number(item.qty || 0)).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Delivery Information */}
              {order.shippingAddress && (
                <Card className="p-6 mt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-bold text-gray-900">Delivery Address</h2>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-900">{order.shippingAddress.address}</p>
                    <p className="text-gray-600">
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}
                    </p>
                    <p className="text-gray-600">{order.shippingAddress.country}</p>
                  </div>
                </Card>
              )}
            </motion.div>

          {/* Column 2 - What's Next */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="p-6 bg-blue-50 border-blue-200 h-full">
              <h2 className="text-lg font-bold text-gray-900 mb-4">What's Next?</h2>
                
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="bg-blue-500 text-white rounded-full h-8 w-8 flex items-center justify-center font-bold shrink-0">
                      1
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Payment Verification</p>
                      <p className="text-sm text-gray-600">
                        We're verifying your payment details
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="bg-blue-500 text-white rounded-full h-8 w-8 flex items-center justify-center font-bold shrink-0">
                      2
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Order Processing</p>
                      <p className="text-sm text-gray-600">
                        Your order will be prepared for shipping
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="bg-blue-500 text-white rounded-full h-8 w-8 flex items-center justify-center font-bold shrink-0">
                      3
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Delivery</p>
                      <p className="text-sm text-gray-600">
                        Estimated: {getEstimatedDelivery()}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800 font-medium">
                    📧 A confirmation email has been sent to {order.email}
                  </p>
                </div>
              </Card>
            </motion.div>

            {/* Column 3 - Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card className="p-6 h-full">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  Order Summary
                </h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-600">
                    <span>Platform Fee</span>
                    <span>₹7</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total Paid</span>
                    <span>₹{order.total.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm font-semibold text-green-900">
                          Payment {order.paymentStatus}
                        </p>
                        {order.upiTransactionId && (
                          <p className="text-xs text-green-700 mt-1">
                            UPI ID: {order.upiTransactionId}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
        </div>

        {/* Action Buttons - Full Width Below */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <Link to="/track-order" className="block">
              <Button className="w-full" size="lg">
                <Truck className="h-5 w-5 mr-2" />
                Track Your Order
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.95 }}
          >
            <Link to="/history" className="block">
              <Button variant="outline" className="w-full" size="lg">
                <Package className="h-5 w-5 mr-2" />
                View Order History
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            <Link to="/" className="block">
              <Button variant="ghost" className="w-full" size="lg">
                <ShoppingBag className="h-5 w-5 mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Help Card - Full Width Below */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="mt-6"
        >
          <Card className="p-6 bg-gray-50">
            <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
            <p className="text-sm text-gray-600 mb-4">
              If you have any questions about your order, feel free to contact our support team.
            </p>
            <Link to="/services">
              <Button variant="link" className="p-0 h-auto">
                Contact Support <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderSuccess;
