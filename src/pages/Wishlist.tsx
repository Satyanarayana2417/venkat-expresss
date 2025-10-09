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
      <div className="container mx-auto px-4 py-16 min-h-[60vh] flex flex-col items-center justify-center">
        <Heart className="h-24 w-24 text-gray-300 mb-6" />
        <h1 className="text-4xl font-bold mb-4">Your Wishlist is Empty</h1>
        <p className="text-muted-foreground mb-8 text-center max-w-md">
          Start adding products you love to your wishlist. They'll be saved here for later!
        </p>
        <Link to="/products">
          <Button size="lg" className="gradient-gold">
            Browse Products
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 lg:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">My Wishlist</h1>
          <p className="text-muted-foreground">
            {totalItems} {totalItems === 1 ? 'item' : 'items'} saved
          </p>
        </div>
        <Button 
          onClick={handleAddAllToCart}
          className="mt-4 md:mt-0 gradient-gold"
          size="lg"
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          Add All to Cart
        </Button>
      </div>

      {/* Wishlist Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item, index) => (
          <motion.div
            key={item.productId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
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
                className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-md hover:bg-red-50 hover:scale-110 transition-all"
              >
                <X className="h-4 w-4 text-red-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              <Link to={`/product/${item.slug}`}>
                <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-primary transition-colors">
                  {item.title}
                </h3>
              </Link>
              <p className="text-2xl font-bold text-primary mb-4">
                ₹{item.priceINR.toLocaleString()}
              </p>
              <Button
                onClick={() => handleAddToCart(item)}
                variant="default"
                className="w-full gradient-gold"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
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
  );
};

export default Wishlist;
