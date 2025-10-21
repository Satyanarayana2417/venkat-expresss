import { useState, useEffect } from 'react';
import { doc, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Plus, MapPin, Clock, X, CreditCard, Image as ImageIcon, ExternalLink } from 'lucide-react';

interface TrackingEvent {
  status: string;
  location: string;
  timestamp: any;
  description?: string;
}

interface OrderDetailProps {
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const AdminOrderDetail = ({ orderId, isOpen, onClose }: OrderDetailProps) => {
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [newStatus, setNewStatus] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (isOpen && orderId) {
      fetchOrderDetails();
    }
  }, [isOpen, orderId]);

  const fetchOrderDetails = async () => {
    try {
      const orderDoc = await getDoc(doc(db, 'orders', orderId));
      if (orderDoc.exists()) {
        setOrder({ id: orderDoc.id, ...orderDoc.data() });
        setNewStatus(orderDoc.data().status || 'pending');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Failed to load order details');
    }
  };

  const addTrackingEvent = async () => {
    if (!newStatus || !location) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const orderRef = doc(db, 'orders', orderId);
      const currentTracking = order?.trackingHistory || [];

      const newEvent: TrackingEvent = {
        status: newStatus,
        location: location,
        timestamp: serverTimestamp(),
        description: description || undefined,
      };

      await updateDoc(orderRef, {
        status: newStatus,
        trackingHistory: [...currentTracking, newEvent],
      });

      toast.success('Tracking event added successfully!', {
        description: 'Customers can now see this update in real-time',
      });

      // Reset form
      setLocation('');
      setDescription('');
      
      // Refresh order data
      await fetchOrderDetails();
    } catch (error) {
      console.error('Error adding tracking event:', error);
      toast.error('Failed to add tracking event');
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    { value: 'pending', label: 'Order Placed' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'out-for-delivery', label: 'Out for Delivery' },
    { value: 'delivered', label: 'Delivered' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Order Tracking Management</DialogTitle>
          <DialogDescription>
            Order ID: <span className="font-mono font-semibold">{orderId}</span>
          </DialogDescription>
        </DialogHeader>

        {order && (
          <div className="space-y-6 py-4">
            {/* Current Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Current Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge className="text-base px-4 py-2">
                  {order.status?.replace(/-/g, ' ').toUpperCase() || 'PENDING'}
                </Badge>
              </CardContent>
            </Card>

            {/* Payment Confirmation Details */}
            <Card className="border-2 border-green-200 bg-green-50/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-900">
                  <CreditCard className="h-5 w-5" />
                  Payment Confirmation Details
                </CardTitle>
                <CardDescription>
                  Customer-provided payment verification information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* UPI Transaction ID */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">
                      UPI Transaction ID
                    </Label>
                    {order.upiTransactionId ? (
                      <div className="bg-white p-3 rounded-lg border border-gray-200">
                        <p className="font-mono text-sm break-all">
                          {order.upiTransactionId}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">
                        No transaction ID provided
                      </p>
                    )}
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">
                      Payment Method
                    </Label>
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <p className="text-sm font-medium">
                        {order.paymentMethod || 'UPI Payment'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment Screenshot */}
                {order.paymentScreenshotUrl && (
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      Payment Screenshot
                    </Label>
                    <div className="bg-white p-3 rounded-lg border-2 border-gray-300">
                      <div className="relative group">
                        <img
                          src={order.paymentScreenshotUrl}
                          alt="Payment Screenshot"
                          className="w-full max-h-96 object-contain rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => window.open(order.paymentScreenshotUrl, '_blank')}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <Button
                            variant="secondary"
                            size="sm"
                            className="shadow-lg"
                            onClick={() => window.open(order.paymentScreenshotUrl, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Full Size
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        Click image to view in full size
                      </p>
                    </div>
                  </div>
                )}

                {!order.paymentScreenshotUrl && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800 flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      No payment screenshot was uploaded by the customer
                    </p>
                  </div>
                )}

                {/* Payment Status */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">
                    Payment Status
                  </Label>
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <Badge variant={order.paymentStatus === 'Verified' ? 'default' : 'secondary'}>
                      {order.paymentStatus || 'Pending Verification'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Add New Tracking Event */}
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add New Tracking Event
                </CardTitle>
                <CardDescription>
                  Update the order status and add tracking information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status *</Label>
                    <Select value={newStatus} onValueChange={setNewStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      placeholder="e.g., Hyderabad Hub, Mumbai Facility"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="e.g., Package has left the carrier facility"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <Button
                  onClick={addTrackingEvent}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? 'Adding...' : 'Add Tracking Event'}
                </Button>
              </CardContent>
            </Card>

            {/* Tracking History */}
            {order.trackingHistory && order.trackingHistory.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Tracking History</CardTitle>
                  <CardDescription>
                    {order.trackingHistory.length} event(s) recorded
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.trackingHistory
                      .slice()
                      .reverse()
                      .map((event: TrackingEvent, index: number) => (
                        <div
                          key={index}
                          className="flex gap-4 pb-4 border-b last:border-b-0"
                        >
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <MapPin className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-semibold capitalize">
                                {event.status.replace(/-/g, ' ')}
                              </p>
                              {event.timestamp && (
                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {new Date(event.timestamp.seconds * 1000).toLocaleString()}
                                </p>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              <MapPin className="h-3 w-3 inline mr-1" />
                              {event.location}
                            </p>
                            {event.description && (
                              <p className="text-sm text-gray-700 mt-1">
                                {event.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Order Details */}
            <Card>
              <CardHeader>
                <CardTitle>Order Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Customer</p>
                    <p className="font-semibold">{order.customer}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p className="font-semibold">{order.email}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Amount</p>
                    <p className="font-semibold">₹{order.total?.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Order Date</p>
                    <p className="font-semibold">{order.date}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
