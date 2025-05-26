
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { Loader2, ShieldAlert } from 'lucide-react';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, isLoading, isAdmin, isCheckingAdmin } = useAuth();
  const location = useLocation();
  
  // Enhanced logging for debugging
  console.log("AdminRoute - Path:", location.pathname);
  console.log("AdminRoute - User:", user?.email);
  console.log("AdminRoute - isLoading:", isLoading);
  console.log("AdminRoute - isAdmin:", isAdmin);
  console.log("AdminRoute - isCheckingAdmin:", isCheckingAdmin);

  // Show loading while checking authentication or admin status
  if (isLoading || isCheckingAdmin) {
    return renderLoadingState("Verifying admin permissions...");
  }

  // If not authenticated, redirect to auth page
  if (!user) {
    console.log("User not authenticated, redirecting to /auth");
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If authenticated but not admin, show access denied
  if (!isAdmin) {
    console.log("User is not an admin, showing access denied");
    return renderAccessDenied();
  }

  // User is authenticated and is an admin, render children
  console.log("Admin authentication successful, rendering protected content");
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

// Helper function for access denied state
const renderAccessDenied = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="flex flex-col items-center gap-4 max-w-md text-center p-8">
      <ShieldAlert className="h-12 w-12 text-amber-500" />
      <h2 className="text-xl font-bold text-gray-800">Admin Access Required</h2>
      <p className="text-gray-600">
        You don't have permission to access this page. Please contact an administrator
        if you believe you should have access.
      </p>
    </div>
  </div>
);

export default AdminRoute;
