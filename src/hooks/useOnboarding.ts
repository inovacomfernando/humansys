
import { useState, useEffect } from 'react';

export interface OnboardingProcess {
  id: string;
  collaborator_id: string;
  collaborator?: {
    id: string;
    name: string;
    email: string;
  };
  status: 'not-started' | 'in-progress' | 'completed';
  progress: number;
  current_step: string;
  start_date: string;
  position: string;
  department: string;
}

export interface OnboardingStep {
  id: string;
  process_id: string;
  title: string;
  description: string;
  type: 'document' | 'training' | 'meeting' | 'task';
  status: 'pending' | 'in-progress' | 'completed';
  due_date?: string;
  completed_at?: string;
  order: number;
  completed?: boolean;
}

// Dados mock para desenvolvimento
const mockProcesses: OnboardingProcess[] = [
  {
    id: '1',
    collaborator_id: '101',
    collaborator: {
      id: '101',
      name: 'Ana Silva',
      email: 'ana.silva@empresa.com'
    },
    status: 'in-progress',
    progress: 65,
    current_step: 'Treinamento de Segurança',
    start_date: '2024-01-20',
    position: 'Desenvolvedora Frontend',
    department: 'Tecnologia'
  },
  {
    id: '2',
    collaborator_id: '102',
    collaborator: {
      id: '102',
      name: 'Carlos Santos',
      email: 'carlos.santos@empresa.com'
    },
    status: 'in-progress',
    progress: 30,
    current_step: 'Reunião com Gestor',
    start_date: '2024-01-22',
    position: 'Analista de Marketing',
    department: 'Marketing'
  },
  {
    id: '3',
    collaborator_id: '103',
    collaborator: {
      id: '103',
      name: 'Maria Oliveira',
      email: 'maria.oliveira@empresa.com'
    },
    status: 'completed',
    progress: 100,
    current_step: 'Concluído',
    start_date: '2024-01-15',
    position: 'Gerente de Vendas',
    department: 'Comercial'
  }
];

const mockSteps: Record<string, OnboardingStep[]> = {
  '1': [
    {
      id: 'step1-1',
      process_id: '1',
      title: 'Documentação Pessoal',
      description: 'Envio de documentos pessoais e contratuais',
      type: 'document',
      status: 'completed',
      order: 1,
      completed_at: '2024-01-21',
      completed: true
    },
    {
      id: 'step1-2',
      process_id: '1',
      title: 'Apresentação da Empresa',
      description: 'Conhecer a história, missão e valores',
      type: 'training',
      status: 'completed',
      order: 2,
      completed_at: '2024-01-22',
      completed: true
    },
    {
      id: 'step1-3',
      process_id: '1',
      title: 'Treinamento de Segurança',
      description: 'Curso obrigatório sobre políticas de segurança',
      type: 'training',
      status: 'in-progress',
      order: 3,
      due_date: '2024-01-25',
      completed: false
    },
    {
      id: 'step1-4',
      process_id: '1',
      title: 'Setup do Ambiente',
      description: 'Configuração de equipamentos e acessos',
      type: 'task',
      status: 'pending',
      order: 4,
      due_date: '2024-01-26',
      completed: false
    }
  ],
  '2': [
    {
      id: 'step2-1',
      process_id: '2',
      title: 'Documentação Pessoal',
      description: 'Envio de documentos pessoais e contratuais',
      type: 'document',
      status: 'completed',
      order: 1,
      completed_at: '2024-01-23',
      completed: true
    },
    {
      id: 'step2-2',
      process_id: '2',
      title: 'Reunião com Gestor',
      description: 'Primeira reunião com o gestor direto',
      type: 'meeting',
      status: 'in-progress',
      order: 2,
      due_date: '2024-01-24',
      completed: false
    }
  ],
  '3': [
    {
      id: 'step3-1',
      process_id: '3',
      title: 'Processo Completo',
      description: 'Todas as etapas foram concluídas',
      type: 'task',
      status: 'completed',
      order: 1,
      completed_at: '2024-01-18',
      completed: true
    }
  ]
};

