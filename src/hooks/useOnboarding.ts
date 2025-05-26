
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
  };
}

export interface OnboardingStep {
  id: string;
  onboarding_process_id: string;
  title: string;
  completed: boolean;
  step_order: number;
}

export const useOnboarding = () => {
  const [processes, setProcesses] = useState<OnboardingProcess[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchProcesses = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('onboarding_processes')
        .select(`
          *,
          collaborator:collaborators(name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Garantir que os dados estão no formato correto
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
    fetchProcesses();
  }, [user]);

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
          collaborator:collaborators(name, email)
        `)
        .single();

      if (error) throw error;

      // Criar etapas padrão
      await supabase.rpc('create_default_onboarding_steps', {
        process_id: data.id
      });

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
    isLoading,
    createProcess,
    getProcessSteps,
    updateStepStatus,
    refetch: fetchProcesses
  };
};
