import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Search, Package, MapPin, Clock, CheckCircle, Truck, Home as HomeIcon, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

interface TrackingEvent {
  status: string;
  location: string;
  timestamp: any;
  description?: string;
}

interface OrderData {
  id: string;
  customer: string;
  email: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'out-for-delivery' | 'delivered' | 'cancelled';
  date: string;
  items: any[];
  trackingHistory?: TrackingEvent[];
  estimatedDelivery?: any;
  createdAt?: any;
}

const TrackOrder = () => {
  const { t } = useTranslation();
  const [orderId, setOrderId] = useState('');
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isTracking, setIsTracking] = useState(false);

  // Cleanup listener on unmount
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const trackOrder = async () => {
    if (!orderId.trim()) {
      toast.error(t('trackOrder.errors.enterOrderId'));
      return;
    }

    setLoading(true);
    setError('');
    setOrderData(null);

    try {
      // Set up real-time listener for the order
      const orderRef = doc(db, 'orders', orderId.trim());
      
      const unsubscribe = onSnapshot(
        orderRef,
        (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setOrderData({
              id: docSnap.id,
              customer: data.customer || data.customerName || 'N/A',
              email: data.email || data.customerEmail || '',
              total: data.total || data.totalAmount || 0,
              status: data.status || 'pending',
              date: data.date || data.orderDate || new Date().toISOString().split('T')[0],
              items: data.items || [],
              trackingHistory: data.trackingHistory || [],
              estimatedDelivery: data.estimatedDelivery,
              createdAt: data.createdAt
            });
            setIsTracking(true);
            setError('');
            
            // Show update notification (only after initial load)
            if (isTracking) {
              toast.success(t('trackOrder.toast.orderStatusUpdated'), {
                description: t('trackOrder.toast.trackingRefreshed')
              });
            }
          } else {
            setError(t('trackOrder.errors.orderNotFound'));
            setOrderData(null);
            setIsTracking(false);
          }
          setLoading(false);
        },
        (err) => {
          console.error('Error fetching order:', err);
          setError(t('trackOrder.errors.fetchFailed'));
          setLoading(false);
          setIsTracking(false);
        }
      );

      // Store unsubscribe function for cleanup
      return () => unsubscribe();
    } catch (err) {
      console.error('Error setting up listener:', err);
      setError(t('trackOrder.errors.genericError'));
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5" />;
      case 'processing':
        return <Package className="h-5 w-5" />;
      case 'shipped':
        return <Truck className="h-5 w-5" />;
      case 'out-for-delivery':
        return <MapPin className="h-5 w-5" />;
      case 'delivered':
        return <HomeIcon className="h-5 w-5" />;
      default:
        return <Package className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'out-for-delivery':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const milestones = [
    { key: 'pending', label: t('trackOrder.statuses.pending'), icon: Clock },
    { key: 'processing', label: t('trackOrder.statuses.processing'), icon: Package },
    { key: 'shipped', label: t('trackOrder.statuses.shipped'), icon: Truck },
    { key: 'out-for-delivery', label: t('trackOrder.statuses.outForDelivery'), icon: MapPin },
    { key: 'delivered', label: t('trackOrder.statuses.delivered'), icon: HomeIcon },
  ];

  const getCurrentMilestoneIndex = (status: string) => {
    const index = milestones.findIndex(m => m.key === status);
    return index >= 0 ? index : 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="container max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Package className="h-16 w-16 mx-auto mb-4 text-primary" />
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
            {t('trackOrder.pageTitle')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('trackOrder.pageSubtitle')}
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8 shadow-lg">
          <CardContent className="pt-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                trackOrder();
              }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <div className="flex-1">
                <Label htmlFor="orderId" className="text-base font-semibold mb-2 block">
                  {t('trackOrder.orderIdLabel')}
                </Label>
                <Input
                  id="orderId"
                  type="text"
                  placeholder={t('trackOrder.orderIdPlaceholder')}
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="text-base h-12"
                  disabled={loading}
                />
              </div>
              <div className="sm:self-end">
                <Button
                  type="submit"
                  className="w-full sm:w-auto h-12 px-8"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      {t('trackOrder.searching')}
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      {t('trackOrder.trackOrderBtn')}
                    </>
                  )}
                </Button>
              </div>
            </form>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tracking Information */}
        {orderData && (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Live Indicator */}
            {isTracking && (
              <div className="flex items-center justify-center gap-2 text-sm text-green-600">
                <div className="h-2 w-2 rounded-full bg-green-600 animate-pulse" />
                <span className="font-medium">{t('trackOrder.liveTrackingActive')}</span>
              </div>
            )}

            {/* Order Summary Header */}
            <Card className="shadow-lg border-2">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{t('trackOrder.orderIdText')}</p>
                    <p className="font-bold text-lg">{orderData.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{t('trackOrder.orderDate')}</p>
                    <p className="font-semibold">{orderData.date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{t('trackOrder.estimatedDelivery')}</p>
                    <p className="font-semibold text-primary">
                      {orderData.estimatedDelivery
                        ? format(orderData.estimatedDelivery.toDate(), 'MMM dd, yyyy')
                        : t('trackOrder.businessDays')}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(orderData.status)}
                      <span className="font-semibold text-lg">{t('trackOrder.currentStatus')}</span>
                    </div>
                    <Badge className={`${getStatusColor(orderData.status)} border px-4 py-2 text-base`}>
                      {orderData.status.replace(/-/g, ' ').toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Visual Progress Timeline */}
            <Card className="shadow-lg">
              <CardContent className="pt-8 pb-8">
                <h3 className="font-heading text-2xl font-bold mb-8 text-center">{t('trackOrder.shipmentProgress')}</h3>
                
                {/* Desktop Timeline */}
                <div className="hidden md:block">
                  <div className="relative">
                    {/* Progress Line */}
                    <div className="absolute top-8 left-0 right-0 h-1 bg-gray-200" />
                    <div
                      className="absolute top-8 left-0 h-1 bg-primary transition-all duration-500"
                      style={{
                        width: `${(getCurrentMilestoneIndex(orderData.status) / (milestones.length - 1)) * 100}%`
                      }}
                    />

                    {/* Milestones */}
                    <div className="relative flex justify-between">
                      {milestones.map((milestone, index) => {
                        const isActive = getCurrentMilestoneIndex(orderData.status) >= index;
                        const isCurrent = milestone.key === orderData.status;
                        const Icon = milestone.icon;

                        return (
                          <div key={milestone.key} className="flex flex-col items-center" style={{ width: '20%' }}>
                            <div
                              className={`w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                                isActive
                                  ? 'bg-primary border-primary text-white shadow-lg scale-110'
                                  : 'bg-white border-gray-300 text-gray-400'
                              } ${isCurrent ? 'ring-4 ring-primary/30 animate-pulse' : ''}`}
                            >
                              <Icon className="h-7 w-7" />
                            </div>
                            <p
                              className={`mt-4 text-sm font-semibold text-center ${
                                isActive ? 'text-primary' : 'text-gray-400'
                              }`}
                            >
                              {milestone.label}
                            </p>
                            {isCurrent && (
                              <Badge className="mt-2 bg-primary text-white">{t('trackOrder.current')}</Badge>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Mobile Timeline */}
                <div className="md:hidden space-y-4">
                  {milestones.map((milestone, index) => {
                    const isActive = getCurrentMilestoneIndex(orderData.status) >= index;
                    const isCurrent = milestone.key === orderData.status;
                    const Icon = milestone.icon;

                    return (
                      <div key={milestone.key} className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all ${
                            isActive
                              ? 'bg-primary border-primary text-white'
                              : 'bg-white border-gray-300 text-gray-400'
                          } ${isCurrent ? 'ring-4 ring-primary/30' : ''}`}
                        >
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <p className={`font-semibold ${isActive ? 'text-primary' : 'text-gray-400'}`}>
                            {milestone.label}
                          </p>
                          {isCurrent && (
                            <Badge className="mt-1 bg-primary text-white text-xs">{t('trackOrder.currentStatusBadge')}</Badge>
                          )}
                        </div>
                        {isActive && <CheckCircle className="h-5 w-5 text-green-600" />}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Tracking History */}
            {orderData.trackingHistory && orderData.trackingHistory.length > 0 && (
              <Card className="shadow-lg">
                <CardContent className="pt-6">
                  <h3 className="font-heading text-2xl font-bold mb-6">{t('trackOrder.trackingHistory')}</h3>
                  <div className="space-y-4">
                    {orderData.trackingHistory
                      .slice()
                      .reverse()
                      .map((event, index) => (
                        <div
                          key={index}
                          className="flex gap-4 pb-4 border-b last:border-b-0 last:pb-0"
                        >
                          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <MapPin className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-1">
                              <p className="font-semibold text-lg capitalize">
                                {event.status.replace(/-/g, ' ')}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {event.timestamp
                                  ? format(event.timestamp.toDate(), 'MMM dd, yyyy • hh:mm a')
                                  : 'N/A'}
                              </p>
                            </div>
                            <p className="text-sm text-muted-foreground mb-1">
                              <MapPin className="h-3 w-3 inline mr-1" />
                              {event.location}
                            </p>
                            {event.description && (
                              <p className="text-sm text-gray-700 mt-2">{event.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Order Contents */}
            {orderData.items && orderData.items.length > 0 && (
              <Card className="shadow-lg">
                <CardContent className="pt-6">
                  <h3 className="font-heading text-2xl font-bold mb-6">{t('trackOrder.orderItems')}</h3>
                  <div className="space-y-3">
                    {orderData.items.map((item: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <Package className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-semibold">{item.name || item.productName || t('trackOrder.product')}</p>
                            <p className="text-sm text-muted-foreground">
                              {t('trackOrder.quantity')} {item.quantity || 1}
                            </p>
                          </div>
                        </div>
                        <p className="font-semibold">
                          ₹{((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                        </p>
                      </div>
                    ))}
                    <div className="flex justify-between items-center pt-4 border-t-2 border-gray-200">
                      <p className="font-bold text-lg">{t('trackOrder.totalAmount')}</p>
                      <p className="font-bold text-xl text-primary">₹{orderData.total.toFixed(2)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;
