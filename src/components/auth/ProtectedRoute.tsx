
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
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
  
  // Enhanced logging for debugging
  console.log("ProtectedRoute - Path:", location.pathname);
  console.log("ProtectedRoute - User:", user?.email);
  console.log("ProtectedRoute - isLoading:", isLoading);
  console.log("ProtectedRoute - Admin required:", requireAdmin);
  console.log("ProtectedRoute - isAdmin:", isAdmin);
  console.log("ProtectedRoute - isAdminLoading:", isAdminLoading);

  // Show loading while checking authentication
  if (isLoading) {
    return renderLoadingState("Checking authentication...");
  }

  // If not authenticated, redirect to auth page
  if (!user) {
    console.log("User not authenticated, redirecting to /auth");
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  // If admin is required, check admin status
  if (requireAdmin) {
    // Show loading while checking admin status
    if (isAdminLoading) {
      return renderLoadingState("Verifying admin access...");
    }
    
    // If not admin, redirect to home
    if (!isAdmin) {
      console.log("Admin access required but user is not an admin, redirecting to /");
      return <Navigate to="/" replace />;
    }
  }

  // Access granted, render children
  console.log("Access granted, rendering protected content");
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

export default ProtectedRoute;
