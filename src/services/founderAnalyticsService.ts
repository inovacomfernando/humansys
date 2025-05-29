
import { supabase } from '@/integrations/supabase/client';
import { Company, CustomerHealthScore, RevenueChartData, ChurnAnalysis } from '@/types/founder';

export const founderAnalyticsService = {
  // Load all companies
  async loadCompanies(): Promise<Company[]> {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error loading companies:', error);
      throw error;
    }
  },

  // Load customer health scores
  async loadHealthScores(): Promise<CustomerHealthScore[]> {
    try {
      const { data, error } = await supabase
        .from('customer_health_scores')
        .select(`
          *,
          company:companies(*)
        `)
        .order('health_score', { ascending: false });
      
      if (error) throw error;
      
      // Type assertion with proper churn_risk typing
      const typedData = (data || []).map(item => ({
        ...item,
        churn_risk: item.churn_risk as 'low' | 'medium' | 'high'
      })) as CustomerHealthScore[];
      
      return typedData;
    } catch (error) {
      console.error('Error loading health scores:', error);
      return [];
    }
  },

  // Generate revenue chart data
  async generateRevenueChart(): Promise<RevenueChartData[]> {
    try {
      const { data, error } = await supabase.rpc('calculate_mrr');
      
      if (error) throw error;
      
      const chartData: RevenueChartData[] = (data || []).map((item: any) => ({
        month: new Date(item.month).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
        mrr: parseFloat(item.total_mrr || '0'),
        arr: parseFloat(item.total_mrr || '0') * 12,
        customers: 0, // Will be calculated separately
        churn_rate: 0 // Will be calculated separately
      }));
      
      return chartData;
    } catch (error) {
      console.error('Error generating revenue chart:', error);
      return [];
    }
  },

  // Calculate churn analysis
  async calculateChurnAnalysis(): Promise<ChurnAnalysis[]> {
    try {
      const periods = [1, 3, 6, 12]; // months
      const analysis: ChurnAnalysis[] = [];
      
      for (const period of periods) {
        const { data, error } = await supabase.rpc('get_churn_rate', { period_months: period });
        
        if (error) throw error;
        
        analysis.push({
          period: `${period} ${period === 1 ? 'mês' : 'meses'}`,
          churned: 0, // Mock data
          total: 0, // Will be set from companies
          rate: parseFloat(String(data || 0)),
          reasons: [
            { reason: 'Preço alto', count: 3, percentage: 30 },
            { reason: 'Falta de recursos', count: 2, percentage: 20 },
            { reason: 'Suporte ruim', count: 1, percentage: 10 },
            { reason: 'Outros', count: 4, percentage: 40 }
          ]
        });
      }
      
      return analysis;
    } catch (error) {
      console.error('Error calculating churn analysis:', error);
      return [];
    }
  },

  // Check if user has founder role
  async checkFounderRole(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
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
  }
};
