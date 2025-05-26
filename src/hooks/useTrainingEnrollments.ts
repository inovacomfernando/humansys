
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface TrainingEnrollment {
  id: string;
  training_id: string;
  collaborator_id: string;
  enrolled_at: string;
  status: 'enrolled' | 'in_progress' | 'completed' | 'dropped';
  progress: number;
  completed_at?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  collaborator?: {
    id: string;
    name: string;
    email: string;
  };
  training?: {
    id: string;
    title: string;
    description: string;
  };
}

export const useTrainingEnrollments = () => {
  const [enrollments, setEnrollments] = useState<TrainingEnrollment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchEnrollments = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('training_enrollments')
        .select(`
          *,
          collaborator:collaborators(id, name, email),
          training:trainings(id, title, description)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEnrollments(data || []);
    } catch (error) {
      console.error('Erro ao carregar matrículas:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as matrículas.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const enrollCollaborator = async (trainingId: string, collaboratorId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('training_enrollments')
        .insert([{
          training_id: trainingId,
          collaborator_id: collaboratorId,
          user_id: user.id,
          status: 'enrolled'
        }]);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Colaborador matriculado no treinamento!"
      });

      fetchEnrollments();
      return true;
    } catch (error: any) {
      console.error('Erro ao matricular colaborador:', error);
      
      if (error.code === '23505') {
        toast({
          title: "Aviso",
          description: "Este colaborador já está matriculado neste treinamento.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível matricular o colaborador.",
          variant: "destructive"
        });
      }
      return false;
    }
  };

  const updateEnrollmentStatus = async (enrollmentId: string, status: TrainingEnrollment['status'], progress?: number) => {
    if (!user) return false;

    try {
      const updateData: any = { status };
      if (progress !== undefined) updateData.progress = progress;
      if (status === 'completed') updateData.completed_at = new Date().toISOString();

      const { error } = await supabase
        .from('training_enrollments')
        .update(updateData)
        .eq('id', enrollmentId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Status do treinamento atualizado!"
      });

      fetchEnrollments();
      return true;
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status.",
        variant: "destructive"
      });
      return false;
    }
  };

  const getEnrollmentsByTraining = (trainingId: string) => {
    return enrollments.filter(enrollment => enrollment.training_id === trainingId);
  };

  useEffect(() => {
    if (user) {
      fetchEnrollments();
    }
  }, [user]);

  return {
    enrollments,
    isLoading,
    enrollCollaborator,
    updateEnrollmentStatus,
    getEnrollmentsByTraining,
    refetch: fetchEnrollments
  };
};
