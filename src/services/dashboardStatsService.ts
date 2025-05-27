
import { supabase } from '@/integrations/supabase/client';
import { DashboardStats } from '@/types/dashboard';

export const fetchDashboardStats = async (userId: string): Promise<DashboardStats> => {
  // Total de colaboradores
  const { count: totalCollaborators } = await supabase
    .from('collaborators')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  // Processos ativos de onboarding
  const { count: activeProcesses } = await supabase
    .from('onboarding_processes')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .in('status', ['in_progress', 'pending']);

  // Taxa de conclusão (usando training enrollments como proxy)
  const { count: totalEnrollments } = await supabase
    .from('training_enrollments')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  const { count: completedEnrollments } = await supabase
    .from('training_enrollments')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'completed');

  const completionRate = totalEnrollments ? Math.round((completedEnrollments || 0) / totalEnrollments * 100) : 0;

  // Pontos de gamificação do localStorage
  const gamificationData = localStorage.getItem(`@humansys:gamification-${userId}`);
  const gamificationPoints = gamificationData ? JSON.parse(gamificationData).totalPoints || 100 : 100;

  return {
    totalCollaborators: totalCollaborators || 0,
    activeProcesses: activeProcesses || 0,
    completionRate,
    gamificationPoints
  };
};