export const useOnboarding = () => {
  const [processes, setProcesses] = useState<OnboardingProcess[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProcesses();
  }, []);

  const loadProcesses = async () => {
    try {
      setIsLoading(true);
      console.log('Carregando processos de onboarding...');
      
      // Simular delay de carregamento
      await new Promise(resolve => setTimeout(resolve, 500));

      // Garantir que sempre retornamos dados válidos
      const validProcesses = mockProcesses.filter(process => 
        process && 
        typeof process === 'object' && 
        process.id && 
        process.collaborator_id
      );
      
      setProcesses(validProcesses);
      console.log('Processos carregados:', validProcesses.length);
      
    } catch (error) {
      console.error('Erro ao carregar processos:', error);
      setProcesses([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getProcessSteps = async (processId: string): Promise<OnboardingStep[]> => {
    try {
      if (!processId || typeof processId !== 'string') {
        console.warn('ProcessId inválido:', processId);
        return [];
      }

      console.log('Carregando etapas do processo:', processId);

      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 200));

      const steps = mockSteps[processId];
      const validSteps = Array.isArray(steps) 
        ? steps.filter(step => 
            step && 
            typeof step === 'object' && 
            step.id && 
            step.title
          )
        : [];
        
      return validSteps;
    } catch (error) {
      console.error('Erro ao buscar etapas:', error);
      return [];
    }
  };

  const updateStepStatus = async (stepId: string, completed: boolean, processId: string): Promise<void> => {
    try {
      console.log('Atualizando status da etapa:', { stepId, completed, processId });

      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 300));

      // Atualizar o status no mock local
      if (mockSteps[processId]) {
        const stepIndex = mockSteps[processId].findIndex(step => step.id === stepId);
        if (stepIndex !== -1) {
          mockSteps[processId][stepIndex] = {
            ...mockSteps[processId][stepIndex],
            completed,
            status: completed ? 'completed' : 'pending',
            completed_at: completed ? new Date().toISOString() : undefined
          };

          // Atualizar o progresso do processo
          const completedSteps = mockSteps[processId].filter(step => step.completed).length;
          const totalSteps = mockSteps[processId].length;
          const newProgress = Math.round((completedSteps / totalSteps) * 100);

          // Atualizar processo no array de processos
          setProcesses(prev => prev.map(process => 
            process.id === processId 
              ? { ...process, progress: newProgress }
              : process
          ));
        }
      }

      console.log('Status da etapa atualizado com sucesso');
    } catch (error) {
      console.error('Erro ao atualizar status da etapa:', error);
      throw error;
    }
  };

  const createProcess = async (processData: Partial<OnboardingProcess>): Promise<OnboardingProcess | null> => {
    try {
      console.log('Criando novo processo:', processData);

      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 300));

      const newProcess: OnboardingProcess = {
        id: Date.now().toString(),
        collaborator_id: processData.collaborator_id || '',
        collaborator: processData.collaborator,
        status: 'not-started',
        progress: 0,
        current_step: 'Aguardando início',
        start_date: new Date().toISOString().split('T')[0],
        position: processData.position || '',
        department: processData.department || ''
      };

      // Adicionar aos processos locais
      setProcesses(prev => [...prev, newProcess]);
      
      console.log('Processo criado com sucesso:', newProcess);
      return newProcess;
    } catch (error) {
      console.error('Erro ao criar processo:', error);
      return null;
    }
  };

  const updateProcess = async (processId: string, updateData: Partial<OnboardingProcess>): Promise<void> => {
    try {
      console.log('Atualizando processo:', { processId, updateData });

      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 200));

      setProcesses(prev => prev.map(process => 
        process.id === processId 
          ? { ...process, ...updateData }
          : process
      ));

      console.log('Processo atualizado com sucesso');
    } catch (error) {
      console.error('Erro ao atualizar processo:', error);
      throw error;
    }
  };

  const deleteProcess = async (processId: string): Promise<void> => {
    try {
      console.log('Deletando processo:', processId);

      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 200));

      setProcesses(prev => prev.filter(process => process.id !== processId));
      
      // Limpar etapas do processo
      delete mockSteps[processId];

      console.log('Processo deletado com sucesso');
    } catch (error) {
      console.error('Erro ao deletar processo:', error);
      throw error;
    }
  };

  const createStep = async (stepData: Partial<OnboardingStep>): Promise<OnboardingStep | null> => {
    try {
      console.log('Criando nova etapa:', stepData);

      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 200));

      const newStep: OnboardingStep = {
        id: `step-${Date.now()}`,
        process_id: stepData.process_id || '',
        title: stepData.title || '',
        description: stepData.description || '',
        type: stepData.type || 'task',
        status: 'pending',
        order: stepData.order || 1,
        completed: false
      };

      // Adicionar ao mock
      if (!mockSteps[newStep.process_id]) {
        mockSteps[newStep.process_id] = [];
      }
      mockSteps[newStep.process_id].push(newStep);

      console.log('Etapa criada com sucesso:', newStep);
      return newStep;
    } catch (error) {
      console.error('Erro ao criar etapa:', error);
      return null;
    }
  };

  return {
    processes,
    isLoading,
    loadProcesses,
    getProcessSteps,
    updateStepStatus,
    createProcess,
    updateProcess,
    deleteProcess,
    createStep
  };
};
