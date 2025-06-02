import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Configuração do Supabase
const supabaseUrl = 'https://dhtkrylkjdtpqpxgimgw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRodGtyeWxramR0cHFweGdpbWd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU5MjY5MjgsImV4cCI6MjA1MTUwMjkyOH0.nYQGCPP-FQjnrWNq4dJIqgNKFXhvSJVg6RtyKXIcHvw';

// Cliente Supabase
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 2
    }
  }
});

// Função de verificação de conectividade
export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('collaborators').select('count').limit(1);
    if (error) {
      console.error('❌ Erro ao conectar com Supabase:', error);
      return false;
    }
    console.log('✅ Supabase conectado com sucesso!');
    return true;
  } catch (error) {
    console.error('❌ Erro de conexão:', error);
    return false;
  }
};

// Cache para queries
export const queryCache = new Map();

export const clearQueryCache = () => {
  queryCache.clear();
  console.log('Query cache cleared');
};

export const refreshSystemData = async () => {
  try {
    clearQueryCache();
    // Força revalidação do cache do Supabase
    await supabase.auth.refreshSession();
    console.log('✅ Sistema atualizado com sucesso!');
    return true;
  } catch (error) {
    console.error('System refresh failed:', error);
    return false;
  }
};