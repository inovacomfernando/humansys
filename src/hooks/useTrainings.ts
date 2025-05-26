
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
    status: data.status === 'inactive' ? 'inactive' : 'active', // Garantir que seja um dos valores válidos
    participants: data.participants || 0,
    user_id: data.user_id,
    created_at: data.created_at,
    updated_at: data.updated_at
  };
};

export const useTrainings = () => {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchTrainings = async () => {
    if (!user) {
      setTrainings([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('trainings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Erro ao buscar treinamentos:', fetchError);
        setError('Erro ao carregar treinamentos');
        return;
      }

      // Converter os dados para o tipo Training
      const convertedTrainings = (data || []).map(convertToTraining);
      setTrainings(convertedTrainings);
    } catch (err) {
      console.error('Erro inesperado:', err);
      setError('Erro inesperado ao carregar treinamentos');
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
      return false;
    }

    try {
      const { data, error: createError } = await supabase
        .from('trainings')
        .insert([{
          ...trainingData,
          user_id: user.id,
          status: 'active',
          participants: 0
        }])
        .select()
        .single();

      if (createError) {
        toast({
          title: "Erro",
          description: "Erro ao criar treinamento",
          variant: "destructive"
        });
        return false;
      }

      if (data) {
        // Converter o novo treinamento para o tipo Training
        const newTraining = convertToTraining(data);
        setTrainings(prev => [newTraining, ...prev]);
        toast({
          title: "Sucesso",
          description: "Treinamento criado com sucesso!",
        });
        return true;
      }

      return false;
    } catch (err) {
      toast({
        title: "Erro",
        description: "Erro ao criar treinamento",
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
