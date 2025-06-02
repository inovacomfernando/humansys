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
      console.log('🔐 Tentando fazer login:', { email });

      // Primeiro verificar se o servidor está rodando
      const healthCheck = await dbClient.healthCheck();
      if (!healthCheck.success) {
        throw new Error('Servidor de banco de dados não está rodando. Por favor, inicie o workflow "Database Server".');
      }

      const response = await dbClient.login(email, password);

      console.log('📡 Resposta do servidor:', response);

      if (response.success && response.data?.user) {
        const user = response.data.user;
        localStorage.setItem('postgres_user', JSON.stringify(user));

        setAuthState({
          user,
          isLoading: false,
          isAuthenticated: true
        });

        console.log('✅ Login realizado com sucesso:', user);
        return { user, error: null };
      } else {
        const errorMsg = response.error || 'Credenciais inválidas';
        console.log('❌ Falha no login:', errorMsg);
        return { user: null, error: new Error(errorMsg) };
      }
    } catch (error: any) {
      console.error('❌ Erro de rede no login:', error);
      return { user: null, error: new Error('Erro de conexão com o servidor') };
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