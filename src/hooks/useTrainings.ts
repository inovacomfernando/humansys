
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
    if (!user) return;

    try {
      setIsLoading(true);
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
        return;
      }

      // Cast the data to match our Training interface
      const typedTrainings: Training[] = (data || []).map(training => ({
        ...training,
        status: training.status as 'active' | 'inactive'
      }));

      setTrainings(typedTrainings);
    } catch (error) {
      console.error('Error:', error);
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
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('trainings')
        .insert([
          {
            ...trainingData,
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

      // Cast the new training data to match our interface
      const newTraining: Training = {
        ...data,
        status: data.status as 'active' | 'inactive'
      };

      setTrainings(prev => [newTraining, ...prev]);
      toast({
        title: "Treinamento criado",
        description: "Novo treinamento foi criado com sucesso.",
      });

      return newTraining;
    } catch (error) {
      console.error('Error:', error);
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
