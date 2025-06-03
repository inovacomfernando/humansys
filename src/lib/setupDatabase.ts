
import { supabase } from '@/integrations/supabase/client';

export const setupDatabase = async (): Promise<void> => {
  try {
    console.log('Setting up PostgreSQL database tables...');

    // Primeiro, verificar se conseguimos conectar
    const { data: connectionTest, error: connectionError } = await supabase
      .from('collaborators')
      .select('count')
      .limit(1);

    if (connectionError) {
      console.log('Database connection test failed:', connectionError);
      throw new Error(`Database connection failed: ${connectionError.message}`);
    }

    console.log('Database connection successful');

    // Verificar se as tabelas existem
    const { data: tablesCheck, error: tablesError } = await supabase
      .from('collaborators')
      .select('id, name, email')
      .limit(1);

    if (tablesError && tablesError.code !== 'PGRST116') {
      console.log('Tables check error:', tablesError);
      throw new Error(`Tables verification failed: ${tablesError.message}`);
    }

    console.log('Database tables verified successfully');

    // Log dados de exemplo se existirem
    if (tablesCheck && tablesCheck.length > 0) {
      console.log('Sample data found:', tablesCheck);
    }

    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Database setup failed:', error);
    throw error;
  }
};

// Função para verificar se o usuário existe
export const checkUserExists = async (email: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('collaborators')
      .select('id')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.log('User check error:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Failed to check user:', error);
    return false;
  }
};

// Função para criar usuário no banco
export const createUserInDatabase = async (userId: string, userData: any) => {
  try {
    // Inserir ou atualizar perfil
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        name: userData.name || userData.full_name,
        updated_at: new Date().toISOString()
      });

    if (profileError) {
      console.error('Profile creation error:', profileError);
    }

    // Inserir créditos iniciais
    const { error: creditsError } = await supabase
      .from('user_credits')
      .upsert({
        user_id: userId,
        credits: 100,
        updated_at: new Date().toISOString()
      });

    if (creditsError) {
      console.error('Credits creation error:', creditsError);
    }

    console.log('User created in database successfully');
    return true;
  } catch (error) {
    console.error('Failed to create user in database:', error);
    return false;
  }
};
