
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

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
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchCollaborators = async () => {
    if (!user?.id) {
      console.log('useCollaborators: Usuário não autenticado ou sem ID, limpando lista');
      setCollaborators([]);
      setIsLoading(false);
      return;
    }

    try {
      console.log('useCollaborators: Iniciando busca para usuário:', user.id);
      setIsLoading(true);
      
      // Verificar se o usuário está autenticado no Supabase
      const { data: { user: supabaseUser }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error('useCollaborators: Erro de autenticação Supabase:', authError);
        throw authError;
      }
      
      if (!supabaseUser) {
        console.error('useCollaborators: Usuário não encontrado no Supabase');
        throw new Error('Usuário não autenticado no Supabase');
      }
      
      console.log('useCollaborators: Usuário autenticado no Supabase:', supabaseUser.id);
      
      // Fazer a query com logs detalhados
      console.log('useCollaborators: Executando query para user_id:', user.id);
      
      const { data, error } = await supabase
        .from('collaborators')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('useCollaborators: Erro Supabase na query:', {
          error,
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }
      
      console.log('useCollaborators: Query executada com sucesso');
      console.log('useCollaborators: Dados retornados:', data?.length || 0, 'colaboradores');
      console.log('useCollaborators: Primeiros dados:', data?.slice(0, 2));
      
      // Garantir que os dados estão no formato correto
      const formattedData = (data || []).map((item: any) => ({
        ...item,
        status: item.status as 'active' | 'inactive' | 'vacation',
      }));
      
      setCollaborators(formattedData);
      console.log('useCollaborators: Estado atualizado com', formattedData.length, 'colaboradores');
      
    } catch (error: any) {
      console.error('useCollaborators: Erro completo ao carregar colaboradores:', {
        error,
        message: error?.message,
        stack: error?.stack,
        userId: user.id
      });
      
      toast({
        title: "Erro ao carregar colaboradores",
        description: error?.message || "Não foi possível carregar os colaboradores.",
        variant: "destructive"
      });
      
      // Em caso de erro, definir lista vazia
      setCollaborators([]);
    } finally {
      setIsLoading(false);
      console.log('useCollaborators: Processo de carregamento finalizado');
    }
  };

  useEffect(() => {
    console.log('useCollaborators: useEffect executado');
    console.log('useCollaborators: user?.id:', user?.id);
    console.log('useCollaborators: user object:', user);
    
    fetchCollaborators();
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
      console.warn('useCollaborators: Tentativa de criar colaborador sem autenticação');
      toast({
        title: "Erro de Autenticação",
        description: "Você precisa estar logado para criar um colaborador.",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('useCollaborators: Criando colaborador para usuário:', user.id);
      console.log('useCollaborators: Dados do colaborador:', collaboratorData);
      
      const dataToInsert = {
        ...collaboratorData,
        user_id: user.id,
        status: collaboratorData.status || 'active' as const,
      };
      
      console.log('useCollaborators: Dados para inserção:', dataToInsert);
      
      const { data, error } = await supabase
        .from('collaborators')
        .insert([dataToInsert])
        .select()
        .single();

      if (error) {
        console.error('useCollaborators: Erro Supabase ao criar colaborador:', {
          error,
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }

      console.log('useCollaborators: Colaborador criado com sucesso:', data);

      const formattedData = {
        ...data,
        status: data.status as 'active' | 'inactive' | 'vacation',
      };

      setCollaborators(prev => [formattedData, ...prev]);
      toast({
        title: "Sucesso",
        description: "Colaborador criado com sucesso."
      });
      
      return formattedData;
    } catch (error: any) {
      console.error('useCollaborators: Erro ao criar colaborador:', {
        error,
        message: error?.message,
        stack: error?.stack
      });
      
      toast({
        title: "Erro",
        description: error?.message || "Não foi possível criar o colaborador.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateCollaborator = async (id: string, updates: Partial<Collaborator>) => {
    if (!user?.id) {
      console.warn('useCollaborators: Tentativa de atualizar colaborador sem autenticação');
      return;
    }

    try {
      console.log('useCollaborators: Atualizando colaborador:', id, 'para usuário:', user.id);
      
      const { data, error } = await supabase
        .from('collaborators')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('useCollaborators: Erro ao atualizar colaborador:', error);
        throw error;
      }

      console.log('useCollaborators: Colaborador atualizado com sucesso:', data);

      const formattedData = {
        ...data,
        status: data.status as 'active' | 'inactive' | 'vacation',
      };

      setCollaborators(prev => 
        prev.map(c => c.id === id ? { ...c, ...formattedData } : c)
      );

      toast({
        title: "Sucesso",
        description: "Colaborador atualizado com sucesso."
      });

      return formattedData;
    } catch (error: any) {
      console.error('useCollaborators: Erro ao atualizar colaborador:', error);
      toast({
        title: "Erro",
        description: error?.message || "Não foi possível atualizar o colaborador.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteCollaborator = async (id: string) => {
    if (!user?.id) {
      console.warn('useCollaborators: Tentativa de deletar colaborador sem autenticação');
      return;
    }

    try {
      console.log('useCollaborators: Deletando colaborador:', id, 'para usuário:', user.id);
      
      const { error } = await supabase
        .from('collaborators')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('useCollaborators: Erro ao deletar colaborador:', error);
        throw error;
      }

      console.log('useCollaborators: Colaborador deletado com sucesso');

      setCollaborators(prev => prev.filter(c => c.id !== id));
      toast({
        title: "Sucesso",
        description: "Colaborador removido com sucesso."
      });
    } catch (error: any) {
      console.error('useCollaborators: Erro ao remover colaborador:', error);
      toast({
        title: "Erro",
        description: error?.message || "Não foi possível remover o colaborador.",
        variant: "destructive"
      });
      throw error;
    }
  };

  return {
    collaborators,
    isLoading,
    createCollaborator,
    updateCollaborator,
    deleteCollaborator,
    refetch: fetchCollaborators
  };
};
