
import { Client } from 'pg';

// Configuração do PostgreSQL
const DATABASE_URL = import.meta.env.VITE_DATABASE_URL || "postgresql://localhost:5432/postgres";

let pgClient: Client | null = null;

// Função para criar conexão com PostgreSQL
export const createPgClient = () => {
  if (!pgClient) {
    pgClient = new Client({
      connectionString: DATABASE_URL,
      ssl: DATABASE_URL.includes('neon.tech') ? { rejectUnauthorized: false } : false
    });
  }
  return pgClient;
};

// Função para conectar
export const connectToDatabase = async () => {
  try {
    const client = createPgClient();
    await client.connect();
    console.log('Conectado ao PostgreSQL');
    return client;
  } catch (error) {
    console.error('Erro ao conectar ao PostgreSQL:', error);
    throw error;
  }
};

// Função para verificar conectividade
export const checkDatabaseConnection = async (): Promise<boolean> => {
  try {
    const client = createPgClient();
    await client.query('SELECT 1');
    return true;
  } catch (error) {
    console.error('Erro de conectividade:', error);
    return false;
  }
};

// Auth simples sem Supabase
export const simpleAuth = {
  async signIn(email: string, password: string) {
    // Implementação simples de autenticação
    try {
      const client = createPgClient();
      const result = await client.query(
        'SELECT * FROM collaborators WHERE email = $1 LIMIT 1',
        [email]
      );
      
      if (result.rows.length > 0) {
        // Salvar no localStorage para simular sessão
        const user = result.rows[0];
        localStorage.setItem('user', JSON.stringify(user));
        return { user, error: null };
      }
      
      return { user: null, error: { message: 'Usuário não encontrado' } };
    } catch (error) {
      return { user: null, error };
    }
  },

  async signOut() {
    localStorage.removeItem('user');
    return { error: null };
  },

  async getSession() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      return { data: { session: { user } }, error: null };
    }
    return { data: { session: null }, error: null };
  }
};

// Exportar auth para compatibilidade
export const supabase = {
  auth: simpleAuth,
  from: (table: string) => ({
    select: (columns: string) => ({
      eq: (column: string, value: any) => ({
        limit: (limit: number) => ({
          order: (column: string, options: any) => 
            mockQuery(table, columns, { [column]: value }, limit)
        })
      })
    })
  })
};

// Função mock para queries
const mockQuery = async (table: string, columns: string, filters: any, limit?: number) => {
  try {
    const client = createPgClient();
    let query = `SELECT ${columns === '*' ? '*' : columns} FROM ${table}`;
    const values: any[] = [];
    
    if (filters && Object.keys(filters).length > 0) {
      const conditions = Object.keys(filters).map((key, index) => {
        values.push(filters[key]);
        return `${key} = $${index + 1}`;
      });
      query += ` WHERE ${conditions.join(' AND ')}`;
    }
    
    if (limit) {
      query += ` LIMIT ${limit}`;
    }
    
    const result = await client.query(query, values);
    return { data: result.rows, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Cache simples
export const queryCache = new Map();

export const clearQueryCache = () => {
  queryCache.clear();
};

export const refreshSystemData = async () => {
  clearQueryCache();
  localStorage.removeItem('user');
  window.location.reload();
  return true;
};
