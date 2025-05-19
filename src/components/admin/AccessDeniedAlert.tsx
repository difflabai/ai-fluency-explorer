
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface AccessDeniedAlertProps {
  title?: string;
  description?: string;
  showAuthLink?: boolean;
}

const AccessDeniedAlert: React.FC<AccessDeniedAlertProps> = ({
  title = "Admin Access Required",
  description = "You don't have permission to perform this action.",
  showAuthLink = false
}) => {
  return (
    <Alert variant="destructive" className="my-4">
      <ShieldAlert className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        <div className="mt-2">
          {description}
        </div>
        {showAuthLink && (
          <div className="mt-4">
            <Button variant="outline" size="sm" asChild>
              <Link to="/auth">Go to authentication</Link>
            </Button>
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default AccessDeniedAlert;
