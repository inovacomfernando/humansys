
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const supabaseUrl = "https://zlnlzcjlyjacvjvkfwyp.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpsblx6Y2pseWphY3Zqdmtmd3lwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2OTY2MzcsImV4cCI6MjA2NDI3MjYzN30.QBqfGVlxH3VtJFV-pNSJQn5x74IlgA3BPQH9lpxJqBw"

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
    storageKey: 'humansys-auth-token'
  }
});
