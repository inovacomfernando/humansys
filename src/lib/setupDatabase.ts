
import { dbClient } from '@/integrations/supabase/client';

export const checkDatabaseConnection = async (): Promise<boolean> => {
  try {
    console.log('🔍 Verificando conexão com o banco...');
    
    const { error } = await dbClient.query('SELECT 1');
    
    if (error) {
      console.error('❌ Erro na conexão:', error);
      return false;
    }

    console.log('✅ Banco conectado');
    return true;
  } catch (error: any) {
    console.error('❌ Erro de conexão:', error);
    return false;
  }
};

export const setupDatabase = async (): Promise<boolean> => {
  try {
    console.log('🛠️ Configurando banco de dados...');
    
    const isConnected = await checkDatabaseConnection();
    
    if (isConnected) {
      console.log('✅ Banco configurado com sucesso');
      return true;
    } else {
      console.warn('⚠️ Usando modo offline');
      return false;
    }
  } catch (error: any) {
    console.error('❌ Erro na configuração:', error);
    return false;
  }
};

export const healthCheck = async (): Promise<boolean> => {
  try {
    const { error } = await dbClient.query('SELECT 1');
    return !error;
  } catch {
    return false;
  }
};
