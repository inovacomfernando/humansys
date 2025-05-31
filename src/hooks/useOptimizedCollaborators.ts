
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useProgressiveLoader } from './useProgressiveLoader';
import { useSessionHealthCheck } from './useSessionHealthCheck';
import { supabase } from '@/integrations/supabase/client';

export interface Collaborator {
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
  skills?: string[];
  hireDate?: string;
}

interface CollaboratorsData {
  collaborators: Collaborator[];
  stats: {
    total: number;
    active: number;
    inactive: number;
    vacation: number;
    departments: number;
  };
}

interface LoadingState {
  isLoading: boolean;
  currentStage: 'initial' | 'essential' | 'secondary' | 'complete';
  progress: number;
}

export const useOptimizedCollaborators = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { sessionHealth } = useSessionHealthCheck();
  
  const {
    loadingState: baseLoadingState,
    data,
    addStage,
    loadProgressively,
    refresh,
    reset
  } = useProgressiveLoader<CollaboratorsData>();

  const [error, setError] = useState<string | null>(null);

  // Converter loadingState para o formato esperado
  const loadingState: LoadingState = {
    isLoading: baseLoadingState.isLoading,
    currentStage: baseLoadingState.currentStage as 'initial' | 'essential' | 'secondary' | 'complete',
    progress: baseLoadingState.progress
  };

  // Função para buscar colaboradores com retry inteligente
  const fetchCollaborators = useCallback(async (): Promise<Collaborator[]> => {
    if (!user?.id) throw new Error('Usuário não autenticado');

    const maxRetries = sessionHealth.networkStatus === 'slow' ? 2 : 3;
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const timeout = sessionHealth.networkStatus === 'slow' ? 10000 : 5000;
        
        const { data, error } = await Promise.race([
          supabase
            .from('collaborators')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false }),
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), timeout)
          )
        ]);

        if (error) throw error;
        
        // Corrigir o tipo de status para corresponder à interface
        const typedData: Collaborator[] = (data || []).map(item => ({
          ...item,
          status: item.status as 'active' | 'inactive' | 'vacation',
          skills: item.skills || [],
          hireDate: item.join_date
        }));
        
        return typedData;

      } catch (error: any) {
        lastError = error;
        console.warn(`Attempt ${attempt} failed:`, error.message);
        
        if (attempt < maxRetries) {
          // Backoff exponencial
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError;
  }, [user?.id, sessionHealth.networkStatus]);

  // Função para calcular estatísticas
  const calculateStats = useCallback((collaborators: Collaborator[]) => {
    const active = collaborators.filter(c => c.status === 'active').length;
    const inactive = collaborators.filter(c => c.status === 'inactive').length;
    const vacation = collaborators.filter(c => c.status === 'vacation').length;
    const departments = new Set(collaborators.map(c => c.department)).size;

    return {
      total: collaborators.length,
      active,
      inactive,
      vacation,
      departments
    };
  }, []);

  // Configurar estágios de carregamento
  useEffect(() => {
    if (!user?.id) return;

    reset();

    // Estágio 1: Dados essenciais (colaboradores básicos)
    addStage('essential', {
      name: 'essential',
      priority: 'high',
      loader: fetchCollaborators
    });

    // Estágio 2: Estatísticas (calculadas dos dados essenciais)
    addStage('secondary', {
      name: 'secondary',
      priority: 'medium',
      loader: async () => {
        const collaborators = data.collaborators || [];
        return calculateStats(collaborators);
      },
      dependencies: ['essential']
    });

  }, [user?.id, addStage, reset, fetchCollaborators, calculateStats, data.collaborators]);

  // Iniciar carregamento quando usuário estiver disponível
  useEffect(() => {
    if (user?.id && sessionHealth.isHealthy) {
      loadProgressively();
    }
  }, [user?.id, sessionHealth.isHealthy, loadProgressively]);

  // Criar colaborador otimizado
  const createCollaborator = useCallback(async (collaboratorData: {
    name: string;
    email: string;
    role: string;
    department: string;
    status?: 'active' | 'inactive' | 'vacation';
    phone?: string;
    location?: string;
    join_date?: string;
  }) => {
    if (!user?.id) {
      toast({
        title: "Erro de Autenticação",
        description: "Você precisa estar logado para criar um colaborador.",
        variant: "destructive"
      });
      return null;
    }

    try {
      const dataToInsert = {
        ...collaboratorData,
        user_id: user.id,
        status: collaboratorData.status || 'active' as const,
      };

      const { data: result, error } = await supabase
        .from('collaborators')
        .insert([dataToInsert])
        .select()
        .single();

      if (error) throw error;

      // Atualizar dados localmente para resposta imediata
      const newCollaborator: Collaborator = {
        ...result,
        status: result.status as 'active' | 'inactive' | 'vacation',
        skills: [],
        hireDate: result.join_date
      };
      const currentCollaborators = data.collaborators || [];
      const updatedCollaborators = [newCollaborator, ...currentCollaborators];
      
      // Atualizar cache com os novos dados
      const updatedData = {
        collaborators: updatedCollaborators,
        stats: calculateStats(updatedCollaborators)
      };

      // Força atualização local imediata
      Object.assign(data, updatedData);

      toast({
        title: "Sucesso",
        description: "Colaborador criado com sucesso."
      });

      return newCollaborator;
    } catch (error: any) {
      const errorMsg = error.message || 'Falha ao criar colaborador';
      setError(errorMsg);
      toast({
        title: "Erro",
        description: errorMsg,
        variant: "destructive"
      });
      return null;
    }
  }, [user?.id, data, calculateStats, toast]);

  // Força refresh com feedback visual
  const forceRefresh = useCallback(() => {
    setError(null);
    toast({
      title: "Atualizando",
      description: "Recarregando dados mais recentes..."
    });
    refresh(true);
  }, [refresh, toast]);

  return {
    collaborators: data.collaborators || [],
    stats: data.stats || { total: 0, active: 0, inactive: 0, vacation: 0, departments: 0 },
    loadingState,
    error,
    createCollaborator,
    refresh: forceRefresh,
    isUsingCache: !sessionHealth.isHealthy
  };
};
