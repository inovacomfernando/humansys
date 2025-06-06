
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
    console.log('useCollaborators: User Email:', user?.email);

    if (!user?.id) {
      console.log('useCollaborators: Usuário não autenticado, limpando lista');
      setCollaborators([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    // Implementar retry com backoff
    const maxRetries = 3;
    let lastError = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`useCollaborators: Tentativa ${attempt}/${maxRetries}`);

        // Verificar sessão antes da query
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('useCollaborators: Erro de sessão:', sessionError);
          throw new Error('Erro de autenticação');
        }

        if (!session) {
          console.error('useCollaborators: Sessão não encontrada');
          throw new Error('Sessão expirada');
        }

        // Query com timeout
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout na consulta')), 8000)
        );

        const queryPromise = supabase
          .from('collaborators')
          .select(`
            id,
            user_id,
            name,
            email,
            role,
            department,
            status,
            phone,
            location,
            join_date,
            created_at,
            updated_at
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        const { data: result, error: queryError } = await Promise.race([
          queryPromise,
          timeoutPromise
        ]) as any;

        console.log('Query result:', { 
          result, 
          queryError, 
          userIdUsed: user.id,
          userEmail: user.email,
          resultCount: result?.length || 0,
          attempt
        });

        if (queryError) {
          lastError = queryError;
          console.error(`Erro na query (tentativa ${attempt}):`, queryError);
          
          // Se é erro de RLS ou autorização, não tentar novamente
          if (queryError.code === 'PGRST301' || 
              queryError.message?.includes('permission') ||
              queryError.message?.includes('RLS')) {
            throw queryError;
          }
          
          // Para outros erros, tentar novamente
          if (attempt < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, attempt * 1000));
            continue;
          }
          
          throw queryError;
        }

        // Sucesso - formatar dados
        const formattedData: Collaborator[] = (result || []).map((item: any) => ({
          id: item.id,
          user_id: item.user_id,
          name: item.name || '',
          email: item.email || '',
          role: item.role || '',
          department: item.department || '',
          status: (item.status as 'active' | 'inactive' | 'vacation') || 'active',
          phone: item.phone || '',
          location: item.location || '',
          join_date: item.join_date || item.created_at,
          created_at: item.created_at,
          updated_at: item.updated_at
        }));
        
        console.log('useCollaborators: Colaboradores formatados:', formattedData);
        setCollaborators(formattedData);
        setError(null);
        setIsLoading(false);
        
        if (formattedData.length > 0) {
          toast({
            title: "Colaboradores carregados",
            description: `${formattedData.length} colaborador(es) encontrado(s)`
          });
        }
        
        return; // Sucesso, sair do loop
        
      } catch (error: any) {
        lastError = error;
        console.error(`useCollaborators: Erro na tentativa ${attempt}:`, error);
        
        if (attempt === maxRetries) {
          // Última tentativa falhou
          setError(`Erro ao carregar colaboradores: ${error.message}`);
          setCollaborators([]);
          
          toast({
            title: "Erro ao carregar colaboradores",
            description: "Tente atualizar a página ou verificar sua conexão",
            variant: "destructive"
          });
        } else {
          // Aguardar antes da próxima tentativa
          await new Promise(resolve => setTimeout(resolve, attempt * 1000));
        }
      }
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
