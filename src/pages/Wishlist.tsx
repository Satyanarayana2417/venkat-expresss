import { Link } from 'react-router-dom';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { X, ShoppingCart, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const Wishlist = () => {
  const { items, removeFromWishlist, totalItems } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (item: any) => {
    addToCart({
      productId: item.productId,
      title: item.title,
      priceINR: item.priceINR,
      image: item.image,
    });
  };

  const handleAddAllToCart = () => {
    items.forEach(item => {
      handleAddToCart(item);
    });
  };

  if (items.length === 0) {
    return (
      <>
        {/* Mobile Header - Only show on mobile */}
        <div className="md:hidden bg-white sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-3 px-4 py-3">
            <Link to="/dashboard">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <svg className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Button>
            </Link>
            <h1 className="text-base font-medium text-gray-900">My Wishlist</h1>
          </div>
        </div>

        <div className="container mx-auto px-4 lg:px-6 py-8 md:py-8 min-h-[60vh] md:min-h-0 flex flex-col items-center justify-center">
          <Heart className="h-16 w-16 md:h-24 md:w-24 text-gray-300 mb-4 md:mb-6" />
          <h1 className="text-sm md:text-4xl font-semibold md:font-bold mb-2 md:mb-4">Your Wishlist is Empty</h1>
          <p className="text-muted-foreground mb-6 md:mb-8 text-center max-w-md text-sm md:text-base">
            Start adding products you love to your wishlist. They'll be saved here for later!
          </p>
          <Link to="/products">
            <Button size="lg" className="gradient-gold">
              Browse Products
            </Button>
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Mobile Header - Only show on mobile */}
      <div className="md:hidden bg-white sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link to="/dashboard">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <svg className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Button>
          </Link>
          <h1 className="text-base font-medium text-gray-900">My Wishlist</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-6 py-6 md:py-6">
        {/* Header - Desktop Only */}
        <div className="hidden md:flex flex-col md:flex-row md:items-center md:justify-between mb-6 md:mb-8">
          <div>
            <h1 className="text-xl font-bold mb-1 md:mb-2">My Wishlist</h1>
            <p className="text-muted-foreground text-sm md:text-base">
              {totalItems} {totalItems === 1 ? 'item' : 'items'} saved
            </p>
          </div>
        <Button 
          onClick={handleAddAllToCart}
          className="mt-4 md:mt-0 bg-transparent border-2 border-gray-800 text-gray-800 rounded-none hover:bg-gray-800/10"
          size="default"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add All to Cart
        </Button>
      </div>

      {/* Wishlist Items Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 md:gap-3">
        {items.map((item, index) => (
          <motion.div
            key={item.productId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-md shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
          >
            {/* Image */}
            <div className="relative aspect-square overflow-hidden bg-gray-100">
              <Link to={`/product/${item.slug}`}>
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </Link>
              <button
                onClick={() => removeFromWishlist(item.productId)}
                className="absolute top-1.5 right-1.5 bg-white rounded-full p-1 shadow-md hover:bg-red-50 hover:scale-110 transition-all"
              >
                <X className="h-2.5 w-2.5 text-red-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-2">
              <Link to={`/product/${item.slug}`}>
                <h3 className="font-medium text-xs mb-0.5 line-clamp-2 hover:text-primary transition-colors leading-tight">
                  {item.title}
                </h3>
              </Link>
              <p className="text-sm font-bold text-primary mb-1.5">
                ₹{item.priceINR.toLocaleString()}
              </p>
              <Button
                onClick={() => handleAddToCart(item)}
                variant="default"
                className="w-full gradient-gold text-[10px] h-7 px-2"
              >
                <ShoppingCart className="mr-0.5 h-2.5 w-2.5" />
                Add to Cart
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

        {/* Continue Shopping */}
        <div className="mt-12 text-center">
          <Link to="/products">
            <Button variant="outline" size="lg">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Wishlist;
