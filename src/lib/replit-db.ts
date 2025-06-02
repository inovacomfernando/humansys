
import { supabase } from '@/integrations/supabase/client';

// Usar apenas Supabase para comunicação com o banco de dados
export const executeQuery = async (query: string, params: any[] = []) => {
  console.log('Executando query via Supabase RPC:', query);
  try {
    // Para queries mais complexas, usar RPC functions no Supabase
    const { data, error } = await supabase.rpc('execute_sql', {
      sql_query: query,
      params: params
    });
    
    if (error) {
      console.error('Erro na query:', error);
      throw error;
    }
    
    return { rows: data || [] };
  } catch (error) {
    console.error('Erro ao executar query:', error);
    throw error;
  }
};

export const setupTables = async () => {
  console.log('PostgreSQL setup via Supabase - tabelas já configuradas');
  return Promise.resolve();
};t
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

let isConnected = false;

export const connectDB = async () => {
  if (!isConnected) {
    try {
      await client.connect();
      isConnected = true;
      console.log('✅ Conectado ao PostgreSQL do Replit');
    } catch (error) {
      console.error('❌ Erro ao conectar ao PostgreSQL:', error);
      throw error;
    }
  }
  return client;
};

export const executeQuery = async (query: string, params: any[] = []) => {
  try {
    const db = await connectDB();
    const result = await db.query(query, params);
    return result;
  } catch (error) {
    console.error('Erro na query:', error);
    throw error;
  }
};

// Função para criar as tabelas necessárias
export const setupTables = async () => {
  try {
    const db = await connectDB();
    
    // Criar tabela de usuários
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        password_hash VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Criar tabela de colaboradores
    await db.query(`
      CREATE TABLE IF NOT EXISTS collaborators (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        position VARCHAR(255),
        department VARCHAR(255),
        hire_date DATE,
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Criar tabela de créditos
    await db.query(`
      CREATE TABLE IF NOT EXISTS user_credits (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        credits INTEGER DEFAULT 100,
        plan VARCHAR(50) DEFAULT 'trial',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id)
      )
    `);

    // Criar tabela de transações de créditos
    await db.query(`
      CREATE TABLE IF NOT EXISTS credit_transactions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        amount INTEGER NOT NULL,
        type VARCHAR(50) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Criar tabela de treinamentos
    await db.query(`
      CREATE TABLE IF NOT EXISTS trainings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        content TEXT,
        duration INTEGER,
        status VARCHAR(50) DEFAULT 'draft',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Tabelas criadas/verificadas com sucesso');
  } catch (error) {
    console.error('❌ Erro ao criar tabelas:', error);
    throw error;
  }
};

export { client as db };
