
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface OnboardingProcess {
  id: string;
  collaborator_id: string;
  position: string;
  department: string;
  start_date: string;
  progress: number;
  status: 'not-started' | 'in-progress' | 'completed';
  current_step: string;
  collaborator?: {
    name: string;
    email: string;
    role?: string;
    department?: string;
  };
}

export interface OnboardingStep {
  id: string;
  onboarding_process_id: string;
  title: string;
  completed: boolean;
  step_order: number;
}

export interface Collaborator {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: string;
}

export const useOnboarding = () => {
  const [processes, setProcesses] = useState<OnboardingProcess[]>([]);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchCollaborators = async () => {
    if (!user?.id) {
      console.log('useOnboarding: Usuário não autenticado para buscar colaboradores');
      return;
    }

    try {
      console.log('useOnboarding: Buscando colaboradores para onboarding, usuário:', user.id);
      
      const { data, error } = await supabase
        .from('collaborators')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('name');

      if (error) {
        console.error('useOnboarding: Erro Supabase ao buscar colaboradores:', {
          error,
          message: error.message,
          details: error.details
        });
        throw error;
      }
      
      console.log('useOnboarding: Colaboradores para onboarding carregados:', data?.length || 0);
      setCollaborators(data || []);
    } catch (error: any) {
      console.error('useOnboarding: Erro ao carregar colaboradores:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os colaboradores.",
        variant: "destructive"
      });
    }
  };

  const fetchProcesses = async () => {
    if (!user?.id) {
      console.log('useOnboarding: Usuário não autenticado, limpando lista de processos');
      setProcesses([]);
      setIsLoading(false);
      return;
    }

    try {
      console.log('useOnboarding: Buscando processos de onboarding para usuário:', user.id);
      setIsLoading(true);
      
      // Verificar autenticação Supabase
      const { data: { user: supabaseUser }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !supabaseUser) {
        console.error('useOnboarding: Erro de autenticação Supabase:', authError);
        throw new Error('Usuário não autenticado no Supabase');
      }
      
      console.log('useOnboarding: Usuário autenticado no Supabase:', supabaseUser.id);
      
      const { data, error } = await supabase
        .from('onboarding_processes')
        .select(`
          *,
          collaborator:collaborators(name, email, role, department)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('useOnboarding: Erro Supabase ao buscar processos:', {
          error,
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }
      
      console.log('useOnboarding: Query de processos executada com sucesso');
      console.log('useOnboarding: Processos de onboarding carregados:', data?.length || 0);
      console.log('useOnboarding: Primeiros dados:', data?.slice(0, 2));
      
      const formattedData = (data || []).map((item: any) => ({
        ...item,
        status: item.status as 'not-started' | 'in-progress' | 'completed',
      }));
      
      setProcesses(formattedData);
      console.log('useOnboarding: Estado de processos atualizado com', formattedData.length, 'processos');
      
    } catch (error: any) {
      console.error('useOnboarding: Erro completo ao carregar processos:', {
        error,
        message: error?.message,
        stack: error?.stack,
        userId: user.id
      });
      
      toast({
        title: "Erro ao carregar processos",
        description: error?.message || "Não foi possível carregar os processos de onboarding.",
        variant: "destructive"
      });
      
      setProcesses([]);
    } finally {
      setIsLoading(false);
      console.log('useOnboarding: Processo de carregamento finalizado');
    }
  };

  useEffect(() => {
    console.log('useOnboarding: useEffect executado');
    console.log('useOnboarding: user?.id:', user?.id);
    console.log('useOnboarding: user object:', user);
    
    if (user?.id) {
      fetchCollaborators();
      fetchProcesses();
    }
  }, [user?.id]);

  const createProcess = async (processData: {
    collaborator_id: string;
    position: string;
    department: string;
    start_date: string;
  }) => {
    if (!user?.id) {
      console.warn('useOnboarding: Tentativa de criar processo sem autenticação');
      return;
    }

    try {
      console.log('useOnboarding: Criando processo para usuário:', user.id);
      console.log('useOnboarding: Dados do processo:', processData);
      
      const dataToInsert = {
        ...processData,
        user_id: user.id,
      };
      
      console.log('useOnboarding: Dados para inserção:', dataToInsert);
      
      const { data, error } = await supabase
        .from('onboarding_processes')
        .insert([dataToInsert])
        .select(`
          *,
          collaborator:collaborators(name, email, role, department)
        `)
        .single();

      if (error) {
        console.error('useOnboarding: Erro ao criar processo:', {
          error,
          message: error.message,
          details: error.details
        });
        throw error;
      }

      console.log('useOnboarding: Processo criado com sucesso:', data);

      // Criar etapas padrão
      try {
        console.log('useOnboarding: Tentando criar etapas padrão via função RPC');
        await supabase.rpc('create_default_onboarding_steps', {
          process_id: data.id
        });
        console.log('useOnboarding: Etapas padrão criadas via RPC');
      } catch (rpcError) {
        console.warn('useOnboarding: Função RPC não encontrada, criando etapas manualmente');
        
        const defaultSteps = [
          'Documentação Pessoal',
          'Apresentação da Empresa', 
          'Reunião com Gestor',
          'Treinamento de Segurança',
          'Setup do Ambiente',
          'Integração com a Equipe'
        ];

        const stepsData = defaultSteps.map((title, index) => ({
          onboarding_process_id: data.id,
          title,
          step_order: index + 1,
          completed: false
        }));

        const { error: stepsError } = await supabase
          .from('onboarding_steps')
          .insert(stepsData);
          
        if (stepsError) {
          console.error('useOnboarding: Erro ao criar etapas manuais:', stepsError);
          throw stepsError;
        }
        
        console.log('useOnboarding: Etapas padrão criadas manualmente');
      }

      const formattedData = {
        ...data,
        status: data.status as 'not-started' | 'in-progress' | 'completed',
      };

      setProcesses(prev => [formattedData, ...prev]);
      toast({
        title: "Sucesso",
        description: "Processo de onboarding criado com sucesso."
      });
      
      return formattedData;
    } catch (error: any) {
      console.error('useOnboarding: Erro completo ao criar processo:', {
        error,
        message: error?.message,
        stack: error?.stack
      });
      
      toast({
        title: "Erro",
        description: error?.message || "Não foi possível criar o processo de onboarding.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const getProcessSteps = async (processId: string): Promise<OnboardingStep[]> => {
    try {
      console.log('useOnboarding: Buscando etapas para processo:', processId);
      
      const { data, error } = await supabase
        .from('onboarding_steps')
        .select('*')
        .eq('onboarding_process_id', processId)
        .order('step_order');

      if (error) {
        console.error('useOnboarding: Erro ao buscar etapas:', error);
        throw error;
      }
      
      console.log('useOnboarding: Etapas carregadas:', data?.length || 0);
      return data || [];
    } catch (error: any) {
      console.error('useOnboarding: Erro ao carregar etapas:', error);
      return [];
    }
  };

  const updateStepStatus = async (stepId: string, completed: boolean, processId: string) => {
    try {
      console.log('useOnboarding: Atualizando etapa:', stepId, 'para completed:', completed);
      
      const { error } = await supabase
        .from('onboarding_steps')
        .update({ completed })
        .eq('id', stepId);

      if (error) {
        console.error('useOnboarding: Erro ao atualizar etapa:', error);
        throw error;
      }

      console.log('useOnboarding: Etapa atualizada com sucesso');

      // Recalcular progresso
      const steps = await getProcessSteps(processId);
      const completedSteps = steps.filter(s => s.completed).length;
      const progress = Math.round((completedSteps / steps.length) * 100);
      
      let status: 'not-started' | 'in-progress' | 'completed' = 'not-started';
      if (progress === 100) status = 'completed';
      else if (progress > 0) status = 'in-progress';

      const currentStep = progress === 100 ? 'Concluído' : 
        steps.find(s => !s.completed)?.title || 'Concluído';

      console.log('useOnboarding: Novo progresso calculado:', progress, '%, status:', status);

      // Atualizar processo
      const { error: updateError } = await supabase
        .from('onboarding_processes')
        .update({ progress, status, current_step: currentStep })
        .eq('id', processId);
        
      if (updateError) {
        console.error('useOnboarding: Erro ao atualizar progresso do processo:', updateError);
        throw updateError;
      }

      // Atualizar estado local
      setProcesses(prev => 
        prev.map(p => 
          p.id === processId 
            ? { ...p, progress, status, current_step: currentStep }
            : p
        )
      );

      toast({
        title: "Etapa atualizada",
        description: `Progresso: ${progress}%`
      });

    } catch (error: any) {
      console.error('useOnboarding: Erro completo ao atualizar etapa:', {
        error,
        message: error?.message,
        stack: error?.stack
      });
      
      toast({
        title: "Erro",
        description: error?.message || "Não foi possível atualizar a etapa.",
        variant: "destructive"
      });
    }
  };

  return {
    processes,
    collaborators,
    isLoading,
    createProcess,
    getProcessSteps,
    updateStepStatus,
    refetch: () => {
      console.log('useOnboarding: Executando refetch manual');
      fetchCollaborators();
      fetchProcesses();
    }
  };
};
