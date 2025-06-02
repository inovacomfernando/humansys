import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AuthUser {
  id: string;
  email: string;
}

export const useSupabaseAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Verificar se há usuário logado (simulado para PostgreSQL local)
    const checkUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          console.error('Erro ao verificar usuário:', error);
          setUser(null);
        } else {
          setUser(data.user);
        }
      } catch (err) {
        console.error('Erro na verificação de usuário:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        name
      });

      if (error) {
        setError(error.message);
        toast({
          title: "Erro no cadastro",
          description: error.message,
          variant: "destructive"
        });
        return { data: null, error };
      }

      setUser(data.user);
      toast({
        title: "Cadastro realizado!",
        description: "Bem-vindo ao HumanSys!"
      });

      return { data, error: null };
    } catch (err) {
      const errorMessage = 'Erro interno no cadastro';
      setError(errorMessage);
      toast({
        title: "Erro no cadastro",
        description: errorMessage,
        variant: "destructive"
      });
      return { data: null, error: { message: errorMessage } };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        setError(error.message);
        toast({
          title: "Erro no login",
          description: error.message,
          variant: "destructive"
        });
        return { data: null, error };
      }

      setUser(data.user);
      toast({
        title: "Login realizado!",
        description: "Bem-vindo de volta!"
      });

      return { data, error: null };
    } catch (err) {
      const errorMessage = 'Erro interno no login';
      setError(errorMessage);
      toast({
        title: "Erro no login",
        description: errorMessage,
        variant: "destructive"
      });
      return { data: null, error: { message: errorMessage } };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      toast({
        title: "Logout realizado",
        description: "Até logo!"
      });
    } catch (err) {
      console.error('Erro no logout:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    signUp,
    signIn,
    signOut
  };
};