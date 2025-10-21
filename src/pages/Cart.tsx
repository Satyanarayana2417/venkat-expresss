import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Heart, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { LoginRequiredModal } from '@/components/LoginRequiredModal';
import { AddressSelectionModal } from '@/components/AddressSelectionModal';
import { AddAddressModal } from '@/components/AddAddressModal';
import { getAddressByType, Address, saveAddress } from '@/lib/addressService';

const Cart = () => {
  const { items, updateQuantity, removeFromCart, subtotal, clearCart } = useCart();
  const { addToWishlist } = useWishlist();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showInlineAddressForm, setShowInlineAddressForm] = useState(false);
  const [userAddress, setUserAddress] = useState<Address | null>(null);
  const [loadingAddress, setLoadingAddress] = useState(false);

  // Fetch user's saved address
  useEffect(() => {
    const fetchUserAddress = async () => {
      if (!user) {
        setUserAddress(null);
        return;
      }

      try {
        setLoadingAddress(true);
        // Try to get home address first, fall back to work address
        const homeAddr = await getAddressByType(user.uid, 'home');
        if (homeAddr) {
          setUserAddress(homeAddr);
        } else {
          const workAddr = await getAddressByType(user.uid, 'work');
          setUserAddress(workAddr);
        }
      } catch (error) {
        console.error('Error fetching address:', error);
        setUserAddress(null);
      } finally {
        setLoadingAddress(false);
      }
    };

    fetchUserAddress();
  }, [user]);

  const handleSaveForLater = (item: any) => {
    // Check if user is logged in for wishlist
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    
    addToWishlist({
      productId: item.productId,
      title: item.title,
      priceINR: item.priceINR,
      image: item.image,
      slug: item.slug || item.productId,
    });
    removeFromCart(item.productId);
    toast.success('Item moved to wishlist');
  };

  const handleCheckout = () => {
    // Check if user is logged in for checkout
    if (!user) {
      toast.error('Please login to proceed to checkout');
      setShowLoginModal(true);
      return;
    }
    
    // Navigate to payment page
    navigate('/payment');
  };

  const calculateDiscount = (original?: number, current?: number) => {
    if (!original || !current || original <= current) return null;
    const discount = Math.round(((original - current) / original) * 100);
    return discount;
  };

  const handleAddressSelect = (address: Address) => {
    setUserAddress(address);
    setShowInlineAddressForm(false); // Close inline form if open
  };

  const handleChangeAddress = () => {
    if (!user) {
      setShowLoginModal(true);
    } else if (!userAddress) {
      // If no address exists, show inline form instead of modal
      setShowInlineAddressForm(true);
    } else {
      // If address exists, show modal to change it
      setShowAddressModal(true);
    }
  };

  const handleSaveAddress = async (address: Address) => {
    if (!user) return;

    try {
      await saveAddress(user.uid, address);
      setUserAddress(address);
      setShowInlineAddressForm(false);
      toast.success('Address saved successfully!');
      
      // Refresh the address to get the ID from Firestore
      const savedAddress = await getAddressByType(user.uid, address.type);
      if (savedAddress) {
        setUserAddress(savedAddress);
      }
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error('Failed to save address. Please try again.');
      throw error; // Re-throw to let the form handle it
    }
  };

  const handleCancelAddressForm = () => {
    setShowInlineAddressForm(false);
  };

  if (items.length === 0) {
    return (
      <>
        {/* Mobile Header - Only show on mobile */}
        <div className="md:hidden bg-white sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-3 px-4 py-3">
            <Link to="/">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-base font-medium text-gray-900">My Cart</h1>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md mx-auto"
          >
            <ShoppingBag className="h-16 w-16 md:h-24 md:w-24 mx-auto text-gray-300 mb-4 md:mb-6" />
            <h2 className="text-sm md:text-3xl font-semibold md:font-bold mb-2 md:mb-4">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-6 md:mb-8 text-sm md:text-base">
              Add some products to your cart to get started!
            </p>
            <Link to="/products">
              <Button size="lg">
                Browse Products
              </Button>
            </Link>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Mobile View */}
      <div className="md:hidden min-h-screen bg-gray-50 pb-24">
        {/* Header with Back Button */}
        <div className="bg-white sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-3 px-4 py-3">
            <Link to="/">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-base font-medium text-gray-900">My Cart</h1>
          </div>
        </div>

        {/* Delivery Address Section - Mobile */}
        <div className="bg-white border-b p-4 mb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {loadingAddress ? (
                <div className="flex items-center gap-2 text-gray-500">
                  <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                  <span className="text-sm">Loading address...</span>
                </div>
              ) : userAddress ? (
                <>
                  <h3 className="font-medium text-gray-900 text-sm mb-1">
                    Deliver to: <span className="font-semibold">{userAddress.fullName}</span>
                  </h3>
                  <p className="text-xs text-gray-600">
                    {userAddress.flatBuilding}, {userAddress.areaStreet}
                    {userAddress.landmark && `, ${userAddress.landmark}`}
                  </p>
                  <p className="text-xs text-gray-600">
                    {userAddress.city}, {userAddress.state} - {userAddress.pincode}
                  </p>
                </>
              ) : user ? (
                <>
                  <h3 className="font-medium text-gray-900 text-sm mb-1">
                    No address saved
                  </h3>
                  <p className="text-xs text-gray-600">Add a delivery address to continue</p>
                </>
              ) : (
                <>
                  <h3 className="font-medium text-gray-900 text-sm mb-1">
                    Please login
                  </h3>
                  <p className="text-xs text-gray-600">Login to see your saved address</p>
                </>
              )}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-blue-600 border-blue-600 hover:bg-blue-50 text-xs h-8 px-3"
              onClick={handleChangeAddress}
            >
              {userAddress ? 'Change' : 'Add'}
            </Button>
          </div>
        </div>

        {/* Inline Address Form - Mobile */}
        {showInlineAddressForm && !userAddress && user && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 mb-3"
          >
            <AddAddressModal
              isOpen={true}
              onClose={handleCancelAddressForm}
              onSave={handleSaveAddress}
              addressType="home"
              inline={true}
            />
          </motion.div>
        )}

        {/* Cart Items List */}
        <div className="space-y-3 p-4">
          {items.map((item) => {
            const discount = calculateDiscount(item.originalPrice, item.priceINR);
            
            return (
              <motion.div
                key={item.productId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm p-3 relative"
              >
                {/* Delete Icon - Top Right */}
                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-5 w-5" />
                </button>

                {/* Product Content */}
                <div className="flex gap-3">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-20 h-20 object-cover rounded"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0 pr-6">
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2">
                      {item.title}
                    </h3>

                    {/* Delivery Badge */}
                    <div className="inline-flex items-center gap-1.5 mb-3">
                      <Package className="h-3.5 w-3.5 text-green-600" />
                      <span className="text-xs text-green-600 font-medium">
                        Free delivery by tomorrow
                      </span>
                    </div>

                    {/* Quantity and Price Row */}
                    <div className="flex items-center justify-between">
                      {/* Quantity Selector */}
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Qty:</span>
                        <Select
                          value={item.qty.toString()}
                          onValueChange={(value) => updateQuantity(item.productId, parseInt(value))}
                        >
                          <SelectTrigger className="h-8 w-16 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">
                          ₹{(item.priceINR * item.qty).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Save for Later Button */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-sm text-gray-700 hover:text-gray-900 p-0 h-auto font-normal"
                    onClick={() => handleSaveForLater(item)}
                  >
                    <Heart className="h-4 w-4 mr-1.5" />
                    Save for Later
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Sticky Footer - Mobile Only */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-20">
          <div className="flex items-center justify-between px-4 py-3">
            {/* Total Price */}
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-gray-900">
                {subtotal > 0 ? `₹${Math.round(subtotal).toLocaleString('en-IN')}` : '₹0'}
              </div>
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>

            {/* Place Order Button */}
            <Button
              size="lg"
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-10 h-12 text-base rounded-md"
              onClick={handleCheckout}
            >
              Place order
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop View - Flipkart Style */}
      <div className="hidden md:block bg-gray-50 min-h-screen">
        {/* Tabs Section */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-8">
              <button className="py-4 px-2 border-b-2 border-blue-600 text-blue-600 font-medium">
                Items ({items.length})
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left Section - Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {/* Delivery Address Card */}
              <Card className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {loadingAddress ? (
                      <div className="flex items-center gap-2 text-gray-500">
                        <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                        <span className="text-sm">Loading address...</span>
                      </div>
                    ) : userAddress ? (
                      <>
                        <h3 className="font-medium text-gray-700 mb-1">
                          Deliver to: <span className="font-semibold text-gray-900">{userAddress.fullName}</span>
                        </h3>
                        <p className="text-sm text-gray-600">
                          {userAddress.flatBuilding}, {userAddress.areaStreet}
                          {userAddress.landmark && `, ${userAddress.landmark}`}
                        </p>
                        <p className="text-sm text-gray-600">
                          {userAddress.city}, {userAddress.state} - {userAddress.pincode}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Phone: {userAddress.mobileNumber}
                        </p>
                      </>
                    ) : user ? (
                      <>
                        <h3 className="font-medium text-gray-700 mb-1">
                          Deliver to: <span className="font-semibold text-gray-900">No address saved</span>
                        </h3>
                        <p className="text-sm text-gray-600">Please add a delivery address</p>
                      </>
                    ) : (
                      <>
                        <h3 className="font-medium text-gray-700 mb-1">
                          Deliver to: <span className="font-semibold text-gray-900">Please login</span>
                        </h3>
                        <p className="text-sm text-gray-600">Login to see your saved address</p>
                      </>
                    )}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-blue-600 border-blue-600 hover:bg-blue-50"
                    onClick={handleChangeAddress}
                  >
                    {userAddress ? 'Change' : 'Add'}
                  </Button>
                </div>
              </Card>

              {/* Inline Address Form - Show when "Add" is clicked and no address exists */}
              {showInlineAddressForm && !userAddress && user && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4"
                >
                  <AddAddressModal
                    isOpen={true}
                    onClose={handleCancelAddressForm}
                    onSave={handleSaveAddress}
                    addressType="home"
                    inline={true}
                  />
                </motion.div>
              )}

              {/* Cart Items Card */}
              <Card className="p-0 overflow-hidden">
                {items.map((item, index) => {
                  const discount = calculateDiscount(item.originalPrice, item.priceINR);
                  
                  return (
                    <div key={item.productId}>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-5"
                      >
                        <div className="flex gap-4">
                          {/* Product Image */}
                          <div className="flex-shrink-0">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-28 h-28 object-cover rounded border"
                            />
                          </div>

                          {/* Product Details */}
                          <div className="flex-1">
                            {/* Product Title */}
                            <h3 className="text-base font-medium text-gray-900 mb-1 line-clamp-2">
                              {item.title}
                            </h3>

                            {/* Price Section */}
                            <div className="flex items-center gap-3 mb-2">
                              {item.originalPrice && (
                                <span className="text-gray-400 line-through text-sm">
                                  ₹{item.originalPrice.toLocaleString('en-IN')}
                                </span>
                              )}
                              <span className="text-2xl font-medium text-gray-900">
                                ₹{item.priceINR.toLocaleString('en-IN')}
                              </span>
                              {discount && (
                                <span className="text-green-600 font-medium text-sm">
                                  {discount}% Off
                                </span>
                              )}
                            </div>

                            {/* Delivery Info */}
                            <p className="text-sm text-gray-700 mb-4">
                              Delivery in 6 - 7 days
                            </p>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-4">
                              {/* Quantity Control */}
                              <div className="flex items-center border rounded">
                                <button
                                  onClick={() => updateQuantity(item.productId, Math.max(1, item.qty - 1))}
                                  className="px-3 py-1 hover:bg-gray-50 border-r"
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                                <span className="px-4 py-1 font-medium">{item.qty}</span>
                                <button
                                  onClick={() => updateQuantity(item.productId, item.qty + 1)}
                                  className="px-3 py-1 hover:bg-gray-50 border-l"
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>

                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-700 hover:text-gray-900"
                                onClick={() => handleSaveForLater(item)}
                              >
                                SAVE FOR LATER
                              </Button>

                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-700 hover:text-gray-900"
                                onClick={() => removeFromCart(item.productId)}
                              >
                                REMOVE
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                      
                      {/* Divider between items */}
                      {index < items.length - 1 && (
                        <div className="border-t mx-5"></div>
                      )}
                    </div>
                  );
                })}

                {/* Bottom Action Button */}
                <div className="border-t p-5 bg-white">
                  <div className="flex justify-end">
                    <Button 
                      className="bg-transparent border-2 border-orange-500 text-orange-500 px-16 py-5 text-base font-semibold rounded-none hover:bg-transparent hover:border-orange-500 hover:text-orange-500"
                      onClick={handleCheckout}
                    >
                      PLACE ORDER
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Section - Price Details */}
            <div className="lg:col-span-1">
              <Card className="p-5 sticky top-4">
                <h2 className="text-gray-500 text-sm font-medium uppercase mb-4 pb-4 border-b">
                  Price Details
                </h2>
                
                <div className="space-y-4 mb-4 pb-4 border-b">
                  <div className="flex justify-between text-base">
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
                      <div className="flex justify-between text-base">
                        <span className="text-gray-700">Discount</span>
                        <span className="text-green-600">
                          − ₹{Math.round(totalDiscount).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ) : null;
                  })()}

                  <div className="flex justify-between text-base">
                    <span className="text-gray-700">Platform Fee</span>
                    <span className="text-gray-900">₹7</span>
                  </div>

                  <div className="flex justify-between text-base">
                    <span className="text-gray-700">Delivery Charges</span>
                    <span className="text-green-600 flex items-center gap-1">
                      <span className="line-through text-gray-400">₹40</span> Free
                    </span>
                  </div>
                </div>

                {/* Total Amount */}
                <div className="flex justify-between text-lg font-semibold mb-4 pb-4 border-b">
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
                      <p className="text-green-700 font-medium text-sm">
                        You will save ₹{Math.round(totalDiscount).toLocaleString('en-IN')} on this order
                      </p>
                    </div>
                  ) : null;
                })()}

                {/* Security Badge */}
                <div className="mt-6 flex items-start gap-3 text-gray-600">
                  <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-xs">
                    <span className="font-medium">Safe and Secure Payments.</span>Easy returns.<span className="font-medium">100% Authentic products.</span>
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Login Required Modal */}
      <LoginRequiredModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        message="Please log in to continue. You can save items to your wishlist and proceed to checkout once logged in."
        returnPath="/cart"
      />

      {/* Address Selection Modal */}
      {user && (
        <AddressSelectionModal
          isOpen={showAddressModal}
          onClose={() => setShowAddressModal(false)}
          userId={user.uid}
          currentAddress={userAddress}
          onAddressSelect={handleAddressSelect}
        />
      )}
    </>
  );
};

export default Cart;
