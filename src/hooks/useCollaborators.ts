import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery';
import { supabase } from '@/integrations/supabase/client';
import { replitStorage, StoredCollaborator } from '@/services/replitStorageService';

export interface Collaborator extends StoredCollaborator {}

export const useCollaborators = () => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const { executeQuery } = useSupabaseQuery();

  const fetchCollaborators = async () => {
    console.log('🔄 useCollaborators: Iniciando fetchCollaborators com Replit Storage');
    console.log('👤 useCollaborators: User ID:', user?.id);

    if (!user?.id) {
      console.log('❌ useCollaborators: Usuário não autenticado, limpando lista');
      setCollaborators([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 1. Carregar dados do Replit Object Storage (fonte primária)
      console.log('📂 Carregando dados do Replit Object Storage...');
      const storageData = await replitStorage.loadCollaborators(user.id);

      if (storageData.length > 0) {
        console.log(`✅ Dados carregados do storage: ${storageData.length} colaboradores`);
        setCollaborators(storageData);
        setError(null);

        toast({
          title: "Dados carregados",
          description: `${storageData.length} colaborador(es) carregado(s) do storage local`
        });
      }

      // 2. Tentar sincronizar com Supabase em background (opcional)
      try {
        console.log('🔄 Tentando sincronizar com Supabase...');
        const { data: supabaseData, error: queryError } = await supabase
          .from('collaborators')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (!queryError && supabaseData && Array.isArray(supabaseData)) {
          console.log(`📡 Dados do Supabase: ${supabaseData.length} colaboradores`);

          const formattedSupabaseData: Collaborator[] = supabaseData.map((item: any) => ({
            ...item,
            status: (item.status as 'active' | 'inactive' | 'vacation') || 'active',
            join_date: item.join_date || item.created_at,
          }));

          // Sincronizar dados
          await replitStorage.syncWithSupabase(user.id, formattedSupabaseData);

          // Atualizar estado se há novos dados
          if (formattedSupabaseData.length > storageData.length) {
            setCollaborators(formattedSupabaseData);
            console.log('🔄 Estado atualizado com dados do Supabase');
          }
        } else {
          console.log('⚠️ Supabase não disponível, usando apenas dados locais');
        }
      } catch (syncError) {
        console.log('⚠️ Erro na sincronização com Supabase (continuando com dados locais):', syncError);
      }

      // Se não há dados em lugar nenhum
      if (storageData.length === 0) {
        console.log('📭 Nenhum colaborador encontrado');
        setCollaborators([]);
      }

    } catch (error: any) {
      console.error('❌ useCollaborators: Erro crítico:', error);
      setError(`Erro ao carregar dados: ${error.message}`);

      // Em caso de erro crítico, tentar carregar dados em cache local
      try {
        const fallbackData = JSON.parse(localStorage.getItem('collaborators_fallback') || '[]');
        if (fallbackData.length > 0) {
          setCollaborators(fallbackData);
          console.log('🔄 Dados de fallback carregados do localStorage');
        }
      } catch {
        setCollaborators([]);
      }
    }

    setIsLoading(false);
  };

  useEffect(() => {
    console.log('🎯 useCollaborators: useEffect executado, user?.id:', user?.id);
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
      return null;
    }

    setIsLoading(true);

    try {
      // Criar novo colaborador
      const newCollaborator: Collaborator = {
        id: `collab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        user_id: user.id,
        name: collaboratorData.name,
        email: collaboratorData.email,
        role: collaboratorData.role,
        department: collaboratorData.department,
        status: collaboratorData.status || 'active',
        phone: collaboratorData.phone || '',
        location: collaboratorData.location || '',
        join_date: collaboratorData.join_date || new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      console.log('🆕 Criando colaborador:', newCollaborator);

      // 1. Salvar no Replit Storage (fonte primária)
      const saveSuccess = await replitStorage.addCollaborator(user.id, newCollaborator);

      if (saveSuccess) {
        // Atualizar estado local imediatamente
        setCollaborators(prev => [newCollaborator, ...prev]);

        // Backup no localStorage
        localStorage.setItem('collaborators_fallback', JSON.stringify([newCollaborator, ...collaborators]));

        toast({
          title: "✅ Sucesso",
          description: "Colaborador criado e salvo no storage local!"
        });

        // 2. Tentar salvar no Supabase em background (opcional)
        try {
          const { error } = await supabase
            .from('collaborators')
            .insert([newCollaborator]);

          if (!error) {
            console.log('✅ Colaborador também salvo no Supabase');
          } else {
            console.log('⚠️ Erro ao salvar no Supabase (dados mantidos localmente):', error);
          }
        } catch (supabaseError) {
          console.log('⚠️ Supabase indisponível (dados mantidos localmente)');
        }

        setIsLoading(false);
        return newCollaborator;
      } else {
        throw new Error('Falha ao salvar no storage local');
      }
    } catch (error: any) {
      console.error('❌ Erro ao criar colaborador:', error);
      toast({
        title: "Erro",
        description: `Falha ao criar colaborador: ${error.message}`,
        variant: "destructive"
      });
      setIsLoading(false);
      return null;
    }
  };

  const updateCollaborator = async (id: string, updates: Partial<Collaborator>) => {
    if (!user?.id) return;

    try {
      const success = await replitStorage.updateCollaborator(user.id, id, updates);

      if (success) {
        setCollaborators(prev => 
          prev.map(c => c.id === id ? { ...c, ...updates, updated_at: new Date().toISOString() } : c)
        );

        toast({
          title: "Sucesso",
          description: "Colaborador atualizado com sucesso."
        });

        // Tentar atualizar no Supabase em background
        try {
          await supabase
            .from('collaborators')
            .update(updates)
            .eq('id', id)
            .eq('user_id', user.id);
        } catch {
          console.log('⚠️ Atualização do Supabase falhou (dados mantidos localmente)');
        }

        return true;
      }
    } catch (error) {
      console.error('Erro ao atualizar colaborador:', error);
    }
  };

  const deleteCollaborator = async (id: string) => {
    if (!user?.id) return;

    try {
      const success = await replitStorage.deleteCollaborator(user.id, id);

      if (success) {
        setCollaborators(prev => prev.filter(c => c.id !== id));

        toast({
          title: "Sucesso",
          description: "Colaborador removido com sucesso."
        });

        // Tentar remover do Supabase em background
        try {
          await supabase
            .from('collaborators')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);
        } catch {
          console.log('⚠️ Remoção do Supabase falhou (dados mantidos localmente)');
        }

        return true;
      }
    } catch (error) {
      console.error('Erro ao remover colaborador:', error);
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