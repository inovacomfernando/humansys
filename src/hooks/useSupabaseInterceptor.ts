
import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useSupabaseInterceptor = () => {
  const { signOut } = useAuth();

  const handleAuthError = useCallback(async (error: any) => {
    // Only handle clear auth errors
    if (
      error?.message?.includes('JWT expired') ||
      error?.message?.includes('Invalid JWT') ||
      error?.code === 401
    ) {
      console.log('Auth token expired, refreshing...');
      
      try {
        const { data, error: refreshError } = await supabase.auth.refreshSession();
        
        if (refreshError || !data.session) {
          console.log('Token refresh failed, signing out');
          await signOut();
          return false;
        }
        
        return true; // Token refreshed, can retry
        
      } catch (refreshError) {
        console.error('Failed to refresh token:', refreshError);
        await signOut();
        return false;
      }
    }
    
    return false; // Not an auth error or can't be handled
  }, [signOut]);

  // Simple auth state listener instead of monkey patching
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed successfully');
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return { handleAuthError };
};
