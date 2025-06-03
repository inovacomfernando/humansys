
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
  const [initialized, setInitialized] = useState(false);

  // Inicializar autenticação uma única vez
  useEffect(() => {
    if (initialized) return;

    let mounted = true;
    
    const initAuth = async () => {
      try {
        console.log('🔐 Inicializando sistema de autenticação...');
        
        // Verificar se há sessão ativa
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (mounted) {
          if (sessionError) {
            console.warn('⚠️ Erro ao obter sessão:', sessionError.message);
            setError(null); // Não considerar como erro crítico
          }
          
          if (session?.user) {
            setUser(session.user);
            console.log('✅ Usuário autenticado recuperado:', session.user.email);
          } else {
            console.log('👤 Nenhuma sessão ativa encontrada');
          }
          
          setIsLoading(false);
          setInitialized(true);
        }
      } catch (err: any) {
        console.error('❌ Erro crítico na inicialização:', err);
        if (mounted) {
          setError('Erro na inicialização do sistema');
          setIsLoading(false);
          setInitialized(true);
        }
      }
    };

    initAuth();

    // Listener para mudanças de estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('🔄 Mudança no estado de auth:', event);
        
        try {
          if (event === 'SIGNED_IN' && session?.user) {
            console.log('✅ Login realizado:', session.user.email);
            setUser(session.user);
            setError(null);
          } else if (event === 'SIGNED_OUT') {
            console.log('🚪 Logout realizado');
            setUser(null);
            setError(null);
          } else if (event === 'TOKEN_REFRESHED' && session?.user) {
            console.log('🔄 Token renovado');
            setUser(session.user);
          }
          
          setIsLoading(false);
        } catch (err: any) {
          console.error('❌ Erro no listener de auth:', err);
          setError('Erro no sistema de autenticação');
          setIsLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [initialized]);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('🔑 Tentativa de login para:', email);

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      if (signInError) {
        console.error('❌ Erro no login:', signInError.message);
        const errorMsg = signInError.message === 'Invalid login credentials' 
          ? 'Email ou senha incorretos' 
          : signInError.message;
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }

      if (data.user) {
        console.log('✅ Login bem-sucedido');
        // O listener já vai atualizar o estado
        return { success: true };
      }

      return { success: false, error: 'Falha na autenticação' };
      
    } catch (err: any) {
      console.error('❌ Erro inesperado no login:', err);
      const errorMsg = 'Erro inesperado no login';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      console.log('🚪 Realizando logout...');

      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('❌ Erro no logout:', error);
        setError('Erro ao fazer logout');
      } else {
        console.log('✅ Logout realizado com sucesso');
        // Limpar dados locais
        setUser(null);
        setError(null);
      }
    } catch (err: any) {
      console.error('❌ Erro inesperado no logout:', err);
      setError('Erro inesperado no logout');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSession = async () => {
    try {
      console.log('🔄 Renovando sessão...');
      const { error } = await supabase.auth.refreshSession();
      if (error) {
        console.error('❌ Erro ao renovar sessão:', error);
        setError('Erro ao renovar sessão');
      }
    } catch (err: any) {
      console.error('❌ Erro inesperado ao renovar sessão:', err);
      setError('Erro inesperado ao renovar sessão');
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
