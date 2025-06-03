// Cliente PostgreSQL simples sem Supabase
export interface DatabaseClient {
  query: (sql: string, params?: any[]) => Promise<{ data: any[], error: any }>;
}

// Mock client para desenvolvimento sem dependências externas
class MockDatabaseClient implements DatabaseClient {
  private mockData = {
    collaborators: [
      {
        id: "1",
        user_id: "admin-001",
        name: "Amanda Motta",
        email: "amanda@vendasimples.com.br",
        created_at: new Date().toISOString()
      }
    ]
  };

  async query(sql: string, params?: any[]): Promise<{ data: any[], error: any }> {
    console.log('Mock Database Query:', sql, params);

    try {
      // Simular queries básicas
      if (sql.includes('SELECT') && sql.includes('collaborators')) {
        return { data: this.mockData.collaborators, error: null };
      }

      return { data: [], error: null };
    } catch (error) {
      return { data: [], error };
    }
  }
}

// Exportar cliente único
export const dbClient = new MockDatabaseClient();

// Função de verificação de conexão
export const checkDatabaseConnection = async (): Promise<boolean> => {
  try {
    const { error } = await dbClient.query('SELECT 1');
    return !error;
  } catch {
    return false;
  }
};

// Limpar cache (compatibilidade)
export const clearSystemCache = () => {
  console.log('Cache cleared');
};

export const queryCache = new Map();