
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'training' | 'meeting' | 'task';
  completed: boolean;
  dueDate?: string;
  videoUrl?: string;
  content?: string;
  order: number;
}

export interface OnboardingProcess {
  id: string;
  collaborator_id: string;
  collaborator?: {
    id: string;
    name: string;
    email: string;
  };
  position: string;
  department: string;
  status: 'not-started' | 'in-progress' | 'completed';
  progress: number;
  start_date: string;
  current_step: string;
  created_at: string;
  updated_at: string;
}

// Mock data service
const mockProcesses: OnboardingProcess[] = [
  {
    id: '1',
    collaborator_id: '1',
    collaborator: {
      id: '1',
      name: 'João Silva',
      email: 'joao.silva@empresa.com'
    },
    position: 'Desenvolvedor Frontend',
    department: 'Tecnologia',
    status: 'in-progress',
    progress: 65,
    start_date: '2024-01-20',
    current_step: 'Treinamento de Segurança',
    created_at: '2024-01-20T10:00:00Z',
    updated_at: '2024-01-23T14:30:00Z'
  },
  {
    id: '2',
    collaborator_id: '2',
    collaborator: {
      id: '2',
      name: 'Maria Santos',
      email: 'maria.santos@empresa.com'
    },
    position: 'Analista de Marketing',
    department: 'Marketing',
    status: 'completed',
    progress: 100,
    start_date: '2024-01-15',
    current_step: 'Integração com a Equipe',
    created_at: '2024-01-15T09:00:00Z',
    updated_at: '2024-01-22T16:45:00Z'
  },
  {
    id: '3',
    collaborator_id: '3',
    collaborator: {
      id: '3',
      name: 'Pedro Costa',
      email: 'pedro.costa@empresa.com'
    },
    position: 'Designer UX/UI',
    department: 'Design',
    status: 'not-started',
    progress: 0,
    start_date: '2024-01-25',
    current_step: 'Documentação Pessoal',
    created_at: '2024-01-24T08:00:00Z',
    updated_at: '2024-01-24T08:00:00Z'
  }
];

const mockSteps: { [processId: string]: OnboardingStep[] } = {
  '1': [
    {
      id: '1-1',
      title: 'Documentação Pessoal',
      description: 'Envio de documentos pessoais e contratuais',
      type: 'document',
      completed: true,
      order: 1
    },
    {
      id: '1-2',
      title: 'Apresentação da Empresa',
      description: 'Conhecer a história, missão e valores da empresa',
      type: 'training',
      completed: true,
      order: 2
    },
    {
      id: '1-3',
      title: 'Reunião com Gestor',
      description: 'Primeira reunião com o gestor direto',
      type: 'meeting',
      completed: true,
      dueDate: '2024-01-23',
      order: 3
    },
    {
      id: '1-4',
      title: 'Treinamento de Segurança',
      description: 'Curso obrigatório sobre políticas de segurança',
      type: 'training',
      completed: false,
      dueDate: '2024-01-25',
      order: 4
    },
    {
      id: '1-5',
      title: 'Setup do Ambiente',
      description: 'Configuração de equipamentos e acessos',
      type: 'task',
      completed: false,
      dueDate: '2024-01-24',
      order: 5
    },
    {
      id: '1-6',
      title: 'Integração com a Equipe',
      description: 'Conhecer os colegas de trabalho',
      type: 'meeting',
      completed: false,
      dueDate: '2024-01-26',
      order: 6
    }
  ]
};

// Mock API functions
const fetchProcesses = async (): Promise<OnboardingProcess[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockProcesses;
};

const fetchProcessSteps = async (processId: string): Promise<OnboardingStep[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockSteps[processId] || [];
};

const createProcess = async (processData: {
  collaboratorId: string;
  position: string;
  department: string;
  startDate: string;
}): Promise<OnboardingProcess> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const newProcess: OnboardingProcess = {
    id: String(mockProcesses.length + 1),
    collaborator_id: processData.collaboratorId,
    collaborator: {
      id: processData.collaboratorId,
      name: 'Novo Colaborador',
      email: 'novo@empresa.com'
    },
    position: processData.position,
    department: processData.department,
    start_date: processData.startDate,
    status: 'not-started',
    progress: 0,
    current_step: 'Documentação Pessoal',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  mockProcesses.push(newProcess);
  return newProcess;
};

