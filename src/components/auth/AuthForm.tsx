
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, LogIn, UserPlus, ArrowLeft, Mail, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { validatePasswordStrength } from '@/utils/security';
import { toast } from '@/hooks/use-toast';

type AuthFormProps = {
  redirectPath?: string;
};

type AuthMode = 'login' | 'signup' | 'magic-link' | 'reset-password';

const AuthForm: React.FC<AuthFormProps> = ({ redirectPath = '/' }) => {
  const { signIn, signUp, sendMagicLink, resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<AuthMode>('login');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const validatePassword = (password: string): boolean => {
    if (mode !== 'signup') return true;
    
    const result = validatePasswordStrength(password);
    if (!result.isValid) {
      toast({
        title: 'Password too weak',
        description: result.message,
        variant: 'destructive'
      });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    
    try {
      if (mode === 'login') {
        await signIn(email, password);
        navigate(redirectPath);
      } else if (mode === 'signup') {
        if (!validatePassword(password)) {
          setIsLoading(false);
          return;
        }
        await signUp(email, password);
        setMessage('Please check your email for a confirmation link.');
      } else if (mode === 'magic-link') {
        await sendMagicLink(email);
        setMessage('Check your email for the magic link');
      } else if (mode === 'reset-password') {
        await resetPassword(email);
        setMessage('Check your email for the password reset link');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setMessage(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const renderForm = () => {
    switch (mode) {
      case 'login':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </>
        );
      
      case 'signup':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </>
        );
      
      case 'magic-link':
      case 'reset-password':
        return (
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        );
    }
  };

  const getSubmitButtonText = () => {
    if (isLoading) {
      switch (mode) {
        case 'login': return 'Signing In...';
        case 'signup': return 'Signing Up...';
        case 'magic-link': return 'Sending Link...';
        case 'reset-password': return 'Sending Reset Link...';
      }
    }

    switch (mode) {
      case 'login': return 'Sign In';
      case 'signup': return 'Sign Up';
      case 'magic-link': return 'Send Magic Link';
      case 'reset-password': return 'Reset Password';
    }
  };

  const getSubmitButtonIcon = () => {
    if (isLoading) {
      return <Loader2 className="mr-2 h-4 w-4 animate-spin" />;
    }

    switch (mode) {
      case 'login': return <LogIn className="mr-2 h-4 w-4" />;
      case 'signup': return <UserPlus className="mr-2 h-4 w-4" />;
      case 'magic-link': return <Mail className="mr-2 h-4 w-4" />;
      case 'reset-password': return <Mail className="mr-2 h-4 w-4" />;
    }
  };

  const renderCardTitle = () => {
    switch (mode) {
      case 'login': return 'Sign In';
      case 'signup': return 'Create Account';
      case 'magic-link': return 'Sign In with Magic Link';
      case 'reset-password': return 'Reset Password';
    }
  };

  const renderCardDescription = () => {
    switch (mode) {
      case 'login': return 'Enter your credentials to access admin features';
      case 'signup': return 'Sign up for an administrator account';
      case 'magic-link': return 'Get a sign in link sent to your email';
      case 'reset-password': return 'Reset your password via email';
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-purple-500" />
          {renderCardTitle()}
        </CardTitle>
        <CardDescription>{renderCardDescription()}</CardDescription>
      </CardHeader>
      <CardContent>
        {message && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md">
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {renderForm()}
          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
          >
            {getSubmitButtonIcon()}
            {getSubmitButtonText()}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        {(mode === 'magic-link' || mode === 'reset-password') && (
          <Button 
            variant="outline" 
            onClick={() => setMode('login')} 
            className="w-full"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Sign In
          </Button>
        )}
        
        {mode === 'login' && (
          <>
            <Button 
              variant="link" 
              onClick={() => setMode('signup')} 
              className="w-full"
            >
              Don't have an account? Sign up
            </Button>
            <Button 
              variant="link" 
              onClick={() => setMode('magic-link')} 
              className="w-full"
            >
              Sign in with Magic Link
            </Button>
            <Button 
              variant="link" 
              onClick={() => setMode('reset-password')} 
              className="w-full"
            >
              Forgot password?
            </Button>
          </>
        )}

        {mode === 'signup' && (
          <Button 
            variant="link" 
            onClick={() => setMode('login')} 
            className="w-full"
          >
            Already have an account? Sign in
          </Button>
        )}
        
        <div className="mt-4 text-xs text-gray-500">
          Protected by enhanced security measures
        </div>
      </CardFooter>
    </Card>
  );
};

export default AuthForm;
