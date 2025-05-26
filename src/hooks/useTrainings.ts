
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

export const useTrainings = () => {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchTrainings = async () => {
    console.log('fetchTrainings called, user:', user?.id);
    
    if (!user) {
      console.log('No user found, setting empty state');
      setTrainings([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      console.log('Fetching trainings for user:', user.id);
      
      const { data, error: fetchError } = await supabase
        .from('trainings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      console.log('Supabase response:', { data, error: fetchError });

      if (fetchError) {
        console.error('Supabase error:', fetchError);
        setError(`Erro ao carregar treinamentos: ${fetchError.message}`);
        setTrainings([]);
        return;
      }

      if (!data) {
        console.log('No data returned from Supabase');
        setTrainings([]);
        setError(null);
        return;
      }

      console.log('Processing trainings data:', data);
      
      const typedTrainings: Training[] = data.map((training: any) => ({
        id: training.id,
        title: training.title || '',
        description: training.description || '',
        duration: training.duration || '',
        instructor: training.instructor || undefined,
        status: (training.status === 'active' || training.status === 'inactive') 
          ? training.status as 'active' | 'inactive'
          : 'active',
        participants: Number(training.participants) || 0,
        user_id: training.user_id,
        created_at: training.created_at,
        updated_at: training.updated_at
      }));

      console.log('Processed trainings:', typedTrainings);
      setTrainings(typedTrainings);
      setError(null);
    } catch (error: any) {
      console.error('Unexpected error in fetchTrainings:', error);
      setError(`Erro inesperado: ${error.message || 'Erro desconhecido'}`);
      setTrainings([]);
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
    console.log('createTraining called with:', trainingData);
    
    if (!user) {
      console.error('No user found for creating training');
      toast({
        title: "Erro",
        description: "Usuário não autenticado",
        variant: "destructive"
      });
      return false;
    }

    try {
      const newTrainingData = {
        title: trainingData.title.trim(),
        description: trainingData.description.trim(),
        duration: trainingData.duration.trim(),
        instructor: trainingData.instructor?.trim() || null,
        user_id: user.id,
        status: 'active' as const,
        participants: 0
      };

      console.log('Inserting training data:', newTrainingData);

      const { data, error: createError } = await supabase
        .from('trainings')
        .insert([newTrainingData])
        .select()
        .single();

      console.log('Create training response:', { data, error: createError });

      if (createError) {
        console.error('Error creating training:', createError);
        toast({
          title: "Erro",
          description: `Erro ao criar treinamento: ${createError.message}`,
          variant: "destructive"
        });
        return false;
      }

      if (data) {
        const newTraining: Training = {
          id: data.id,
          title: data.title,
          description: data.description,
          duration: data.duration,
          instructor: data.instructor || undefined,
          status: (data.status === 'active' || data.status === 'inactive') 
            ? data.status as 'active' | 'inactive'
            : 'active',
          participants: Number(data.participants) || 0,
          user_id: data.user_id,
          created_at: data.created_at,
          updated_at: data.updated_at
        };

        setTrainings(prev => [newTraining, ...prev]);
        toast({
          title: "Sucesso",
          description: "Treinamento criado com sucesso!",
        });
        return true;
      }

      return false;
    } catch (error: any) {
      console.error('Unexpected error creating training:', error);
      toast({
        title: "Erro",
        description: `Erro ao criar treinamento: ${error.message || 'Erro desconhecido'}`,
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    console.log('useTrainings useEffect triggered, user changed:', user?.id);
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
