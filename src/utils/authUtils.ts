
import { toast } from '@/hooks/use-toast';

/**
 * Cleans up all authentication state in localStorage and sessionStorage
 * to prevent authentication limbo states
 */
export const cleanupAuthState = () => {
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token');
  
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  
  // Remove from sessionStorage if in use
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
};

/**
 * Checks if a user has admin role
 * @param userId The user ID to check
 * @param supabase The Supabase client instance
 * @returns Promise that resolves to boolean indicating admin status
 */
export const checkAdminStatus = async (userId: string, supabase: any) => {
  try {
    console.log("Checking admin status for user:", userId);
    // Use the RPC endpoint that has proper search_path set
    const { data, error } = await supabase
      .rpc('is_admin', { user_id: userId });
    
    if (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
    
    console.log("Admin status result:", data);
    return data || false;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};
