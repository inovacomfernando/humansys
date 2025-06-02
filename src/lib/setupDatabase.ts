import { supabase, checkSupabaseConnection } from '@/integrations/supabase/client';

export const setupDatabase = async () => {
  try {
    console.log('🔧 Verificando configuração do PostgreSQL local...');

    // Verificar conectividade
    const isConnected = await checkSupabaseConnection();

    if (!isConnected) {
      console.log('❌ PostgreSQL local não está disponível');
      return false;
    }

    console.log('✅ PostgreSQL local configurado e funcionando!');
    return true;
  } catch (error) {
    console.error('Database setup failed:', error);
    console.log('Continuando sem database setup...');
    return false;
  }
};

// Função simplificada que não depende de RPC
export const createTablesSQL = async () => {
  try {
    const isConnected = await checkSupabaseConnection();
    return isConnected;
  } catch (error) {
    console.log('Tables creation result:', error);
    return false;
  }
};