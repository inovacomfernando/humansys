import { supabase } from '@/integrations/supabase/client';

export const setupDatabase = async (): Promise<boolean> => {
  try {
    console.log('Setting up PostgreSQL database tables...');

    // Verificar se as tabelas já existem
    const { data: collaboratorsCheck, error: collaboratorsError } = await supabase
      .from('collaborators')
      .select('*')
      .limit(1);

    console.log('Collaborators table check:', { collaboratorsCheck, collaboratorsError });

    if (collaboratorsError && collaboratorsError.code === 'PGRST116') {
      console.log('Tables do not exist, they should be created by the init script');
      return false;
    }

    console.log('Database tables are accessible');
    return true;
  } catch (error) {
    console.error('Error setting up database:', error);
    return false;
  }
};

// Função simplificada para inicializar o banco
export const initializeDatabase = async (): Promise<void> => {
  try {
    console.log('Initializing database...');

    const success = await setupDatabase();

    if (success) {
      console.log('Database initialized successfully');
    } else {
      console.warn('Database initialization completed with warnings');
    }
  } catch (error) {
    console.error('Failed to initialize database:', error);
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

export default { setupDatabase, initializeDatabase };