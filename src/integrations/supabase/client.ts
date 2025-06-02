import { createClient } from '@supabase/supabase-js';

// Usar Supabase para desenvolvimento no Replit
const supabaseUrl = 'https://mlfkbxsowzrhkjvmhcrl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sZmtieHNvd3pyaGtqdm1oY3JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU5NjA2MzgsImV4cCI6MjA1MTUzNjYzOH0.RvgFwdCePcXyH0W73oYRx6t6dIaHTqm2aFTyqF1m3oo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Cache para queries
export const queryCache = new Map();

export const clearQueryCache = () => {
  queryCache.clear();
  console.log('Query cache cleared');
};

// Função de verificação de conectividade
export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('collaborators')
      .select('count', { count: 'exact', head: true })
      .limit(1);

    if (error) {
      console.error('Supabase connection error:', error);
      return false;
    }

    console.log('✅ Supabase connected successfully!');
    return true;
  } catch (error) {
    console.error('❌ Failed to connect to Supabase:', error);
    return false;
  }
};

export const refreshSystemData = async () => {
  try {
    clearQueryCache();
    console.log('✅ System refreshed successfully!');
    return true;
  } catch (error) {
    console.error('System refresh failed:', error);
    return false;
  }
};