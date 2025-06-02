
// PostgreSQL local client configuration
import pkg from 'pg';
const { Pool } = pkg;

// Configuração do banco PostgreSQL local
const DATABASE_CONFIG = {
  host: 'localhost',
  port: 5432,
  database: 'humansys_db',
  user: 'replit',
  password: 'humansys123'
};

// Pool de conexões para melhor performance
const pool = new Pool(DATABASE_CONFIG);

// Interface compatível com Supabase para facilitar migração
class PostgreSQLClient {
  constructor() {
    this.pool = pool;
  }

  // Simular auth do Supabase
  auth = {
    getUser: async () => ({
      data: { 
        user: { 
          id: '5b43d42f-f5e1-46bf-9a95-e6de48163a81',
          email: 'oriento.suporte@proton.me'
        } 
      },
      error: null
    }),
    
    getSession: async () => ({
      data: { 
        session: { 
          user: { 
            id: '5b43d42f-f5e1-46bf-9a95-e6de48163a81',
            email: 'oriento.suporte@proton.me'
          } 
        } 
      },
      error: null
    })
  };

  // Método from para queries
  from(table) {
    return new QueryBuilder(this.pool, table);
  }

  // RPC method placeholder
  rpc(functionName, params = {}) {
    console.log(`RPC call: ${functionName}`, params);
    return Promise.resolve({ data: null, error: null });
  }
}

// Query Builder para simular interface do Supabase
class QueryBuilder {
  constructor(pool, table) {
    this.pool = pool;
    this.table = table;
    this.query = {
      select: '*',
      where: [],
      order: [],
      limit: null
    };
  }

  select(columns = '*') {
    this.query.select = columns;
    return this;
  }

  eq(column, value) {
    this.query.where.push(`${column} = $${this.query.where.length + 1}`);
    this.values = this.values || [];
    this.values.push(value);
    return this;
  }

  order(column, { ascending = true } = {}) {
    this.query.order.push(`${column} ${ascending ? 'ASC' : 'DESC'}`);
    return this;
  }

  limit(count) {
    this.query.limit = count;
    return this;
  }

  async execute() {
    try {
      let sql = `SELECT ${this.query.select} FROM ${this.table}`;
      
      if (this.query.where.length > 0) {
        sql += ` WHERE ${this.query.where.join(' AND ')}`;
      }
      
      if (this.query.order.length > 0) {
        sql += ` ORDER BY ${this.query.order.join(', ')}`;
      }
      
      if (this.query.limit) {
        sql += ` LIMIT ${this.query.limit}`;
      }

      console.log('Executing SQL:', sql, this.values || []);
      
      const client = await this.pool.connect();
      try {
        const result = await client.query(sql, this.values || []);
        return { data: result.rows, error: null };
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Query error:', error);
      return { data: null, error };
    }
  }

  // Métodos de conveniência que executam automaticamente
  then(onResolve, onReject) {
    return this.execute().then(onResolve, onReject);
  }

  catch(onReject) {
    return this.execute().catch(onReject);
  }
}

// Instância do cliente
export const supabase = new PostgreSQLClient();

// Função de verificação de conectividade
export const checkSupabaseConnection = async () => {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    console.log('✅ PostgreSQL local conectado com sucesso!');
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar com PostgreSQL:', error);
    return false;
  }
};

// Cache para queries
export const queryCache = new Map();

export const clearQueryCache = () => {
  queryCache.clear();
  console.log('Query cache cleared');
};

export const refreshSystemData = async () => {
  try {
    clearQueryCache();
    // Para PostgreSQL local, não precisamos recarregar a página
    console.log('✅ Sistema atualizado com sucesso!');
    return true;
  } catch (error) {
    console.error('System refresh failed:', error);
    return false;
  }
};
