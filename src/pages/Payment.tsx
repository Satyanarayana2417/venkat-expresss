import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Package, 
  QrCode as QrCodeIcon,
  Loader2,
  AlertCircle,
  ShoppingBag,
  Upload,
  X,
  Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import QRCode from 'react-qr-code';
import { generateOrderId, createUPIString, saveOrder, formatCurrency, OrderData } from '@/lib/orderUtils';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { UPIPaymentButtons } from '@/components/UPIPaymentButtons';

const Payment = () => {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [orderId, setOrderId] = useState<string>('');
  const [upiString, setUpiString] = useState<string>('');
  const [transactionId, setTransactionId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string>('');
  const [uploadingScreenshot, setUploadingScreenshot] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      navigate('/cart');
    }
  }, [items, navigate]);

  // Generate order ID and UPI string on mount
  useEffect(() => {
    if (items.length > 0 && !orderId) {
      const newOrderId = generateOrderId();
      setOrderId(newOrderId);
      
      const totalAmount = subtotal + 7; // Add platform fee
      const upi = createUPIString(newOrderId, totalAmount);
      setUpiString(upi);
      
      console.log('✅ Generated Order ID:', newOrderId);
      console.log('✅ Generated UPI String:', upi);
      console.log('✅ Total Amount (with platform fee):', totalAmount);
    }
  }, [items, subtotal, orderId]);

  // Handle screenshot file selection
  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setPaymentScreenshot(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setScreenshotPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    toast.success('Screenshot selected successfully');
  };

  // Remove screenshot
  const handleRemoveScreenshot = () => {
    setPaymentScreenshot(null);
    setScreenshotPreview('');
  };

  const handleConfirmOrder = async () => {
    // Validate: At least one of Transaction ID or Screenshot must be provided
    if (!transactionId.trim() && !paymentScreenshot) {
      toast.error('Please provide either UPI Transaction ID or payment screenshot');
      return;
    }

    if (!user) {
      toast.error('User not authenticated');
      navigate('/auth');
      return;
    }

    setIsSubmitting(true);

    try {
      let screenshotUrl = '';
      
      // Upload screenshot to Cloudinary if provided
      if (paymentScreenshot) {
        setUploadingScreenshot(true);
        try {
          screenshotUrl = await uploadToCloudinary(paymentScreenshot, 'image');
          console.log('✅ Screenshot uploaded:', screenshotUrl);
        } catch (error) {
          console.error('❌ Error uploading screenshot:', error);
          toast.error('Failed to upload screenshot, but continuing with order...');
        } finally {
          setUploadingScreenshot(false);
        }
      }

      const totalAmount = subtotal + 7; // Add platform fee
      const orderData: Partial<OrderData> = {
        orderId: orderId,
        orderNumber: orderId,
        customer: user.displayName || user.email?.split('@')[0] || 'Customer',
        email: user.email || '',
        phone: user.phoneNumber || '',
        userId: user.uid,
        items: items,
        total: totalAmount,
        subtotal: subtotal,
        tax: 0,
        shippingCost: 0,
        upiTransactionId: transactionId.trim(),
        paymentScreenshotUrl: screenshotUrl || '', // Add screenshot URL
        orderStatus: 'Payment Verification Pending',
        paymentStatus: 'Pending Verification',
        paymentMethod: 'UPI',
        date: new Date().toISOString().split('T')[0],
      };

      // Save order to Firestore
      const firestoreOrderId = await saveOrder(orderData);
      
      console.log('✅ Order confirmed:', firestoreOrderId);
      
      // Clear the cart after successful order
      clearCart();
      
      toast.success('Order placed successfully! 🎉');
      
      // Show processing state
      setIsProcessing(true);
      
      // Add a small delay to ensure Firestore has propagated the data
      // This prevents race conditions on the OrderSuccess page
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Navigate to order success page with order ID
      // The OrderSuccess page will fetch from Firestore and display the confirmation
      navigate(`/order/success/${firestoreOrderId}`);
      
    } catch (error: any) {
      console.error('❌ Error placing order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Main payment screen
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Processing Modal Overlay */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-8 shadow-xl max-w-sm w-full mx-4"
            >
              <div className="flex flex-col items-center justify-center gap-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                  <Loader2 className="h-12 w-12 text-primary" />
                </motion.div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Confirming Order
                  </h3>
                  <p className="text-sm text-gray-600">
                    Please wait while we process your order...
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/cart')}
              className="h-9 w-9"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Complete Payment</h1>
              <p className="text-sm text-gray-500">Order ID: {orderId}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* First Column - Order Summary */}
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Package className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Order Summary</h2>
              </div>
              
              {/* Cart Items */}
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-3 pb-3 border-b border-gray-100 last:border-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {item.title}
                      </h3>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm text-gray-500">Qty: {item.qty}</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {formatCurrency(item.priceINR * item.qty)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown - Detailed like Cart page */}
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-gray-500 text-sm font-medium uppercase mb-3">
                  Price Details
                </h3>
                
                <div className="space-y-3 mb-3 pb-3 border-b">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">Price ({items.length} item{items.length > 1 ? 's' : ''})</span>
                    <span className="text-gray-900">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  
                  {/* Show Discount only if applicable */}
                  {(() => {
                    const totalDiscount = items.reduce((total, item) => {
                      if (item.originalPrice && item.originalPrice > item.priceINR) {
                        return total + ((item.originalPrice - item.priceINR) * item.qty);
                      }
                      return total;
                    }, 0);
                    
                    return totalDiscount > 0 ? (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-700">Discount</span>
                        <span className="text-green-600">
                          − ₹{Math.round(totalDiscount).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ) : null;
                  })()}

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">Platform Fee</span>
                    <span className="text-gray-900">₹7</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">Delivery Charges</span>
                    <span className="text-green-600 flex items-center gap-1">
                      <span className="line-through text-gray-400 text-xs">₹40</span> Free
                    </span>
                  </div>
                </div>

                {/* Total Amount */}
                <div className="flex justify-between text-base font-bold mb-3 pb-3 border-b">
                  <span className="text-gray-900">Total Amount</span>
                  <span className="text-gray-900">₹{Math.round(subtotal + 7).toLocaleString('en-IN')}</span>
                </div>

                {/* Savings Info - Only show if there's actual discount */}
                {(() => {
                  const totalDiscount = items.reduce((total, item) => {
                    if (item.originalPrice && item.originalPrice > item.priceINR) {
                      return total + ((item.originalPrice - item.priceINR) * item.qty);
                    }
                    return total;
                  }, 0);
                  
                  return totalDiscount > 0 ? (
                    <div className="bg-green-50 px-3 py-2 rounded">
                      <p className="text-green-700 font-medium text-xs">
                        You will save ₹{Math.round(totalDiscount).toLocaleString('en-IN')} on this order
                      </p>
                    </div>
                  ) : null;
                })()}
              </div>
            </Card>

            {/* Mobile: Show this card on small screens below QR */}
            <Card className="p-6 md:hidden">
              <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Important:</p>
                  <p>The payment amount is locked to ₹{Math.round(subtotal + 7).toFixed(2)} and cannot be changed during UPI payment.</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Second Column - QR Code (Scan to Pay) */}
          <div className="space-y-6">
            {/* QR Code Card */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <QrCodeIcon className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Scan to Pay</h2>
              </div>

              {/* QR Code Display */}
              <div className="bg-white p-6 rounded-lg border-2 border-dashed border-gray-300 mb-4">
                {upiString ? (
                  <div className="flex flex-col items-center">
                    <QRCode
                      value={upiString}
                      size={220}
                      level="H"
                      className="mb-3"
                    />
                    <p className="text-xs text-gray-500 text-center">
                      Scan with any UPI app to pay
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                )}
              </div>

              {/* Payment Details */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Payee Name:</span>
                  <span className="font-medium">Satyanarayana</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">UPI ID:</span>
                  <span className="font-medium">9121055512@ybl</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-bold text-primary">₹{Math.round(subtotal + 7).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-medium text-xs">{orderId}</span>
                </div>
              </div>

              {/* Desktop: Show alert here */}
              <div className="hidden md:block mt-4">
                <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Important:</p>
                    <p>The payment amount is locked to ₹{Math.round(subtotal + 7).toFixed(2)} and cannot be changed during UPI payment.</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Mobile: Show Payment Confirmation below QR on small/medium screens */}
            <Card className="p-6 lg:hidden">
              <h2 className="text-lg font-semibold mb-4">Payment Confirmation</h2>
              
              <div className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-yellow-800 font-medium mb-2">
                    📱 Steps to Complete Payment:
                  </p>
                  <ol className="text-sm text-yellow-800 space-y-1 list-decimal list-inside">
                    <li>Scan the QR code above OR use payment buttons below</li>
                    <li>Complete the payment in your UPI app</li>
                    <li>Return here and enter Transaction ID OR Upload Screenshot</li>
                    <li>Click confirm to place your order</li>
                  </ol>
                </div>

                {/* UPI Payment Buttons - Mobile Only */}
                {orderId && subtotal > 0 && (
                  <UPIPaymentButtons
                    orderId={orderId}
                    amount={subtotal + 7}
                    payeeVPA="9121055512@ybl"
                    payeeName="satyanarayana"
                  />
                )}

                <div>
                  <Label htmlFor="transactionId-mobile" className="text-base font-medium mb-2 block">
                    UPI Transaction ID <span className="text-gray-500 text-sm">(Optional)</span>
                  </Label>
                  <Input
                    id="transactionId-mobile"
                    type="text"
                    placeholder="Enter your UPI Transaction ID"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="h-12 text-base"
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Provide either Transaction ID or upload payment screenshot below
                  </p>
                </div>

                {/* Payment Screenshot Upload (Optional) */}
                <div className="border-t pt-4">
                  <Label htmlFor="paymentScreenshot-mobile" className="text-base font-medium mb-2 block">
                    Upload Payment Screenshot <span className="text-gray-500 text-sm">(Optional)</span>
                  </Label>
                  <p className="text-xs text-gray-500 mb-3">
                    Alternative to Transaction ID - upload a screenshot for payment verification
                  </p>
                  
                  {!screenshotPreview ? (
                    <div className="relative">
                      <input
                        id="paymentScreenshot-mobile"
                        type="file"
                        accept="image/*"
                        onChange={handleScreenshotUpload}
                        className="hidden"
                        disabled={isSubmitting}
                      />
                      <label htmlFor="paymentScreenshot-mobile">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer">
                          <div className="flex flex-col items-center justify-center text-center">
                            <Upload className="h-10 w-10 text-gray-400 mb-2" />
                            <p className="text-sm font-medium text-gray-700 mb-1">
                              Click to upload screenshot
                            </p>
                            <p className="text-xs text-gray-500">
                              PNG, JPG, WEBP up to 5MB
                            </p>
                          </div>
                        </div>
                      </label>
                    </div>
                  ) : (
                    <div className="relative border-2 border-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={screenshotPreview}
                        alt="Payment screenshot"
                        className="w-full h-48 object-contain bg-gray-50"
                      />
                      <button
                        onClick={handleRemoveScreenshot}
                        disabled={isSubmitting}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg transition-colors disabled:opacity-50"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white px-3 py-2">
                        <p className="text-xs truncate flex items-center gap-2">
                          <ImageIcon className="h-3 w-3" />
                          {paymentScreenshot?.name}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleConfirmOrder}
                  disabled={(!transactionId.trim() && !paymentScreenshot) || isSubmitting || uploadingScreenshot}
                  className="w-full h-12 text-base font-semibold"
                  size="lg"
                >
                  {uploadingScreenshot ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Uploading Screenshot...
                    </>
                  ) : isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing Order...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-5 w-5" />
                      Confirm Order
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-gray-500">
                  By confirming, you agree that payment has been completed
                </p>
              </div>
            </Card>
          </div>

          {/* Third Column - Payment Confirmation (Desktop Only) */}
          <div className="hidden lg:block space-y-6">
            {/* Transaction Confirmation Card */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Payment Confirmation</h2>
              
              <div className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-yellow-800 font-medium mb-2">
                    📱 Steps to Complete Payment:
                  </p>
                  <ol className="text-sm text-yellow-800 space-y-1 list-decimal list-inside">
                    <li>Scan the QR code with any UPI app</li>
                    <li>Complete the payment</li>
                    <li>Provide proof: Enter Transaction ID OR Upload Screenshot</li>
                    <li>Click confirm to place your order</li>
                  </ol>
                </div>

                <div>
                  <Label htmlFor="transactionId" className="text-base font-medium mb-2 block">
                    UPI Transaction ID <span className="text-gray-500 text-sm">(Optional)</span>
                  </Label>
                  <Input
                    id="transactionId"
                    type="text"
                    placeholder="Enter your UPI Transaction ID"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="h-12 text-base"
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Provide either Transaction ID or upload payment screenshot below
                  </p>
                </div>

                {/* Payment Screenshot Upload (Optional) */}
                <div className="border-t pt-4">
                  <Label htmlFor="paymentScreenshot" className="text-base font-medium mb-2 block">
                    Upload Payment Screenshot <span className="text-gray-500 text-sm">(Optional)</span>
                  </Label>
                  <p className="text-xs text-gray-500 mb-3">
                    Alternative to Transaction ID - upload a screenshot for payment verification
                  </p>
                  
                  {!screenshotPreview ? (
                    <div className="relative">
                      <input
                        id="paymentScreenshot"
                        type="file"
                        accept="image/*"
                        onChange={handleScreenshotUpload}
                        className="hidden"
                        disabled={isSubmitting}
                      />
                      <label htmlFor="paymentScreenshot">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer">
                          <div className="flex flex-col items-center justify-center text-center">
                            <Upload className="h-10 w-10 text-gray-400 mb-2" />
                            <p className="text-sm font-medium text-gray-700 mb-1">
                              Click to upload screenshot
                            </p>
                            <p className="text-xs text-gray-500">
                              PNG, JPG, WEBP up to 5MB
                            </p>
                          </div>
                        </div>
                      </label>
                    </div>
                  ) : (
                    <div className="relative border-2 border-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={screenshotPreview}
                        alt="Payment screenshot"
                        className="w-full h-48 object-contain bg-gray-50"
                      />
                      <button
                        onClick={handleRemoveScreenshot}
                        disabled={isSubmitting}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg transition-colors disabled:opacity-50"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white px-3 py-2">
                        <p className="text-xs truncate flex items-center gap-2">
                          <ImageIcon className="h-3 w-3" />
                          {paymentScreenshot?.name}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleConfirmOrder}
                  disabled={(!transactionId.trim() && !paymentScreenshot) || isSubmitting || uploadingScreenshot}
                  className="w-full h-12 text-base font-semibold"
                  size="lg"
                >
                  {uploadingScreenshot ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Uploading Screenshot...
                    </>
                  ) : isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing Order...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-5 w-5" />
                      Confirm Order
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-gray-500">
                  By confirming, you agree that payment has been completed
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
