
import React, { useEffect } from 'react';
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
  const { user, isLoading, isAdmin } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (user && requireAdmin) {
      console.log("ProtectedRoute - User:", user.email);
      console.log("ProtectedRoute - Admin required:", requireAdmin);
      console.log("ProtectedRoute - Is admin:", isAdmin);
    }
  }, [user, requireAdmin, isAdmin]);

  // While checking authentication status, show loading
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          <p className="text-gray-500">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to auth page
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  // If admin is required but user is not admin, redirect to home
  if (requireAdmin && !isAdmin) {
    console.log("User is not an admin, redirecting to home");
    return <Navigate to="/" replace />;
  }

  // If authenticated (and admin if required), render children
  return <>{children}</>;
};

export default ProtectedRoute;
