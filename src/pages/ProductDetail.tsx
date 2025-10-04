import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ProductCard, Product } from '@/components/ProductCard';
import { ArrowLeft, ShoppingCart, Zap, Loader2, Video as VideoIcon, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState<'images' | 'videos'>('images');
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

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
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
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
    <div className="container mx-auto px-4 lg:px-6 py-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate('/products')}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Products
      </Button>

      {/* Product Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
        {/* Media Gallery */}
        <div className="space-y-4">
          {/* Tab switcher for images and videos */}
          {product.videos && product.videos.length > 0 && (
            <div className="flex gap-2 mb-4">
              <Button
                variant={activeTab === 'images' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('images')}
                className="flex-1"
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Images ({product.images.length})
              </Button>
              <Button
                variant={activeTab === 'videos' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('videos')}
                className="flex-1"
              >
                <VideoIcon className="h-4 w-4 mr-2" />
                Videos ({product.videos.length})
              </Button>
            </div>
          )}

          {/* Main display area */}
          {activeTab === 'images' ? (
            <>
              <motion.div
                key="image-main"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="aspect-square rounded-xl overflow-hidden bg-muted border shadow-premium-lg"
              >
                <img
                  src={product.images[selectedImage]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </motion.div>
              
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === idx
                          ? 'border-accent shadow-gold'
                          : 'border-border hover:border-accent/50'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.title} ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="space-y-4">
              {product.videos?.map((video, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="aspect-video rounded-xl overflow-hidden bg-muted border shadow-premium-lg"
                >
                  {video.includes('youtube.com') || video.includes('vimeo.com') ? (
                    <iframe
                      src={video}
                      className="w-full h-full"
                      allowFullScreen
                      title={`${product.title} video ${idx + 1}`}
                    />
                  ) : (
                    <video
                      src={video}
                      className="w-full h-full object-cover"
                      controls
                      preload="metadata"
                    />
                  )}
                </motion.div>
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
            <h1 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              {product.title}
            </h1>
            <p className="text-muted-foreground text-lg mb-6">
              {product.description}
            </p>
          </div>

          <div className="mb-6">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-bold text-primary">
                ₹{product.priceINR.toLocaleString()}
              </span>
              <span className="text-muted-foreground">INR</span>
            </div>
            
            {product.stock > 0 ? (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                In Stock ({product.stock} available)
              </Badge>
            ) : (
              <Badge variant="destructive">Out of Stock</Badge>
            )}
          </div>

          <Card className="p-6 mb-6 bg-muted/30">
            <h3 className="font-semibold mb-3">Product Details</h3>
            <div className="space-y-2 text-sm">
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

          <div className="space-y-3 mt-auto">
            <Button
              size="lg"
              className="w-full gradient-gold hover:shadow-gold"
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full"
              onClick={handleBuyNow}
              disabled={product.stock <= 0}
            >
              <Zap className="h-5 w-5 mr-2" />
              Buy Now
            </Button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section>
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-6">
            You May Also Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
