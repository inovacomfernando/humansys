
import { supabase } from '@/integrations/supabase/client';
import { Training, CreateTrainingData } from '@/types/training';
import { convertToTraining } from '@/utils/trainingConverters';

export const fetchTrainings = async (userId: string): Promise<Training[]> => {
  console.log('Iniciando busca de treinamentos para usuário:', userId);
  
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
};
