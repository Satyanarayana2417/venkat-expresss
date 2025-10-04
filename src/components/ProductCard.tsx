import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useCart } from '@/contexts/CartContext';
import { motion } from 'framer-motion';

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: 'Food' | 'Decorative';
  serviceType: 'purchaseable' | 'parcel-only' | 'both';
  priceINR: number;
  weightKg?: number;
  dimensionsCm?: {
    length: number;
  };
  ingredients?: string;
  images: string[];
  thumbnails: string[];
  videos?: string[];
  stock: number;
  inStock: boolean;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
}

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      productId: product.id,
      title: product.title,
      priceINR: product.priceINR,
      image: product.images[0],
    });
  };

  return (
    <Link to={`/product/${product.slug}`}>
      <motion.div
        whileHover={{ y: -4 }}
        className="group bg-card rounded-xl overflow-hidden shadow-premium hover:shadow-premium-lg transition-all duration-300 border"
      >
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.images[0]}
            alt={product.title}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {(!product.inStock || product.stock <= 0) && (
            <Badge className="absolute top-2 right-2 bg-destructive">
              Out of Stock
            </Badge>
          )}
          {product.tags?.includes('new') && (
            <Badge className="absolute top-2 left-2 gradient-gold">
              New
            </Badge>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <Badge variant="secondary" className="mb-2">
            {product.category}
          </Badge>
          <h3 className="font-heading font-semibold text-lg mb-2 line-clamp-2 group-hover:text-accent transition-colors">
            {product.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {product.description}
          </p>
          
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary">
              ₹{product.priceINR.toLocaleString()}
            </span>
            <Button
              size="sm"
              className="gradient-gold hover:shadow-gold"
              onClick={handleAddToCart}
              disabled={!product.inStock || product.stock <= 0}
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};
