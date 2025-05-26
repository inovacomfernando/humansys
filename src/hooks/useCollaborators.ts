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
    if (!user) {
      console.log('Usuário não autenticado, limpando lista de colaboradores');
      setCollaborators([]);
      setIsLoading(false);
      return;
    }

    try {
      console.log('Buscando colaboradores para usuário:', user.id);
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('collaborators')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro Supabase ao buscar colaboradores:', error);
        throw error;
      }
      
      console.log('Colaboradores carregados:', data?.length || 0);
      
      // Garantir que os dados estão no formato correto
      const formattedData = (data || []).map((item: any) => ({
        ...item,
        status: item.status as 'active' | 'inactive' | 'vacation',
      }));
      
      setCollaborators(formattedData);
    } catch (error) {
      console.error('Erro ao carregar colaboradores:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os colaboradores.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('useCollaborators: useEffect executado, user.id:', user?.id);
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
    if (!user) {
      console.warn('Tentativa de criar colaborador sem autenticação');
      toast({
        title: "Erro de Autenticação",
        description: "Você precisa estar logado para criar um colaborador.",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('Criando colaborador para usuário:', user.id);
      
      const { data, error } = await supabase
        .from('collaborators')
        .insert([{
          ...collaboratorData,
          user_id: user.id,
          status: collaboratorData.status || 'active' as const,
        }])
        .select()
        .single();

      if (error) {
        console.error('Erro Supabase ao criar colaborador:', error);
        throw error;
      }

      const formattedData = {
        ...data,
        status: data.status as 'active' | 'inactive' | 'vacation',
      };

      setCollaborators(prev => [formattedData, ...prev]);
      toast({
        title: "Sucesso",
        description: "Colaborador criado com sucesso."
      });
      
      console.log('Colaborador criado com sucesso:', formattedData.id);
      return formattedData;
    } catch (error) {
      console.error('Erro ao criar colaborador:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o colaborador.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateCollaborator = async (id: string, updates: Partial<Collaborator>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('collaborators')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

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
    } catch (error) {
      console.error('Erro ao atualizar colaborador:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o colaborador.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteCollaborator = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('collaborators')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setCollaborators(prev => prev.filter(c => c.id !== id));
      toast({
        title: "Sucesso",
        description: "Colaborador removido com sucesso."
      });
    } catch (error) {
      console.error('Erro ao remover colaborador:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o colaborador.",
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
