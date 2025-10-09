import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUserRole } from '@/hooks/useUserRole';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Shield, Lock } from 'lucide-react';
import { AdminRouter } from './AdminRouter';

const Admin = () => {
  const { user, signIn, signOut } = useAuth();
  const { isAdmin, role, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Admin sign-in state
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [signingIn, setSigningIn] = useState(false);
  const [hasAttemptedAuth, setHasAttemptedAuth] = useState(false);

  const handleAdminSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSigningIn(true);

    try {
      await signIn(adminEmail, adminPassword);
      setHasAttemptedAuth(true);
      // Don't set signingIn to false here - wait for role to load
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast.error('Invalid credentials. Please try again.');
      setSigningIn(false);
      setHasAttemptedAuth(false);
    }
  };

  // Check admin status after authentication
  useEffect(() => {
    // If user is not logged in, reset states
    if (!user) {
      setSigningIn(false);
      setHasAttemptedAuth(false);
      return;
    }

    // Wait for role to be loaded
    if (roleLoading) {
      return;
    }

    // Role has been loaded, now check admin status
    if (hasAttemptedAuth) {
      if (!isAdmin) {
        console.log('User role:', role, '- Admin access required');
        toast.error('Access denied. Admin privileges required.');
        // Sign out the non-admin user
        signOut().then(() => {
          setHasAttemptedAuth(false);
          setSigningIn(false);
        });
      } else {
        console.log('Admin access granted - Role:', role);
        toast.success('Admin access granted ✓');
        setSigningIn(false);
      }
    }
  }, [user, roleLoading, isAdmin, role, hasAttemptedAuth, signOut]);

  // Show loading state while checking authentication
  if (signingIn || (user && roleLoading)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-yellow-600 mx-auto" />
              <div>
                <p className="font-semibold text-lg">
                  {signingIn ? 'Verifying Credentials' : 'Loading Admin Panel'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {signingIn ? 'Checking admin privileges...' : 'Please wait...'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show admin sign-in form if user is not authenticated or not an admin
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-yellow-100 flex items-center justify-center ring-2 ring-yellow-200">
                <Shield className="h-8 w-8 text-yellow-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Admin Access Required</CardTitle>
            <CardDescription>
              Sign in with your admin credentials to access the admin panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdminSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email">Admin Email</Label>
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="admin@venkatexpress.com"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  required
                  disabled={signingIn}
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password">Password</Label>
                <Input
                  id="admin-password"
                  type="password"
                  placeholder="Enter your password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  required
                  disabled={signingIn}
                  autoComplete="current-password"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700" 
                disabled={signingIn}
              >
                {signingIn ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Sign In as Admin
                  </>
                )}
              </Button>
            </form>
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
              <p className="text-xs text-gray-600 text-center">
                ⚠️ This area is restricted to admin users only. Regular customer accounts will be denied access.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // User is authenticated and is an admin - show admin dashboard
  return <AdminRouter />;
};

export default Admin;
