
// Sistema de dados local - não requer configuração de banco externo

export const initializeDatabase = async (): Promise<void> => {
  try {
    console.log('Inicializando sistema de dados local...');
    
    // Verificar se localStorage está disponível
    if (typeof Storage === 'undefined') {
      throw new Error('LocalStorage não disponível');
    }

    // Verificar dados iniciais
    const tables = ['collaborators', 'profiles', 'user_credits', 'trainings'];
    let isInitialized = true;

    tables.forEach(table => {
      if (!localStorage.getItem(table)) {
        isInitialized = false;
      }
    });

    if (!isInitialized) {
      console.log('Primeira inicialização - criando dados demo...');
    }

    console.log('Sistema de dados local inicializado com sucesso');
  } catch (error) {
    console.error('Erro na inicialização do sistema local:', error);
    throw error;
  }
};

export const checkTablesExist = async (): Promise<boolean> => {
  try {
    // Verificar se as tabelas básicas existem no localStorage
    const requiredTables = ['collaborators', 'profiles', 'user_credits'];
    return requiredTables.every(table => localStorage.getItem(table) !== null);
  } catch {
    return false;
  }
};

// Função para verificar se o usuário existe no sistema local
export const checkUserExists = async (email: string): Promise<boolean> => {
  try {
    const collaborators = localStorage.getItem('collaborators');
    if (!collaborators) return false;

    const data = JSON.parse(collaborators);
    return data.some((collaborator: any) => collaborator.email === email);
  } catch (error) {
    console.error('Erro ao verificar usuário:', error);
    return false;
  }
};

// Função para criar usuário no sistema local
export const createUserInDatabase = async (userId: string, userData: any) => {
  try {
    // Criar perfil
    const profiles = JSON.parse(localStorage.getItem('profiles') || '[]');
    const profile = {
      id: userId,
      name: userData.name || userData.full_name,
      email: userData.email,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const existingProfileIndex = profiles.findIndex((p: any) => p.id === userId);
    if (existingProfileIndex >= 0) {
      profiles[existingProfileIndex] = profile;
    } else {
      profiles.push(profile);
    }
    localStorage.setItem('profiles', JSON.stringify(profiles));

    // Criar créditos iniciais
    const credits = JSON.parse(localStorage.getItem('user_credits') || '[]');
    const userCredit = {
      id: Math.random().toString(36).substr(2, 9),
      user_id: userId,
      credits: 100,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const existingCreditIndex = credits.findIndex((c: any) => c.user_id === userId);
    if (existingCreditIndex >= 0) {
      credits[existingCreditIndex] = userCredit;
    } else {
      credits.push(userCredit);
    }
    localStorage.setItem('user_credits', JSON.stringify(credits));

    console.log('Usuário criado no sistema local com sucesso');
    return true;
  } catch (error) {
    console.error('Erro ao criar usuário no sistema local:', error);
    return false;
  }
};

export default { initializeDatabase };
