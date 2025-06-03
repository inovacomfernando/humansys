
import { useEffect, useState, useCallback, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, clearSystemCache } from '@/integrations/supabase/client';

export const useSupabaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Refs para evitar loops
  const initializingRef = useRef(false);
  const mountedRef = useRef(true);

  // Função para limpar estado
  const clearAuthState = useCallback(() => {
    if (!mountedRef.current) return;
    
    setUser(null);
    setSession(null);
    setError(null);
    setIsLoading(false);
  }, []);

  // Função para atualizar estado de autenticação
  const updateAuthState = useCallback((currentSession: Session | null, error?: any) => {
    if (!mountedRef.current) return;

    if (error) {
      console.error('Auth error:', error);
      setError(error.message);
      clearAuthState();
      return;
    }

    if (currentSession && currentSession.user) {
      console.log('User authenticated:', currentSession.user.id);
      setUser(currentSession.user);
      setSession(currentSession);
      setError(null);
    } else {
      console.log('No authenticated user');
      clearAuthState();
    }
    
    setIsLoading(false);
  }, [clearAuthState]);

  // Inicializar autenticação
  const initializeAuth = useCallback(async () => {
    if (initializingRef.current || !mountedRef.current) return;
    
    initializingRef.current = true;
    setIsLoading(true);

    try {
      console.log('Initializing authentication...');
      
      // Verificar sessão atual
      const { data: { session: currentSession }, error } = await supabase.auth.getSession();
      
      if (error) {
        throw error;
      }

      updateAuthState(currentSession);
      
    } catch (error: any) {
      console.error('Failed to initialize auth:', error);
      updateAuthState(null, error);
    } finally {
      initializingRef.current = false;
    }
  }, [updateAuthState]);

  // Effect para inicialização e listener de mudanças
  useEffect(() => {
    mountedRef.current = true;
    
    // Inicializar autenticação
    initializeAuth();

    // Listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (!mountedRef.current) return;

        console.log('Auth state changed:', event, currentSession?.user?.id);

        switch (event) {
          case 'INITIAL_SESSION':
          case 'SIGNED_IN':
          case 'TOKEN_REFRESHED':
            updateAuthState(currentSession);
            break;
            
          case 'SIGNED_OUT':
            clearAuthState();
            clearSystemCache();
            break;
            
          default:
            // Para outros eventos, verificar se ainda há sessão válida
            if (currentSession) {
              updateAuthState(currentSession);
            } else {
              clearAuthState();
            }
        }
      }
    );

    // Cleanup
    return () => {
      mountedRef.current = false;
      subscription.unsubscribe();
    };
  }, [initializeAuth, updateAuthState, clearAuthState]);

  // Função de cadastro
  const signUp = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            full_name: name,
          },
        },
      });

      if (error) throw error;

      console.log('User signed up successfully');
      return { data, error: null };
      
    } catch (error: any) {
      console.error('Signup error:', error);
      setError(error.message);
      return { data: null, error };
    } finally {
      setIsLoading(false);
    }
  };

  // Função de login
  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('Attempting to sign in user:', email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      console.log('User signed in successfully');
      return { data, error: null };
      
    } catch (error: any) {
      console.error('Signin error:', error);
      setError(error.message);
      return { data: null, error };
    } finally {
      setIsLoading(false);
    }
  };

  // Função de logout
  const signOut = async () => {
    try {
      setIsLoggingOut(true);
      setIsLoading(true);
      
      console.log('Signing out user...');

      // Limpar estado local primeiro
      clearAuthState();
      clearSystemCache();

      // Fazer logout no Supabase
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.warn('Logout warning:', error);
        // Não tratar como erro crítico
      }

      console.log('User signed out successfully');
      return { error: null };
      
    } catch (error: any) {
      console.error('Logout error:', error);
      // Mesmo com erro, considerar logout bem-sucedido
      clearAuthState();
      clearSystemCache();
      return { error: null };
    } finally {
      setIsLoggingOut(false);
      setIsLoading(false);
    }
  };

  return {
    user,
    session,
    isLoading: isLoading || isLoggingOut,
    isLoggingOut,
    error,
    signUp,
    signIn,
    signOut,
  };
};
