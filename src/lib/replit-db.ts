// Cliente para comunicação com o servidor de banco local
const API_BASE_URL = 'http://localhost:3001/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

class LocalDatabaseClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      console.log('📡 Fazendo requisição:', { url, method: options.method || 'GET' });
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      console.log('📥 Resposta recebida:', { status: response.status, ok: response.ok });

      const data = await response.json();
      console.log('📋 Dados da resposta:', data);

      if (!response.ok) {
        return { success: false, error: data.message || data.error || 'Request failed' };
      }

      return { success: true, data };
    } catch (error) {
      console.error('❌ Erro na requisição de banco:', error);
      return { success: false, error: 'Erro de conexão. Verifique se o servidor está rodando.' };
    }
  }

  // Auth methods
  async login(email: string, password: string) {
    console.log('🌐 Enviando requisição de login para:', `${API_BASE_URL}/auth/login`);
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async createUser(email: string, name: string, password_hash: string) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify({ email, name, password_hash }),
    });
  }

  // Collaborators methods
  async getCollaborators(userId: string) {
    return this.request(`/collaborators/${userId}`);
  }

  async createCollaborator(collaboratorData: any) {
    return this.request('/collaborators', {
      method: 'POST',
      body: JSON.stringify(collaboratorData),
    });
  }

  // Credits methods
  async getCredits(userId: string) {
    return this.request(`/credits/${userId}`);
  }

  // Users methods
  async getUsers() {
    return this.request('/users');
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

export const dbClient = new LocalDatabaseClient();

// Legacy compatibility functions
export const executeQuery = async (query: string, params: any[] = []) => {
  console.warn('executeQuery is deprecated, use dbClient methods instead');
  return { rows: [] };
};

export const setupTables = async () => {
  console.log('Tables are managed by the database server');
  return Promise.resolve();
};