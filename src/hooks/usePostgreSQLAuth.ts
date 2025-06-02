
import { useState, useEffect, createContext, useContext } from 'react';
import { executeQuery } from '@/lib/replit-db';

interface User {
  id: number;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => void;
  isLoading: boolean;
}

export const usePostgreSQLAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se há um usuário logado no localStorage
    const checkAuth = () => {
      try {
        const savedUser = localStorage.getItem('auth_user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Verificar credenciais no PostgreSQL
      const result = await executeQuery(
        'SELECT id, email, name FROM users WHERE email = $1 AND password_hash = $2',
        [email, password] // Em produção, compare com hash da senha
      );

      if (result.rows.length > 0) {
        const userData = result.rows[0];
        setUser(userData);
        localStorage.setItem('auth_user', JSON.stringify(userData));
        return true;
      }

      return false;
    } catch (error) {
      console.error('Sign in error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
  };

  return {
    user,
    signIn,
    signOut,
    isLoading
  };
};
