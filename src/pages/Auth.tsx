
import React, { useEffect, useState } from 'react';
import AuthForm from '@/components/auth/AuthForm';
import { useAuth } from '@/contexts/auth';
import { Navigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const AuthPage: React.FC = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [isResetFlow, setIsResetFlow] = useState(false);
  
  const from = (location.state as any)?.from?.pathname || '/';
  
  useEffect(() => {
    // Check if the URL contains a reset password hash
    const hash = window.location.hash;
    if (hash && hash.includes('type=recovery')) {
      setIsResetFlow(true);
    }
  }, []);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
        description: 'Please ensure both passwords match',
        variant: 'destructive'
      });
      return;
    }

    // Enforce stronger password requirements
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      toast({
        title: 'Password too weak',
        description: 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character',
        variant: 'destructive'
      });
      return;
    }

    setResetLoading(true);
    
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      toast({
        title: 'Password updated',
        description: 'Your password has been successfully reset'
      });
      
      // Redirect to login after password reset
      setTimeout(() => {
        window.location.href = '/auth';
      }, 2000);
      
    } catch (error: any) {
      toast({
        title: 'Password reset failed',
        description: error.message || 'Failed to reset your password',
        variant: 'destructive'
      });
    } finally {
      setResetLoading(false);
    }
  };

  // If already authenticated, redirect
  if (!isLoading && user && !isResetFlow) {
    return <Navigate to={from} replace />;
  }

  if (isResetFlow) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-center">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader>
              <CardTitle>Set New Password</CardTitle>
              <CardDescription>Enter your new password below</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input 
                    id="new-password"
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input 
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={resetLoading}
                >
                  {resetLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating Password...
                    </>
                  ) : (
                    'Set New Password'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
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
