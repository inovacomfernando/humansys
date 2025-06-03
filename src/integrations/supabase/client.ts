
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Configuração para PostgreSQL local no Replit
const POSTGRES_URL = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/humansys";

// Para desenvolvimento local, vamos usar uma configuração simples
const SUPABASE_URL = "http://localhost:54321"; // Supabase local studio
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxvY2FsaG9zdCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjQwOTk1MjAwLCJleHAiOjE5NTY1NzEyMDB9.A7CzTYD6fAXhLgFv_aeIaq-w8TnqaKyYqFPSd09a9y0";

// Singleton instance para evitar múltiplas conexões
let supabaseInstance: ReturnType<typeof createClient<Database>> | null = null;

const createSupabaseClient = () => {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  supabaseInstance = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false, // Desabilitar para evitar conflitos
      storageKey: 'humansys-auth-token',
      storage: {
        getItem: (key: string) => {
          try {
            return localStorage.getItem(key);
          } catch {
            return null;
          }
        },
        setItem: (key: string, value: string) => {
          try {
            localStorage.setItem(key, value);
          } catch {
            // Ignorar erros de storage
          }
        },
        removeItem: (key: string) => {
          try {
            localStorage.removeItem(key);
          } catch {
            // Ignorar erros de storage
          }
        }
      }
    },
    global: {
      headers: {
        'X-Client-Info': 'humansys-dashboard'
      }
    },
    db: {
      schema: 'public'
    }
  });

  return supabaseInstance;
};

export const supabase = createSupabaseClient();

// Função para verificar conectividade com PostgreSQL
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('collaborators')
      .select('id')
      .limit(1);

    if (error) {
      console.warn('Database connection test failed:', error.message);
      return false;
    }

    console.log('Database connection successful');
    return true;
  } catch (error) {
    console.error('Connection check failed:', error);
    return false;
  }
};

// Cache para queries
export const queryCache = new Map();

// Função para limpar cache
export const clearQueryCache = () => {
  queryCache.clear();
  console.log('Query cache cleared');
};

// Função para limpar completamente o sistema
export const clearSystemCache = () => {
  try {
    // Limpar localStorage
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (
        key.includes('supabase') || 
        key.includes('auth') || 
        key.includes('humansys')
      )) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    // Limpar sessionStorage
    sessionStorage.clear();
    
    // Limpar query cache
    clearQueryCache();
    
    console.log('System cache cleared completely');
    return true;
  } catch (error) {
    console.error('Failed to clear system cache:', error);
    return false;
  }
};

// Função para resetar cliente Supabase
export const resetSupabaseClient = () => {
  supabaseInstance = null;
  clearSystemCache();
  return createSupabaseClient();
};
