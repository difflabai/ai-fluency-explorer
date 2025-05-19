
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  
  // Enhanced logging for debugging
  console.log("ProtectedRoute - Path:", location.pathname);
  console.log("ProtectedRoute - User:", user?.email);
  console.log("ProtectedRoute - isLoading:", isLoading);

  // Show loading while checking authentication
  if (isLoading) {
    return renderLoadingState("Checking authentication...");
  }

  // If not authenticated, redirect to auth page
  if (!user) {
    console.log("User not authenticated, redirecting to /auth");
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // User is authenticated, render children
  console.log("Authentication successful, rendering protected content");
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
