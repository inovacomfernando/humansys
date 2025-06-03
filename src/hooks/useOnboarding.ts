
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
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

// Mock data para desenvolvimento
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
  ],
  '2': [
    {
      id: '2-1',
      title: 'Documentação Pessoal',
      description: 'Envio de documentos pessoais e contratuais',
      type: 'document',
      completed: true,
      order: 1
    },
    {
      id: '2-2',
      title: 'Apresentação da Empresa',
      description: 'Conhecer a história, missão e valores da empresa',
      type: 'training',
      completed: true,
      order: 2
    },
    {
      id: '2-3',
      title: 'Reunião com Gestor',
      description: 'Primeira reunião com o gestor direto',
      type: 'meeting',
      completed: true,
      order: 3
    },
    {
      id: '2-4',
      title: 'Treinamento de Segurança',
      description: 'Curso obrigatório sobre políticas de segurança',
      type: 'training',
      completed: true,
      order: 4
    },
    {
      id: '2-5',
      title: 'Setup do Ambiente',
      description: 'Configuração de equipamentos e acessos',
      type: 'task',
      completed: true,
      order: 5
    },
    {
      id: '2-6',
      title: 'Integração com a Equipe',
      description: 'Conhecer os colegas de trabalho',
      type: 'meeting',
      completed: true,
      order: 6
    }
  ]
};

export const useOnboarding = () => {
  const [processes, setProcesses] = useState<OnboardingProcess[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchProcesses();
    } else {
      // Se não há usuário, inicializar com array vazio
      setProcesses([]);
      setIsLoading(false);
    }
  }, [user]);

  const fetchProcesses = async () => {
    setIsLoading(true);
    try {
      console.log('Carregando processos de onboarding...');
      
      // Simular delay de carregamento
      await new Promise(resolve => setTimeout(resolve, 500));

      // Garantir que sempre retornamos um array válido com dados válidos
      const validProcesses = Array.isArray(mockProcesses) 
        ? mockProcesses.filter(process => 
            process && 
            typeof process === 'object' && 
            process.id && 
            process.collaborator_id
          )
        : [];
      
      setProcesses(validProcesses);
      
      console.log('Processos carregados:', validProcesses);
    } catch (error) {
      console.error('Erro ao buscar processos:', error);
      
      // Em caso de erro, definir array vazio para evitar crashes
      setProcesses([]);
      
      toast({
        title: "Erro",
        description: "Não foi possível carregar os processos de onboarding.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createProcess = async (processData: {
    collaboratorId: string;
    position: string;
    department: string;
    startDate: string;
  }) => {
    try {
      console.log('Criando novo processo de onboarding:', processData);

      const newProcess: OnboardingProcess = {
        id: String(Date.now()),
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

      // Criar etapas padrão para o novo processo
      mockSteps[newProcess.id] = [
        {
          id: `${newProcess.id}-1`,
          title: 'Documentação Pessoal',
          description: 'Envio de documentos pessoais e contratuais',
          type: 'document',
          completed: false,
          order: 1
        },
        {
          id: `${newProcess.id}-2`,
          title: 'Apresentação da Empresa',
          description: 'Conhecer a história, missão e valores da empresa',
          type: 'training',
          completed: false,
          order: 2
        },
        {
          id: `${newProcess.id}-3`,
          title: 'Reunião com Gestor',
          description: 'Primeira reunião com o gestor direto',
          type: 'meeting',
          completed: false,
          order: 3
        },
        {
          id: `${newProcess.id}-4`,
          title: 'Treinamento de Segurança',
          description: 'Curso obrigatório sobre políticas de segurança',
          type: 'training',
          completed: false,
          order: 4
        },
        {
          id: `${newProcess.id}-5`,
          title: 'Setup do Ambiente',
          description: 'Configuração de equipamentos e acessos',
          type: 'task',
          completed: false,
          order: 5
        },
        {
          id: `${newProcess.id}-6`,
          title: 'Integração com a Equipe',
          description: 'Conhecer os colegas de trabalho',
          type: 'meeting',
          completed: false,
          order: 6
        }
      ];

      // Atualizar estado garantindo array válido
      const currentProcesses = Array.isArray(processes) ? processes : [];
      const updatedProcesses = [...currentProcesses, newProcess];
      
      mockProcesses.push(newProcess);
      setProcesses(updatedProcesses);

      toast({
        title: "Sucesso",
        description: "Processo de onboarding criado com sucesso!",
      });

      return newProcess;
    } catch (error) {
      console.error('Erro ao criar processo:', error);
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

  const updateStepStatus = async (stepId: string, completed: boolean, processId: string) => {
    try {
      console.log('Atualizando status da etapa:', { stepId, completed, processId });

      // Atualizar no mock
      if (mockSteps[processId] && Array.isArray(mockSteps[processId])) {
        const step = mockSteps[processId].find(s => s.id === stepId);
        if (step) {
          step.completed = completed;
        }
      }

      // Atualizar progresso do processo
      await updateProcessProgress(processId);

    } catch (error) {
      console.error('Erro ao atualizar etapa:', error);
      throw error;
    }
  };

  const updateProcessProgress = async (processId: string) => {
    try {
      const steps = await getProcessSteps(processId);
      const completedSteps = steps.filter(step => step.completed).length;
      const progress = steps.length > 0 ? Math.round((completedSteps / steps.length) * 100) : 0;

      const status = progress === 100 ? 'completed' : progress > 0 ? 'in-progress' : 'not-started';

      // Atualizar no mock
      const processIndex = mockProcesses.findIndex(p => p.id === processId);
      if (processIndex >= 0) {
        mockProcesses[processIndex].progress = progress;
        mockProcesses[processIndex].status = status;
        mockProcesses[processIndex].updated_at = new Date().toISOString();
      }

      // Garantir que processes seja sempre um array válido antes de atualizar
      const validProcesses = Array.isArray(processes) ? [...processes] : [];
      const currentProcessIndex = validProcesses.findIndex(p => p.id === processId);
      
      if (currentProcessIndex >= 0) {
        validProcesses[currentProcessIndex].progress = progress;
        validProcesses[currentProcessIndex].status = status;
        validProcesses[currentProcessIndex].updated_at = new Date().toISOString();
        setProcesses(validProcesses);
      }
    } catch (error) {
      console.error('Erro ao atualizar progresso:', error);
      throw error;
    }
  };

  // Garantir que sempre retornamos um array válido
  const safeProcesses = Array.isArray(processes) ? processes : [];

  return {
    processes: safeProcesses,
    isLoading,
    fetchProcesses,
    createProcess,
    getProcessSteps,
    updateStepStatus,
    updateProcessProgress
  };
};
