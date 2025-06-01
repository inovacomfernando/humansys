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
    console.log('🔄 useCollaborators: Iniciando fetchCollaborators');
    console.log('👤 useCollaborators: User ID:', user?.id);

    if (!user?.id) {
      console.log('❌ useCollaborators: Usuário não autenticado');
      setCollaborators([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Primeiro, tentar carregar do Supabase
      console.log('📡 Tentando carregar do Supabase...');
      const { data: supabaseData, error: queryError } = await supabase
        .from('collaborators')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!queryError && supabaseData && Array.isArray(supabaseData)) {
        console.log(`✅ Dados do Supabase: ${supabaseData.length} colaboradores`);

        const formattedData: Collaborator[] = supabaseData.map((item: any) => ({
          id: item.id,
          user_id: item.user_id,
          name: item.name || '',
          email: item.email || '',
          role: item.role || '',
          department: item.department || '',
          status: (item.status as 'active' | 'inactive' | 'vacation') || 'active',
          phone: item.phone || '',
          location: item.location || '',
          join_date: item.join_date || item.created_at || new Date().toISOString(),
          created_at: item.created_at || new Date().toISOString(),
          updated_at: item.updated_at || new Date().toISOString(),
        }));

        setCollaborators(formattedData);
        
        // Salvar no storage local como backup
        try {
          await replitStorage.saveCollaborators(user.id, formattedData);
          localStorage.setItem('collaborators_fallback', JSON.stringify(formattedData));
        } catch (storageError) {
          console.log('⚠️ Erro ao salvar backup:', storageError);
        }

        console.log('✅ Colaboradores carregados do Supabase e salvos localmente');
        setError(null);
        
      } else {
        // Se Supabase falhar, tentar storage local
        console.log('⚠️ Supabase indisponível, tentando storage local...');
        const storageData = await replitStorage.loadCollaborators(user.id);
        
        if (storageData.length > 0) {
          console.log(`📂 Dados do storage local: ${storageData.length} colaboradores`);
          setCollaborators(storageData);
          setError(null);
        } else {
          // Tentar localStorage como último recurso
          try {
            const fallbackData = JSON.parse(localStorage.getItem('collaborators_fallback') || '[]');
            if (fallbackData.length > 0) {
              console.log(`🔄 Dados do localStorage: ${fallbackData.length} colaboradores`);
              setCollaborators(fallbackData);
              setError(null);
            } else {
              console.log('📭 Nenhum colaborador encontrado em nenhuma fonte');
              setCollaborators([]);
              setError(null);
            }
          } catch {
            setCollaborators([]);
            setError(null);
          }
        }
      }

    } catch (error: any) {
      console.error('❌ useCollaborators: Erro crítico:', error);
      
      // Tentar fontes de backup
      try {
        const storageData = await replitStorage.loadCollaborators(user.id);
        if (storageData.length > 0) {
          setCollaborators(storageData);
          setError(null);
          console.log('🔄 Fallback para storage local funcionou');
        } else {
          const fallbackData = JSON.parse(localStorage.getItem('collaborators_fallback') || '[]');
          setCollaborators(fallbackData);
          if (fallbackData.length === 0) {
            setError('Nenhum dado encontrado. Tente adicionar um colaborador.');
          }
        }
      } catch {
        setCollaborators([]);
        setError('Erro ao carregar dados. Tente novamente.');
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
      // Criar novo colaborador com ID único
      const newCollaborator: Collaborator = {
        id: `collab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        user_id: user.id,
        name: collaboratorData.name.trim(),
        email: collaboratorData.email.trim(),
        role: collaboratorData.role.trim(),
        department: collaboratorData.department.trim(),
        status: collaboratorData.status || 'active',
        phone: collaboratorData.phone?.trim() || '',
        location: collaboratorData.location?.trim() || '',
        join_date: collaboratorData.join_date || new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      console.log('🆕 Criando colaborador:', newCollaborator);

      // 1. Atualizar UI imediatamente para melhor UX
      setCollaborators(prev => [newCollaborator, ...prev]);
      
      // 2. Tentar salvar no Supabase primeiro
      try {
        const { data, error } = await supabase
          .from('collaborators')
          .insert([newCollaborator])
          .select()
          .single();

        if (!error && data) {
          console.log('✅ Colaborador salvo no Supabase');
          
          // Salvar no storage local como backup
          await replitStorage.addCollaborator(user.id, data);
          localStorage.setItem('collaborators_fallback', JSON.stringify([data, ...collaborators]));
          
          toast({
            title: "✅ Sucesso",
            description: "Colaborador criado com sucesso!"
          });
          
          setIsLoading(false);
          return data;
        } else {
          throw new Error(error?.message || 'Erro ao salvar no Supabase');
        }
      } catch (supabaseError: any) {
        console.log('⚠️ Erro no Supabase, salvando apenas localmente:', supabaseError);
        
        // Salvar no storage local como fallback
        const saveSuccess = await replitStorage.addCollaborator(user.id, newCollaborator);
        
        if (saveSuccess) {
          localStorage.setItem('collaborators_fallback', JSON.stringify([newCollaborator, ...collaborators]));
          
          toast({
            title: "✅ Sucesso",
            description: "Colaborador criado (salvo localmente)"
          });
          
          setIsLoading(false);
          return newCollaborator;
        } else {
          throw new Error('Falha ao salvar localmente');
        }
      }

    } catch (error: any) {
      console.error('❌ Erro ao criar colaborador:', error);
      
      // Reverter mudança na UI se falhou completamente
      setCollaborators(prev => prev.filter(c => c.id !== newCollaborator.id));
      
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