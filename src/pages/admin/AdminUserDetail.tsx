import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, User, Mail, Calendar, Shield, ShoppingBag, Heart, Package } from 'lucide-react';
import { useUsers } from '@/hooks/useUsers';
import { format } from 'date-fns';
import { toast } from 'sonner';

export const AdminUserDetail = () => {
  const { userId } = useParams<{ userId: string }>();
  const { getUserDetails } = useUsers();
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState<any>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        const details = await getUserDetails(userId);
        setUserDetails(details);
      } catch (error) {
        toast.error('Failed to load user details');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [userId, getUserDetails]);

  if (loading) {
    return (
      <AdminLayout title="User Details">
        <div className="py-12 text-center text-gray-500">Loading user details...</div>
      </AdminLayout>
    );
  }

  if (!userDetails) {
    return (
      <AdminLayout title="User Details">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">User not found</p>
            <Button asChild className="mt-4" variant="outline">
              <Link to="/admin/users">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Users
              </Link>
            </Button>
          </CardContent>
        </Card>
      </AdminLayout>
    );
  }

  const { user, orders, wishlist } = userDetails;

  return (
    <AdminLayout title="User Details">
      <div className="space-y-6">
        {/* Back Button */}
        <Button asChild variant="outline" size="sm">
          <Link to="/admin/users">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Users
          </Link>
        </Button>

        {/* User Profile */}
        <Card>
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
            <CardDescription>Personal information and account details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white text-3xl font-bold">
                {user.displayName ? user.displayName[0].toUpperCase() : user.email[0].toUpperCase()}
              </div>
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>Display Name</span>
                    </div>
                    <p className="text-base font-medium">{user.displayName || 'Not set'}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>Email</span>
                    </div>
                    <p className="text-base font-medium">{user.email}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Shield className="h-4 w-4" />
                      <span>Role</span>
                    </div>
                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                      {user.role}
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Member Since</span>
                    </div>
                    <p className="text-base font-medium">
                      {user.createdAt ? format(new Date(user.createdAt), 'MMMM dd, yyyy') : 'N/A'}
                    </p>
                  </div>
                </div>

                {user.phoneNumber && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Phone Number</p>
                    <p className="text-base font-medium">{user.phoneNumber}</p>
                  </div>
                )}

                {user.address && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="text-base font-medium">{user.address}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order History */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Order History</CardTitle>
                <CardDescription>All orders placed by this user</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{orders.length} orders</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No orders yet</p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order: any) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{format(new Date(order.date), 'MMM dd, yyyy')}</TableCell>
                        <TableCell>{order.items} items</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{order.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">₹{order.total.toLocaleString('en-IN')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Wishlist */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Wishlist</CardTitle>
                <CardDescription>Products saved for later</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{wishlist.length} items</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {wishlist.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Heart className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No items in wishlist</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {wishlist.map((item: any) => (
                  <div key={item.productId} className="border rounded-lg p-4 space-y-3">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-32 object-cover rounded"
                    />
                    <div>
                      <h4 className="font-medium text-sm line-clamp-2">{item.title}</h4>
                      <p className="text-sm font-semibold text-yellow-600 mt-1">
                        ₹{item.priceINR.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <Button asChild size="sm" variant="outline" className="w-full">
                      <Link to={`/product/${item.slug}`}>View Product</Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};
