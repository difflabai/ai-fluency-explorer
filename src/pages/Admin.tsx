import React from 'react';
import { useAuth } from '@/contexts/auth';
import AccessDeniedAlert from '@/components/admin/AccessDeniedAlert';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Settings, TestTube, Trophy } from 'lucide-react';
import DatabaseStatusCard from '@/components/admin/DatabaseStatusCard';
import MigrationControls from '@/components/admin/MigrationControls';
import TestHarness from '@/components/admin/TestHarness';

const Admin: React.FC = () => {
  const { user, isAdmin } = useAuth();

  if (!user) {
    return <AccessDeniedAlert message="Please sign in to access the admin panel." />;
  }

  if (!isAdmin) {
    return <AccessDeniedAlert message="Admin access required." />;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
        <p className="text-gray-600">
          Manage the AI Fluency Assessment system, migrate data, and generate test content.
        </p>
      </div>

      <div className="grid gap-8">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Common administrative tasks and system operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex flex-col gap-2"
                onClick={() => window.location.href = '/admin/system-test'}
              >
                <TestTube className="h-6 w-6" />
                <span>System Tests</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col gap-2"
                onClick={() => window.location.href = '/leaderboard'}
              >
                <Trophy className="h-6 w-6" />
                <span>View Leaderboard</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col gap-2"
                onClick={() => window.location.href = '/'}
              >
                <Home className="h-6 w-6" />
                <span>Take Test</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Database Management */}
        <DatabaseStatusCard />
        
        {/* Migration Controls */}
        <MigrationControls />
        
        {/* Test Data Management */}
        <TestHarness />
      </div>
    </div>
  );
};

export default Admin;
