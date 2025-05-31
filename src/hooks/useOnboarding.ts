import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery';
import { supabase } from '@/integrations/supabase/client';

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
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const { executeQuery } = useSupabaseQuery();

  const fetchCollaborators = async () => {
    if (!user?.id) return;

    const result = await executeQuery<Collaborator[]>(
      () => supabase
        .from('collaborators')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('name'),
      { maxRetries: 2, requireAuth: true, timeout: 5000 }
    );

    if (result && Array.isArray(result)) {
      setCollaborators(result as Collaborator[]);
    }
  };

  const fetchProcesses = async () => {
    if (!user?.id) {
      setProcesses([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    const result = await executeQuery<OnboardingProcess[]>(
      () => supabase
        .from('onboarding_processes')
        .select(`
          *,
          collaborator:collaborators(name, email, role, department)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }),
      { maxRetries: 2, requireAuth: true, timeout: 5000 }
    );

    if (result && Array.isArray(result)) {
      const formattedData: OnboardingProcess[] = result.map((item: any) => ({
        ...item,
        status: item.status as 'not-started' | 'in-progress' | 'completed',
      }));
      
      setProcesses(formattedData);
      setError(null);
    } else {
      setProcesses([]);
      setError('Falha ao carregar processos de onboarding');
    }

    setIsLoading(false);
  };

  useEffect(() => {
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
    if (!user?.id) return;

    const dataToInsert = {
      ...processData,
      user_id: user.id,
    };

    const result = await executeQuery(
      () => supabase
        .from('onboarding_processes')
        .insert([dataToInsert])
        .select(`
          *,
          collaborator:collaborators(name, email, role, department)
        `)
        .single(),
      { maxRetries: 2, requireAuth: true, timeout: 5000 }
    );

    if (result) {
      const typedResult = result as any;
      
      // Criar etapas padrão
      const defaultSteps = [
        'Documentação Pessoal',
        'Apresentação da Empresa', 
        'Reunião com Gestor',
        'Treinamento de Segurança',
        'Setup do Ambiente',
        'Integração com a Equipe'
      ];

      const stepsData = defaultSteps.map((title, index) => ({
        onboarding_process_id: typedResult.id,
        title,
        step_order: index + 1,
        completed: false
      }));

      await executeQuery(
        () => supabase.from('onboarding_steps').insert(stepsData),
        { maxRetries: 1, requireAuth: true, timeout: 5000 }
      );

      const formattedData: OnboardingProcess = {
        ...typedResult,
        status: typedResult.status as 'not-started' | 'in-progress' | 'completed',
      };

      setProcesses(prev => [formattedData, ...prev]);
      toast({
        title: "Sucesso",
        description: "Processo de onboarding criado com sucesso."
      });
      
      return formattedData;
    }
  };

  const getProcessSteps = async (processId: string): Promise<OnboardingStep[]> => {
    const result = await executeQuery<OnboardingStep[]>(
      () => supabase
        .from('onboarding_steps')
        .select('*')
        .eq('onboarding_process_id', processId)
        .order('step_order'),
      { maxRetries: 2, requireAuth: true, timeout: 5000 }
    );

    return (result && Array.isArray(result)) ? result as OnboardingStep[] : [];
  };

  const updateStepStatus = async (stepId: string, completed: boolean, processId: string) => {
    const stepResult = await executeQuery(
      () => supabase
        .from('onboarding_steps')
        .update({ completed })
        .eq('id', stepId),
      { maxRetries: 2, requireAuth: true, timeout: 5000 }
    );

    if (stepResult !== null) {
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
      await executeQuery(
        () => supabase
          .from('onboarding_processes')
          .update({ progress, status, current_step: currentStep })
          .eq('id', processId),
        { maxRetries: 2, requireAuth: true, timeout: 5000 }
      );

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
    }
  };

  return {
    processes,
    collaborators,
    isLoading,
    error,
    createProcess,
    getProcessSteps,
    updateStepStatus,
    refetch: () => {
      fetchCollaborators();
      fetchProcesses();
    }
  };
};
