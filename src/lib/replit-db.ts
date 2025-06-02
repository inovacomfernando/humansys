// Cliente para comunicação com o servidor de banco local
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-production-url.com' 
  : `http://${window.location.hostname}:3001`;

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

      // Timeout para requisições
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos

      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        signal: controller.signal,
        ...options,
      });

      clearTimeout(timeoutId);
      console.log('📥 Resposta recebida:', { status: response.status, ok: response.ok });

      const data = await response.json();
      console.log('📋 Dados da resposta:', data);

      if (!response.ok) {
        return { success: false, error: data.message || data.error || 'Request failed' };
      }

      return { success: true, data };
    } catch (error) {
      console.error('❌ Erro na requisição de banco:', error);

      if (error.name === 'AbortError') {
        return { success: false, error: 'Timeout na requisição. Servidor pode estar sobrecarregado.' };
      }

      if (error.message?.includes('Failed to fetch')) {
        return { success: false, error: 'Erro de rede. Verifique se o servidor de banco está rodando na porta 3001.' };
      }

      return { success: false, error: `Erro de conexão: ${error.message}` };
    }
  }

  // Auth methods
  async login(email: string, password: string) {
    console.log('🌐 Enviando requisição de login para:', `${API_BASE_URL}/api/auth/login`);
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async createUser(email: string, name: string, password_hash: string) {
    return this.request('/api/users', {
      method: 'POST',
      body: JSON.stringify({ email, name, password_hash }),
    });
  }

  // Collaborators methods
  async getCollaborators(userId: string) {
    return this.request(`/api/collaborators/${userId}`);
  }

  async createCollaborator(collaboratorData: any) {
    return this.request('/api/collaborators', {
      method: 'POST',
      body: JSON.stringify(collaboratorData),
    });
  }

  // Credits methods
  async getCredits(userId: string) {
    return this.request(`/api/credits/${userId}`);
  }

  // Users methods
  async getUsers() {
    return this.request('/api/users');
  }

  // Health check
  async healthCheck() {
    return this.request('/api/health');
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