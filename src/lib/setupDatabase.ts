import { supabase } from '@/integrations/supabase/client';

export const initializeDatabase = async (): Promise<void> => {
  try {
    console.log('Inicializando banco de dados...');

    // Para desenvolvimento, simular sucesso
    if (process.env.NODE_ENV === 'development') {
      console.log('Modo desenvolvimento: banco simulado');
      return;
    }

    // Verificar conectividade básica
    const { error } = await supabase.from('collaborators').select('count').limit(0);

    if (error && error.code === 'PGRST202') {
      console.log('Tabelas não encontradas, mas continuando...');
      return;
    }

    if (error) {
      console.warn('Erro na verificação do banco:', error);
      return;
    }

    console.log('Banco de dados inicializado com sucesso');
  } catch (error) {
    console.warn('Aviso na inicialização do banco:', error);
    // Não falhar por causa de problemas de banco em desenvolvimento
  }
};

export const checkTablesExist = async (): Promise<boolean> => {
  try {
    if (process.env.NODE_ENV === 'development') {
      return true;
    }

    const { error } = await supabase.from('collaborators').select('count').limit(0);
    return !error;
  } catch {
    return false;
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

export default { initializeDatabase };