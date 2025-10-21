import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ProductCard, Product } from '@/components/ProductCard';
import { ArrowLeft, ShoppingCart, Zap, Loader2, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  // Combine images and videos into a single media array
  const getMediaItems = () => {
    if (!product) return [];
    const items: Array<{ type: 'image' | 'video'; url: string }> = [];
    
    // Add all images
    product.images.forEach(img => {
      items.push({ type: 'image', url: img });
    });
    
    // Add all videos
    if (product.videos) {
      product.videos.forEach(video => {
        items.push({ type: 'video', url: video });
      });
    }
    
    return items;
  };

  useEffect(() => {
    if (!loading && products.length > 0) {
      const foundProduct = products.find(p => p.slug === slug);
      
      if (!foundProduct) {
        toast.error('Product not found');
        navigate('/products');
        return;
      }
      
      setProduct(foundProduct);
      
      // Get related products (same category, exclude current)
      const related = products
        .filter(p => p.category === foundProduct.category && p.id !== foundProduct.id)
        .slice(0, 4);
      setRelatedProducts(related);
    }
  }, [slug, products, loading, navigate]);

  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart({
      productId: product.id,
      title: product.title,
      priceINR: product.priceINR,
      image: product.images[0],
      slug: product.slug,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 lg:px-6 py-4 md:py-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        className="mb-4 md:mb-6"
        size="sm"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      {/* Product Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 lg:gap-12 mb-8 md:mb-16">
        {/* Media Gallery - Unified Slideshow */}
        <div className="space-y-4">
          {/* Main Slideshow */}
          <div className="relative group">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-[4/3] md:aspect-square rounded-lg md:rounded-xl overflow-hidden bg-muted border shadow-lg md:shadow-premium-lg relative"
            >
              {getMediaItems()[currentSlide]?.type === 'image' ? (
                <img
                  src={getMediaItems()[currentSlide]?.url}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full relative">
                  {getMediaItems()[currentSlide]?.url.includes('youtube.com') || 
                   getMediaItems()[currentSlide]?.url.includes('vimeo.com') ? (
                    <iframe
                      src={getMediaItems()[currentSlide]?.url}
                      className="w-full h-full"
                      allowFullScreen
                      title={`${product.title} video`}
                    />
                  ) : (
                    <video
                      src={getMediaItems()[currentSlide]?.url}
                      className="w-full h-full object-cover"
                      controls
                      preload="metadata"
                      controlsList="nodownload"
                      style={{ pointerEvents: 'auto' }}
                    />
                  )}
                </div>
              )}
            </motion.div>
            
            {/* Transparent touch areas for arrows - only on mobile */}
            {getMediaItems().length > 1 && (
              <div className="md:hidden absolute inset-0 pointer-events-none" style={{ zIndex: 100 }}>
                {/* Left arrow touch area */}
                <div 
                  className="absolute left-0 top-0 bottom-0 w-20 pointer-events-auto"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setCurrentSlide(prev => prev === 0 ? getMediaItems().length - 1 : prev - 1);
                  }}
                  onTouchEnd={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setCurrentSlide(prev => prev === 0 ? getMediaItems().length - 1 : prev - 1);
                  }}
                  style={{ touchAction: 'manipulation' }}
                />
                {/* Right arrow touch area */}
                <div 
                  className="absolute right-0 top-0 bottom-0 w-20 pointer-events-auto"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setCurrentSlide(prev => prev === getMediaItems().length - 1 ? 0 : prev + 1);
                  }}
                  onTouchEnd={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setCurrentSlide(prev => prev === getMediaItems().length - 1 ? 0 : prev + 1);
                  }}
                  style={{ touchAction: 'manipulation' }}
                />
              </div>
            )}

            {/* Navigation Arrows - Visual indicators only on mobile, clickable on desktop */}
            {getMediaItems().length > 1 && (
              <>
                <button
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setCurrentSlide(prev => prev === 0 ? getMediaItems().length - 1 : prev - 1);
                  }}
                  className="absolute left-1 md:left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-1.5 md:p-2 shadow-lg md:opacity-0 md:group-hover:opacity-100 transition-opacity pointer-events-none md:pointer-events-auto"
                  style={{ zIndex: 101 }}
                  aria-label="Previous slide"
                  type="button"
                >
                  <ChevronLeft className="h-4 w-4 md:h-5 md:w-5 text-gray-800" />
                </button>
                <button
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setCurrentSlide(prev => prev === getMediaItems().length - 1 ? 0 : prev + 1);
                  }}
                  className="absolute right-1 md:right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-1.5 md:p-2 shadow-lg md:opacity-0 md:group-hover:opacity-100 transition-opacity pointer-events-none md:pointer-events-auto"
                  style={{ zIndex: 101 }}
                  aria-label="Next slide"
                  type="button"
                >
                  <ChevronRight className="h-4 w-4 md:h-5 md:w-5 text-gray-800" />
                </button>
              </>
            )}

            {/* Slide Indicators */}
            {getMediaItems().length > 1 && (
              <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 md:gap-2">
                {getMediaItems().map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all ${
                      currentSlide === idx
                        ? 'bg-white w-6 md:w-8'
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Thumbnail Navigation - Hidden on mobile, shown on larger screens */}
          {getMediaItems().length > 1 && (
            <div className="hidden md:grid grid-cols-5 lg:grid-cols-6 gap-2">
              {getMediaItems().slice(0, 6).map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    currentSlide === idx
                      ? 'border-accent shadow-gold'
                      : 'border-border hover:border-accent/50'
                  }`}
                >
                  {item.type === 'image' ? (
                    <img
                      src={item.url}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white border-l-transparent rounded-full" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="mb-4">
            <Badge variant="secondary" className="mb-3">
              {product.category}
            </Badge>
            {/* Product Title - Single line on mobile, multiline on desktop */}
            <h1 className="font-heading text-lg md:text-3xl lg:text-4xl font-bold mb-4 truncate md:whitespace-normal" title={product.title}>
              {product.title}
            </h1>
            <p className="text-muted-foreground text-sm md:text-lg mb-6 line-clamp-3 md:line-clamp-none">
              {product.description}
            </p>
          </div>

          <div className="mb-4 md:mb-6">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-2xl md:text-4xl font-bold text-primary">
                ₹{product.priceINR.toLocaleString()}
              </span>
              <span className="text-sm md:text-base text-muted-foreground">INR</span>
            </div>
            
            {product.stock > 0 ? (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs md:text-sm">
                In Stock ({product.stock} available)
              </Badge>
            ) : (
              <Badge variant="destructive" className="text-xs md:text-sm">Out of Stock</Badge>
            )}
          </div>

          {/* Desktop: Static Product Details Card */}
          <Card className="hidden md:block p-4 md:p-6 mb-4 md:mb-6 bg-muted/30">
            <h3 className="font-semibold mb-2 md:mb-3 text-sm md:text-base">Product Details</h3>
            <div className="space-y-1.5 md:space-y-2 text-xs md:text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category:</span>
                <span className="font-medium">{product.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">SKU:</span>
                <span className="font-medium">{product.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Availability:</span>
                <span className="font-medium">
                  {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>
          </Card>

          {/* Mobile: Collapsible All Details Dropdown */}
          <div className="md:hidden mb-4">
            <button
              onClick={() => setIsDetailsOpen(!isDetailsOpen)}
              className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="text-left">
                <h3 className="font-semibold text-base mb-1">All details</h3>
                <p className="text-xs text-gray-500">Features, description and more</p>
              </div>
              {isDetailsOpen ? (
                <ChevronUp className="h-5 w-5 text-gray-600 flex-shrink-0" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-600 flex-shrink-0" />
              )}
            </button>
            
            <AnimatePresence>
              {isDetailsOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <Card className="mt-2 p-4 bg-white border-t-0 rounded-t-none">
                    <div className="space-y-4">
                      {/* Product Details Section */}
                      <div>
                        <h4 className="font-semibold text-sm mb-3 text-gray-900">Product Details</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Category:</span>
                            <span className="font-medium text-gray-900">{product.category}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">SKU:</span>
                            <span className="font-medium text-gray-900">{product.id}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Availability:</span>
                            <span className="font-medium text-gray-900">
                              {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Description Section */}
                      <div>
                        <h4 className="font-semibold text-sm mb-2 text-gray-900">Description</h4>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {product.description}
                        </p>
                      </div>

                      {/* Additional Information Section */}
                      <div>
                        <h4 className="font-semibold text-sm mb-2 text-gray-900">Additional Information</h4>
                        <p className="text-sm text-gray-700">
                          This product is carefully sourced and quality checked to ensure the best experience for our customers.
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop buttons - hidden on mobile */}
          <div className="hidden md:flex md:flex-col space-y-2 md:space-y-3 mt-auto">
            <Button
              size="default"
              className="w-full gradient-gold hover:shadow-gold text-sm md:text-base"
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
            >
              <ShoppingCart className="h-4 w-4 md:h-5 md:w-5 mr-2" />
              Add to Cart
            </Button>
            <Button
              size="default"
              variant="outline"
              className="w-full text-sm md:text-base"
              onClick={handleBuyNow}
              disabled={product.stock <= 0}
            >
              <Zap className="h-4 w-4 md:h-5 md:w-5 mr-2" />
              Buy Now
            </Button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mb-20 md:mb-0">
          <h2 className="font-heading text-lg md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6">
            You May Also Like
          </h2>
          {/* Mobile: Horizontal scroll with small cards */}
          <div className="md:hidden flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4"
               style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {relatedProducts.map((relatedProduct) => (
              <div key={relatedProduct.id} className="flex-none w-[140px]">
                <Link to={`/product/${relatedProduct.slug}`} className="block">
                  <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    {/* Product Image */}
                    <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg bg-gray-100">
                      <img
                        src={relatedProduct.images[0]}
                        alt={relatedProduct.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    {/* Product Info */}
                    <div className="p-2">
                      <p className="text-base font-semibold text-gray-900 mb-1">
                        ₹{relatedProduct.priceINR.toLocaleString()}
                      </p>
                      <h3 className="text-xs text-gray-600 line-clamp-2 mb-2">
                        {relatedProduct.title}
                      </h3>
                      {relatedProduct.stock > 0 ? (
                        <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 bg-green-50 text-green-700 border-green-200">
                          In Stock
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="text-[10px] px-1 py-0 h-4">
                          Out of Stock
                        </Badge>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          {/* Desktop: Grid layout */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </section>
      )}

      {/* Fixed Bottom Action Bar - Mobile Only */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-50 p-3">
        <div className="flex gap-3 items-center max-w-screen-xl mx-auto">
          <Button
            variant="outline"
            size="default"
            className="flex-1 font-semibold text-sm border-2"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
          >
            Add to cart
          </Button>
          <Button
            size="default"
            className="flex-1 bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 font-semibold text-sm shadow-none"
            onClick={handleBuyNow}
            disabled={product.stock <= 0}
          >
            Buy at ₹{product.priceINR.toLocaleString()}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
