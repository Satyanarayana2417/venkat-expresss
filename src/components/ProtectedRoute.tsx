import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * ProtectedRoute Component
 * 
 * Wraps routes that require authentication.
 * - If user is authenticated: renders the children
 * - If user is not authenticated: redirects to /login with return path
 * - If auth is loading: shows loading spinner
 */
export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login with return path
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
};
