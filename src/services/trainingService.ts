
import { supabase } from '@/integrations/supabase/client';
import { Training, CreateTrainingData } from '@/types/training';
import { convertToTraining } from '@/utils/trainingConverters';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const retryOperation = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 2,
  delayMs: number = 1000
): Promise<T> => {
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      console.warn(`Tentativa ${attempt} falhou:`, error?.message || error);
      
      // Se é um erro de rede e não é a última tentativa
      if (error?.message?.includes('Failed to fetch') && attempt < maxRetries) {
        console.log(`Aguardando ${delayMs}ms antes da próxima tentativa...`);
        await delay(delayMs);
        continue;
      }
      
      // Para outros tipos de erro ou última tentativa, parar
      break;
    }
  }
  
  throw lastError;
};

export const fetchTrainings = async (userId: string): Promise<Training[]> => {
  console.log('Iniciando busca de treinamentos para usuário:', userId);
  
  try {
    const { data, error } = await supabase
      .from('trainings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro do Supabase ao buscar treinamentos:', error);
      throw error;
    }

    console.log('Dados recebidos do Supabase:', data);
    return (data || []).map(convertToTraining);
  } catch (error) {
    console.error('Erro na busca de treinamentos:', error);
    throw error;
  }
};

export const createTraining = async (
  trainingData: CreateTrainingData,
  userId: string
): Promise<Training> => {
  const insertData = {
    title: trainingData.title.trim(),
    description: trainingData.description.trim(),
    duration: trainingData.duration.trim(),
    instructor: trainingData.instructor?.trim() || null,
    user_id: userId,
    status: 'active' as const,
    participants: 0
  };

  console.log('Dados preparados para inserção:', insertData);

  return retryOperation(async () => {
    const { data, error } = await supabase
      .from('trainings')
      .insert([insertData])
      .select()
      .single();

    if (error) {
      console.error('Erro do Supabase ao criar treinamento:', error);
      throw error;
    }

    if (!data) {
      throw new Error('Nenhum dado retornado após inserção');
    }

    console.log('Treinamento criado com sucesso:', data);
    return convertToTraining(data);
  });
};