const updateStepStatus = async (stepId: string, completed: boolean, processId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (mockSteps[processId]) {
    const step = mockSteps[processId].find(s => s.id === stepId);
    if (step) {
      step.completed = completed;
    }
  }
  
  // Atualizar progresso do processo
  const steps = mockSteps[processId] || [];
  const completedSteps = steps.filter(step => step.completed).length;
  const progress = Math.round((completedSteps / steps.length) * 100);
  
  const processIndex = mockProcesses.findIndex(p => p.id === processId);
  if (processIndex >= 0) {
    mockProcesses[processIndex].progress = progress;
    mockProcesses[processIndex].status = progress === 100 ? 'completed' : 'in-progress';
    mockProcesses[processIndex].updated_at = new Date().toISOString();
  }
};

export const useOptimizedOnboarding = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Query para buscar processos
  const {
    data: processes = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['onboarding-processes'],
    queryFn: fetchProcesses,
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 10 * 60 * 1000, // 10 minutos
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Query para buscar etapas de um processo específico
  const useProcessSteps = (processId: string) => {
    return useQuery({
      queryKey: ['onboarding-steps', processId],
      queryFn: () => fetchProcessSteps(processId),
      enabled: !!processId,
      staleTime: 2 * 60 * 1000, // 2 minutos
      cacheTime: 5 * 60 * 1000, // 5 minutos
    });
  };

  // Mutation para criar novo processo
  const createProcessMutation = useMutation({
    mutationFn: createProcess,
    onSuccess: (newProcess) => {
      queryClient.invalidateQueries({ queryKey: ['onboarding-processes'] });
      toast({
        title: "Sucesso",
        description: "Processo de onboarding criado com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Erro ao criar processo:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o processo de onboarding.",
        variant: "destructive"
      });
    }
  });

  // Mutation para atualizar status de etapa
  const updateStepMutation = useMutation({
    mutationFn: ({ stepId, completed, processId }: { stepId: string; completed: boolean; processId: string }) =>
      updateStepStatus(stepId, completed, processId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['onboarding-processes'] });
      queryClient.invalidateQueries({ queryKey: ['onboarding-steps', variables.processId] });
      toast({
        title: "Sucesso",
        description: "Status da etapa atualizado com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Erro ao atualizar etapa:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status da etapa.",
        variant: "destructive"
      });
    }
  });

  // Funções de conveniência
  const createNewProcess = useCallback((processData: {
    collaboratorId: string;
    position: string;
    department: string;
    startDate: string;
  }) => {
    return createProcessMutation.mutateAsync(processData);
  }, [createProcessMutation]);

  const updateStep = useCallback((stepId: string, completed: boolean, processId: string) => {
    return updateStepMutation.mutateAsync({ stepId, completed, processId });
  }, [updateStepMutation]);

  // Computed values
  const inProgressProcesses = processes.filter(p => p.status !== 'completed');
  const completedProcesses = processes.filter(p => p.status === 'completed');
  const processesByStatus = {
    'not-started': processes.filter(p => p.status === 'not-started'),
    'in-progress': processes.filter(p => p.status === 'in-progress'),
    'completed': processes.filter(p => p.status === 'completed'),
  };

  const stats = {
    total: processes.length,
    inProgress: inProgressProcesses.length,
    completed: completedProcesses.length,
    completionRate: processes.length > 0 ? Math.round((completedProcesses.length / processes.length) * 100) : 0,
  };

  return {
    // Data
    processes,
    inProgressProcesses,
    completedProcesses,
    processesByStatus,
    stats,
    
    // Loading states
    isLoading,
    isCreating: createProcessMutation.isPending,
    isUpdating: updateStepMutation.isPending,
    
    // Error states
    error,
    
    // Actions
    createNewProcess,
    updateStep,
    refetch,
    useProcessSteps,
    
    // Mutation objects (for advanced usage)
    createProcessMutation,
    updateStepMutation,
  };
};
