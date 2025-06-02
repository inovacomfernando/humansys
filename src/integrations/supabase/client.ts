import pkg from 'pg';
const { Pool } = pkg;

// Configuração do pool de conexões PostgreSQL
const pool = new Pool({
  user: process.env.PGUSER || 'replit',
  host: process.env.PGHOST || 'localhost',
  database: process.env.PGDATABASE || 'humansys_db',
  password: process.env.PGPASSWORD || 'humansys123',
  port: parseInt(process.env.PGPORT || '5432'),
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

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
    }),

    signUp: async (credentials) => {
      try {
        const { name, email, password } = credentials;
        const client = await this.pool.connect();

        try {
          // Verificar se usuário já existe
          const existingUser = await client.query('SELECT id FROM auth_users WHERE email = $1', [email]);

          if (existingUser.rows.length > 0) {
            return { 
              data: null, 
              error: { message: 'Usuário já existe' } 
            };
          }

          // Criar novo usuário
          const result = await client.query(
            'INSERT INTO auth_users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
            [email, password] // Em produção, hash a senha
          );

          const user = result.rows[0];

          // Criar créditos iniciais
          await client.query(
            'INSERT INTO user_credits (user_id) VALUES ($1)',
            [user.id]
          );

          return { 
            data: { user }, 
            error: null 
          };
        } finally {
          client.release();
        }
      } catch (error) {
        console.error('Erro no signup:', error);
        return { 
          data: null, 
          error: { message: 'Erro interno do servidor' } 
        };
      }
    },

    signInWithPassword: async (credentials) => {
      try {
        const { email, password } = credentials;
        const client = await this.pool.connect();

        try {
          const result = await client.query(
            'SELECT id, email FROM auth_users WHERE email = $1 AND password_hash = $2',
            [email, password] // Em produção, verificar hash
          );

          if (result.rows.length === 0) {
            return { 
              data: null, 
              error: { message: 'Credenciais inválidas' } 
            };
          }

          const user = result.rows[0];
          return { 
            data: { user }, 
            error: null 
          };
        } finally {
          client.release();
        }
      } catch (error) {
        console.error('Erro no login:', error);
        return { 
          data: null, 
          error: { message: 'Erro interno do servidor' } 
        };
      }
    },

    signOut: async () => {
      return { error: null };
    }
  };

  // Método from para queries
  from(table) {
    return new QueryBuilder(this.pool, table);
  }

  // RPC method que não faz nada (remove dependência de funções não existentes)
  rpc(functionName, params = {}) {
    console.log(`RPC call ignored: ${functionName}`, params);
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
    this.values = [];
  }

  select(columns = '*') {
    this.query.select = columns;
    return this;
  }

  eq(column, value) {
    this.query.where.push(`${column} = $${this.values.length + 1}`);
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

  async insert(data) {
    try {
      const columns = Object.keys(data);
      const values = Object.values(data);
      const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');

      const sql = `INSERT INTO ${this.table} (${columns.join(', ')}) VALUES (${placeholders}) RETURNING *`;

      const client = await this.pool.connect();
      try {
        const result = await client.query(sql, values);
        return { data: result.rows[0], error: null };
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Insert error:', error);
      return { data: null, error };
    }
  }

  async update(data) {
    try {
      const columns = Object.keys(data);
      const values = Object.values(data);
      const setClause = columns.map((col, i) => `${col} = $${i + 1}`).join(', ');

      let sql = `UPDATE ${this.table} SET ${setClause}`;

      if (this.query.where.length > 0) {
        sql += ` WHERE ${this.query.where.join(' AND ')}`;
        values.push(...this.values);
      }

      sql += ' RETURNING *';

      const client = await this.pool.connect();
      try {
        const result = await client.query(sql, values);
        return { data: result.rows[0], error: null };
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Update error:', error);
      return { data: null, error };
    }
  }

  async delete() {
    try {
      let sql = `DELETE FROM ${this.table}`;

      if (this.query.where.length > 0) {
        sql += ` WHERE ${this.query.where.join(' AND ')}`;
      }

      const client = await this.pool.connect();
      try {
        const result = await client.query(sql, this.values);
        return { data: { count: result.rowCount }, error: null };
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Delete error:', error);
      return { data: null, error };
    }
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

      console.log('Executing SQL:', sql, this.values);

      const client = await this.pool.connect();
      try {
        const result = await client.query(sql, this.values);
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

// Cache para queries
export const queryCache = new Map();

export const clearQueryCache = () => {
  queryCache.clear();
  console.log('Query cache cleared');
};

// Função de verificação de conectividade simplificada
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

export const refreshSystemData = async () => {
  try {
    clearQueryCache();
    console.log('✅ Sistema atualizado com sucesso!');
    return true;
  } catch (error) {
    console.error('System refresh failed:', error);
    return false;
  }
};