
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// For local development, use the existing Neon database
const SUPABASE_URL = "https://ep-holy-fire-a6jhjo8y.us-west-2.aws.neon.tech";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwLWhvbHktZmlyZS1hNmpqamhvOHkiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczNjg3NDM5MSwiZXhwIjoyMDUyNDUwMzkxfQ.ZjY2ZjZjNjZkNmQ2ZDZkNmQ2ZDZkNmQ2ZDZkNmQ2ZA";

// Create singleton instance to avoid multiple connections
let supabaseInstance: any = null;

export const supabase = supabaseInstance || (supabaseInstance = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Client-Info': 'replit-hr-dashboard'
    }
  },
  db: {
    schema: 'public'
  }
}));

// Função auxiliar para verificar conectividade com PostgreSQL
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    // Usar uma consulta mais simples e robusta
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.warn('Database session check failed:', sessionError.message);
      return false;
    }

    // Se há sessão, fazer uma query básica para testar a conectividade
    if (session) {
      const { error } = await supabase
        .from('collaborators')
        .select('count')
        .limit(0);

      if (error) {
        console.warn('Database table access test failed:', error.message);
        // Erros de RLS/permissão ainda indicam conectividade
        if (error.message.includes('JWT') || 
            error.message.includes('auth') || 
            error.message.includes('RLS') ||
            error.message.includes('permission') ||
            error.code === 'PGRST301') {
          return true;
        }
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Connection check failed:', error);
    return false;
  }
};

// Cache para melhorar performance
export const queryCache = new Map();

// Função para limpar cache
export const clearQueryCache = () => {
  queryCache.clear();
  console.log('Query cache cleared');
};

// Função para refresh completo do sistema
export const refreshSystemData = async () => {
  try {
    clearQueryCache();
    localStorage.removeItem('replit.auth.token');

    // Recarregar a página para garantir estado limpo
    window.location.reload();

    return true;
  } catch (error) {
    console.error('System refresh failed:', error);
    return false;
  }
};
