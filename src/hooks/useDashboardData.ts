
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface DashboardStats {
  totalCollaborators: number;
  activeProcesses: number;
  completionRate: number;
  gamificationPoints: number;
}

interface RecentActivity {
  id: string;
  type: string;
  description: string;
  created_at: string;
  entity_type?: string;
  entity_id?: string;
}

interface PendingTask {
  id: number;
  title: string;
  priority: 'high' | 'medium' | 'low';
  deadline: string;
}

interface TrendData {
  date: string;
  value: number;
}

interface DashboardData {
  stats: DashboardStats;
  recentActivities: RecentActivity[];
  pendingTasks: PendingTask[];
  trends: TrendData[];
}

export const useDashboardData = () => {
  const [data, setData] = useState<DashboardData>({
    stats: {
      totalCollaborators: 0,
      activeProcesses: 0,
      completionRate: 0,
      gamificationPoints: 100
    },
    recentActivities: [],
    pendingTasks: [],
    trends: []
  });
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

      // Processos ativos de onboarding
      const { count: activeProcesses } = await supabase
        .from('onboarding_processes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .in('status', ['in_progress', 'pending']);

      // Taxa de conclusão (usando training enrollments como proxy)
      const { count: totalEnrollments } = await supabase
        .from('training_enrollments')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      const { count: completedEnrollments } = await supabase
        .from('training_enrollments')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'completed');

      const completionRate = totalEnrollments ? Math.round((completedEnrollments || 0) / totalEnrollments * 100) : 0;

      // Pontos de gamificação do localStorage
      const gamificationData = localStorage.getItem(`@humansys:gamification-${user.id}`);
      const gamificationPoints = gamificationData ? JSON.parse(gamificationData).totalPoints || 100 : 100;

      setData(prev => ({
        ...prev,
        stats: {
          totalCollaborators: totalCollaborators || 0,
          activeProcesses: activeProcesses || 0,
          completionRate,
          gamificationPoints
        }
      }));

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
      const { data: activities, error } = await supabase
        .from('system_activities')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      
      setData(prev => ({
        ...prev,
        recentActivities: activities || []
      }));
    } catch (error) {
      console.error('Erro ao carregar atividades:', error);
    }
  };

  const fetchPendingTasks = async () => {
    // Mock data para tarefas pendentes
    const mockTasks: PendingTask[] = [
      {
        id: 1,
        title: "Revisar feedback de João Silva",
        priority: "high",
        deadline: "Hoje"
      },
      {
        id: 2,
        title: "Aprovar certificado de Maria",
        priority: "medium",
        deadline: "Amanhã"
      },
      {
        id: 3,
        title: "Atualizar meta trimestral",
        priority: "low",
        deadline: "Esta semana"
      }
    ];

    setData(prev => ({
      ...prev,
      pendingTasks: mockTasks
    }));
  };

  const fetchTrends = async () => {
    // Mock data para trends with correct date format
    const mockTrends: TrendData[] = [
      { date: '2024-01-01', value: 65 },
      { date: '2024-02-01', value: 70 },
      { date: '2024-03-01', value: 68 },
      { date: '2024-04-01', value: 75 },
      { date: '2024-05-01', value: 80 },
      { date: '2024-06-01', value: 85 }
    ];

    setData(prev => ({
      ...prev,
      trends: mockTrends
    }));
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
      fetchPendingTasks();
      fetchTrends();
    }
  }, [user]);

  return {
    data,
    isLoading,
    refetch: fetchDashboardStats,
    logActivity
  };
};
