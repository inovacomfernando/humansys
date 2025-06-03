import { supabase } from '@/integrations/supabase/client';

export const checkDatabaseConnection = async (): Promise<boolean> => {
  try {
    console.log('🔍 Verificando conexão...');

    const { error } = await supabase
      .from('collaborators')
      .select('count')
      .limit(0);

    if (error) {
      console.error('❌ Erro na conexão:', error.message);
      return false;
    }

    console.log('✅ Banco conectado');
    return true;

  } catch (error: any) {
    console.error('❌ Erro de conexão:', error.message);
    return false;
  }
};

export const setupDatabase = async (): Promise<boolean> => {
  try {
    console.log('🛠️ Configurando banco...');

    const isConnected = await checkDatabaseConnection();

    if (isConnected) {
      console.log('✅ Banco configurado');
      return true;
    } else {
      console.warn('⚠️ Banco não conectado - modo offline');
      return false;
    }

  } catch (error: any) {
    console.error('❌ Erro na configuração:', error.message);
    return false;
  }
};

export const healthCheck = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.from('collaborators').select('count').limit(0);
    return !error;
  } catch {
    return false;
  }
};