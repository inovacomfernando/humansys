
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface DashboardStats {
  totalCollaborators: number;
  newHires: number;
  pendingFeedbacks: number;
  completedGoals: number;
}

interface RecentActivity {
  id: string;
  type: string;
  description: string;
  created_at: string;
  entity_type?: string;
  entity_id?: string;
}

export const useDashboardData = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalCollaborators: 0,
    newHires: 0,
    pendingFeedbacks: 0,
    completedGoals: 0
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchDashboardStats = async () => {
    if (!user) return;

    try {
      setIsLoading(true);

      // Total de colaboradores
      const { count: totalCollaborators } = await supabase
        .from('collaborators')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Novos contratados (último mês)
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      
      const { count: newHires } = await supabase
        .from('collaborators')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', lastMonth.toISOString());

      // Feedbacks pendentes
      const { count: pendingFeedbacks } = await supabase
        .from('feedbacks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'sent');

      // Metas concluídas (usando training enrollments como proxy)
      const { count: completedGoals } = await supabase
        .from('training_enrollments')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'completed');

      setStats({
        totalCollaborators: totalCollaborators || 0,
        newHires: newHires || 0,
        pendingFeedbacks: pendingFeedbacks || 0,
        completedGoals: completedGoals || 0
      });

    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as estatísticas do dashboard.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecentActivities = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('system_activities')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setRecentActivities(data || []);
    } catch (error) {
      console.error('Erro ao carregar atividades:', error);
    }
  };

  const logActivity = async (type: string, description: string, entityType?: string, entityId?: string) => {
    if (!user) return;

    try {
      await supabase
        .from('system_activities')
        .insert([{
          type,
          description,
          entity_type: entityType,
          entity_id: entityId,
          user_id: user.id
        }]);

      fetchRecentActivities();
    } catch (error) {
      console.error('Erro ao registrar atividade:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboardStats();
      fetchRecentActivities();
    }
  }, [user]);

  return {
    stats,
    recentActivities,
    isLoading,
    refetch: fetchDashboardStats,
    logActivity
  };
};
