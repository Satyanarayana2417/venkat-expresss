import { AdminLayout } from '@/components/admin/AdminLayout';
import { DashboardStats } from '@/components/admin/DashboardStats';
import { SalesChart } from '@/components/admin/SalesChart';
import { RecentOrders } from '@/components/admin/RecentOrders';
import { LowStockItems } from '@/components/admin/LowStockItems';
import { useProducts } from '@/hooks/useProducts';

export const AdminDashboard = () => {
  const { products } = useProducts();

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6">
        {/* Stats Cards */}
        <DashboardStats products={products} />

        {/* Sales Chart */}
        <SalesChart type="line" />

        {/* Low Stock Alert */}
        <LowStockItems products={products} threshold={10} />

        {/* Recent Orders */}
        <RecentOrders />
      </div>
    </AdminLayout>
  );
};
