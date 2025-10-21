import { Heart, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { Product } from './ProductCard';
import { cn } from '@/lib/utils';

interface SearchProductCardProps {
  product: Product;
}

export const SearchProductCard = ({ product }: SearchProductCardProps) => {
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
      <div className="bg-white rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">
        {/* Image Container with Wishlist */}
        <div className="relative aspect-square bg-gray-50">
          <img
            src={product.images[0]}
            alt={product.title}
            className="object-cover w-full h-full"
            loading="lazy"
          />
          {/* Wishlist Heart Icon */}
          <button
            onClick={handleWishlistToggle}
            className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm hover:shadow-md transition-shadow"
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

        {/* Product Info */}
        <div className="p-3">
          {/* Price - Smaller */}
          <div className="text-base font-bold text-gray-900 mb-1">
            ₹{product.priceINR.toLocaleString()}
          </div>
          
          {/* Title - Smaller, One Line Only */}
          <h3 className="text-xs text-gray-600 truncate mb-3">
            {product.title}
          </h3>

          {/* Add to Cart Button - White with border */}
          <Button
            onClick={handleAddToCart}
            disabled={!product.inStock || product.stock <= 0}
            variant="outline"
            className="w-full h-8 text-xs bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 rounded-md"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </Link>
  );
};
