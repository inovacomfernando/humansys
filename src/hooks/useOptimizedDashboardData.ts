
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useOptimizedCache } from './useOptimizedCache';
import { DashboardData } from '@/types/dashboard';
import { fetchDashboardStats } from '@/services/dashboardStatsService';
import { fetchRecentActivities, logActivity as logActivityService } from '@/services/dashboardActivitiesService';
import { fetchPendingTasks, fetchTrends } from '@/services/dashboardDataService';
import { cacheTTLs } from '@/cacheConfig';

export const useOptimizedDashboardData = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const cache = useOptimizedCache<any>(cacheTTLs.cacheDefault);

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

  // Carregar estatísticas com cache
  const loadDashboardStats = useCallback(async () => {
    if (!user?.id) return null;

    const cacheKey = `dashboard-stats-${user.id}`;
    const cachedStats = cache.get(cacheKey);

    if (cachedStats) {
      return cachedStats;
    }

    try {
      const stats = await fetchDashboardStats(user.id);
      cache.set(cacheKey, stats, cacheTTLs.dashboardStats);
      return stats;
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
      return null;
    }
  }, [user?.id, cache]);

  // Carregar atividades com cache
  const loadRecentActivities = useCallback(async () => {
    if (!user?.id) return [];

    const cacheKey = `activities-${user.id}`;
    const cachedActivities = cache.get(cacheKey);

    if (cachedActivities) {
      return cachedActivities;
    }

    try {
      const activities = await fetchRecentActivities(user.id);
      cache.set(cacheKey, activities, cacheTTLs.recentActivities);
      return activities;
    } catch (error) {
      console.error('Erro ao carregar atividades:', error);
      return [];
    }
  }, [user?.id, cache]);

  // Carregar tarefas (dados mock, cache mais longo)
  const loadPendingTasks = useCallback(async () => {
    const cacheKey = 'pending-tasks';
    const cachedTasks = cache.get(cacheKey);

    if (cachedTasks) {
      return cachedTasks;
    }

    try {
      const tasks = await fetchPendingTasks();
      cache.set(cacheKey, tasks, cacheTTLs.pendingTasks);
      return tasks;
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
      return [];
    }
  }, [cache]);

  // Carregar trends (dados mock, cache mais longo)
  const loadTrends = useCallback(async () => {
    const cacheKey = 'dashboard-trends';
    const cachedTrends = cache.get(cacheKey);

    if (cachedTrends) {
      return cachedTrends;
    }

    try {
      const trends = await fetchTrends();
      cache.set(cacheKey, trends, cacheTTLs.trends);
      return trends;
    } catch (error) {
      console.error('Erro ao carregar trends:', error);
      return [];
    }
  }, [cache]);

  // Carregar todos os dados de forma otimizada
  const loadAllData = useCallback(async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);

      // Carregar dados essenciais primeiro (stats e activities)
      const [stats, activities] = await Promise.all([
        loadDashboardStats(),
        loadRecentActivities()
      ]);

      // Atualizar com dados essenciais imediatamente
      setData(prev => ({
        ...prev,
        stats: stats || prev.stats,
        recentActivities: activities || prev.recentActivities
      }));

      // Carregar dados secundários em background
      const [tasks, trends] = await Promise.all([
        loadPendingTasks(),
        loadTrends()
      ]);

      // Atualizar com dados completos
      setData(prev => ({
        ...prev,
        pendingTasks: tasks,
        trends: trends
      }));

    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar alguns dados do dashboard.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, loadDashboardStats, loadRecentActivities, loadPendingTasks, loadTrends, toast]);

  // Log de atividade otimizado
  const logActivity = useCallback(
    async (
      type: string,
      description: string,
      entityType?: string,
      entityId?: string
    ) => {
      if (!user?.id) return;

      try {
        await logActivityService(user.id, type, description, entityType, entityId);

        // Invalidar cache de atividades para próximo carregamento
        const cacheKey = `activities-${user.id}`;
        cache.set(cacheKey, null, 0); // Expira imediatamente

        // Recarregar atividades
        const newActivities = await loadRecentActivities();
        setData(prev => ({
          ...prev,
          recentActivities: newActivities
        }));
      } catch (error) {
        console.error('Erro ao registrar atividade:', error);
      }
    },
    [user?.id, cache, loadRecentActivities]
  );

  // Carregar dados na inicialização
  useEffect(() => {
    if (user?.id) {
      loadAllData();
    } else {
      setIsLoading(false);
    }
  }, [user?.id, loadAllData]);

  // Estatísticas do cache para debug
  const cacheStats = useMemo(() => cache.stats, [cache.stats]);

  return {
    data,
    isLoading,
    refetch: loadAllData,
    logActivity,
    cacheStats
  };
};
