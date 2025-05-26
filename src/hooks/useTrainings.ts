
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

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

  const fetchTrainings = async () => {
    console.log('🔄 Iniciando busca de treinamentos...');
    
    if (!user) {
      console.log('❌ Usuário não autenticado, limpando lista de treinamentos');
      setTrainings([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      console.log('📡 Fazendo consulta ao Supabase para user_id:', user.id);
      
      const { data, error: fetchError } = await supabase
        .from('trainings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('❌ Erro ao buscar treinamentos:', fetchError);
        console.error('Detalhes do erro:', {
          message: fetchError.message,
          code: fetchError.code,
          details: fetchError.details
        });
        setError('Erro ao carregar treinamentos: ' + fetchError.message);
        return;
      }

      console.log('✅ Dados recebidos do Supabase:', data);
      console.log('📊 Número de treinamentos encontrados:', data?.length || 0);

      const convertedTrainings = (data || []).map(convertToTraining);
      console.log('🔄 Treinamentos convertidos:', convertedTrainings);
      
      setTrainings(convertedTrainings);
    } catch (err) {
      console.error('💥 Erro inesperado ao buscar treinamentos:', err);
      setError('Erro inesperado ao carregar treinamentos: ' + (err as Error).message);
    } finally {
      setIsLoading(false);
      console.log('✅ Busca de treinamentos finalizada');
    }
  };

  const createTraining = async (trainingData: {
    title: string;
    description: string;
    duration: string;
    instructor?: string;
  }) => {
    console.log('🚀 Iniciando criação de treinamento...');
    console.log('📝 Dados recebidos:', trainingData);

    // Verificar autenticação
    if (!user) {
      console.error('❌ Usuário não autenticado');
      toast({
        title: "Erro de Autenticação",
        description: "Você precisa estar logado para criar um treinamento",
        variant: "destructive"
      });
      return false;
    }

    console.log('✅ Usuário autenticado:', user.id);

    // Validar dados de entrada
    const validationErrors = validateTrainingData(trainingData);
    if (validationErrors.length > 0) {
      console.error('❌ Erros de validação:', validationErrors);
      toast({
        title: "Dados Inválidos",
        description: validationErrors.join(', '),
        variant: "destructive"
      });
      return false;
    }

    console.log('✅ Validação de dados passou');

    // Preparar dados para inserção
    const insertData = {
      ...trainingData,
      user_id: user.id,
      status: 'active' as const,
      participants: 0
    };

    console.log('📤 Dados preparados para inserção:', insertData);

    try {
      console.log('📡 Enviando dados para Supabase...');
      
      const { data, error: createError } = await supabase
        .from('trainings')
        .insert([insertData])
        .select()
        .single();

      if (createError) {
        console.error('❌ Erro na criação:', createError);
        console.error('Detalhes do erro:', {
          message: createError.message,
          code: createError.code,
          details: createError.details,
          hint: createError.hint
        });
        
        let errorMessage = 'Erro ao criar treinamento';
        if (createError.code === '42501') {
          errorMessage = 'Erro de permissão. Verifique se você tem acesso para criar treinamentos.';
        } else if (createError.code === '23505') {
          errorMessage = 'Já existe um treinamento com esses dados.';
        } else if (createError.message) {
          errorMessage = createError.message;
        }
        
        toast({
          title: "Erro na Criação",
          description: errorMessage,
          variant: "destructive"
        });
        return false;
      }

      if (!data) {
        console.error('❌ Nenhum dado retornado após inserção');
        toast({
          title: "Erro",
          description: "Nenhum dado foi retornado após a criação",
          variant: "destructive"
        });
        return false;
      }

      console.log('✅ Treinamento criado com sucesso:', data);

      // Converter e adicionar à lista
      const newTraining = convertToTraining(data);
      console.log('🔄 Novo treinamento convertido:', newTraining);
      
      setTrainings(prev => {
        console.log('📋 Lista anterior:', prev);
        const newList = [newTraining, ...prev];
        console.log('📋 Nova lista:', newList);
        return newList;
      });
      
      toast({
        title: "Sucesso",
        description: "Treinamento criado com sucesso!",
      });
      
      return true;
    } catch (err) {
      console.error('💥 Erro inesperado na criação:', err);
      console.error('Stack trace:', (err as Error).stack);
      
      toast({
        title: "Erro Inesperado",
        description: "Erro inesperado ao criar treinamento: " + (err as Error).message,
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    console.log('🔄 useEffect disparado, user.id:', user?.id);
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
