
import React, { useEffect, useState } from 'react';
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
  const [isChecking, setIsChecking] = useState(true);
  const [localIsAdmin, setLocalIsAdmin] = useState(false);
  
  useEffect(() => {
    // If admin check isn't needed, we can skip this delay
    if (!requireAdmin) {
      setIsChecking(false);
      return;
    }
    
    // If we need admin check, ensure we wait for isAdmin to stabilize
    if (user && isAdmin) {
      setLocalIsAdmin(true);
      setIsChecking(false);
    } else if (!isLoading) {
      // Only stop checking if we're done loading and still not admin
      const timer = setTimeout(() => {
        setLocalIsAdmin(isAdmin);
        setIsChecking(false);
      }, 1000); // Increased timeout to ensure admin status is checked
      
      return () => clearTimeout(timer);
    }
  }, [user, isAdmin, isLoading, requireAdmin]);

  useEffect(() => {
    if (user && requireAdmin) {
      console.log("ProtectedRoute - User:", user.email);
      console.log("ProtectedRoute - Admin required:", requireAdmin);
      console.log("ProtectedRoute - Is admin:", isAdmin);
      console.log("ProtectedRoute - Local is admin:", localIsAdmin);
    }
  }, [user, requireAdmin, isAdmin, localIsAdmin]);

  // While checking authentication status, show loading
  if (isLoading || isChecking) {
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
  if (requireAdmin && !localIsAdmin) {
    console.log("User is not an admin, redirecting to home");
    return <Navigate to="/" replace />;
  }

  // If authenticated (and admin if required), render children
  return <>{children}</>;
};

export default ProtectedRoute;
