
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useSystemLogs } from './useSystemLogs';
import { useErrorHandler } from './useErrorHandler';
import { Training, CreateTrainingData } from '@/types/training';
import { validateTrainingData } from '@/utils/trainingValidation';
import * as trainingService from '@/services/trainingService';

export const useTrainings = () => {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const { logError, logInfo, logWarning } = useSystemLogs();
  const { handleError } = useErrorHandler();

  const fetchTrainings = async () => {
    if (!user) {
      console.log('Usuário não autenticado, limpando lista de treinamentos');
      setTrainings([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      logInfo('Iniciando busca de treinamentos', 'useTrainings.fetchTrainings', { userId: user.id });

      const fetchedTrainings = await trainingService.fetchTrainings(user.id);
      setTrainings(fetchedTrainings);
      
      console.log('Treinamentos carregados com sucesso:', fetchedTrainings.length);
      logInfo('Treinamentos carregados com sucesso', 'useTrainings.fetchTrainings', { 
        count: fetchedTrainings.length 
      });
    } catch (err: any) {
      console.error('Erro ao carregar treinamentos:', err);
      const errorMessage = err?.message?.includes('Failed to fetch') 
        ? 'Erro de conectividade. Verifique sua conexão e tente novamente.'
        : 'Não foi possível carregar os treinamentos. Tente novamente.';
      
      setError(errorMessage);
      handleError(err, 'useTrainings.fetchTrainings', errorMessage, false);
    } finally {
      setIsLoading(false);
    }
  };

  const createNewTraining = async (trainingData: CreateTrainingData) => {
    console.log('Iniciando criação de treinamento:', trainingData);
    
    if (!user?.id) {
      console.warn('Tentativa de criar treinamento sem autenticação');
      logWarning('Tentativa de criar treinamento sem autenticação', 'useTrainings.createNewTraining');
      toast({
        title: "Erro de Autenticação",
        description: "Você precisa estar logado para criar um treinamento",
        variant: "destructive"
      });
      return false;
    }

    const validationErrors = validateTrainingData(trainingData);
    if (validationErrors.length > 0) {
      console.warn('Dados inválidos para criação de treinamento:', validationErrors);
      logWarning('Dados inválidos para criação de treinamento', 'useTrainings.createNewTraining', {
        errors: validationErrors,
        data: trainingData
      });
      toast({
        title: "Dados Inválidos",
        description: validationErrors.join(', '),
        variant: "destructive"
      });
      return false;
    }

    try {
      logInfo('Criando novo treinamento', 'useTrainings.createNewTraining', { 
        userId: user.id,
        title: trainingData.title 
      });

      const newTraining = await trainingService.createTraining(trainingData, user.id);
      setTrainings(prev => [newTraining, ...prev]);
      
      logInfo('Treinamento criado com sucesso', 'useTrainings.createNewTraining', {
        trainingId: newTraining.id,
        title: newTraining.title
      });
      
      toast({
        title: "Sucesso",
        description: "Treinamento criado com sucesso!",
      });
      
      return true;
    } catch (err: any) {
      console.error('Erro na criação de treinamento:', err);
      
      let errorMessage = 'Erro desconhecido ao criar treinamento';
      
      if (err?.message?.includes('Failed to fetch')) {
        errorMessage = 'Erro de conectividade. Verifique sua conexão com a internet e tente novamente.';
      } else if (err.code === '42501') {
        errorMessage = 'Erro de permissão. Verifique se você tem acesso para criar treinamentos.';
      } else if (err.code === '23505') {
        errorMessage = 'Já existe um treinamento com esses dados.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      handleError(err, 'useTrainings.createNewTraining', errorMessage);
      return false;
    }
  };

  useEffect(() => {
    console.log('useTrainings: useEffect executado, user.id:', user?.id);
    fetchTrainings();
  }, [user?.id]);

  return {
    trainings,
    isLoading,
    error,
    createTraining: createNewTraining,
    refetch: fetchTrainings
  };
};
