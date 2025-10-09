import { Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Heart, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const Cart = () => {
  const { items, updateQuantity, removeFromCart, subtotal, clearCart } = useCart();
  const { addToWishlist } = useWishlist();

  const handleSaveForLater = (item: any) => {
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

  const calculateDiscount = (original?: number, current?: number) => {
    if (!original || !current || original <= current) return null;
    const discount = Math.round(((original - current) / original) * 100);
    return discount;
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto"
        >
          <ShoppingBag className="h-24 w-24 mx-auto text-gray-300 mb-6" />
          <h2 className="text-3xl font-bold mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-8">
            Add some products to your cart to get started!
          </p>
          <Link to="/products">
            <Button size="lg">
              Browse Products
            </Button>
          </Link>
        </motion.div>
      </div>
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
            >
              Place order
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop View - Original Design */}
      <div className="hidden md:block container mx-auto px-4 py-6 md:py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-4xl font-bold">Shopping Cart</h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={clearCart}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Cart
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <motion.div
                key={item.productId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
              >
                <Card className="p-4">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-20 h-20 md:w-24 md:h-24 object-cover rounded"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm md:text-base mb-1 truncate">
                        {item.title}
                      </h3>
                      <p className="text-lg font-bold text-primary mb-3">
                        ₹{item.priceINR.toFixed(2)}
                      </p>

                      <div className="flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.productId, Math.max(1, item.qty - 1))}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-12 text-center font-semibold">
                            {item.qty}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.productId, item.qty + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Remove Button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => removeFromCart(item.productId)}
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>

                    {/* Item Total (Desktop) */}
                    <div className="hidden md:flex flex-col items-end justify-between">
                      <p className="text-lg font-bold">
                        ₹{(item.priceINR * item.qty).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-20">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4 pb-4 border-b">
                <div className="flex justify-between">
                  <span className="text-gray-600">Items ({items.length})</span>
                  <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery</span>
                  <span className="font-semibold text-green-600">FREE</span>
                </div>
              </div>

              <div className="flex justify-between mb-6 text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">₹{subtotal.toFixed(2)}</span>
              </div>

              <Button className="w-full" size="lg">
                Proceed to Checkout
              </Button>

              <Link to="/products">
                <Button variant="outline" className="w-full mt-3">
                  Continue Shopping
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
