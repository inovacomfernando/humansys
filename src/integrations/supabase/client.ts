
// Cliente local simulado para substituir completamente o Supabase
interface LocalUser {
  id: string;
  email: string;
  user_metadata?: any;
  app_metadata?: any;
}

interface LocalSession {
  user: LocalUser;
  access_token: string;
  refresh_token: string;
}

class LocalAuthClient {
  private currentUser: LocalUser | null = null;
  private currentSession: LocalSession | null = null;
  private listeners: ((event: string, session: LocalSession | null) => void)[] = [];

  constructor() {
    // Carregar usuário do localStorage se existir
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const userData = localStorage.getItem('local_auth_user');
      const sessionData = localStorage.getItem('local_auth_session');
      
      if (userData && sessionData) {
        this.currentUser = JSON.parse(userData);
        this.currentSession = JSON.parse(sessionData);
      }
    } catch (error) {
      console.error('Erro ao carregar dados locais:', error);
    }
  }

  private saveToStorage() {
    try {
      if (this.currentUser && this.currentSession) {
        localStorage.setItem('local_auth_user', JSON.stringify(this.currentUser));
        localStorage.setItem('local_auth_session', JSON.stringify(this.currentSession));
      } else {
        localStorage.removeItem('local_auth_user');
        localStorage.removeItem('local_auth_session');
      }
    } catch (error) {
      console.error('Erro ao salvar dados locais:', error);
    }
  }

  async signInWithPassword({ email, password }: { email: string; password: string }) {
    // Simulação de login local
    if (email && password) {
      const user: LocalUser = {
        id: 'local-user-' + Date.now(),
        email: email,
        user_metadata: { name: email.split('@')[0] }
      };

      const session: LocalSession = {
        user,
        access_token: 'local-token-' + Date.now(),
        refresh_token: 'local-refresh-' + Date.now()
      };

      this.currentUser = user;
      this.currentSession = session;
      this.saveToStorage();

      // Notificar listeners
      this.listeners.forEach(callback => callback('SIGNED_IN', session));

      return { data: { user, session }, error: null };
    }

    return { data: { user: null, session: null }, error: { message: 'Email e senha são obrigatórios' } };
  }

  async signOut() {
    this.currentUser = null;
    this.currentSession = null;
    this.saveToStorage();

    // Notificar listeners
    this.listeners.forEach(callback => callback('SIGNED_OUT', null));

    return { error: null };
  }

  async getSession() {
    return { 
      data: { session: this.currentSession }, 
      error: null 
    };
  }

  async getUser() {
    return { 
      data: { user: this.currentUser }, 
      error: null 
    };
  }

  async refreshSession() {
    if (this.currentSession) {
      // Simular refresh do token
      this.currentSession.access_token = 'local-token-' + Date.now();
      this.saveToStorage();
      return { data: { session: this.currentSession }, error: null };
    }
    return { data: { session: null }, error: { message: 'Nenhuma sessão para renovar' } };
  }

  onAuthStateChange(callback: (event: string, session: LocalSession | null) => void) {
    this.listeners.push(callback);
    
    // Chamar callback inicial se há sessão
    if (this.currentSession) {
      setTimeout(() => callback('INITIAL_SESSION', this.currentSession), 100);
    }

    return {
      data: {
        subscription: {
          unsubscribe: () => {
            const index = this.listeners.indexOf(callback);
            if (index > -1) {
              this.listeners.splice(index, 1);
            }
          }
        }
      }
    };
  }
}

class LocalDatabaseClient {
  private data: { [table: string]: any[] } = {
    collaborators: [],
    trainings: [],
    user_credits: [],
    goals: [],
    feedback: []
  };

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const savedData = localStorage.getItem('local_database');
      if (savedData) {
        this.data = JSON.parse(savedData);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do banco local:', error);
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem('local_database', JSON.stringify(this.data));
    } catch (error) {
      console.error('Erro ao salvar dados do banco local:', error);
    }
  }

  from(table: string) {
    return {
      select: (columns: string = '*') => ({
        eq: (column: string, value: any) => this.query(table, { [column]: value }),
        order: (column: string, options?: { ascending?: boolean }) => this.query(table),
        limit: (count: number) => this.query(table).then(result => ({
          ...result,
          data: result.data ? result.data.slice(0, count) : null
        }))
      }),
      insert: (data: any) => {
        const newItem = { ...data, id: 'local-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9) };
        if (!this.data[table]) this.data[table] = [];
        this.data[table].push(newItem);
        this.saveToStorage();
        return Promise.resolve({ data: newItem, error: null });
      },
      update: (data: any) => ({
        eq: (column: string, value: any) => {
          if (!this.data[table]) return Promise.resolve({ data: null, error: null });
          const items = this.data[table].filter(item => item[column] === value);
          items.forEach(item => Object.assign(item, data));
          this.saveToStorage();
          return Promise.resolve({ data: items, error: null });
        }
      }),
      delete: () => ({
        eq: (column: string, value: any) => {
          if (!this.data[table]) return Promise.resolve({ data: null, error: null });
          const initialLength = this.data[table].length;
          this.data[table] = this.data[table].filter(item => item[column] !== value);
          this.saveToStorage();
          return Promise.resolve({ data: { count: initialLength - this.data[table].length }, error: null });
        }
      })
    };
  }

  private async query(table: string, filters?: { [key: string]: any }) {
    if (!this.data[table]) this.data[table] = [];
    
    let result = [...this.data[table]];
    
    if (filters) {
      result = result.filter(item => {
        return Object.entries(filters).every(([key, value]) => item[key] === value);
      });
    }

    return { data: result, error: null };
  }

  rpc(functionName: string, params?: any) {
    console.log(`RPC call to ${functionName} with params:`, params);
    // Simular funções RPC localmente
    return Promise.resolve({ data: null, error: null });
  }
}

// Cliente principal local
export const supabase = {
  auth: new LocalAuthClient(),
  from: (table: string) => new LocalDatabaseClient().from(table),
  rpc: (functionName: string, params?: any) => new LocalDatabaseClient().rpc(functionName, params)
};

console.log('🏠 Cliente local inicializado');
