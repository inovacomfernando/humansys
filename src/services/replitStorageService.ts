
import { Client } from '@replit/object-storage';

export interface StoredCollaborator {
  id: string;
  user_id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'active' | 'inactive' | 'vacation';
  phone?: string;
  location?: string;
  join_date: string;
  created_at: string;
  updated_at: string;
}

class ReplitStorageService {
  private client: Client;
  private cacheKey = 'collaborators_cache';

  constructor() {
    this.client = new Client();
  }

  // Gerar chave única por usuário
  private getUserKey(userId: string): string {
    return `collaborators_${userId}.json`;
  }

  // Salvar colaboradores no Object Storage
  async saveCollaborators(userId: string, collaborators: StoredCollaborator[]): Promise<boolean> {
    try {
      const key = this.getUserKey(userId);
      const data = {
        collaborators,
        lastUpdated: new Date().toISOString(),
        version: '1.0'
      };

      const { ok, error } = await this.client.uploadFromText(key, JSON.stringify(data, null, 2));
      
      if (!ok) {
        console.error('Error saving to Replit storage:', error);
        return false;
      }

      console.log(`✅ Colaboradores salvos no Object Storage: ${collaborators.length} itens`);
      return true;
    } catch (error) {
      console.error('Storage save error:', error);
      return false;
    }
  }

  // Carregar colaboradores do Object Storage
  async loadCollaborators(userId: string): Promise<StoredCollaborator[]> {
    try {
      const key = this.getUserKey(userId);
      const { ok, value, error } = await this.client.downloadAsText(key);

      if (!ok) {
        if (error && error.toString().includes('not found')) {
          console.log('📁 Arquivo de colaboradores não encontrado, retornando lista vazia');
          return [];
        }
        console.error('Error loading from Replit storage:', error);
        return [];
      }

      const data = JSON.parse(value);
      console.log(`📂 Colaboradores carregados do Object Storage: ${data.collaborators?.length || 0} itens`);
      
      return data.collaborators || [];
    } catch (error) {
      console.error('Storage load error:', error);
      return [];
    }
  }

  // Adicionar colaborador
  async addCollaborator(userId: string, collaborator: StoredCollaborator): Promise<boolean> {
    try {
      const existing = await this.loadCollaborators(userId);
      const updated = [collaborator, ...existing.filter(c => c.id !== collaborator.id)];
      return await this.saveCollaborators(userId, updated);
    } catch (error) {
      console.error('Error adding collaborator:', error);
      return false;
    }
  }

  // Atualizar colaborador
  async updateCollaborator(userId: string, collaboratorId: string, updates: Partial<StoredCollaborator>): Promise<boolean> {
    try {
      const existing = await this.loadCollaborators(userId);
      const updated = existing.map(c => 
        c.id === collaboratorId 
          ? { ...c, ...updates, updated_at: new Date().toISOString() }
          : c
      );
      return await this.saveCollaborators(userId, updated);
    } catch (error) {
      console.error('Error updating collaborator:', error);
      return false;
    }
  }

  // Remover colaborador
  async deleteCollaborator(userId: string, collaboratorId: string): Promise<boolean> {
    try {
      const existing = await this.loadCollaborators(userId);
      const updated = existing.filter(c => c.id !== collaboratorId);
      return await this.saveCollaborators(userId, updated);
    } catch (error) {
      console.error('Error deleting collaborator:', error);
      return false;
    }
  }

  // Listar todos os arquivos de usuários (debug)
  async listAllFiles(): Promise<string[]> {
    try {
      const { ok, value, error } = await this.client.list();
      if (!ok) {
        console.error('Error listing files:', error);
        return [];
      }
      return value.map(file => file.name);
    } catch (error) {
      console.error('List files error:', error);
      return [];
    }
  }

  // Sincronizar com Supabase (tentativa)
  async syncWithSupabase(userId: string, supabaseData: StoredCollaborator[]): Promise<boolean> {
    try {
      const storageData = await this.loadCollaborators(userId);
      
      // Merge dos dados (prioridade para dados mais recentes)
      const merged = [...supabaseData];
      
      // Adicionar itens que existem apenas no storage
      storageData.forEach(storageItem => {
        const existsInSupabase = supabaseData.find(sb => sb.id === storageItem.id);
        if (!existsInSupabase) {
          merged.push(storageItem);
        }
      });

      // Salvar dados mesclados
      await this.saveCollaborators(userId, merged);
      
      console.log(`🔄 Sincronização concluída: ${merged.length} colaboradores`);
      return true;
    } catch (error) {
      console.error('Sync error:', error);
      return false;
    }
  }
}

export const replitStorage = new ReplitStorageService();
