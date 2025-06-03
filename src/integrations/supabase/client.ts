import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// URLs e chaves para PostgreSQL local
const supabaseUrl = 'http://localhost:5432';
const supabaseAnonKey = 'local_development_key';

// Configuração específica para desenvolvimento local
const supabaseConfig = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    storage: {
      getItem: (key: string) => localStorage.getItem(key),
      setItem: (key: string, value: string) => localStorage.setItem(key, value),
      removeItem: (key: string) => localStorage.removeItem(key),
    },
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'x-my-custom-header': 'OrientoHub-Local',
    },
  },
};

// Cliente único para evitar múltiplas instâncias
let supabaseInstance: ReturnType<typeof createClient<Database>> | null = null;

export const getSupabaseClient = () => {
  if (!supabaseInstance) {
    console.log('Criando nova instância do cliente Supabase para PostgreSQL local');

    // Para desenvolvimento local, usamos uma configuração simplificada
    supabaseInstance = createClient(
      'http://localhost:54321', // Supabase local URL
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0',
      supabaseConfig
    );
  }

  return supabaseInstance;
};

export const supabase = getSupabaseClient();

// Função para verificar conectividade
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    console.log('Verificando conectividade...');
    const { error } = await supabase.from('collaborators').select('count').limit(0);

    if (error && error.code !== 'PGRST301') {
      console.warn('Erro de conectividade:', error);
      return false;
    }

    console.log('Conectividade OK');
    return true;
  } catch (error) {
    console.error('Erro na verificação de conectividade:', error);
    return false;
  }
};

// Função para refresh do sistema
export const refreshSystemData = async (): Promise<boolean> => {
  try {
    console.log('Iniciando refresh do sistema...');

    // Refresh da sessão
    const { error: refreshError } = await supabase.auth.refreshSession();
    if (refreshError) {
      console.warn('Aviso no refresh da sessão:', refreshError);
    }

    // Verificar conectividade
    const isConnected = await checkSupabaseConnection();

    console.log('Refresh do sistema concluído:', { isConnected });
    return isConnected;
  } catch (error) {
    console.error('Erro no refresh do sistema:', error);
    return false;
  }
};

// Função para limpar cache de queries
export const clearQueryCache = (): void => {
  try {
    console.log('Limpando cache de queries...');

    // Limpar localStorage específico do Supabase
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('supabase.') || key.startsWith('sb-')) {
        localStorage.removeItem(key);
      }
    });

    // Limpar sessionStorage
    sessionStorage.clear();

    console.log('Cache limpo com sucesso');
  } catch (error) {
    console.error('Erro ao limpar cache:', error);
  }
};

export default supabase;