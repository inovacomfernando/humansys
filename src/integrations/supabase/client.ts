
// Sistema de autenticação simples sem dependências de banco
const MOCK_USERS = [
  {
    id: "5b43d42f-f5e1-46bf-9a95-e6de48163a81",
    email: "amanda@vendasimples.com.br",
    name: "Amanda Motta",
    role: "admin"
  },
  {
    id: "test-user-1",
    email: "test@test.com", 
    name: "Usuário Teste",
    role: "user"
  }
];

// Auth simples baseado em localStorage
export const simpleAuth = {
  async signIn(email: string, password: string) {
    console.log('Tentando fazer login com:', email);
    
    // Simulação de delay de rede
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Verificar se o usuário existe na lista mock
    const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (user) {
      // Salvar no localStorage para simular sessão
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('session', JSON.stringify({
        access_token: 'mock-token',
        user: user,
        expires_at: Date.now() + (24 * 60 * 60 * 1000) // 24 horas
      }));
      
      console.log('Login realizado com sucesso:', user);
      return { user, error: null };
    }
    
    return { 
      user: null, 
      error: { message: 'Email ou senha incorretos' } 
    };
  },

  async signOut() {
    localStorage.removeItem('user');
    localStorage.removeItem('session');
    console.log('Logout realizado');
    return { error: null };
  },

  async getSession() {
    const sessionStr = localStorage.getItem('session');
    if (sessionStr) {
      try {
        const session = JSON.parse(sessionStr);
        
        // Verificar se a sessão não expirou
        if (session.expires_at > Date.now()) {
          return { data: { session }, error: null };
        } else {
          // Sessão expirada, limpar
          localStorage.removeItem('user');
          localStorage.removeItem('session');
        }
      } catch (error) {
        console.error('Erro ao parsear sessão:', error);
      }
    }
    return { data: { session: null }, error: null };
  },

  async getUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        return { data: { user }, error: null };
      } catch (error) {
        console.error('Erro ao parsear usuário:', error);
      }
    }
    return { data: { user: null }, error: null };
  }
};

// Mock data para simular dados do banco
const MOCK_DATA = {
  collaborators: [
    {
      id: "0965ad80-73c7-4fc4-8fe0-c5302926cb57",
      user_id: "5b43d42f-f5e1-46bf-9a95-e6de48163a81",
      name: "Amanda Motta",
      email: "amanda@vendasimples.com.br",
      department: "Vendas",
      position: "Gerente",
      created_at: new Date().toISOString()
    }
  ],
  trainings: [],
  certificates: [],
  documents: []
};

// Simulação de queries para compatibilidade
export const supabase = {
  auth: simpleAuth,
  
  from: (table: string) => ({
    select: (columns: string = '*') => ({
      eq: (column: string, value: any) => ({
        order: (orderColumn: string, options?: any) => ({
          limit: (limitValue: number) => mockQuery(table, columns, { [column]: value }, limitValue, orderColumn, options),
          single: () => mockQuery(table, columns, { [column]: value }, 1, orderColumn, options).then(result => ({
            ...result,
            data: result.data?.[0] || null
          }))
        }),
        limit: (limitValue: number) => mockQuery(table, columns, { [column]: value }, limitValue),
        single: () => mockQuery(table, columns, { [column]: value }, 1).then(result => ({
          ...result, 
          data: result.data?.[0] || null
        }))
      }),
      order: (orderColumn: string, options?: any) => ({
        limit: (limitValue: number) => mockQuery(table, columns, {}, limitValue, orderColumn, options)
      }),
      limit: (limitValue: number) => mockQuery(table, columns, {}, limitValue)
    }),
    
    insert: (data: any) => ({
      select: () => mockInsert(table, data)
    }),
    
    update: (data: any) => ({
      eq: (column: string, value: any) => mockUpdate(table, data, { [column]: value })
    }),
    
    delete: () => ({
      eq: (column: string, value: any) => mockDelete(table, { [column]: value })
    })
  })
};

// Função mock para queries
const mockQuery = async (
  table: string, 
  columns: string, 
  filters: any = {}, 
  limit?: number,
  orderColumn?: string,
  orderOptions?: any
) => {
  console.log(`Mock query: ${table}`, { columns, filters, limit, orderColumn });
  
  await new Promise(resolve => setTimeout(resolve, 200)); // Simular delay
  
  let data = MOCK_DATA[table as keyof typeof MOCK_DATA] || [];
  
  // Aplicar filtros
  if (Object.keys(filters).length > 0) {
    data = data.filter(item => {
      return Object.entries(filters).every(([key, value]) => item[key] === value);
    });
  }
  
  // Aplicar ordenação
  if (orderColumn) {
    data.sort((a, b) => {
      const aVal = a[orderColumn];
      const bVal = b[orderColumn];
      const ascending = orderOptions?.ascending !== false;
      
      if (aVal < bVal) return ascending ? -1 : 1;
      if (aVal > bVal) return ascending ? 1 : -1;
      return 0;
    });
  }
  
  // Aplicar limite
  if (limit) {
    data = data.slice(0, limit);
  }
  
  return { data, error: null };
};

const mockInsert = async (table: string, insertData: any) => {
  console.log(`Mock insert: ${table}`, insertData);
  
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const newItem = {
    id: `mock-${Date.now()}`,
    created_at: new Date().toISOString(),
    ...insertData
  };
  
  if (MOCK_DATA[table as keyof typeof MOCK_DATA]) {
    (MOCK_DATA[table as keyof typeof MOCK_DATA] as any[]).push(newItem);
  }
  
  return { data: [newItem], error: null };
};

const mockUpdate = async (table: string, updateData: any, filters: any) => {
  console.log(`Mock update: ${table}`, { updateData, filters });
  
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const data = MOCK_DATA[table as keyof typeof MOCK_DATA] || [];
  const updatedItems = data.filter(item => {
    return Object.entries(filters).every(([key, value]) => item[key] === value);
  }).map(item => ({ ...item, ...updateData, updated_at: new Date().toISOString() }));
  
  return { data: updatedItems, error: null };
};

const mockDelete = async (table: string, filters: any) => {
  console.log(`Mock delete: ${table}`, filters);
  
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return { data: [], error: null };
};

// Cache simples
export const queryCache = new Map();

export const clearQueryCache = () => {
  queryCache.clear();
};

export const refreshSystemData = async () => {
  clearQueryCache();
  localStorage.removeItem('user');
  localStorage.removeItem('session');
  window.location.reload();
  return true;
};

// Verificar conectividade (sempre retorna true no mock)
export const checkDatabaseConnection = async (): Promise<boolean> => {
  return true;
};
