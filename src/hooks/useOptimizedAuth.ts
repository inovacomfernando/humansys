
import { useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isValidated: boolean;
}

export const useOptimizedAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
    isValidated: false
  });

  // Mobile detection
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  const validateSession = useCallback(async (session: Session | null): Promise<boolean> => {
    if (!session || !session.expires_at) {
      return false;
    }
    
    const now = Date.now();
    const expiresAt = session.expires_at * 1000;
    
    // Add buffer for mobile (30 seconds)
    const buffer = isMobile ? 30000 : 5000;
    
    return expiresAt > (now + buffer);
  }, [isMobile]);

  const clearAuthState = useCallback(() => {
    setAuthState({
      user: null,
      session: null,
      isLoading: false,
      isValidated: true
    });
    
    // Clear all local storage
    localStorage.clear();
    sessionStorage.clear();
    
    // Clear query cache
    if (window.queryCache) {
      window.queryCache.clear();
    }
  }, []);

  const updateAuthState = useCallback(async (session: Session | null) => {
    const isValid = await validateSession(session);
    
    if (!isValid && session) {
      console.log('Session expired, clearing auth state');
      clearAuthState();
      return;
    }
    
    setAuthState({
      user: session?.user || null,
      session,
      isLoading: false,
      isValidated: true
    });
  }, [validateSession, clearAuthState]);

  useEffect(() => {
    let mounted = true;
    let sessionCheckInterval: NodeJS.Timeout;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      console.log('Auth state changed:', event);
      
      if (event === 'SIGNED_OUT' || !session) {
        clearAuthState();
        return;
      }
      
      await updateAuthState(session);
    });

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted) {
          await updateAuthState(session);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
        if (mounted) {
          clearAuthState();
        }
      }
    };

    getInitialSession();

    // Set up periodic session validation for mobile
    if (isMobile) {
      sessionCheckInterval = setInterval(async () => {
        if (!mounted || !authState.session) return;
        
        const isValid = await validateSession(authState.session);
        if (!isValid) {
          console.log('Mobile session check failed, clearing state');
          clearAuthState();
        }
      }, 30000); // Check every 30 seconds on mobile
    }

    return () => {
      mounted = false;
      subscription.unsubscribe();
      if (sessionCheckInterval) {
        clearInterval(sessionCheckInterval);
      }
    };
  }, [isMobile, validateSession, updateAuthState, clearAuthState]);

  return authState;
};
