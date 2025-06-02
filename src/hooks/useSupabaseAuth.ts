
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const useSupabaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Detectar se é mobile
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  useEffect(() => {
    let mounted = true;
    let sessionCheckInterval: NodeJS.Timeout;

    // Verificar sessão atual
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        }
        
        if (mounted) {
          // Verificar se a sessão não expirou
          const isValidSession = session && session.expires_at && (session.expires_at * 1000) > Date.now();
          setUser(isValidSession ? session.user : null);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error in getSession:', error);
        if (mounted) {
          setUser(null);
          setIsLoading(false);
        }
      }
    };

    getSession();

    // Escutar mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      if (mounted) {
        // Para logout, limpar tudo imediatamente
        if (event === 'SIGNED_OUT' || !session) {
          setUser(null);
          setIsLoading(false);
          setIsLoggingOut(false);
          
          // Limpar storage local
          localStorage.clear();
          sessionStorage.clear();
          
          return;
        }

        // Verificar se a sessão é válida
        const isValidSession = session && session.expires_at && (session.expires_at * 1000) > Date.now();
        setUser(isValidSession ? session.user : null);
        setIsLoading(false);
      }
    });

    // Verificação periódica de sessão para mobile (mais frequente)
    if (isMobile) {
      sessionCheckInterval = setInterval(async () => {
        if (!mounted) return;
        
        try {
          const { data: { session } } = await supabase.auth.getSession();
          const isValidSession = session && session.expires_at && (session.expires_at * 1000) > Date.now();
          
          if (!isValidSession && user) {
            console.log('Session expired, logging out...');
            setUser(null);
            localStorage.clear();
            sessionStorage.clear();
          }
        } catch (error) {
          console.error('Session check failed:', error);
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
  }, [isMobile, user]);

  const signUp = async (email: string, password: string, name: string) => {
    try {
      console.log('Tentando cadastro...', { email, hasPassword: !!password, hasName: !!name });
      
      const { data, error } = await Promise.race([
        supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name,
              full_name: name,
            },
          },
        }),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Timeout no cadastro. Verifique sua conexão.')), 15000)
        )
      ]);
      
      console.log('Resultado do cadastro:', { data: !!data, error });
      return { data, error };
    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      
      if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
        return { 
          data: null, 
          error: { 
            message: 'Erro de conectividade. Verifique sua internet e tente novamente.' 
          } 
        };
      }
      
      if (error.message?.includes('Timeout')) {
        return { 
          data: null, 
          error: { 
            message: 'Conexão muito lenta. Tente novamente.' 
          } 
        };
      }
      
      return { data: null, error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log('Tentando login...', { email, hasPassword: !!password });
      
      const { data, error } = await Promise.race([
        supabase.auth.signInWithPassword({
          email,
          password,
        }),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Timeout no login. Verifique sua conexão.')), 15000)
        )
      ]);
      
      console.log('Resultado do login:', { data: !!data, error });
      return { data, error };
    } catch (error: any) {
      console.error('Erro no login:', error);
      
      if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
        return { 
          data: null, 
          error: { 
            message: 'Erro de conectividade. Verifique sua internet e tente novamente.' 
          } 
        };
      }
      
      if (error.message?.includes('Timeout')) {
        return { 
          data: null, 
          error: { 
            message: 'Conexão muito lenta. Tente novamente.' 
          } 
        };
      }
      
      return { data: null, error };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      console.log('Starting logout process...');
      setIsLoggingOut(true);
      setIsLoading(true);
      
      // Limpar tudo ANTES do logout
      localStorage.clear();
      sessionStorage.clear();
      
      // Limpar estado imediatamente
      setUser(null);
      
      const { error } = await supabase.auth.signOut();
      
      // Timeout adicional para mobile
      if (isMobile) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      return { error };
    } catch (error: any) {
      console.error('Logout error:', error);
      // Mesmo com erro, considerar logout bem-sucedido
      setUser(null);
      localStorage.clear();
      sessionStorage.clear();
      return { error: null };
    } finally {
      setIsLoggingOut(false);
      setIsLoading(false);
    }
  };

  return {
    user,
    isLoading: isLoading || isLoggingOut,
    isLoggingOut,
    signUp,
    signIn,
    signOut,
  };
};
