import React, { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { AuthContext } from './AuthContext';
import { cleanupAuthState, checkAdminStatus } from '@/utils/authUtils';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isAdminLoading, setIsAdminLoading] = useState<boolean>(true);

  // Helper function to check admin status with better error handling
  const checkAndSetAdminStatus = async (userId: string) => {
    setIsAdminLoading(true);
    try {
      console.log("Checking admin status for user:", userId);
      const isUserAdmin = await checkAdminStatus(userId, supabase);
      console.log(`Admin status check completed: ${isUserAdmin}`);
      setIsAdmin(isUserAdmin);
    } catch (err) {
      console.error("Error checking admin status:", err);
      setIsAdmin(false);
    } finally {
      setIsAdminLoading(false);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("Auth state changed:", event);
        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (newSession?.user) {
          // Check admin status with better error handling
          checkAndSetAdminStatus(newSession.user.id);
        } else {
          setIsAdmin(false);
          setIsAdminLoading(false);
        }

        if (event === 'SIGNED_OUT') {
          setUser(null);
          setSession(null);
          setIsAdmin(false);
          setIsAdminLoading(false);
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
        
        // Check admin status if user exists
        if (currentSession?.user) {
          checkAndSetAdminStatus(currentSession.user.id);
        } else {
          setIsAdmin(false);
          setIsAdminLoading(false);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setIsAdmin(false);
        setIsAdminLoading(false);
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

  // Updated makeUserAdmin function with correct return type and RPC name
  const makeUserAdmin = async (email: string): Promise<void> => {
    try {
      // Call the RPC function with the correct name
      const { data, error } = await supabase.rpc('add_user_role', { 
        user_email: email,
        role_name: 'admin'
      });
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: `Admin privileges granted to ${email}`,
      });
    } catch (error: any) {
      toast({
        title: 'Error granting admin privileges',
        description: error.message || 'Failed to make user an admin',
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
    isAdminLoading,
    signIn,
    signUp,
    signOut,
    sendMagicLink,
    resetPassword,
    cleanupAuthState,
    makeUserAdmin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
