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

  // Enhanced admin status check with comprehensive debugging
  const checkAdminStatus = async (): Promise<boolean> => {
    if (!user) {
      console.log("❌ Admin check: No user found");
      setIsAdmin(false);
      return false;
    }
    
    setIsCheckingAdmin(true);
    console.log("🔍 Starting admin check for user:", user.email, "ID:", user.id);
    
    try {
      // Method 1: Try the RPC function
      console.log("📞 Attempting RPC admin check...");
      const { data: rpcResult, error: rpcError } = await supabase.rpc('is_admin', {
        user_id: user.id
      });
      
      if (rpcError) {
        console.error("❌ RPC admin check failed:", rpcError);
        
        // Method 2: Fallback to direct query
        console.log("🔄 Trying direct query fallback...");
        const { data: directResult, error: directError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .maybeSingle();
        
        if (directError) {
          console.error("❌ Direct query also failed:", directError);
          console.log("🚨 Both admin check methods failed - user may need admin role assigned");
          
          // Show helpful error message
          toast({
            title: "Admin Check Failed",
            description: "Unable to verify admin status. Contact support if you should have admin access.",
            variant: "destructive"
          });
          
          setIsAdmin(false);
          return false;
        }
        
        const isAdminDirect = !!directResult;
        console.log("✅ Direct query result:", isAdminDirect);
        setIsAdmin(isAdminDirect);
        return isAdminDirect;
      }
      
      const isAdminRpc = !!rpcResult;
      console.log("✅ RPC admin check result:", isAdminRpc);
      setIsAdmin(isAdminRpc);
      return isAdminRpc;
      
    } catch (error) {
      console.error('💥 Exception in admin check:', error);
      
      // Final fallback: check if user_roles table exists and is accessible
      try {
        console.log("🔄 Final fallback: testing user_roles table access...");
        const { error: testError } = await supabase
          .from('user_roles')
          .select('count')
          .limit(1);
        
        if (testError) {
          console.error("❌ Cannot access user_roles table:", testError);
          toast({
            title: "Database Access Issue",
            description: "Cannot access user roles. Please check database permissions.",
            variant: "destructive"
          });
        } else {
          console.log("✅ user_roles table is accessible");
          toast({
            title: "Admin Check Issue",
            description: "Admin verification failed. You may need to be assigned admin role.",
            variant: "destructive"
          });
        }
      } catch (finalError) {
        console.error("💥 Final fallback also failed:", finalError);
      }
      
      setIsAdmin(false);
      return false;
    } finally {
      setIsCheckingAdmin(false);
    }
  };

  // Manual admin status refresh function
  const refreshAdminStatus = async () => {
    console.log("🔄 Manual admin status refresh requested");
    if (user) {
      const result = await checkAdminStatus();
      console.log("🔄 Manual refresh result:", result);
      return result;
    }
    return false;
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("🔔 Auth state changed:", event);
        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (event === 'SIGNED_IN' && newSession?.user) {
          console.log("👤 User signed in, checking admin status");
          // Use setTimeout to prevent potential deadlocks
          setTimeout(() => {
            checkAdminStatus();
          }, 100);
        } else if (event === 'SIGNED_OUT') {
          console.log("👋 User signed out, clearing admin status");
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
        
        console.log("🔍 Initial session check:", currentSession?.user?.email);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          console.log("👤 Found existing session, checking admin status");
          await checkAdminStatus();
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('💥 Error initializing auth:', error);
        setIsLoading(false);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Update checkAdminStatus dependency when user changes
  useEffect(() => {
    if (user && !isCheckingAdmin) {
      console.log("👤 User changed, rechecking admin status");
      checkAdminStatus();
    }
  }, [user?.id]);

  const signIn = async (email: string, password: string) => {
    try {
      cleanupAuthState();
      
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
      cleanupAuthState();
      
      await supabase.auth.signOut({ scope: 'global' });
      
      toast({
        title: 'Signed out',
        description: 'You have been successfully signed out.'
      });
      
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
        console.log("👤 Current user was made admin, refreshing status");
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
    checkAdminStatus,
    refreshAdminStatus
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
