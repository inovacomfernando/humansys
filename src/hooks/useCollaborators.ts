import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery';
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
}

export const useCollaborators = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { executeQuery } = useSupabaseQuery();

  const fetchCollaborators = useCallback(async () => {
    // Para PostgreSQL local, sempre usar o ID fixo do usuário de teste
    const userId = '5b43d42f-f5e1-46bf-9a95-e6de48163a81';

    try {
      console.log('🔍 Buscando colaboradores para user_id:', userId);

      const { data, error } = await supabase
        .from('collaborators')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Erro ao buscar colaboradores:', error);
        toast({
          title: "Erro ao carregar colaboradores",
          description: error.message,
          variant: "destructive"
        });
        return [];
      }

      console.log('✅ Colaboradores encontrados:', data?.length || 0);
      console.log('📋 Dados dos colaboradores:', data);
      return data || [];
    } catch (error) {
      console.error('❌ Erro inesperado ao buscar colaboradores:', error);
      toast({
        title: "Erro inesperado",
        description: "Não foi possível carregar os colaboradores",
        variant: "destructive"
      });
      return [];
    }
  }, [toast]);

  useEffect(() => {
    console.log('useCollaborators: useEffect executado, user?.id:', user?.id);
    const getCollaborators = async () => {
      setIsLoading(true);
      setError(null);

      const fetchedCollaborators = await fetchCollaborators();
      setCollaborators(fetchedCollaborators);
      setIsLoading(false);

      if (!fetchedCollaborators) {
        setError("Failed to fetch collaborators.");
      }
    };

    getCollaborators();

    // Configurar subscription de tempo real
    if (user?.id) {
      const channel = supabase
        .channel('collaborators-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'collaborators',
            filter: `user_id=eq.5b43d42f-f5e1-46bf-9a95-e6de48163a81`
          },
          (payload) => {
            console.log('Realtime update received:', payload);

            switch (payload.eventType) {
              case 'INSERT':
                const newCollaborator: Collaborator = {
                  ...payload.new as any,
                  status: payload.new.status as 'active' | 'inactive' | 'vacation',
                };
                setCollaborators(prev => {
                  // Verificar se já existe para evitar duplicatas
                  const exists = prev.find(c => c.id === newCollaborator.id);
                  if (!exists) {
                    return [newCollaborator, ...prev];
                  }
                  return prev;
                });
                break;

              case 'UPDATE':
                const updatedCollaborator: Collaborator = {
                  ...payload.new as any,
                  status: payload.new.status as 'active' | 'inactive' | 'vacation',
                };
                setCollaborators(prev =>
                  prev.map(c => c.id === updatedCollaborator.id ? updatedCollaborator : c)
                );
                break;

              case 'DELETE':
                setCollaborators(prev =>
                  prev.filter(c => c.id !== payload.old.id)
                );
                break;
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user?.id, fetchCollaborators]);

  const createCollaborator = async (collaboratorData: {
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

    setIsLoading(true);

    try {
      const dataToInsert = {
        ...collaboratorData,
        user_id: '5b43d42f-f5e1-46bf-9a95-e6de48163a81', // Usar ID fixo
        status: collaboratorData.status || 'active' as const,
        join_date: collaboratorData.join_date || new Date().toISOString(),
      };

      console.log('Criando colaborador com dados:', dataToInsert);

      const { data: result, error } = await supabase
        .from('collaborators')
        .insert([dataToInsert])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar colaborador:', error);
        toast({
          title: "Erro",
          description: `Falha ao criar colaborador: ${error.message}`,
          variant: "destructive"
        });
        setIsLoading(false);
        return null;
      }

      if (result) {
        const formattedData: Collaborator = {
          ...result,
          status: result.status as 'active' | 'inactive' | 'vacation',
        };

        console.log('Colaborador criado com sucesso:', formattedData);

        // Atualizar estado local imediatamente
        setCollaborators(prev => [formattedData, ...prev]);

        // Recarregar dados do servidor para garantir sincronização
        setTimeout(() => {
          fetchCollaborators();
        }, 500);

        toast({
          title: "Sucesso",
          description: "Colaborador criado e sincronizado com sucesso."
        });

        setIsLoading(false);
        return formattedData;
      }
    } catch (error: any) {
      console.error('Erro inesperado ao criar colaborador:', error);
      toast({
        title: "Erro",
        description: `Erro inesperado: ${error.message}`,
        variant: "destructive"
      });
      setIsLoading(false);
      return null;
    }

    setIsLoading(false);
    return null;
  };

  const updateCollaborator = async (id: string, updates: Partial<Collaborator>) => {
    if (!user?.id) return;

    const result = await executeQuery(
      () => supabase
        .from('collaborators')
        .update(updates)
        .eq('id', id)
        .eq('user_id', '5b43d42f-f5e1-46bf-9a95-e6de48163a81') // Usar ID fixo
        .select()
        .single(),
      { maxRetries: 2, requireAuth: true, timeout: 5000 }
    );

    if (result) {
      const typedResult = result as any;
      const formattedData: Collaborator = {
        ...typedResult,
        status: typedResult.status as 'active' | 'inactive' | 'vacation',
      };

      setCollaborators(prev =>
        prev.map(c => c.id === id ? { ...c, ...formattedData } : c)
      );

      toast({
        title: "Sucesso",
        description: "Colaborador atualizado com sucesso."
      });

      return formattedData;
    }
  };

  const deleteCollaborator = async (id: string) => {
    if (!user?.id) return;

    const result = await executeQuery(
      () => supabase
        .from('collaborators')
        .delete()
        .eq('id', id)
        .eq('user_id', '5b43d42f-f5e1-46bf-9a95-e6de48163a81'), // Usar ID fixo
      { maxRetries: 2, requireAuth: true, timeout: 5000 }
    );

    if (result !== null) {
      setCollaborators(prev => prev.filter(c => c.id !== id));
      toast({
        title: "Sucesso",
        description: "Colaborador removido com sucesso."
      });
    }
  };

  return {
    collaborators,
    isLoading,
    error,
    createCollaborator,
    updateCollaborator,
    deleteCollaborator,
    refetch: fetchCollaborators
  };
};