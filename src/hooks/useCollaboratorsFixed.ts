
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useOfflineCache } from './useOfflineCache';
import { supabase } from '@/integrations/supabase/client';

export interface CollaboratorFixed {
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

export const useCollaboratorsFixed = () => {
  const [collaborators, setCollaborators] = useState<CollaboratorFixed[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const { get, set, addToSyncQueue, processSyncQueue, isOnline, syncQueueLength } = useOfflineCache<CollaboratorFixed[]>('collaborators');

  // Amanda como colaboradora padrão para demonstração
  const getAmandaCollaborator = useCallback((): CollaboratorFixed => ({
    id: 'amanda-demo-id',
    user_id: user?.id || '',
    name: 'Amanda Silva',
    email: 'amanda.silva@empresa.com',
    role: 'Analista de RH',
    department: 'Recursos Humanos',
    status: 'active' as const,
    phone: '(11) 99999-8888',
    location: 'São Paulo, SP',
    join_date: '2024-01-15',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  }), [user?.id]);

  const fetchCollaborators = useCallback(async (useCache: boolean = true) => {
    if (!user?.id) {
      setCollaborators([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    // Tentar cache primeiro se permitido
    if (useCache) {
      const cached = get('data');
      if (cached && cached.length > 0) {
        console.log('Using cached collaborators:', cached.length);
        setCollaborators(cached);
        setIsLoading(false);
        
        // Se offline, não tentar buscar do servidor
        if (!isOnline) {
          return;
        }
      }
    }

    try {
      const { data, error: fetchError } = await supabase
        .from('collaborators')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      const typedData: CollaboratorFixed[] = (data || []).map(item => ({
        ...item,
        status: item.status as 'active' | 'inactive' | 'vacation'
      }));

      // Se não há dados, adicionar Amanda como exemplo
      if (typedData.length === 0) {
        const amanda = getAmandaCollaborator();
        typedData.push(amanda);
      }

      setCollaborators(typedData);
      set('data', typedData, true);
      console.log('Collaborators loaded successfully:', typedData.length);

    } catch (err: any) {
      console.error('Error fetching collaborators:', err);
      
      // Em caso de erro, usar cache se disponível
      const cached = get('data');
      if (cached && cached.length > 0) {
        setCollaborators(cached);
        setError('Usando dados salvos - conexão instável');
        toast({
          title: "Modo Offline",
          description: "Exibindo dados salvos. Reconectando automaticamente...",
          variant: "destructive"
        });
      } else {
        // Se não há cache, mostrar Amanda como fallback
        const amanda = getAmandaCollaborator();
        setCollaborators([amanda]);
        setError('Falha na conexão - dados de demonstração');
      }
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, get, set, isOnline, getAmandaCollaborator, toast]);

  const createCollaborator = useCallback(async (collaboratorData: {
    name: string;
    email: string;
    role: string;
    department: string;
    status?: 'active' | 'inactive' | 'vacation';
    phone?: string;
    location?: string;
  }) => {
    if (!user?.id) {
      toast({
        title: "Erro de Autenticação",
        description: "Você precisa estar logado para criar um colaborador.",
        variant: "destructive"
      });
      return null;
    }

    const tempId = crypto.randomUUID();
    const newCollaborator: CollaboratorFixed = {
      id: tempId,
      user_id: user.id,
      ...collaboratorData,
      status: collaboratorData.status || 'active',
      join_date: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Adicionar localmente imediatamente
    const updatedCollaborators = [newCollaborator, ...collaborators];
    setCollaborators(updatedCollaborators);
    set('data', updatedCollaborators, false);

    if (isOnline) {
      try {
        const { data: result, error } = await supabase
          .from('collaborators')
          .insert([{
            ...collaboratorData,
            user_id: user.id,
            status: collaboratorData.status || 'active'
          }])
          .select()
          .single();

        if (error) throw error;

        // Atualizar com dados reais do servidor
        const realCollaborator: CollaboratorFixed = {
          ...result,
          status: result.status as 'active' | 'inactive' | 'vacation'
        };

        const finalCollaborators = updatedCollaborators.map(c => 
          c.id === tempId ? realCollaborator : c
        );
        setCollaborators(finalCollaborators);
        set('data', finalCollaborators, true);

        toast({
          title: "Sucesso",
          description: "Colaborador criado com sucesso."
        });

        return realCollaborator;

      } catch (error: any) {
        console.error('Error creating collaborator:', error);
        // Adicionar à fila de sincronização
        addToSyncQueue({
          type: 'create',
          table: 'collaborators',
          data: { ...collaboratorData, user_id: user.id, temp_id: tempId }
        });

        toast({
          title: "Salvo Localmente",
          description: "Colaborador salvo. Será sincronizado quando possível.",
          variant: "destructive"
        });

        return newCollaborator;
      }
    } else {
      // Offline - adicionar à fila
      addToSyncQueue({
        type: 'create',
        table: 'collaborators',
        data: { ...collaboratorData, user_id: user.id, temp_id: tempId }
      });

      toast({
        title: "Salvo Offline",
        description: "Colaborador será enviado quando conectar.",
      });

      return newCollaborator;
    }
  }, [user?.id, collaborators, set, isOnline, addToSyncQueue, toast]);

  // Processar fila de sincronização quando online
  useEffect(() => {
    if (isOnline && syncQueueLength > 0) {
      processSyncQueue(async (operation) => {
        try {
          if (operation.type === 'create' && operation.table === 'collaborators') {
            const { error } = await supabase
              .from('collaborators')
              .insert([operation.data]);
            
            if (!error) {
              toast({
                title: "Sincronizado",
                description: "Dados enviados com sucesso ao servidor."
              });
              // Recarregar dados após sync
              fetchCollaborators(false);
              return true;
            }
          }
          return false;
        } catch (error) {
          console.error('Sync error:', error);
          return false;
        }
      });
    }
  }, [isOnline, syncQueueLength, processSyncQueue, fetchCollaborators, toast]);

  useEffect(() => {
    fetchCollaborators();
  }, [fetchCollaborators]);

  return {
    collaborators,
    isLoading,
    error,
    createCollaborator,
    refetch: () => fetchCollaborators(false),
    isOnline,
    pendingSync: syncQueueLength
  };
};
