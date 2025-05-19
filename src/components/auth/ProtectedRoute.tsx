
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { user, isLoading, isAdmin, isAdminLoading } = useAuth();
  const location = useLocation();
  
  // Logging for debugging
  console.log("ProtectedRoute - Path:", location.pathname);
  console.log("ProtectedRoute - User:", user?.email);
  console.log("ProtectedRoute - isLoading:", isLoading);
  console.log("ProtectedRoute - Admin required:", requireAdmin);
  console.log("ProtectedRoute - isAdmin:", isAdmin);
  console.log("ProtectedRoute - isAdminLoading:", isAdminLoading);

  // Show loading while checking authentication or admin status (when required)
  if (isLoading || (requireAdmin && isAdminLoading)) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          <p className="text-gray-500">
            {requireAdmin ? 'Checking admin access...' : 'Checking authentication...'}
          </p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to auth page
  if (!user) {
    console.log("User not authenticated, redirecting to /auth");
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  // If admin is required but user is not admin, redirect to home
  if (requireAdmin && !isAdmin) {
    console.log("Admin access required but user is not an admin, redirecting to /");
    return <Navigate to="/" replace />;
  }

  // If authenticated (and admin if required), render children
  console.log("Access granted, rendering protected content");
  return <>{children}</>;
};

export default ProtectedRoute;
