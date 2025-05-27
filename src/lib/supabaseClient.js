import { createClient } from '@supabase/supabase-js';

// Substitua pelos seus valores do Supabase
const supabaseUrl = 'https://hdugxslfoujddlbkvvak.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhkdWd4c2xmb3VqZGRsYmt2dmFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyNjMwMzksImV4cCI6MjA2MzgzOTAzOX0.V1CflAVNQGZyjl36gs4mzHY1HxvzrD1_nwXc4zPTTRw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
