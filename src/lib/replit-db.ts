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
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.message || data.error || 'Request failed' };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Database request error:', error);
      return { success: false, error: 'Network error' };
    }
  }

  // Auth methods
  async login(email: string, password: string) {
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