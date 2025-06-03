import { connectToDatabase } from '@/integrations/supabase/client';

export const setupDatabase = async () => {
  try {
    console.log('Configurando banco de dados...');

    const client = await connectToDatabase();

    // Verificar se as tabelas existem
    const checkTables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('collaborators', 'trainings', 'certificates')
    `);

    console.log('Tabelas encontradas:', checkTables.rows);

    // Se não existirem, criar as tabelas básicas
    if (checkTables.rows.length === 0) {
      await client.query(`
        CREATE TABLE IF NOT EXISTS collaborators (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          created_at TIMESTAMP DEFAULT NOW()
        )
      `);

      console.log('Tabelas criadas com sucesso');
    }

    return true;
  } catch (error) {
    console.error('Erro ao configurar banco:', error);
    return false;
  }
};