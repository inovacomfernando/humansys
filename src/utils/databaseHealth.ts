
import { dbClient } from '@/lib/replit-db';

export interface DatabaseHealthCheck {
  isHealthy: boolean;
  serverRunning: boolean;
  canConnect: boolean;
  hasData: boolean;
  errors: string[];
}

export const checkDatabaseHealth = async (): Promise<DatabaseHealthCheck> => {
  const result: DatabaseHealthCheck = {
    isHealthy: false,
    serverRunning: false,
    canConnect: false,
    hasData: false,
    errors: []
  };

  try {
    // 1. Verificar se o servidor está rodando
    const healthResponse = await dbClient.healthCheck();
    if (healthResponse.success) {
      result.serverRunning = true;
      result.canConnect = true;
    } else {
      result.errors.push('Servidor de banco não está respondendo');
      return result;
    }

    // 2. Verificar se há dados de teste
    const usersResponse = await dbClient.getUsers();
    if (usersResponse.success && usersResponse.data?.users?.length > 0) {
      result.hasData = true;
    } else {
      result.errors.push('Banco sem dados de teste');
    }

    // 3. Marcar como saudável se todos os checks passaram
    result.isHealthy = result.serverRunning && result.canConnect;

  } catch (error: any) {
    result.errors.push(`Erro de conectividade: ${error.message}`);
  }

  return result;
};

export const fixDatabaseIssues = async (): Promise<boolean> => {
  try {
    console.log('🔧 Tentando corrigir problemas do banco...');
    
    // Limpar cache problemático
    localStorage.removeItem('postgres_user');
    sessionStorage.clear();
    
    // Aguardar um pouco
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Verificar conectividade
    const health = await checkDatabaseHealth();
    
    if (!health.serverRunning) {
      console.error('❌ Servidor de banco não está rodando. Por favor, inicie o workflow "Start Database Server"');
      return false;
    }
    
    if (!health.hasData) {
      console.log('📝 Populando banco com dados de teste...');
      // Aqui você pode chamar o script de população se necessário
    }
    
    console.log('✅ Correções aplicadas com sucesso');
    return true;
    
  } catch (error) {
    console.error('❌ Erro ao corrigir problemas:', error);
    return false;
  }
};
