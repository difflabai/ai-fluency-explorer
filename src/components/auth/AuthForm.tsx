
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, LogIn, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type AuthFormProps = {
  redirectPath?: string;
};

const AuthForm: React.FC<AuthFormProps> = ({ redirectPath = '/' }) => {
  const { signIn, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (mode === 'login') {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
      navigate(redirectPath);
    } catch (error) {
      console.error('Authentication error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>
          {mode === 'login' ? 'Sign In' : 'Create Account'}
        </CardTitle>
        <CardDescription>
          {mode === 'login' 
            ? 'Enter your credentials to access admin features' 
            : 'Sign up for an administrator account'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {mode === 'login' ? 'Signing In...' : 'Signing Up...'}
              </>
            ) : (
              <>
                {mode === 'login' ? (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Sign Up
                  </>
                )}
              </>
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col">
        <Button 
          variant="link" 
          onClick={toggleMode} 
          className="w-full mt-2"
        >
          {mode === 'login' ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AuthForm;
