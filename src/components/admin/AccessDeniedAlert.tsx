import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldAlert, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth';

interface AccessDeniedAlertProps {
  message?: string;
  title?: string;
  showAuthLink?: boolean;
  showDebugInfo?: boolean;
}

const AccessDeniedAlert: React.FC<AccessDeniedAlertProps> = ({
  message = "You don't have permission to perform this action.",
  title = 'Admin Access Required',
  showAuthLink = false,
  showDebugInfo = true,
}) => {
  const { user, refreshAdminStatus } = useAuth();
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefreshAdminStatus = async () => {
    setIsRefreshing(true);
    try {
      await refreshAdminStatus();
    } catch (error) {
      console.error('Error refreshing admin status:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <Alert variant="destructive" className="my-4">
      <ShieldAlert className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        <div className="mt-2">{message}</div>

        {showDebugInfo && user && (
          <div className="bg-white/50 p-3 rounded mt-3 text-sm">
            <p>
              <strong>Debug Info:</strong>
            </p>
            <p>Email: {user.email}</p>
            <p>User ID: {user.id}</p>
            <p className="text-xs text-gray-600 mt-1">
              If you should have admin access, try refreshing your status or contact
              support.
            </p>
          </div>
        )}

        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshAdminStatus}
            disabled={isRefreshing}
            className="flex items-center gap-1"
          >
            {isRefreshing ? (
              <RefreshCw className="h-3 w-3 animate-spin" />
            ) : (
              <RefreshCw className="h-3 w-3" />
            )}
            {isRefreshing ? 'Checking...' : 'Refresh Status'}
          </Button>

          {showAuthLink && (
            <Button variant="outline" size="sm" asChild>
              <Link to="/auth">Go to authentication</Link>
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default AccessDeniedAlert;
