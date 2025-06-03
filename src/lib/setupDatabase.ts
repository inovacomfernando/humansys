
import { supabase } from '@/integrations/supabase/client';

interface DatabaseStatus {
  isConnected: boolean;
  tablesExist: boolean;
  error?: string;
}

export const checkDatabaseConnection = async (): Promise<DatabaseStatus> => {
  try {
    console.log('🔍 Verificando conexão com banco...');
    
    // Verificar conexão básica
    const { data, error } = await supabase
      .from('collaborators')
      .select('count')
      .limit(0);

    if (error) {
      console.error('❌ Erro na conexão:', error);
      return {
        isConnected: false,
        tablesExist: false,
        error: error.message
      };
    }

    console.log('✅ Conexão com banco estabelecida');
    return {
      isConnected: true,
      tablesExist: true
    };

  } catch (error: any) {
    console.error('❌ Erro crítico na verificação:', error);
    return {
      isConnected: false,
      tablesExist: false,
      error: error.message
    };
  }
};

export const setupDatabase = async (): Promise<boolean> => {
  try {
    console.log('🛠️ Configurando banco de dados...');
    
    const status = await checkDatabaseConnection();
    
    if (!status.isConnected) {
      console.error('❌ Não foi possível conectar ao banco');
      return false;
    }

    console.log('✅ Banco de dados configurado e pronto');
    return true;

  } catch (error: any) {
    console.error('❌ Erro na configuração do banco:', error);
    return false;
  }
};

// Verificar saúde do banco periodicamente
export const healthCheck = async (): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('collaborators')
      .select('count')
      .limit(0);

    return !error;
  } catch {
    return false;
  }
};
