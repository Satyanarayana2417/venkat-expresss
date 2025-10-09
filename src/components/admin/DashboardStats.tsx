import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ShoppingCart, Users, Clock, TrendingUp, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  iconColor?: string;
}

const StatCard = ({ title, value, description, icon: Icon, trend, iconColor = "text-blue-600" }: StatCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <div className={cn("p-2 rounded-lg bg-opacity-10", iconColor.replace('text-', 'bg-'))}>
          <Icon className={cn("h-5 w-5", iconColor)} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-gray-900">{value}</div>
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
        {trend && (
          <div className={cn(
            "flex items-center mt-2 text-xs font-medium",
            trend.isPositive ? "text-green-600" : "text-red-600"
          )}>
            <TrendingUp className={cn("h-3 w-3 mr-1", !trend.isPositive && "rotate-180")} />
            <span>{Math.abs(trend.value)}% from last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface DashboardStatsProps {
  products: any[];
  orders?: any[];
  users?: any[];
}

export const DashboardStats = ({ products, orders = [], users = [] }: DashboardStatsProps) => {
  // Calculate stats
  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.stock < 10).length;
  const outOfStockProducts = products.filter(p => p.stock === 0).length;
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o: any) => o.status === 'pending').length;
  const totalRevenue = orders.reduce((sum: number, order: any) => sum + (order.total || 0), 0);
  const newCustomers = users.filter((u: any) => {
    const createdDate = new Date(u.createdAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return createdDate >= thirtyDaysAgo;
  }).length;

  const stats = [
    {
      title: 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString('en-IN')}`,
      description: 'Total earnings',
      icon: DollarSign,
      iconColor: 'text-green-600',
      trend: { value: 12.5, isPositive: true }
    },
    {
      title: 'Total Orders',
      value: totalOrders,
      description: `${pendingOrders} pending`,
      icon: ShoppingCart,
      iconColor: 'text-blue-600',
      trend: { value: 8.2, isPositive: true }
    },
    {
      title: 'Products',
      value: totalProducts,
      description: `${outOfStockProducts} out of stock`,
      icon: Package,
      iconColor: 'text-purple-600',
    },
    {
      title: 'New Customers',
      value: newCustomers,
      description: 'Last 30 days',
      icon: Users,
      iconColor: 'text-orange-600',
      trend: { value: 5.1, isPositive: true }
    },
    {
      title: 'Low Stock Items',
      value: lowStockProducts,
      description: 'Needs attention',
      icon: Clock,
      iconColor: 'text-yellow-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};
