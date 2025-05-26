
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useSystemLogs } from './useSystemLogs';

export interface Training {
  id: string;
  title: string;
  description: string;
  duration: string;
  instructor?: string;
  status: 'active' | 'inactive';
  participants: number;
  user_id: string;
  created_at: string;
  updated_at: string;
}

// Função para converter dados do Supabase para o tipo Training
const convertToTraining = (data: any): Training => {
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    duration: data.duration,
    instructor: data.instructor,
    status: data.status === 'inactive' ? 'inactive' : 'active',
    participants: data.participants || 0,
    user_id: data.user_id,
    created_at: data.created_at,
    updated_at: data.updated_at
  };
};

// Função para validar dados de entrada
const validateTrainingData = (data: {
  title: string;
  description: string;
  duration: string;
  instructor?: string;
}): string[] => {
  const errors: string[] = [];
  
  if (!data.title || data.title.trim().length < 3) {
    errors.push('Título deve ter pelo menos 3 caracteres');
  }
  
  if (!data.description || data.description.trim().length < 10) {
    errors.push('Descrição deve ter pelo menos 10 caracteres');
  }
  
  if (!data.duration || data.duration.trim().length < 2) {
    errors.push('Duração é obrigatória');
  }
  
  return errors;
};

export const useTrainings = () => {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const { logError, logInfo, logWarning } = useSystemLogs();

  const fetchTrainings = async () => {
    if (!user) {
      setTrainings([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      logInfo('Iniciando busca de treinamentos', 'useTrainings.fetchTrainings', { userId: user.id });

      const { data, error: fetchError } = await supabase
        .from('trainings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      const convertedTrainings = (data || []).map(convertToTraining);
      setTrainings(convertedTrainings);
      
      logInfo('Treinamentos carregados com sucesso', 'useTrainings.fetchTrainings', { 
        count: convertedTrainings.length 
      });

    } catch (err: any) {
      const errorMessage = err.message || 'Erro desconhecido ao carregar treinamentos';
      setError('Erro ao carregar treinamentos: ' + errorMessage);
      
      logError('Erro ao buscar treinamentos', 'useTrainings.fetchTrainings', {
        error: err,
        userId: user.id
      });
      
      toast({
        title: "Erro ao Carregar",
        description: "Não foi possível carregar os treinamentos. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createTraining = async (trainingData: {
    title: string;
    description: string;
    duration: string;
    instructor?: string;
  }) => {
    // Verificar autenticação
    if (!user?.id) {
      logWarning('Tentativa de criar treinamento sem autenticação', 'useTrainings.createTraining');
      toast({
        title: "Erro de Autenticação",
        description: "Você precisa estar logado para criar um treinamento",
        variant: "destructive"
      });
      return false;
    }

    // Validar dados de entrada
    const validationErrors = validateTrainingData(trainingData);
    if (validationErrors.length > 0) {
      logWarning('Dados inválidos para criação de treinamento', 'useTrainings.createTraining', {
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

    // Preparar dados para inserção
    const insertData = {
      title: trainingData.title.trim(),
      description: trainingData.description.trim(),
      duration: trainingData.duration.trim(),
      instructor: trainingData.instructor?.trim() || null,
      user_id: user.id,
      status: 'active' as const,
      participants: 0
    };

    try {
      logInfo('Criando novo treinamento', 'useTrainings.createTraining', { 
        userId: user.id,
        title: insertData.title 
      });

      const { data, error: createError } = await supabase
        .from('trainings')
        .insert([insertData])
        .select()
        .single();

      if (createError) {
        throw createError;
      }

      if (!data) {
        throw new Error('Nenhum dado retornado após inserção');
      }

      // Converter e adicionar à lista
      const newTraining = convertToTraining(data);
      setTrainings(prev => [newTraining, ...prev]);
      
      logInfo('Treinamento criado com sucesso', 'useTrainings.createTraining', {
        trainingId: newTraining.id,
        title: newTraining.title
      });
      
      toast({
        title: "Sucesso",
        description: "Treinamento criado com sucesso!",
      });
      
      return true;
    } catch (err: any) {
      let errorMessage = 'Erro desconhecido ao criar treinamento';
      
      if (err.code === '42501') {
        errorMessage = 'Erro de permissão. Verifique se você tem acesso para criar treinamentos.';
      } else if (err.code === '23505') {
        errorMessage = 'Já existe um treinamento com esses dados.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      logError('Erro na criação de treinamento', 'useTrainings.createTraining', {
        error: err,
        userId: user.id,
        data: trainingData
      });
      
      toast({
        title: "Erro na Criação",
        description: errorMessage,
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    fetchTrainings();
  }, [user?.id]);

  return {
    trainings,
    isLoading,
    error,
    createTraining,
    refetch: fetchTrainings
  };
};
