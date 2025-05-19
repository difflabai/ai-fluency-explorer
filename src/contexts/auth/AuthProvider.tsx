
import React, { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { AuthContext } from './AuthContext';
import { cleanupAuthState } from '@/utils/authUtils';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState<boolean>(false);

  // Check if the current user has admin role
  const checkAdminStatus = async (): Promise<boolean> => {
    if (!user) return false;
    
    setIsCheckingAdmin(true);
    try {
      // Query the user_roles table to check if the user has admin role
      const { data, error } = await supabase.rpc('is_admin', {
        user_id: user.id
      });
      
      if (error) {
        console.error('Error checking admin status:', error);
        return false;
      }
      
      setIsAdmin(!!data);
      return !!data;
    } catch (error) {
      console.error('Error in checkAdminStatus:', error);
      return false;
    } finally {
      setIsCheckingAdmin(false);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("Auth state changed:", event);
        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (event === 'SIGNED_IN') {
          // Check admin status on sign in
          // Use setTimeout to prevent potential deadlocks with Supabase client
          setTimeout(() => {
            checkAdminStatus();
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setSession(null);
          setIsAdmin(false);
        }
      }
    );

    // THEN check for existing session
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          // Check admin status for existing session
          await checkAdminStatus();
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing auth:', error);
        setIsLoading(false);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // Clean up existing state
      cleanupAuthState();
      
      // Attempt sign out first (to clear any existing sessions)
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      // Check admin status after successful login
      // Use setTimeout to prevent potential deadlocks
      setTimeout(async () => {
        await checkAdminStatus();
      }, 0);
      
      toast({
        title: 'Welcome back!',
        description: 'You have successfully signed in.'
      });
    } catch (error: any) {
      toast({
        title: 'Sign in failed',
        description: error.message || 'An error occurred during sign in',
        variant: 'destructive'
      });
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      // Clean up existing state
      cleanupAuthState();
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });
      
      if (error) throw error;
      
      toast({
        title: 'Account created!',
        description: 'Please check your email for a confirmation link.'
      });
    } catch (error: any) {
      toast({
        title: 'Sign up failed',
        description: error.message || 'An error occurred during sign up',
        variant: 'destructive'
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      // Clean up auth state
      cleanupAuthState();
      
      // Attempt global sign out
      await supabase.auth.signOut({ scope: 'global' });
      
      toast({
        title: 'Signed out',
        description: 'You have been successfully signed out.'
      });
      
      // Force page reload
      window.location.href = '/';
    } catch (error: any) {
      toast({
        title: 'Sign out failed',
        description: error.message || 'An error occurred during sign out',
        variant: 'destructive'
      });
    }
  };

  const sendMagicLink = async (email: string) => {
    try {
      // Clean up existing state
      cleanupAuthState();
      
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
        }
      });
      
      if (error) throw error;
      
      toast({
        title: 'Magic link sent',
        description: 'Check your email for the login link'
      });
    } catch (error: any) {
      toast({
        title: 'Failed to send magic link',
        description: error.message || 'An error occurred while sending the magic link',
        variant: 'destructive'
      });
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      // Clean up existing state
      cleanupAuthState();
      
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/auth',
      });
      
      if (error) throw error;
      
      toast({
        title: 'Password reset email sent',
        description: 'Check your email for the password reset link'
      });
    } catch (error: any) {
      toast({
        title: 'Failed to send reset email',
        description: error.message || 'An error occurred while sending the password reset email',
        variant: 'destructive'
      });
      throw error;
    }
  };

  const makeUserAdmin = async (email: string) => {
    try {
      if (!email || !email.trim()) {
        throw new Error('Email is required');
      }

      const { data, error } = await supabase.rpc('add_user_role', {
        user_email: email,
        role_name: 'admin'
      });

      if (error) throw error;

      toast({
        title: 'Admin privileges granted',
        description: `User ${email} has been given admin privileges.`
      });
      
      // If the current user was made admin, refresh their admin status
      if (user && user.email === email) {
        await checkAdminStatus();
      }
    } catch (error: any) {
      toast({
        title: 'Failed to grant admin privileges',
        description: error.message || 'An error occurred while granting admin privileges',
        variant: 'destructive'
      });
      throw error;
    }
  };

  const value = {
    user,
    session,
    isLoading,
    isAdmin,
    isCheckingAdmin,
    signIn,
    signUp,
    signOut,
    sendMagicLink,
    resetPassword,
    cleanupAuthState,
    makeUserAdmin,
    checkAdminStatus
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
