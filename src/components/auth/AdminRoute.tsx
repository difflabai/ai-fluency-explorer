import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { Loader2, ShieldAlert, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, isLoading, isAdmin, isCheckingAdmin, refreshAdminStatus } = useAuth();
  const location = useLocation();

  // Enhanced logging for debugging
  console.log('🛡️ AdminRoute - Path:', location.pathname);
  console.log('🛡️ AdminRoute - User:', user?.email);
  console.log('🛡️ AdminRoute - User ID:', user?.id);
  console.log('🛡️ AdminRoute - isLoading:', isLoading);
  console.log('🛡️ AdminRoute - isAdmin:', isAdmin);
  console.log('🛡️ AdminRoute - isCheckingAdmin:', isCheckingAdmin);

  // Show loading while checking authentication or admin status
  if (isLoading || isCheckingAdmin) {
    return renderLoadingState('Verifying admin permissions...');
  }

  // If not authenticated, redirect to auth page
  if (!user) {
    console.log('🛡️ User not authenticated, redirecting to /auth');
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If authenticated but not admin, show enhanced access denied with debug info
  if (!isAdmin) {
    console.log('🛡️ User is not an admin, showing access denied');
    return <EnhancedAccessDenied />;
  }

  // User is authenticated and is an admin, render children
  console.log('🛡️ Admin authentication successful, rendering protected content');
  return <>{children}</>;
};

// Helper function for consistent loading state display
const renderLoadingState = (message: string) => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      <p className="text-gray-500">{message}</p>
    </div>
  </div>
);

// Enhanced access denied state with debugging and refresh option
const EnhancedAccessDenied = () => {
  const { user, refreshAdminStatus } = useAuth();
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefreshAdminStatus = async () => {
    setIsRefreshing(true);
    try {
      console.log('🔄 Manual admin status refresh triggered');
      const result = await refreshAdminStatus();
      console.log('🔄 Refresh result:', result);

      if (!result) {
        // Still not admin, show helpful message
        console.log('🚨 Still not admin after refresh - may need role assignment');
      }
    } catch (error) {
      console.error('💥 Error refreshing admin status:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="flex flex-col items-center gap-4 max-w-md text-center p-8">
        <ShieldAlert className="h-12 w-12 text-amber-500" />
        <h2 className="text-xl font-bold text-gray-800">Admin Access Required</h2>
        <div className="text-gray-600 space-y-2">
          <p>
            You don't have permission to access this page. Please contact an
            administrator if you believe you should have access.
          </p>
          {user && (
            <div className="bg-gray-100 p-3 rounded text-sm">
              <p>
                <strong>Logged in as:</strong> {user.email}
              </p>
              <p>
                <strong>User ID:</strong> {user.id}
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-4">
          <Button
            variant="outline"
            onClick={handleRefreshAdminStatus}
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            {isRefreshing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            {isRefreshing ? 'Checking...' : 'Refresh Status'}
          </Button>

          <Button variant="outline" onClick={() => (window.location.href = '/')}>
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminRoute;
