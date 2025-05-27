
import React from 'react';
import { useAuth } from '@/contexts/auth';
import SystemTestPanel from '@/components/admin/SystemTestPanel';
import AccessDeniedAlert from '@/components/admin/AccessDeniedAlert';

const SystemTest: React.FC = () => {
  const { user, isAdmin } = useAuth();

  if (!user) {
    return <AccessDeniedAlert message="Please sign in to access system testing." />;
  }

  if (!isAdmin) {
    return <AccessDeniedAlert message="Admin access required to run system tests." />;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">System Testing</h1>
        <p className="text-gray-600">
          Comprehensive testing suite to validate all system components and ensure data integrity.
        </p>
      </div>

      <SystemTestPanel />
    </div>
  );
};

export default SystemTest;
