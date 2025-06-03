import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ user: User | null; error: any }>;
  logout: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Inicializar autenticação
  useEffect(() => {
    if (initialized) return;

    const initAuth = async () => {
      try {
        console.log('🔐 Inicializando autenticação...');

        // Verificar sessão atual
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('Erro ao obter sessão:', sessionError);
          setError(sessionError.message);
        } else if (currentSession) {
          console.log('✅ Sessão encontrada:', currentSession.user.id);
          setSession(currentSession);
          setUser(currentSession.user);
        } else {
          console.log('ℹ️ Nenhuma sessão ativa');
        }

        // Configurar listener de mudanças de auth
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, newSession) => {
            console.log('🔄 Auth state changed:', event, newSession?.user?.id);

            setSession(newSession);
            setUser(newSession?.user ?? null);

            if (event === 'SIGNED_OUT') {
              setError(null);
            }
          }
        );

        setInitialized(true);
        return () => subscription.unsubscribe();

      } catch (error: any) {
        console.error('❌ Erro na inicialização auth:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [initialized]);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Tentar login local primeiro
      const { data: collaboratorData } = await supabase
        .from('collaborators')
        .select('*')
        .eq('email', email)
        .single();

      if (collaboratorData) {
        // Simular autenticação local
        const mockUser: User = {
          id: collaboratorData.user_id,
          email: collaboratorData.email,
          user_metadata: {
            name: collaboratorData.name,
            role: 'user'
          },
          app_metadata: {},
          aud: 'authenticated',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const mockSession: Session = {
          access_token: 'mock-token',
          refresh_token: 'mock-refresh',
          expires_in: 3600,
          expires_at: Date.now() / 1000 + 3600,
          token_type: 'bearer',
          user: mockUser
        };

        setUser(mockUser);
        setSession(mockSession);

        // Salvar no localStorage
        localStorage.setItem('orientohub-auth-session', JSON.stringify(mockSession));

        console.log('✅ Login local realizado:', mockUser.email);
        return { user: mockUser, error: null };
      } else {
        throw new Error('Credenciais inválidas');
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
      setUser(null);
      setSession(null);
      setError(null);
      localStorage.removeItem('orientohub-auth-session');
      console.log('👋 Logout realizado');
    } catch (error: any) {
      console.error('❌ Erro no logout:', error);
      setError(error.message);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
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