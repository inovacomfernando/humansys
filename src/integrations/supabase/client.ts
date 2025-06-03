
// Sistema de dados local - substitui completamente o Supabase
interface LocalDatabase {
  [key: string]: any[];
}

// Cache global para dados
export const queryCache = new Map<string, any>();

// Simular estrutura de banco local
class LocalDataClient {
  private storage: Storage;
  private memoryCache: LocalDatabase = {};

  constructor() {
    this.storage = localStorage;
    this.initializeDatabase();
  }

  private initializeDatabase() {
    // Inicializar tabelas se não existirem
    const tables = [
      'collaborators',
      'profiles', 
      'user_credits',
      'trainings',
      'certificates',
      'surveys',
      'documents',
      'goals',
      'meetings',
      'organization_users',
      'business_metrics',
      'founder_gamification'
    ];

    tables.forEach(table => {
      if (!this.storage.getItem(table)) {
        this.storage.setItem(table, JSON.stringify([]));
      }
    });

    // Dados iniciais de demonstração
    this.seedInitialData();
  }

  private seedInitialData() {
    // Usuário demo
    const demoUser = {
      id: '5b43d42f-f5e1-46bf-9a95-e6de48163a81',
      email: 'demo@orientohub.com',
      name: 'Usuário Demo',
      created_at: new Date().toISOString()
    };

    // Colaborador demo
    const collaborators = this.getTable('collaborators');
    if (collaborators.length === 0) {
      this.insertIntoTable('collaborators', {
        id: '0965ad80-73c7-4fc4-8fe0-c5302926cb57',
        user_id: demoUser.id,
        name: 'Amanda Motta',
        email: 'amanda@vendasimples.com.br',
        created_at: new Date().toISOString()
      });
    }

    // Perfil demo
    const profiles = this.getTable('profiles');
    if (profiles.length === 0) {
      this.insertIntoTable('profiles', demoUser);
    }

    // Créditos demo
    const credits = this.getTable('user_credits');
    if (credits.length === 0) {
      this.insertIntoTable('user_credits', {
        id: '1',
        user_id: demoUser.id,
        credits: 100,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }
  }

  private getTable(tableName: string): any[] {
    try {
      const data = this.storage.getItem(tableName);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveTable(tableName: string, data: any[]) {
    this.storage.setItem(tableName, JSON.stringify(data));
    this.memoryCache[tableName] = data;
  }

  private insertIntoTable(tableName: string, record: any) {
    const table = this.getTable(tableName);
    record.id = record.id || this.generateId();
    record.created_at = record.created_at || new Date().toISOString();
    record.updated_at = new Date().toISOString();
    
    table.push(record);
    this.saveTable(tableName, table);
    return record;
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  // Simular API do Supabase
  from(tableName: string) {
    return {
      select: (columns = '*') => ({
        eq: (column: string, value: any) => this.query(tableName, { [column]: value }),
        neq: (column: string, value: any) => this.query(tableName, { [`${column}__neq`]: value }),
        in: (column: string, values: any[]) => this.query(tableName, { [`${column}__in`]: values }),
        gte: (column: string, value: any) => this.query(tableName, { [`${column}__gte`]: value }),
        lte: (column: string, value: any) => this.query(tableName, { [`${column}__lte`]: value }),
        like: (column: string, pattern: string) => this.query(tableName, { [`${column}__like`]: pattern }),
        limit: (count: number) => this.query(tableName, {}, count),
        single: () => this.querySingle(tableName),
        order: (column: string, options?: any) => this.query(tableName, {}, undefined, column, options),
        then: (callback: (result: any) => void) => {
          const data = this.getTable(tableName);
          callback({ data, error: null });
        }
      }),
      insert: (record: any) => ({
        select: () => ({
          then: (callback: (result: any) => void) => {
            const inserted = this.insertIntoTable(tableName, record);
            callback({ data: [inserted], error: null });
          }
        }),
        then: (callback: (result: any) => void) => {
          const inserted = this.insertIntoTable(tableName, record);
          callback({ data: [inserted], error: null });
        }
      }),
      update: (updates: any) => ({
        eq: (column: string, value: any) => ({
          then: (callback: (result: any) => void) => {
            const table = this.getTable(tableName);
            const updated = table.map(item => 
              item[column] === value ? { ...item, ...updates, updated_at: new Date().toISOString() } : item
            );
            this.saveTable(tableName, updated);
            callback({ data: updated.filter(item => item[column] === value), error: null });
          }
        })
      }),
      delete: () => ({
        eq: (column: string, value: any) => ({
          then: (callback: (result: any) => void) => {
            const table = this.getTable(tableName);
            const filtered = table.filter(item => item[column] !== value);
            this.saveTable(tableName, filtered);
            callback({ data: null, error: null });
          }
        })
      }),
      upsert: (record: any) => ({
        then: (callback: (result: any) => void) => {
          const table = this.getTable(tableName);
          const existingIndex = table.findIndex(item => item.id === record.id);
          
          if (existingIndex >= 0) {
            table[existingIndex] = { ...table[existingIndex], ...record, updated_at: new Date().toISOString() };
          } else {
            record.id = record.id || this.generateId();
            record.created_at = record.created_at || new Date().toISOString();
            record.updated_at = new Date().toISOString();
            table.push(record);
          }
          
          this.saveTable(tableName, table);
          callback({ data: [record], error: null });
        }
      })
    };
  }

  private query(tableName: string, filters: any = {}, limit?: number, orderBy?: string, orderOptions?: any) {
    return {
      then: (callback: (result: any) => void) => {
        let data = this.getTable(tableName);

        // Aplicar filtros
        Object.keys(filters).forEach(key => {
          const value = filters[key];
          
          if (key.endsWith('__neq')) {
            const column = key.replace('__neq', '');
            data = data.filter(item => item[column] !== value);
          } else if (key.endsWith('__in')) {
            const column = key.replace('__in', '');
            data = data.filter(item => value.includes(item[column]));
          } else if (key.endsWith('__gte')) {
            const column = key.replace('__gte', '');
            data = data.filter(item => item[column] >= value);
          } else if (key.endsWith('__lte')) {
            const column = key.replace('__lte', '');
            data = data.filter(item => item[column] <= value);
          } else if (key.endsWith('__like')) {
            const column = key.replace('__like', '');
            const pattern = value.replace(/%/g, '.*');
            data = data.filter(item => new RegExp(pattern, 'i').test(item[column]));
          } else {
            data = data.filter(item => item[key] === value);
          }
        });

        // Ordenação
        if (orderBy) {
          const ascending = !orderOptions?.ascending === false;
          data.sort((a, b) => {
            const aVal = a[orderBy];
            const bVal = b[orderBy];
            if (aVal < bVal) return ascending ? -1 : 1;
            if (aVal > bVal) return ascending ? 1 : -1;
            return 0;
          });
        }

        // Limite
        if (limit) {
          data = data.slice(0, limit);
        }

        callback({ data, error: null });
      }
    };
  }

  private querySingle(tableName: string) {
    return {
      then: (callback: (result: any) => void) => {
        const data = this.getTable(tableName);
        const single = data.length > 0 ? data[0] : null;
        callback({ data: single, error: single ? null : { code: 'PGRST116', message: 'No rows found' } });
      }
    };
  }

  // Simular autenticação
  auth = {
    getSession: async () => {
      const session = sessionStorage.getItem('demo_session');
      if (session) {
        const parsed = JSON.parse(session);
        return { data: { session: parsed }, error: null };
      }
      return { data: { session: null }, error: null };
    },

    signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
      // Autenticação demo - aceita qualquer email/senha
      const user = {
        id: '5b43d42f-f5e1-46bf-9a95-e6de48163a81',
        email: email,
        user_metadata: { name: 'Usuário Demo' }
      };

      const session = {
        user,
        access_token: 'demo_token',
        expires_at: Date.now() + 3600000
      };

      sessionStorage.setItem('demo_session', JSON.stringify(session));
      return { data: { user, session }, error: null };
    },

    signUp: async ({ email, password, options }: any) => {
      const user = {
        id: this.generateId(),
        email: email,
        user_metadata: options?.data || {}
      };

      const session = {
        user,
        access_token: 'demo_token',
        expires_at: Date.now() + 3600000
      };

      sessionStorage.setItem('demo_session', JSON.stringify(session));
      return { data: { user, session }, error: null };
    },

    signOut: async () => {
      sessionStorage.removeItem('demo_session');
      return { error: null };
    },

    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      // Simular listener de mudanças de auth
      const checkSession = () => {
        const session = sessionStorage.getItem('demo_session');
        if (session) {
          callback('SIGNED_IN', JSON.parse(session));
        } else {
          callback('SIGNED_OUT', null);
        }
      };

      // Verificar sessão inicial
      setTimeout(checkSession, 100);

      // Retornar subscription mock
      return {
        data: {
          subscription: {
            unsubscribe: () => {}
          }
        }
      };
    },

    resetPasswordForEmail: async (email: string) => {
      // Simular reset de senha
      console.log('Password reset requested for:', email);
      return { error: null };
    }
  };
}

// Instância única do cliente local
export const supabase = new LocalDataClient();

// Funções de compatibilidade
export const checkSupabaseConnection = async (): Promise<boolean> => {
  console.log('Conectividade OK (sistema local)');
  return true;
};

export const refreshSystemData = async (): Promise<boolean> => {
  console.log('Refresh do sistema local...');
  return true;
};

export const clearSystemCache = (): void => {
  queryCache.clear();
  console.log('Cache do sistema limpo');
};

export const clearQueryCache = (): void => {
  queryCache.clear();
  console.log('Cache de queries limpo');
};
