import { createClient } from '@supabase/supabase-js'

// Garantir que só existe uma instância do cliente
let supabaseInstance: any = null;

const createSupabaseClient = () => {
  // Se já existe uma instância, retornar ela
  if (supabaseInstance) {
    return supabaseInstance;
  }

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'http://127.0.0.1:54321'
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'

  console.log('🔗 Criando cliente Supabase:', {
    url: supabaseUrl,
    hasKey: !!supabaseAnonKey
  });

  try {
    // Criar instância única
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
        storageKey: 'orientohub-auth',
        storage: window.localStorage
      },
      global: {
        headers: {
          'x-client-info': 'orientohub-local'
        }
      },
      db: {
        schema: 'public'
      },
      realtime: {
        enabled: false // Desabilitar realtime para evitar conflitos
      }
    });

    console.log('✅ Cliente Supabase criado com sucesso');
    return supabaseInstance;

  } catch (error) {
    console.error('❌ Erro ao criar cliente Supabase:', error);
    throw error;
  }
};

// Exportar a instância única
export const supabase = createSupabaseClient();

// Função para resetar o cliente se necessário
export const resetSupabaseClient = () => {
  supabaseInstance = null;
  return createSupabaseClient();
};

export default supabase;