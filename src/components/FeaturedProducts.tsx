import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface ProductCarouselProps {
  title: string;
  category: 'Food' | 'Decorative';
  position?: 'left' | 'right';
}

const ProductCarousel = ({ title, category, position = 'left' }: ProductCarouselProps) => {
  const { t } = useTranslation();
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [scrollPosition, setScrollPosition] = useState(0);

  const categoryProducts = products.filter(p => p.category === category && p.inStock);

  const scroll = (direction: 'left' | 'right') => {
    const container = document.getElementById(`carousel-${category}`);
    if (container) {
      const scrollAmount = 300;
      const newPosition = direction === 'left' 
        ? Math.max(0, scrollPosition - scrollAmount)
        : Math.min(container.scrollWidth - container.clientWidth, scrollPosition + scrollAmount);
      
      container.scrollTo({ left: newPosition, behavior: 'smooth' });
      setScrollPosition(newPosition);
    }
  };

  const handleAddToCart = (product: any) => {
    addToCart({
      productId: product.id,
      title: product.title,
      priceINR: product.priceINR,
      image: product.images[0],
    });
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

  // Determine the view all link based on category
  const getViewAllLink = () => {
    if (category === 'Food') return '/food-items';
    if (category === 'Decorative') return '/decorative-items';
    return '/products';
  };

  return (
    <div className="flex-1">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-semibold">{title}</h2>
        <Link to={getViewAllLink()} className="text-sm font-semibold hover:underline flex items-center gap-1">
          {t('featuredProducts.viewAll')}
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Carousel Container */}
      <div className="relative group">
        {/* Navigation Buttons */}
        {categoryProducts.length > 3 && (
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
          id={`carousel-${category}`}
          className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categoryProducts.length > 0 ? (
            categoryProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-none w-[180px] md:w-[250px] bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300"
              >
                {/* Product Image */}
                <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg bg-gray-100">
                  <Link to={`/product/${product.slug}`}>
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </Link>
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
                  <p className="text-lg md:text-xl font-semibold text-gray-900 mb-1">
                    ₹{product.priceINR.toLocaleString()}
                  </p>
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
                    <span className="mr-1">+</span> {t('featuredProducts.add')}
                  </Button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="w-full py-8 text-center text-muted-foreground">
              {t('featuredProducts.noProducts')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface PromoBannerProps {
  title: string;
  image: string;
  buttonText: string;
  buttonLink: string;
}

const PromoBanner = ({ title, image, buttonText, buttonLink }: PromoBannerProps) => {
  const { t } = useTranslation();
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Fallback image
  const fallbackImage = 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80';

  const handleImageError = () => {
    console.error(`Failed to load image: ${image}`);
    setImageError(true);
    setImageLoaded(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div className="relative h-full min-h-[220px] rounded-xl overflow-hidden shadow-lg group bg-gray-200">
      {/* Loading placeholder */}
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse">
          <span className="text-gray-400">{t('featuredProducts.loading')}</span>
        </div>
      )}
      
      <img
        src={imageError ? fallbackImage : image}
        alt={title}
        className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onError={handleImageError}
        onLoad={handleImageLoad}
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 flex flex-col justify-end p-8">
        <h2 className="text-white text-3xl md:text-4xl font-bold mb-6 leading-tight drop-shadow-lg">
          {title}
        </h2>
        <Link to={buttonLink}>
          <Button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold w-fit px-6">
            {buttonText}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export const FeaturedProducts = () => {
  const { t } = useTranslation();
  
  return (
    <section className="container mx-auto px-4 lg:px-6 pt-2 pb-6 space-y-12">
      {/* First Row: Banner Left, Carousel Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <PromoBanner
            title={t('featuredProducts.elevateYourCooking')}
            image="https://i.postimg.cc/DmTrD8Q6/image.png"
            buttonText={t('featuredProducts.shopNow')}
            buttonLink="/food-items"
          />
        </div>
        <div className="lg:col-span-6">
          <ProductCarousel title={t('featuredProducts.authenticSpices')} category="Food" position="right" />
        </div>
      </div>

      {/* Second Row: Carousel Left, Banner Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 order-2 lg:order-1">
          <ProductCarousel title={t('featuredProducts.handcraftedDecor')} category="Decorative" position="left" />
        </div>
        <div className="lg:col-span-6 order-1 lg:order-2">
          <PromoBanner
            title={t('featuredProducts.beautifySpace')}
            image="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80"
            buttonText={t('featuredProducts.shopNow')}
            buttonLink="/decorative-items"
          />
        </div>
      </div>
    </section>
  );
};
