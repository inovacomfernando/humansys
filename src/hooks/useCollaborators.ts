
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
      return;
    }

    setIsLoading(true);

    const result = await executeQuery(
      () => supabase
        .from('collaborators')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }),
      { maxRetries: 3, requireAuth: true }
    );

    if (result) {
      const formattedData = result.map((item: any) => ({
        ...item,
        status: item.status as 'active' | 'inactive' | 'vacation',
      }));
      
      setCollaborators(formattedData);
      console.log('useCollaborators: Colaboradores carregados com sucesso:', formattedData.length);
    } else {
      setCollaborators([]);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    console.log('useCollaborators: useEffect executado, user?.id:', user?.id);
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
      toast({
        title: "Erro de Autenticação",
        description: "Você precisa estar logado para criar um colaborador.",
        variant: "destructive"
      });
      return;
    }

    const dataToInsert = {
      ...collaboratorData,
      user_id: user.id,
      status: collaboratorData.status || 'active' as const,
    };

    const result = await executeQuery(
      () => supabase
        .from('collaborators')
        .insert([dataToInsert])
        .select()
        .single(),
      { maxRetries: 2, requireAuth: true }
    );

    if (result) {
      const formattedData = {
        ...result,
        status: result.status as 'active' | 'inactive' | 'vacation',
      };

      setCollaborators(prev => [formattedData, ...prev]);
      toast({
        title: "Sucesso",
        description: "Colaborador criado com sucesso."
      });
      
      return formattedData;
    }
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
      { maxRetries: 2, requireAuth: true }
    );

    if (result) {
      const formattedData = {
        ...result,
        status: result.status as 'active' | 'inactive' | 'vacation',
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
      { maxRetries: 2, requireAuth: true }
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
    createCollaborator,
    updateCollaborator,
    deleteCollaborator,
    refetch: fetchCollaborators
  };
};
