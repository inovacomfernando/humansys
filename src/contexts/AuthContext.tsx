import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { dbClient } from '@/integrations/supabase/client';

interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ user: User | null; error: any }>;
  logout: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Verificar sessão salva no localStorage na inicialização
  useEffect(() => {
    const checkSavedSession = async () => {
      try {
        console.log('🔐 Verificando sessão salva...');

        const savedSession = localStorage.getItem('orientohub-auth-user');
        if (savedSession) {
          const userData = JSON.parse(savedSession);
          console.log('✅ Sessão encontrada:', userData.email);
          setUser(userData);
        } else {
          console.log('ℹ️ Nenhuma sessão salva');
        }
      } catch (error: any) {
        console.error('❌ Erro ao verificar sessão:', error);
        localStorage.removeItem('orientohub-auth-user');
      } finally {
        setIsLoading(false);
      }
    };

    checkSavedSession();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('🔑 Tentando login para:', email);

      // Buscar colaborador no banco
      const { data: collaborators, error: dbError } = await dbClient.query(
        'SELECT * FROM collaborators WHERE email = $1 LIMIT 1',
        [email]
      );

      if (dbError) {
        throw new Error('Erro ao verificar credenciais');
      }

      if (collaborators && collaborators.length > 0) {
        const collaborator = collaborators[0];

        // Simular verificação de senha (em produção, usar hash)
        if (password === 'admin123' || password === '123456') {
          const userData: User = {
            id: collaborator.user_id || collaborator.id,
            email: collaborator.email,
            name: collaborator.name,
            role: 'user'
          };

          setUser(userData);
          localStorage.setItem('orientohub-auth-user', JSON.stringify(userData));

          console.log('✅ Login realizado com sucesso');
          return { user: userData, error: null };
        } else {
          throw new Error('Senha incorreta');
        }
      } else {
        throw new Error('Usuário não encontrado');
      }

    } catch (error: any) {
      console.error('❌ Erro no login:', error);
      setError(error.message);
      return { user: null, error };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('👋 Fazendo logout...');
      setUser(null);
      setError(null);
      localStorage.removeItem('orientohub-auth-user');
      console.log('✅ Logout realizado');
    } catch (error: any) {
      console.error('❌ Erro no logout:', error);
      setError(error.message);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      logout,
      error
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};