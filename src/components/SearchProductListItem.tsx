import { Heart, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { Product } from './ProductCard';
import { cn } from '@/lib/utils';

interface SearchProductListItemProps {
  product: Product;
}

export const SearchProductListItem = ({ product }: SearchProductListItemProps) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      productId: product.id,
      title: product.title,
      priceINR: product.priceINR,
      image: product.images[0],
    });
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      productId: product.id,
      title: product.title,
      priceINR: product.priceINR,
      image: product.images[0],
      slug: product.slug,
    });
  };

  return (
    <Link to={`/product/${product.slug}`}>
      <div className="bg-white rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200 flex gap-3 p-3">
        {/* Image Container */}
        <div className="relative w-24 h-24 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.title}
            className="object-cover w-full h-full"
            loading="lazy"
          />
        </div>

        {/* Product Info */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          {/* Title - One Line */}
          <h3 className="text-xs text-gray-900 font-medium truncate mb-1">
            {product.title}
          </h3>
          
          {/* Price */}
          <div className="text-base font-bold text-gray-900 mb-2">
            ₹{product.priceINR.toLocaleString()}
          </div>

          {/* Actions Row */}
          <div className="flex gap-2 items-center">
            {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              disabled={!product.inStock || product.stock <= 0}
              variant="outline"
              className="flex-1 h-8 text-xs bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 rounded-md"
            >
              Add to Cart
            </Button>

            {/* Wishlist Heart Icon */}
            <button
              onClick={handleWishlistToggle}
              className="w-8 h-8 flex items-center justify-center bg-white rounded-md border border-gray-300 hover:bg-gray-50 transition-colors flex-shrink-0"
              aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart
                className={cn(
                  "h-4 w-4 transition-colors",
                  inWishlist ? "fill-red-500 text-red-500" : "text-gray-600"
                )}
              />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};
