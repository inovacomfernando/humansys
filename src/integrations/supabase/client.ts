
import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Garantir instância única global
let supabaseInstance: SupabaseClient | null = null;
let isInitializing = false;

const supabaseUrl = 'http://127.0.0.1:54321'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'

const createSupabaseClient = (): SupabaseClient => {
  // Prevenir múltiplas criações simultâneas
  if (isInitializing && supabaseInstance) {
    return supabaseInstance;
  }

  // Se já existe, retornar
  if (supabaseInstance) {
    return supabaseInstance;
  }

  isInitializing = true;

  try {
    console.log('🔗 Criando cliente Supabase único...');

    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false, // Desabilitar para evitar conflitos
        persistSession: true,
        detectSessionInUrl: false,
        storageKey: 'orientohub-auth-session',
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
          'x-client-info': 'orientohub-local-v1'
        }
      },
      db: {
        schema: 'public'
      },
      realtime: {
        enabled: false
      }
    });

    console.log('✅ Cliente Supabase único criado');
    return supabaseInstance;

  } catch (error) {
    console.error('❌ Erro crítico ao criar cliente:', error);
    throw error;
  } finally {
    isInitializing = false;
  }
};

// Exportar cliente único
export const supabase = createSupabaseClient();

// Função de verificação de conexão simples
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.from('collaborators').select('count').limit(0);
    return !error;
  } catch {
    return false;
  }
};

export default supabase;
