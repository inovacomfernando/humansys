
import { useState, useEffect } from 'react';
import { dbClient } from '@/lib/replit-db';

interface User {
  id: number;
  email: string;
  name: string;
}

export const usePostgreSQLAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('auth_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('auth_user');
      }
    }
  }, []);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Check database server health first
      const healthCheck = await dbClient.healthCheck();
      if (!healthCheck.success) {
        setError('Servidor de banco não está acessível');
        return false;
      }

      const result = await dbClient.login(email, password);

      if (result.success && result.data?.user) {
        const userData = result.data.user;
        setUser(userData);
        localStorage.setItem('auth_user', JSON.stringify(userData));
        return true;
      } else {
        setError(result.error || 'Credenciais inválidas');
        return false;
      }
    } catch (error) {
      console.error('Sign in error:', error);
      setError('Erro de conexão com o banco');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await dbClient.createUser(email, name, password);

      if (result.success && result.data?.user) {
        const userData = result.data.user;
        setUser(userData);
        localStorage.setItem('auth_user', JSON.stringify(userData));
        return true;
      } else {
        setError(result.error || 'Erro ao criar usuário');
        return false;
      }
    } catch (error) {
      console.error('Sign up error:', error);
      setError('Erro de conexão com o banco');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    setUser(null);
    localStorage.removeItem('auth_user');
  };

  return {
    user,
    isLoading,
    error,
    signIn,
    signUp,
    signOut,
  };
};
