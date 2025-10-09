import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Category data for the first carousel
const categories = [
  {
    id: 'spices',
    name: 'Spices',
    image: 'https://images.unsplash.com/photo-1596040033229-a0b3b684e2e8?w=400&q=80',
    link: '/products?category=Food&subcategory=spices'
  },
  {
    id: 'snacks',
    name: 'Snacks & Sweets',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=80',
    link: '/products?category=Food&subcategory=snacks'
  },
  {
    id: 'home-decor',
    name: 'Home Decor',
    image: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?w=400&q=80',
    link: '/products?category=Decorative'
  },
  {
    id: 'kitchenware',
    name: 'Kitchenware',
    image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&q=80',
    link: '/products?category=Decorative&subcategory=kitchen'
  },
  {
    id: 'festive',
    name: 'Festive Items',
    image: 'https://images.unsplash.com/photo-1544552866-d3ed42536cfd?w=400&q=80',
    link: '/products?category=Decorative&subcategory=festive'
  },
  {
    id: 'courier',
    name: 'Courier Service',
    image: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=400&q=80',
    link: '/services'
  }
];

interface CategoryCarouselProps {
  title: string;
  viewAllLink: string;
}

const CategoryCarousel = ({ title, viewAllLink }: CategoryCarouselProps) => {
  const [scrollPosition, setScrollPosition] = useState(0);

  const scroll = (direction: 'left' | 'right') => {
    const container = document.getElementById('category-carousel');
    if (container) {
      const scrollAmount = 300;
      const newPosition = direction === 'left' 
        ? Math.max(0, scrollPosition - scrollAmount)
        : Math.min(container.scrollWidth - container.clientWidth, scrollPosition + scrollAmount);
      
      container.scrollTo({ left: newPosition, behavior: 'smooth' });
      setScrollPosition(newPosition);
    }
  };

  return (
    <div className="mb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
        <Link to={viewAllLink} className="text-sm font-semibold text-orange-500 hover:text-orange-600 flex items-center gap-1">
          View all →
        </Link>
      </div>

      {/* Carousel Container */}
      <div className="relative group">
        {/* Navigation Buttons */}
        {categories.length > 5 && (
          <>
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
              disabled={scrollPosition === 0}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Categories Carousel */}
        <div
          id="category-carousel"
          className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((category) => (
            <Link
              key={category.id}
              to={category.link}
              className="flex-none group/item"
            >
              <motion.div
                whileHover={{ y: -4 }}
                className="flex flex-col items-center"
              >
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden mb-3 shadow-md group-hover/item:shadow-lg transition-shadow">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <p className="text-sm font-medium text-center text-gray-700 group-hover/item:text-gray-900">
                  {category.name}
                </p>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

interface ProductCarouselShowcaseProps {
  title: string;
  category: 'Food' | 'Decorative';
  viewAllLink: string;
  carouselId: string;
}

const ProductCarouselShowcase = ({ title, category, viewAllLink, carouselId }: ProductCarouselShowcaseProps) => {
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [scrollPosition, setScrollPosition] = useState(0);

  const categoryProducts = products.filter(p => p.category === category && p.inStock);

  const scroll = (direction: 'left' | 'right') => {
    const container = document.getElementById(carouselId);
    if (container) {
      const scrollAmount = 300;
      const newPosition = direction === 'left' 
        ? Math.max(0, scrollPosition - scrollAmount)
        : Math.min(container.scrollWidth - container.clientWidth, scrollPosition + scrollAmount);
      
      container.scrollTo({ left: newPosition, behavior: 'smooth' });
      setScrollPosition(newPosition);
    }
  };

  const handleToggleWishlist = (product: any) => {
    toggleWishlist({
      productId: product.id,
      title: product.title,
      priceINR: product.priceINR,
      image: product.images[0],
      slug: product.slug,
    });
  };

  const handleAddToCart = (product: any) => {
    addToCart({
      productId: product.id,
      title: product.title,
      priceINR: product.priceINR,
      image: product.images[0],
    });
  };

  // Helper function to get badge info
  const getBadgeInfo = (product: any) => {
    if (product.tags?.includes('bestseller')) {
      return { text: 'Bestseller', color: 'bg-green-500' };
    }
    if (product.tags?.includes('new')) {
      return { text: 'New Arrival', color: 'bg-blue-500' };
    }
    if (product.tags?.includes('sale')) {
      return { text: 'Sale', color: 'bg-red-500' };
    }
    if (product.tags?.includes('flash-deal')) {
      return { text: 'Flash Deal', color: 'bg-red-600' };
    }
    if (product.tags?.includes('trending')) {
      return { text: 'Trending', color: 'bg-orange-500' };
    }
    if (product.tags?.includes('limited')) {
      return { text: 'Limited', color: 'bg-purple-500' };
    }
    if (product.tags?.includes('popular')) {
      return { text: 'Popular', color: 'bg-yellow-500' };
    }
    return null;
  };

  return (
    <div className="mb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
        <Link to={viewAllLink} className="text-sm font-semibold text-orange-500 hover:text-orange-600 flex items-center gap-1">
          View all →
        </Link>
      </div>

      {/* Carousel Container */}
      <div className="relative group">
        {/* Navigation Buttons */}
        {categoryProducts.length > 4 && (
          <>
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
              disabled={scrollPosition === 0}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Products Carousel */}
        <div
          id={carouselId}
          className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categoryProducts.length > 0 ? (
            categoryProducts.map((product) => {
              const badge = getBadgeInfo(product);
              const hasDiscount = product.tags?.includes('sale');
              const originalPrice = hasDiscount ? Math.round(product.priceINR * 1.25) : null;

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex-none w-[160px] md:w-[200px] bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden rounded-t-lg bg-gray-100">
                    <Link to={`/product/${product.slug}`}>
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </Link>

                    {/* Badge - Top Left */}
                    {badge && (
                      <div className={cn(
                        "absolute top-2 left-2 text-white text-xs font-semibold px-2 py-1 rounded",
                        badge.color
                      )}>
                        {badge.text}
                      </div>
                    )}

                    {/* Wishlist - Top Right */}
                    <button
                      onClick={() => handleToggleWishlist(product)}
                      className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-sm hover:scale-110 transition-transform"
                    >
                      <Heart
                        className={cn(
                          "h-4 w-4",
                          isInWishlist(product.id) ? "fill-red-500 text-red-500" : "text-gray-600"
                        )}
                      />
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="p-2 md:p-3">
                    <div className="flex items-baseline gap-2 mb-1">
                      <p className="text-base md:text-lg font-semibold text-gray-900">
                        ₹{product.priceINR.toLocaleString()}
                      </p>
                      {originalPrice && (
                        <p className="text-xs md:text-sm text-gray-400 line-through">
                          ₹{originalPrice.toLocaleString()}
                        </p>
                      )}
                    </div>
                    <Link to={`/product/${product.slug}`}>
                      <h3 className="text-xs md:text-sm text-gray-600 mb-2 line-clamp-2 hover:text-primary transition-colors">
                        {product.title}
                      </h3>
                    </Link>
                    <Button
                      onClick={() => handleAddToCart(product)}
                      variant="outline"
                      size="sm"
                      className="w-full text-xs font-semibold rounded-none hover:bg-gray-100"
                    >
                      <span className="mr-1">+</span> Add
                    </Button>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="w-full py-8 text-center text-muted-foreground">
              No products available in this category
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main Component
export const ProductShowcase = () => {
  return (
    <section className="container mx-auto px-4 lg:px-6 py-12 space-y-12">
      {/* Carousel 1: Browse by Category */}
      <CategoryCarousel 
        title="Get it all right here" 
        viewAllLink="/products"
      />

      {/* Carousel 2: Save on Popular Food Items */}
      <ProductCarouselShowcase
        title="Save on Popular Food Items"
        category="Food"
        viewAllLink="/products?category=Food"
        carouselId="food-carousel"
      />

      {/* Carousel 3: Flash Deals on Decor */}
      <ProductCarouselShowcase
        title="Flash Deals on Decor"
        category="Decorative"
        viewAllLink="/products?category=Decorative"
        carouselId="decor-carousel"
      />
    </section>
  );
};
