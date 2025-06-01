
import { useState, useEffect } from 'react';
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
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const { executeQuery } = useSupabaseQuery();

  const fetchCollaborators = async () => {
    console.log('useCollaborators: Iniciando fetchCollaborators');
    console.log('useCollaborators: User ID:', user?.id);

    if (!user?.id) {
      console.log('useCollaborators: Usuário não autenticado, limpando lista');
      setCollaborators([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Primeiro, vamos verificar se a tabela existe e tem dados
      const { data: tableCheck, error: tableError } = await supabase
        .from('collaborators')
        .select('count', { count: 'exact', head: true });

      console.log('Table check result:', { tableCheck, tableError });

      // Agora buscar os dados
      const { data: result, error: queryError } = await supabase
        .from('collaborators')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      console.log('Query result:', { result, queryError, userIdUsed: user.id });

      if (queryError) {
        console.error('Erro na query:', queryError);
        setError(`Erro ao buscar colaboradores: ${queryError.message}`);
        setCollaborators([]);
      } else if (result && Array.isArray(result)) {
        const formattedData: Collaborator[] = result.map((item: any) => ({
          ...item,
          status: (item.status as 'active' | 'inactive' | 'vacation') || 'active',
          join_date: item.join_date || item.created_at,
        }));
        
        console.log('useCollaborators: Colaboradores formatados:', formattedData);
        setCollaborators(formattedData);
        setError(null);
        
        toast({
          title: "Colaboradores carregados",
          description: `${formattedData.length} colaborador(es) encontrado(s)`
        });
      } else {
        console.log('useCollaborators: Nenhum resultado ou resultado inválido');
        setCollaborators([]);
        setError(null);
      }
    } catch (error: any) {
      console.error('useCollaborators: Erro inesperado:', error);
      setError(`Erro inesperado: ${error.message}`);
      setCollaborators([]);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    console.log('useCollaborators: useEffect executado, user?.id:', user?.id);
    fetchCollaborators();

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
            filter: `user_id=eq.${user.id}`
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
  }, [user?.id]);

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
        user_id: user.id,
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
        .eq('user_id', user.id)
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
        .eq('user_id', user.id),
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
