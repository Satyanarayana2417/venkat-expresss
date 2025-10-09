import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '@/components/ProductCard';

interface LowStockItemsProps {
  products: Product[];
  threshold?: number;
}

export const LowStockItems = ({ products, threshold = 10 }: LowStockItemsProps) => {
  const lowStockProducts = products.filter(p => p.stock < threshold && p.inStock);

  if (lowStockProducts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Low Stock Items
          </CardTitle>
          <CardDescription>Products with stock below {threshold} units</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>All products are well stocked</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-orange-200 bg-orange-50/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-900">
          <AlertTriangle className="h-5 w-5" />
          Low Stock Alert
        </CardTitle>
        <CardDescription>
          {lowStockProducts.length} {lowStockProducts.length === 1 ? 'product' : 'products'} with stock below {threshold} units
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {lowStockProducts.slice(0, 5).map((product) => (
            <div 
              key={product.id} 
              className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-200"
            >
              <div className="flex items-center gap-3 flex-1">
                <img 
                  src={product.images[0]} 
                  alt={product.title}
                  className="w-12 h-12 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{product.title}</p>
                  <p className="text-xs text-muted-foreground">{product.category}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="destructive" className="font-semibold">
                  {product.stock} left
                </Badge>
                <Button asChild size="sm" variant="outline">
                  <Link to={`/admin/products/edit/${product.id}`}>
                    Restock
                  </Link>
                </Button>
              </div>
            </div>
          ))}
          {lowStockProducts.length > 5 && (
            <Button asChild variant="outline" className="w-full">
              <Link to="/admin/products">
                View all {lowStockProducts.length} low stock items
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
