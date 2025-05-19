
import React, { useEffect } from 'react';
import AuthForm from '@/components/auth/AuthForm';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

const AuthPage: React.FC = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/';
  
  // If already authenticated, redirect
  if (!isLoading && user) {
    return <Navigate to={from} replace />;
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-center">
      <div className="w-full max-w-md">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">
          AI Fluency Assessment
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Sign in to access admin features
        </p>
        <AuthForm redirectPath={from} />
      </div>
    </div>
  );
};

export default AuthPage;
