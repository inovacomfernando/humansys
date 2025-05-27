
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  FounderAnalytics, 
  Company, 
  CustomerHealthScore, 
  RevenueChartData, 
  ChurnAnalysis,
  RevenueEvent,
  UserActivityLog 
} from '@/types/founder';

export const useFounderAnalytics = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [analytics, setAnalytics] = useState<FounderAnalytics>({
    revenue: {
      total_mrr: 0,
      total_arr: 0,
      mrr_growth: 0,
      churn_rate: 0,
      ltv: 0,
      cac: 0
    },
    customers: {
      total_customers: 0,
      active_customers: 0,
      trial_customers: 0,
      churned_customers: 0,
      new_customers_this_month: 0
    },
    engagement: {
      dau: 0,
      mau: 0,
      avg_session_duration: 0,
      feature_adoption_rate: 0
    },
    health: {
      healthy_customers: 0,
      at_risk_customers: 0,
      critical_customers: 0,
      avg_health_score: 0
    }
  });
  
  const [companies, setCompanies] = useState<Company[]>([]);
  const [healthScores, setHealthScores] = useState<CustomerHealthScore[]>([]);
  const [revenueChart, setRevenueChart] = useState<RevenueChartData[]>([]);
  const [churnAnalysis, setChurnAnalysis] = useState<ChurnAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFounder, setIsFounder] = useState(false);

  // Check if user has founder role
  const checkFounderRole = async () => {
    if (!user) return false;
    
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'founder')
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error checking founder role:', error);
        return false;
      }
      
      return !!data;
    } catch (error) {
      console.error('Error checking founder role:', error);
      return false;
    }
  };

  // Load all companies
  const loadCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setCompanies(data || []);
      return data || [];
    } catch (error) {
      console.error('Error loading companies:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar dados das empresas.",
        variant: "destructive"
      });
      return [];
    }
  };

  // Load customer health scores
  const loadHealthScores = async () => {
    try {
      const { data, error } = await supabase
        .from('customer_health_scores')
        .select(`
          *,
          company:companies(*)
        `)
        .order('health_score', { ascending: false });
      
      if (error) throw error;
      setHealthScores(data || []);
      return data || [];
    } catch (error) {
      console.error('Error loading health scores:', error);
      return [];
    }
  };

  // Calculate revenue analytics
  const calculateRevenueAnalytics = (companies: Company[]) => {
    const activeCompanies = companies.filter(c => c.status === 'active');
    const total_mrr = activeCompanies.reduce((sum, c) => sum + (c.mrr || 0), 0);
    const total_arr = total_mrr * 12;
    
    // Calculate MRR growth (mock calculation)
    const mrr_growth = Math.round((total_mrr * 0.15) * 100) / 100; // 15% growth assumption
    
    return {
      total_mrr,
      total_arr,
      mrr_growth,
      churn_rate: 0, // Will be calculated from function
      ltv: total_arr / activeCompanies.length || 0,
      cac: 150 // Mock CAC
    };
  };

  // Calculate customer analytics
  const calculateCustomerAnalytics = (companies: Company[]) => {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    return {
      total_customers: companies.length,
      active_customers: companies.filter(c => c.status === 'active').length,
      trial_customers: companies.filter(c => c.trial_ends_at && new Date(c.trial_ends_at) > now).length,
      churned_customers: companies.filter(c => c.status === 'churned').length,
      new_customers_this_month: companies.filter(c => 
        new Date(c.created_at) >= thisMonth
      ).length
    };
  };

  // Calculate health analytics
  const calculateHealthAnalytics = (healthScores: CustomerHealthScore[]) => {
    if (healthScores.length === 0) {
      return {
        healthy_customers: 0,
        at_risk_customers: 0,
        critical_customers: 0,
        avg_health_score: 0
      };
    }

    const healthy = healthScores.filter(h => h.health_score >= 70).length;
    const at_risk = healthScores.filter(h => h.health_score >= 40 && h.health_score < 70).length;
    const critical = healthScores.filter(h => h.health_score < 40).length;
    const avg_score = healthScores.reduce((sum, h) => sum + h.health_score, 0) / healthScores.length;

    return {
      healthy_customers: healthy,
      at_risk_customers: at_risk,
      critical_customers: critical,
      avg_health_score: Math.round(avg_score)
    };
  };

  // Generate revenue chart data
  const generateRevenueChart = async () => {
    try {
      const { data, error } = await supabase.rpc('calculate_mrr');
      
      if (error) throw error;
      
      const chartData: RevenueChartData[] = (data || []).map((item: any) => ({
        month: new Date(item.month).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
        mrr: parseFloat(item.total_mrr || 0),
        arr: parseFloat(item.total_mrr || 0) * 12,
        customers: 0, // Will be calculated separately
        churn_rate: 0 // Will be calculated separately
      }));
      
      setRevenueChart(chartData);
    } catch (error) {
      console.error('Error generating revenue chart:', error);
    }
  };

  // Calculate churn analysis
  const calculateChurnAnalysis = async () => {
    try {
      const periods = [1, 3, 6, 12]; // months
      const analysis: ChurnAnalysis[] = [];
      
      for (const period of periods) {
        const { data, error } = await supabase.rpc('get_churn_rate', { period_months: period });
        
        if (error) throw error;
        
        analysis.push({
          period: `${period} ${period === 1 ? 'mês' : 'meses'}`,
          churned: 0, // Mock data
          total: companies.length,
          rate: parseFloat(data || 0),
          reasons: [
            { reason: 'Preço alto', count: 3, percentage: 30 },
            { reason: 'Falta de recursos', count: 2, percentage: 20 },
            { reason: 'Suporte ruim', count: 1, percentage: 10 },
            { reason: 'Outros', count: 4, percentage: 40 }
          ]
        });
      }
      
      setChurnAnalysis(analysis);
    } catch (error) {
      console.error('Error calculating churn analysis:', error);
    }
  };

  // Load all analytics data
  const loadAllAnalytics = async () => {
    if (!isFounder) return;
    
    setIsLoading(true);
    try {
      const [companiesData, healthData] = await Promise.all([
        loadCompanies(),
        loadHealthScores()
      ]);
      
      // Calculate analytics
      const revenueAnalytics = calculateRevenueAnalytics(companiesData);
      const customerAnalytics = calculateCustomerAnalytics(companiesData);
      const healthAnalytics = calculateHealthAnalytics(healthData);
      
      // Mock engagement data
      const engagementAnalytics = {
        dau: 450,
        mau: 2800,
        avg_session_duration: 25, // minutes
        feature_adoption_rate: 73 // percentage
      };
      
      setAnalytics({
        revenue: revenueAnalytics,
        customers: customerAnalytics,
        engagement: engagementAnalytics,
        health: healthAnalytics
      });
      
      // Generate charts
      await Promise.all([
        generateRevenueChart(),
        calculateChurnAnalysis()
      ]);
      
    } catch (error) {
      console.error('Error loading analytics:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar analytics.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Export data to CSV
  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;
    
    const headers = Object.keys(data[0]).join(',');
    const csvContent = [
      headers,
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Initialize
  useEffect(() => {
    const init = async () => {
      if (user) {
        const hasFounderRole = await checkFounderRole();
        setIsFounder(hasFounderRole);
        
        if (hasFounderRole) {
          await loadAllAnalytics();
        }
      }
    };
    
    init();
  }, [user]);

  return {
    analytics,
    companies,
    healthScores,
    revenueChart,
    churnAnalysis,
    isLoading,
    isFounder,
    refetch: loadAllAnalytics,
    exportToCSV
  };
};
