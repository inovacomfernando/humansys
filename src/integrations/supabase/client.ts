import { createClient } from '@supabase/supabase-js'
import { Database } from './types'

console.log('%c🏠 SISTEMA LOCAL INICIALIZADO', 'color: green; font-size: 16px; font-weight: bold;');

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'http://localhost:54321'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'

// Singleton instance
let supabaseInstance: ReturnType<typeof createClient<Database>> | null = null;

const createSupabaseClient = () => {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
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
            // Ignore errors
          }
        },
        removeItem: (key: string) => {
          try {
            localStorage.removeItem(key);
          } catch {
            // Ignore errors
          }
        },
      },
    },
    db: {
      schema: 'public',
    },
    global: {
      headers: {
        'x-client-info': 'humansys-local'
      }
    }
  });

  return supabaseInstance;
};

export const supabase = createSupabaseClient();

// Reset function for testing
export const resetSupabaseClient = () => {
  supabaseInstance = null;
};