import React, { Suspense, lazy } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/auth';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/Header';
import ErrorBoundary from '@/components/error/ErrorBoundary';
import { Loader2 } from 'lucide-react';

// Lazy-loaded pages
const Index = lazy(() => import('@/pages/Index'));
const Auth = lazy(() => import('@/pages/Auth'));
const Admin = lazy(() => import('@/pages/Admin'));
const SystemTest = lazy(() => import('@/pages/SystemTest'));
const LeaderboardPage = lazy(() => import('@/pages/Leaderboard'));
const NotFound = lazy(() => import('@/pages/NotFound'));

// Lazy-loaded components
const SharedResultView = lazy(() => import('@/components/SharedResultView'));
const AdminRoute = lazy(() => import('@/components/auth/AdminRoute'));

const PageLoader = () => (
  <div className="flex justify-center items-center min-h-[50vh]">
    <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
  </div>
);

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
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
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
                </Suspense>
              </ErrorBoundary>
            </main>
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
