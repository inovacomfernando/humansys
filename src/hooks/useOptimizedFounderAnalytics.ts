
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useOptimizedCache } from './useOptimizedCache';
import { 
  FounderAnalytics, 
  Company, 
  CustomerHealthScore, 
  RevenueChartData, 
  ChurnAnalysis
} from '@/types/founder';
import { founderAnalyticsService } from '@/services/founderAnalyticsService';
import { analyticsCalculators } from '@/utils/founderAnalyticsCalculators';
import { csvExporter } from '@/utils/csvExporter';

export const useOptimizedFounderAnalytics = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const cache = useOptimizedCache<any>(10 * 60 * 1000); // 10 minutos TTL
  
  const [analytics, setAnalytics] = useState<FounderAnalytics>({
    revenue: { total_mrr: 0, total_arr: 0, mrr_growth: 0, churn_rate: 0, ltv: 0, cac: 0 },
    customers: { total_customers: 0, active_customers: 0, trial_customers: 0, churned_customers: 0, new_customers_this_month: 0 },
    engagement: { dau: 0, mau: 0, avg_session_duration: 0, feature_adoption_rate: 0 },
    health: { healthy_customers: 0, at_risk_customers: 0, critical_customers: 0, avg_health_score: 0 }
  });
  
  const [companies, setCompanies] = useState<Company[]>([]);
  const [healthScores, setHealthScores] = useState<CustomerHealthScore[]>([]);
  const [revenueChart, setRevenueChart] = useState<RevenueChartData[]>([]);
  const [churnAnalysis, setChurnAnalysis] = useState<ChurnAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFounder, setIsFounder] = useState(false);

  // Verificar role de founder de forma otimizada
  const checkFounderRole = useCallback(async () => {
    if (!user?.id) return false;
    
    // Verificar cache local primeiro
    const cacheKey = `founder-role-${user.id}`;
    const cachedRole = cache.get(cacheKey);
    if (cachedRole !== null) {
      return cachedRole;
    }

    // Verificar localStorage como fallback rápido
    const localRole = localStorage.getItem(`@humansys:founder-role-${user.id}`);
    if (localRole) {
      const isFounderLocal = localRole === 'true';
      cache.set(cacheKey, isFounderLocal, 30 * 60 * 1000); // 30 min cache
      return isFounderLocal;
    }

    try {
      const hasRole = await founderAnalyticsService.checkFounderRole(user.id);
      cache.set(cacheKey, hasRole, 30 * 60 * 1000);
      localStorage.setItem(`@humansys:founder-role-${user.id}`, String(hasRole));
      return hasRole;
    } catch (error) {
      console.error('Error checking founder role:', error);
      return false;
    }
  }, [user?.id, cache]);

  // Carregar dados de forma otimizada e paralela
  const loadAnalyticsData = useCallback(async () => {
    if (!user?.id) return;
    
    const cacheKey = `analytics-${user.id}`;
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
      console.log('Analytics: Usando dados do cache');
      setCompanies(cachedData.companies || []);
      setHealthScores(cachedData.healthScores || []);
      setAnalytics(cachedData.analytics);
      setRevenueChart(cachedData.revenueChart || []);
      setChurnAnalysis(cachedData.churnAnalysis || []);
      return;
    }

    try {
      console.log('Analytics: Carregando dados frescos...');
      
      // Carregar dados básicos em paralelo
      const [companiesData, healthData] = await Promise.all([
        founderAnalyticsService.loadCompanies(),
        founderAnalyticsService.loadHealthScores()
      ]);
      
      // Calcular analytics localmente (mais rápido)
      const revenueAnalytics = analyticsCalculators.calculateRevenueAnalytics(companiesData);
      const customerAnalytics = analyticsCalculators.calculateCustomerAnalytics(companiesData);
      const healthAnalytics = analyticsCalculators.calculateHealthAnalytics(healthData);
      const engagementAnalytics = analyticsCalculators.getMockEngagementAnalytics();
      
      const calculatedAnalytics = {
        revenue: revenueAnalytics,
        customers: customerAnalytics,
        engagement: engagementAnalytics,
        health: healthAnalytics
      };

      // Gerar charts em background
      const [revenueChartData, churnAnalysisData] = await Promise.all([
        founderAnalyticsService.generateRevenueChart(),
        founderAnalyticsService.calculateChurnAnalysis()
      ]);

      const result = {
        companies: companiesData,
        healthScores: healthData,
        analytics: calculatedAnalytics,
        revenueChart: revenueChartData,
        churnAnalysis: churnAnalysisData
      };

      // Atualizar estado
      setCompanies(companiesData);
      setHealthScores(healthData);
      setAnalytics(calculatedAnalytics);
      setRevenueChart(revenueChartData);
      setChurnAnalysis(churnAnalysisData);

      // Cache por 5 minutos
      cache.set(cacheKey, result, 5 * 60 * 1000);
      
    } catch (error) {
      console.error('Error loading analytics:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar analytics.",
        variant: "destructive"
      });
    }
  }, [user?.id, cache, toast]);

  // Inicialização otimizada
  useEffect(() => {
    const initializeFounderDashboard = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // Verificar role primeiro
       const hasFounderRole = await checkFounderRole();
      setIsFounder(hasFounderRole);
      setIsLoading(false); // Libera painel logo após identificar founder
      if (hasFounderRole) {
         // Carrega dados em background, não trava o painel
          loadAnalyticsData(); // Não precisa de await
         }
      }
    };

    initializeFounderDashboard();
  }, [user?.id, checkFounderRole, loadAnalyticsData]);

  const refetch = useCallback(async () => {
    if (!user?.id) return;
    
    // Limpar cache para forçar reload
    cache.clear();
    localStorage.removeItem(`@humansys:founder-role-${user.id}`);
    
    await loadAnalyticsData();
  }, [user?.id, cache, loadAnalyticsData]);

  return {
    analytics,
    companies,
    healthScores,
    revenueChart,
    churnAnalysis,
    isLoading,
    isFounder,
    refetch,
    exportToCSV: csvExporter.exportToCSV,
    cacheStats: cache.stats
  };
};
