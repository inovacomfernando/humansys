
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  user_metadata?: any;
}

interface Session {
  user: User;
  access_token: string;
  expires_at: number;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    console.log('%c🏠 SISTEMA LOCAL', 'color: green; font-size: 16px; font-weight: bold;');
    console.log('%cSistema rodando com dados locais', 'color: green; font-size: 12px;');

    // Verificar sessão inicial
    const getInitialSession = async () => {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();

        if (!error && initialSession) {
          console.log('Sessão local encontrada:', initialSession.user.id);
          setSession(initialSession);
          setUser(initialSession.user);
        }
      } catch (error) {
        console.log('Nenhuma sessão local encontrada');
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state changed:', event, currentSession?.user?.id);

        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Login realizado!",
        description: "Bem-vindo ao sistema local!",
      });

      return { data };
    } catch (error: any) {
      console.error('Erro no login:', error);
      toast({
        title: "Erro no Login",
        description: error.message || "Não foi possível fazer login",
        variant: "destructive",
      });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }
        }
      });

      if (error) throw error;

      toast({
        title: "Conta Criada",
        description: "Sua conta foi criada no sistema local!",
      });

      return { data };
    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      toast({
        title: "Erro no Cadastro",
        description: error.message || "Não foi possível criar a conta",
        variant: "destructive",
      });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);

      // Limpar dados locais
      sessionStorage.clear();

      const { error } = await supabase.auth.signOut();

      if (error) {
        console.warn('Aviso no logout:', error);
      }

      // Forçar limpeza do estado
      setUser(null);
      setSession(null);

      toast({
        title: "Logout realizado",
        description: "Até logo!",
      });

    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) throw error;

      toast({
        title: "Solicitação Enviada",
        description: "Reset de senha simulado (sistema local)",
      });

      return {};
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível processar solicitação",
        variant: "destructive",
      });
      return { error };
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
