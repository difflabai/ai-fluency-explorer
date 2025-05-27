
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/auth';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/Header';

// Pages
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Admin from '@/pages/Admin';
import SystemTest from '@/pages/SystemTest';
import LeaderboardPage from '@/pages/Leaderboard';
import NotFound from '@/pages/NotFound';

// Components
import SharedResultView from '@/components/SharedResultView';
import AdminRoute from '@/components/auth/AdminRoute';

import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/leaderboard" element={<LeaderboardPage />} />
                <Route path="/shared/:shareId" element={<SharedResultView />} />
                <Route 
                  path="/admin" 
                  element={
                    <AdminRoute>
                      <Admin />
                    </AdminRoute>
                  } 
                />
                <Route 
                  path="/admin/system-test" 
                  element={
                    <AdminRoute>
                      <SystemTest />
                    </AdminRoute>
                  } 
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
