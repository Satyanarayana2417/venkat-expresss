import { Routes, Route } from 'react-router-dom';
import { AdminDashboard } from './admin/AdminDashboard';
import { AdminAnalytics } from './admin/AdminAnalytics';
import { AdminProducts } from './admin/AdminProducts';
import { AdminProductForm } from './admin/AdminProductForm';
import { AdminOrders } from './admin/AdminOrders';
import { AdminRequests } from './admin/AdminRequests';
import { AdminQuotes } from './admin/AdminQuotes';
import { AdminUsers } from './admin/AdminUsers';
import { AdminUserDetail } from './admin/AdminUserDetail';
import { AdminDiscounts } from './admin/AdminDiscounts';
import { AdminSettings } from './admin/AdminSettings';

export const AdminRouter = () => {
  return (
    <Routes>
      <Route index element={<AdminDashboard />} />
      <Route path="analytics" element={<AdminAnalytics />} />
      <Route path="products" element={<AdminProducts />} />
      <Route path="products/add" element={<AdminProductForm />} />
      <Route path="products/edit/:id" element={<AdminProductForm />} />
      <Route path="orders" element={<AdminOrders />} />
      <Route path="requests" element={<AdminRequests />} />
      <Route path="quotes" element={<AdminQuotes />} />
      <Route path="users" element={<AdminUsers />} />
      <Route path="users/:userId" element={<AdminUserDetail />} />
      <Route path="discounts" element={<AdminDiscounts />} />
      <Route path="settings" element={<AdminSettings />} />
    </Routes>
  );
};
