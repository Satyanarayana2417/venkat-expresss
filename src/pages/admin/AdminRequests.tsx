import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export const AdminRequests = () => {
  return (
    <AdminLayout title="Product Requests">
      <Card>
        <CardHeader>
          <CardTitle>Product Requests</CardTitle>
          <CardDescription>Manage customer product requests and inquiries</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Product Requests</h3>
            <p className="text-sm text-gray-500 max-w-sm">
              Customer product requests will appear here. This feature allows customers to request products they'd like to see in your store.
            </p>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};
