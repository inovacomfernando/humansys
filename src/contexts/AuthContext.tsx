
import React, { createContext, useContext } from 'react';
import { User } from '@supabase/supabase-js';
import { usePostgreSQLAuth } from '@/hooks/usePostgreSQLAuth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isLoggingOut: boolean;
  signUp: (email: string, password: string, name: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<any>;
  login: (email: string, password: string) => Promise<any>; // Alias para signIn
  logout: () => Promise<any>; // Alias para signOut
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = usePostgreSQLAuth();

  // Criar aliases para manter compatibilidade
  const contextValue: AuthContextType = {
    ...auth,
    login: auth.signIn,
    logout: auth.signOut,
  };

  return (
    <AuthContext.Provider value={contextValue}>
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
