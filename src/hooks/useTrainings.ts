
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
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchTrainings = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      console.log('Fetching trainings for user:', user.id);
      
      const { data, error } = await supabase
        .from('trainings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching trainings:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar treinamentos",
          variant: "destructive"
        });
        setTrainings([]);
        return;
      }

      console.log('Trainings fetched successfully:', data);

      // Transform the data to match our Training interface
      const typedTrainings: Training[] = (data || []).map(training => ({
        id: training.id,
        title: training.title,
        description: training.description,
        duration: training.duration,
        instructor: training.instructor || undefined,
        status: training.status === 'active' || training.status === 'inactive' 
          ? training.status
          : 'active',
        participants: training.participants || 0,
        user_id: training.user_id,
        created_at: training.created_at,
        updated_at: training.updated_at
      }));

      setTrainings(typedTrainings);
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao carregar treinamentos",
        variant: "destructive"
      });
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
    if (!user) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('Creating training:', trainingData);
      
      const { data, error } = await supabase
        .from('trainings')
        .insert([
          {
            title: trainingData.title,
            description: trainingData.description,
            duration: trainingData.duration,
            instructor: trainingData.instructor || null,
            user_id: user.id,
            status: 'active',
            participants: 0
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating training:', error);
        toast({
          title: "Erro",
          description: "Erro ao criar treinamento",
          variant: "destructive"
        });
        return;
      }

      console.log('Training created successfully:', data);

      // Transform the new training data to match our interface
      const newTraining: Training = {
        id: data.id,
        title: data.title,
        description: data.description,
        duration: data.duration,
        instructor: data.instructor || undefined,
        status: data.status === 'active' || data.status === 'inactive' 
          ? data.status
          : 'active',
        participants: data.participants || 0,
        user_id: data.user_id,
        created_at: data.created_at,
        updated_at: data.updated_at
      };

      setTrainings(prev => [newTraining, ...prev]);
      toast({
        title: "Treinamento criado",
        description: "Novo treinamento foi criado com sucesso.",
      });

      return newTraining;
    } catch (error) {
      console.error('Unexpected error creating training:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar treinamento",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchTrainings();
  }, [user]);

  return {
    trainings,
    isLoading,
    createTraining,
    refetch: fetchTrainings
  };
};
