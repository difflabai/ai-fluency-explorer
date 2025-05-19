
import React, { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminControls from '@/components/AdminControls';
import SystemCheck from '@/components/SystemCheck';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

const AdminPage: React.FC = () => {
  const { isAdmin, user } = useAuth();
  
  useEffect(() => {
    console.log("Admin page - Current user:", user?.email);
    console.log("Admin page - Is admin:", isAdmin);
  }, [isAdmin, user]);

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="container max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        <Tabs defaultValue="data">
          <TabsList className="mb-8">
            <TabsTrigger value="data">Data Management</TabsTrigger>
            <TabsTrigger value="system">System Diagnostics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="data" className="space-y-8">
            <AdminControls />
          </TabsContent>
          
          <TabsContent value="system" className="space-y-8">
            <SystemCheck />
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  );
};

export default AdminPage;
