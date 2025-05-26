
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useSystemLogs } from './useSystemLogs';
import { useErrorHandler } from './useErrorHandler';
import { useTrainingCache } from './useTrainingCache';
import { Training, CreateTrainingData } from '@/types/training';
import { validateTrainingData } from '@/utils/trainingValidation';
import * as trainingService from '@/services/trainingService';

export const useTrainings = () => {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUsingCache, setIsUsingCache] = useState(false);
  const [forceRefresh, setForceRefresh] = useState(0);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const { logError, logInfo, logWarning } = useSystemLogs();
  const { handleError } = useErrorHandler();
  const { saveToCache, getFromCache, clearCache } = useTrainingCache();

  const fetchTrainings = async (skipCache = false) => {
    if (!user) {
      console.log('Usuário não autenticado, limpando lista de treinamentos');
      setTrainings([]);
      setIsLoading(false);
      setIsUsingCache(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    // Tentar usar cache primeiro se não for um refresh forçado
    if (!skipCache) {
      const { data: cachedData, isStale } = getFromCache();
      if (cachedData && cachedData.length > 0) {
        console.log('Usando dados do cache, stale:', isStale);
        setTrainings(cachedData);
        setIsUsingCache(true);
        
        // Se os dados não estão obsoletos, pode usar só o cache
        if (!isStale) {
          setIsLoading(false);
          return;
        }
      }
    }
    
    try {
      logInfo('Iniciando busca de treinamentos', 'useTrainings.fetchTrainings', { 
        userId: user.id,
        skipCache,
        forceRefresh 
      });

      const fetchedTrainings = await trainingService.fetchTrainings(user.id);
      
      // Salvar no cache
      saveToCache(fetchedTrainings);
      
      setTrainings(fetchedTrainings);
      setIsUsingCache(false);
      
      console.log('Treinamentos carregados com sucesso:', fetchedTrainings.length);
      logInfo('Treinamentos carregados com sucesso', 'useTrainings.fetchTrainings', { 
        count: fetchedTrainings.length 
      });

      // Limpar erro se a busca foi bem-sucedida
      setError(null);
    } catch (err: any) {
      console.error('Erro ao carregar treinamentos:', err);
      
      const errorMessage = err?.message?.includes('Failed to fetch') 
        ? 'Erro de conectividade. Usando dados em cache quando disponíveis.'
        : 'Não foi possível carregar os treinamentos. Tente novamente.';
      
      // Se temos dados em cache, usar eles e mostrar aviso
      const { data: cachedData } = getFromCache();
      if (cachedData && cachedData.length > 0) {
        console.log('Usando dados em cache devido a erro de conectividade');
        setTrainings(cachedData);
        setIsUsingCache(true);
        setError('Usando dados salvos - alguns dados podem estar desatualizados');
        
        toast({
          title: "Modo Offline",
          description: "Exibindo dados salvos. Alguns dados podem estar desatualizados.",
          variant: "destructive"
        });
      } else {
        setError(errorMessage);
        handleError(err, 'useTrainings.fetchTrainings', errorMessage, false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const forceRefreshTrainings = () => {
    console.log('Forçando recarregamento de treinamentos');
    clearCache();
    setForceRefresh(prev => prev + 1);
    fetchTrainings(true);
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
      
      // Atualizar lista local e cache
      const updatedTrainings = [newTraining, ...trainings];
      setTrainings(updatedTrainings);
      saveToCache(updatedTrainings);
      
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
      
      let errorMessage = 'Erro ao criar treinamento. Tente novamente.';
      
      if (err?.message?.includes('Failed to fetch')) {
        errorMessage = 'Erro de conectividade. Verifique sua conexão com a internet e tente novamente.';
      } else if (err.code === '42501') {
        errorMessage = 'Erro de permissão. Verifique se você tem acesso para criar treinamentos.';
      } else if (err.code === '23505') {
        errorMessage = 'Já existe um treinamento com esses dados.';
      } else if (err.message) {
        errorMessage = `Erro: ${err.message}`;
      }
      
      handleError(err, 'useTrainings.createNewTraining', errorMessage);
      return false;
    }
  };

  useEffect(() => {
    console.log('useTrainings: useEffect executado, user.id:', user?.id, 'forceRefresh:', forceRefresh);
    fetchTrainings();
  }, [user?.id, forceRefresh]);

  return {
    trainings,
    isLoading,
    error,
    isUsingCache,
    createTraining: createNewTraining,
    refetch: fetchTrainings,
    forceRefresh: forceRefreshTrainings
  };
};
