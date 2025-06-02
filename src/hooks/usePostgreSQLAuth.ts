
import { useState, useEffect, useCallback } from 'react';
import { dbClient } from '@/lib/replit-db';

interface User {
  id: string;
  email: string;
  name: string;
  created_at?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export const usePostgreSQLAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false
  });

  // Verificar se há usuário logado no localStorage
  const checkAuthState = useCallback(async () => {
    try {
      const savedUser = localStorage.getItem('postgres_user');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        setAuthState({
          user,
          isLoading: false,
          isAuthenticated: true
        });
      } else {
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false
        });
      }
    } catch (error) {
      console.error('Erro ao verificar estado de autenticação:', error);
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false
      });
    }
  }, []);

  // Login
  const signIn = async (email: string, password: string) => {
    try {
      console.log('Tentando fazer login:', { email });
      
      const response = await dbClient.login(email, password);
      
      if (response.success && response.data?.user) {
        const user = response.data.user;
        localStorage.setItem('postgres_user', JSON.stringify(user));
        
        setAuthState({
          user,
          isLoading: false,
          isAuthenticated: true
        });
        
        return { user, error: null };
      } else {
        return { user: null, error: new Error(response.error || 'Credenciais inválidas') };
      }
    } catch (error: any) {
      console.error('Erro no login:', error);
      return { user: null, error };
    }
  };

  // Cadastro
  const signUp = async (email: string, password: string, name: string) => {
    try {
      console.log('Iniciando criação de usuário:', { email, name });
      
      // Simular hash de senha (em produção usar bcrypt)
      const password_hash = btoa(password); // Base64 básico para teste
      
      const response = await dbClient.createUser(email, name, password_hash);
      
      if (response.success && response.data?.user) {
        const user = response.data.user;
        localStorage.setItem('postgres_user', JSON.stringify(user));
        
        setAuthState({
          user,
          isLoading: false,
          isAuthenticated: true
        });
        
        return { user, error: null };
      } else {
        return { user: null, error: new Error(response.error || 'Erro ao criar usuário') };
      }
    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      return { user: null, error };
    }
  };

  // Logout
  const signOut = async () => {
    try {
      localStorage.removeItem('postgres_user');
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false
      });
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  // Verificar estado na inicialização
  useEffect(() => {
    checkAuthState();
  }, [checkAuthState]);

  return {
    ...authState,
    signIn,
    signUp,
    signOut,
    refreshAuth: checkAuthState
  };
};
