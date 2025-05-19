
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';

const TestDataInfoAlert: React.FC = () => {
  return (
    <Alert>
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        Generated test data is only visible to admin users and will not appear in public leaderboards.
      </AlertDescription>
    </Alert>
  );
};

export default TestDataInfoAlert;
