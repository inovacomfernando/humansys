import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  email: string;
  user_metadata?: any;
  app_metadata?: any;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Inicializar autenticação
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        console.log('🔐 Inicializando autenticação local...');

        const { data: { session } } = await supabase.auth.getSession();

        if (mounted) {
          if (session?.user) {
            setUser(session.user);
            console.log('✅ Usuário autenticado:', session.user.email);
          } else {
            console.log('👤 Nenhum usuário autenticado');
          }
          setIsLoading(false);
        }
      } catch (err: any) {
        console.error('❌ Erro na inicialização:', err);
        if (mounted) {
          setError(err.message);
          setIsLoading(false);
        }
      }
    };

    initAuth();

    // Listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('🔄 Estado de autenticação mudou:', event);

        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
        }

        setIsLoading(false);
        setError(null);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('🔑 Tentando fazer login para:', email);

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        console.error('❌ Erro no login:', signInError);
        setError(signInError.message);
        return { success: false, error: signInError.message };
      }

      if (data.user) {
        console.log('✅ Login realizado com sucesso');
        setUser(data.user);
        return { success: true };
      }

      return { success: false, error: 'Falha na autenticação' };
    } catch (err: any) {
      console.error('❌ Erro inesperado no login:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      console.log('🚪 Fazendo logout...');

      await supabase.auth.signOut();
      setUser(null);
      setError(null);

      console.log('✅ Logout realizado com sucesso');
    } catch (err: any) {
      console.error('❌ Erro no logout:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSession = async () => {
    try {
      console.log('🔄 Renovando sessão...');
      await supabase.auth.refreshSession();
    } catch (err: any) {
      console.error('❌ Erro ao renovar sessão:', err);
      setError(err.message);
    }
  };

  const value = {
    user,
    isLoading,
    error,
    signIn,
    signOut,
    refreshSession
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};