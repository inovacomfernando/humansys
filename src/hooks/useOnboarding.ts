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
    if (!user) return;

    try {
      console.log('Buscando colaboradores para onboarding, usuário:', user.id);
      
      const { data, error } = await supabase
        .from('collaborators')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('name');

      if (error) {
        console.error('Erro Supabase ao buscar colaboradores:', error);
        throw error;
      }
      
      console.log('Colaboradores para onboarding carregados:', data?.length || 0);
      setCollaborators(data || []);
    } catch (error) {
      console.error('Erro ao carregar colaboradores:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os colaboradores.",
        variant: "destructive"
      });
    }
  };

  const fetchProcesses = async () => {
    if (!user) {
      console.log('Usuário não autenticado, limpando lista de processos');
      setProcesses([]);
      setIsLoading(false);
      return;
    }

    try {
      console.log('Buscando processos de onboarding para usuário:', user.id);
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('onboarding_processes')
        .select(`
          *,
          collaborator:collaborators(name, email, role, department)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro Supabase ao buscar processos:', error);
        throw error;
      }
      
      console.log('Processos de onboarding carregados:', data?.length || 0);
      
      const formattedData = (data || []).map((item: any) => ({
        ...item,
        status: item.status as 'not-started' | 'in-progress' | 'completed',
      }));
      
      setProcesses(formattedData);
    } catch (error) {
      console.error('Erro ao carregar processos de onboarding:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os processos de onboarding.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('useOnboarding: useEffect executado, user.id:', user?.id);
    if (user) {
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
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('onboarding_processes')
        .insert([{
          ...processData,
          user_id: user.id,
        }])
        .select(`
          *,
          collaborator:collaborators(name, email, role, department)
        `)
        .single();

      if (error) throw error;

      // Criar etapas padrão se a função existir
      try {
        await supabase.rpc('create_default_onboarding_steps', {
          process_id: data.id
        });
      } catch (rpcError) {
        console.warn('Função create_default_onboarding_steps não encontrada, criando etapas manualmente');
        
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

        await supabase
          .from('onboarding_steps')
          .insert(stepsData);
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
    } catch (error) {
      console.error('Erro ao criar processo de onboarding:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o processo de onboarding.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const getProcessSteps = async (processId: string): Promise<OnboardingStep[]> => {
    try {
      const { data, error } = await supabase
        .from('onboarding_steps')
        .select('*')
        .eq('onboarding_process_id', processId)
        .order('step_order');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao carregar etapas:', error);
      return [];
    }
  };

  const updateStepStatus = async (stepId: string, completed: boolean, processId: string) => {
    try {
      const { error } = await supabase
        .from('onboarding_steps')
        .update({ completed })
        .eq('id', stepId);

      if (error) throw error;

      // Recalcular progresso
      const steps = await getProcessSteps(processId);
      const completedSteps = steps.filter(s => s.completed).length;
      const progress = Math.round((completedSteps / steps.length) * 100);
      
      let status: 'not-started' | 'in-progress' | 'completed' = 'not-started';
      if (progress === 100) status = 'completed';
      else if (progress > 0) status = 'in-progress';

      const currentStep = progress === 100 ? 'Concluído' : 
        steps.find(s => !s.completed)?.title || 'Concluído';

      // Atualizar processo
      await supabase
        .from('onboarding_processes')
        .update({ progress, status, current_step: currentStep })
        .eq('id', processId);

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

    } catch (error) {
      console.error('Erro ao atualizar etapa:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a etapa.",
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
      fetchCollaborators();
      fetchProcesses();
    }
  };
};
