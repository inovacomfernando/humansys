import { useState, useEffect, useCallback } from 'react';
import { useSupabaseQuery } from './useSupabaseQuery';
import { useToast } from './use-toast';

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
  const [processes, setProcesses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { executeQuery } = useSupabaseQuery();
  const { toast } = useToast();

  // Mock data para desenvolvimento
  const mockProcesses2 = [
    {
      id: '1',
      collaborator_id: '1',
      collaborator: {
        id: '1',
        name: 'Ana Silva',
        email: 'ana.silva@empresa.com',
        position: 'Desenvolvedora Frontend',
        department: 'Tecnologia',
        hire_date: '2024-01-15',
        status: 'active'
      },
      position: 'Desenvolvedora Frontend',
      department: 'Tecnologia',
      start_date: '2024-01-15',
      status: 'in-progress',
      progress: 75,
      current_step: 'Treinamento de Segurança',
    },
    {
      id: '2',
      collaborator_id: '2',
      collaborator: {
        id: '2',
        name: 'Carlos Oliveira',
        email: 'carlos.oliveira@empresa.com',
        position: 'Analista de Marketing',
        department: 'Marketing',
        hire_date: '2024-01-10',
        status: 'active'
      },
      position: 'Analista de Marketing',
      department: 'Marketing',
      start_date: '2024-01-10',
      status: 'completed',
      progress: 100,
      current_step: 'Concluído',
    }
  ];

  const fetchProcesses = useCallback(async () => {
    console.log('useOnboarding: Iniciando busca de processos');
    setIsLoading(true);
    setError(null);

    try {
      const result = await executeQuery(
        () => {
          console.log('useOnboarding: Executando query mock para processos');
          // Simular delay de rede
          return new Promise<any[]>((resolve) => {
            setTimeout(() => {
              console.log('useOnboarding: Retornando dados mock');
              resolve(mockProcesses2);
            }, 500);
          });
        },
        { 
          maxRetries: 2, 
          retryDelay: 1000,
          useCache: true 
        }
      );

      if (result && Array.isArray(result)) {
        console.log('useOnboarding: Dados carregados com sucesso:', result);
        setProcesses(result);
        setError(null);
      } else {
        console.warn('useOnboarding: Resultado não é um array, usando array vazio');
        setProcesses([]);
        setError('Dados inválidos recebidos');
      }
    } catch (err) {
      console.error('useOnboarding: Erro ao carregar dados:', err);
      setProcesses([]);
      setError('Erro ao carregar processos de onboarding');

      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os processos de onboarding",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [executeQuery, toast]);

  useEffect(() => {
    fetchProcesses();
  }, [fetchProcesses]);

  const updateProcessProgress = useCallback(async (processId: string, progress: number) => {
    console.log(`useOnboarding: Atualizando progresso do processo ${processId} para ${progress}%`);

    try {
      setProcesses(current => {
        if (!Array.isArray(current)) {
          console.error('useOnboarding: processes não é um array ao atualizar progresso');
          return [];
        }

        return current.map(process => 
          process.id === processId 
            ? { ...process, progress }
            : process
        );
      });

      toast({
        title: "Progresso atualizado",
        description: `Progresso atualizado para ${progress}%`,
      });
    } catch (err) {
      console.error('useOnboarding: Erro ao atualizar progresso:', err);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o progresso",
        variant: "destructive"
      });
    }
  }, [toast]);

  const createProcess = useCallback(async (processData: any) => {
    console.log('useOnboarding: Criando novo processo', processData);

    try {
      const newProcess = {
        id: Date.now().toString(),
        ...processData,
        start_date: new Date().toISOString(),
        status: 'in-progress',
        progress: 0,
        current_step: 'Documentação Pessoal',
      };

      setProcesses(current => {
        if (!Array.isArray(current)) {
          console.error('useOnboarding: processes não é um array ao criar processo');
          return [newProcess];
        }
        return [...current, newProcess];
      });

      toast({
        title: "Processo criado",
        description: `Onboarding iniciado para ${processData.collaborator?.name}`,
      });

      return newProcess;
    } catch (err) {
      console.error('useOnboarding: Erro ao criar processo:', err);
      toast({
        title: "Erro",
        description: "Não foi possível criar o processo de onboarding",
        variant: "destructive"
      });
      return null;
    }
  }, [toast]);

  // Garantir que processes sempre seja um array
  const safeProcesses = Array.isArray(processes) ? processes : [];

  return {
    processes: safeProcesses,
    isLoading,
    error,
    updateProcessProgress,
    createProcess,
    refetch: fetchProcesses
  };
};