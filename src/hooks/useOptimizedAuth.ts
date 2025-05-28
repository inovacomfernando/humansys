
import { useEffect, useState, useCallback, useRef } from 'react';
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

  // Refs para controlar race conditions
  const isValidatingRef = useRef(false);
  const lastValidationRef = useRef(0);
  const authMutexRef = useRef(false);

  // Mobile detection
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  const validateSession = useCallback(async (session: Session | null): Promise<boolean> => {
    if (!session || !session.expires_at) {
      return false;
    }
    
    const now = Date.now();
    const expiresAt = session.expires_at * 1000;
    
    // Add buffer for mobile (30 seconds), desktop (5 seconds)
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
    // Mutex para evitar updates simultâneos
    if (authMutexRef.current) return;
    authMutexRef.current = true;

    try {
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
    } finally {
      authMutexRef.current = false;
    }
  }, [validateSession, clearAuthState]);

  const debouncedSessionValidation = useCallback(async (session: Session | null) => {
    // Debounce validações para evitar calls excessivos
    const now = Date.now();
    if (now - lastValidationRef.current < 5000) return; // 5s debounce
    
    lastValidationRef.current = now;
    
    if (isValidatingRef.current) return;
    isValidatingRef.current = true;

    try {
      if (session?.user) {
        // Verificar se consegue fazer uma query básica
        const { error } = await supabase
          .from('profiles')
          .select('id')
          .limit(1)
          .maybeSingle();
        
        // Se der erro de auth, session está inválida
        if (error && (error.message.includes('JWT') || error.message.includes('auth'))) {
          console.log('Session validation failed, clearing state');
          clearAuthState();
          return;
        }
      }
    } catch (error) {
      console.warn('Session validation error:', error);
    } finally {
      isValidatingRef.current = false;
    }
  }, [clearAuthState]);

  useEffect(() => {
    let mounted = true;
    let sessionCheckInterval: NodeJS.Timeout | null = null;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      console.log('Auth state changed:', event);
      
      if (event === 'SIGNED_OUT' || !session) {
        clearAuthState();
        return;
      }
      
      // Para outros eventos, atualizar estado sem validação adicional
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        await updateAuthState(session);
      }
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

    // Set up periodic session validation apenas para mobile e com interval maior
    if (isMobile) {
      sessionCheckInterval = setInterval(async () => {
        if (!mounted || !authState.session) return;
        
        await debouncedSessionValidation(authState.session);
      }, 60000); // Check every minute on mobile
    }

    return () => {
      mounted = false;
      subscription.unsubscribe();
      if (sessionCheckInterval) {
        clearInterval(sessionCheckInterval);
      }
    };
  }, [isMobile, updateAuthState, clearAuthState, debouncedSessionValidation]);

  return authState;
};
