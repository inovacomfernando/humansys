` tags. I'll make sure to maintain the original indentation and structure, and avoid any forbidden words or placeholders.

```
<replit_final_file>
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
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
  join_date?: string;
  created_at: string;
  updated_at: string;
}

export const useCollaborators = () => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchCollaborators = async () => {
    if (!user?.id || !supabase) {
      setCollaborators([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('🔄 Carregando colaboradores para usuário:', user.id);

      const { data, error: fetchError } = await supabase
        .from('collaborators')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      const formattedData: Collaborator[] = (data || []).map((item: any) => ({
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
        updated_at: item.updated_at || item.created_at,
      }));

      console.log('✅ Colaboradores carregados:', formattedData.length);
      setCollaborators(formattedData);
      setError(null);

    } catch (error: any) {
      console.error('❌ Erro ao carregar colaboradores:', error);
      setError(`Erro ao carregar colaboradores: ${error.message}`);
      setCollaborators([]);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (user?.id) {
      fetchCollaborators();
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
  }) => {
    if (!user?.id || !supabase) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado ou serviço indisponível",
        variant: "destructive"
      });
      return null;
    }

    try {
      const newCollaborator = {
        user_id: user.id,
        name: collaboratorData.name.trim(),
        email: collaboratorData.email.trim(),
        role: collaboratorData.role.trim(),
        department: collaboratorData.department.trim(),
        status: collaboratorData.status || 'active',
        phone: collaboratorData.phone?.trim() || '',
        location: collaboratorData.location?.trim() || '',
        join_date: new Date().toISOString(),
      };

      console.log('🆕 Criando colaborador:', newCollaborator);

      const { data, error } = await supabase
        .from('collaborators')
        .insert([newCollaborator])
        .select()
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        // Atualizar a lista local
        setCollaborators(prev => [data, ...prev]);

        toast({
          title: "✅ Sucesso",
          description: "Colaborador criado com sucesso!"
        });

        return data;
      }
    } catch (error: any) {
      console.error('❌ Erro ao criar colaborador:', error);
      toast({
        title: "Erro",
        description: `Falha ao criar colaborador: ${error.message}`,
        variant: "destructive"
      });
      return null;
    }
  };

  const updateCollaborator = async (id: string, updates: Partial<Collaborator>) => {
    if (!user?.id || !supabase) return false;

    try {
      const { error } = await supabase
        .from('collaborators')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setCollaborators(prev => 
        prev.map(c => c.id === id ? { ...c, ...updates, updated_at: new Date().toISOString() } : c)
      );

      toast({
        title: "Sucesso",
        description: "Colaborador atualizado com sucesso."
      });

      return true;
    } catch (error: any) {
      console.error('Erro ao atualizar colaborador:', error);
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }
  };

  const deleteCollaborator = async (id: string) => {
    if (!user?.id || !supabase) return false;

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

      return true;
    } catch (error: any) {
      console.error('Erro ao remover colaborador:', error);
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
      return false;
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