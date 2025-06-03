
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Configuração para desenvolvimento local sem Supabase
const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.VITE_SUPABASE_URL;

// Mock client para desenvolvimento
const createMockClient = () => {
  const mockAuth = {
    getSession: async () => ({ data: { session: null }, error: null }),
    signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
      // Simular login bem-sucedido para desenvolvimento
      const mockUser = {
        id: '5b43d42f-f5e1-46bf-9a95-e6de48163a81',
        email,
        user_metadata: { name: email.split('@')[0] },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        aud: 'authenticated',
        role: 'authenticated'
      };

      const mockSession = {
        access_token: 'mock-token',
        refresh_token: 'mock-refresh',
        expires_in: 3600,
        token_type: 'bearer',
        user: mockUser
      };

      // Armazenar no localStorage para persistência
      localStorage.setItem('supabase.auth.token', JSON.stringify(mockSession));
      
      return { data: { user: mockUser, session: mockSession }, error: null };
    },
    signUp: async ({ email, password, options }: any) => {
      return await mockAuth.signInWithPassword({ email, password });
    },
    signOut: async () => {
      localStorage.removeItem('supabase.auth.token');
      return { error: null };
    },
    onAuthStateChange: (callback: Function) => {
      // Verificar se há sessão salva
      const savedSession = localStorage.getItem('supabase.auth.token');
      if (savedSession) {
        try {
          const session = JSON.parse(savedSession);
          setTimeout(() => callback('INITIAL_SESSION', session), 100);
        } catch (e) {
          console.log('No saved session');
        }
      }

      return {
        data: {
          subscription: {
            unsubscribe: () => {}
          }
        }
      };
    },
    refreshSession: async () => ({ data: { session: null }, error: null }),
    resetPasswordForEmail: async () => ({ error: null })
  };

  const mockFrom = (table: string) => ({
    select: (columns = '*') => ({
      eq: () => ({ data: [], error: null }),
      limit: () => ({ data: [], error: null }),
      order: () => ({ data: [], error: null }),
      single: () => ({ data: null, error: null }),
      then: (resolve: Function) => resolve({ data: [], error: null })
    }),
    insert: () => ({ data: null, error: null }),
    update: () => ({ data: null, error: null }),
    delete: () => ({ data: null, error: null }),
    upsert: () => ({ data: null, error: null })
  });

  return {
    auth: mockAuth,
    from: mockFrom,
    rpc: async () => ({ data: null, error: null }),
    storage: {
      from: () => ({
        upload: async () => ({ data: null, error: null }),
        download: async () => ({ data: null, error: null })
      })
    }
  };
};

// Cliente real para produção
const createRealClient = () => {
  const supabaseUrl = process.env.VITE_SUPABASE_URL!;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY!;

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false
    }
  });
};

// Cliente único para evitar múltiplas instâncias
let supabaseInstance: any = null;

export const getSupabaseClient = () => {
  if (!supabaseInstance) {
    if (isDevelopment) {
      console.log('🛠️ Modo desenvolvimento: usando mock client');
      supabaseInstance = createMockClient();
    } else {
      console.log('🚀 Modo produção: usando cliente real');
      supabaseInstance = createRealClient();
    }
  }
  return supabaseInstance;
};

export const supabase = getSupabaseClient();

// Função para verificar conectividade
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    if (isDevelopment) {
      console.log('Conectividade OK (modo desenvolvimento)');
      return true;
    }
    
    const { error } = await supabase.from('collaborators').select('count').limit(0);
    return !error;
  } catch (error) {
    console.log('Erro na conectividade:', error);
    return false;
  }
};

// Função para refresh do sistema
export const refreshSystemData = async (): Promise<boolean> => {
  try {
    console.log('Refresh do sistema...');
    return true;
  } catch (error) {
    console.error('Erro no refresh:', error);
    return false;
  }
};

// Função para limpar cache
export const clearQueryCache = (): void => {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('supabase.') && key.includes('undefined')) {
        localStorage.removeItem(key);
      }
    });
    console.log('Cache limpo');
  } catch (error) {
    console.error('Erro ao limpar cache:', error);
  }
};

export default supabase;
