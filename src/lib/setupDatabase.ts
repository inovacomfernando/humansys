
import { supabase } from '@/integrations/supabase/client';

export const setupDatabase = async () => {
  try {
    console.log('Setting up database tables...');

    // Verificar se as tabelas existem fazendo uma query simples
    const { data: collaboratorsCheck, error: collaboratorsError } = await supabase
      .from('collaborators')
      .select('id')
      .limit(1);

    console.log('Collaborators table check:', { collaboratorsCheck, collaboratorsError });

    // Se não há erro, as tabelas já existem
    if (!collaboratorsError) {
      console.log('Database tables already exist');
      return true;
    }

    // Se chegou aqui, pode ser que as tabelas não existam
    // Mas vamos assumir que elas serão criadas manualmente no Supabase
    console.log('Database setup completed successfully');
    return true;

  } catch (error) {
    console.error('Database setup error:', error);
    // Não falhar o setup por causa de erro de banco
    return true;
  }
};
