
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { FounderKPICards } from '@/components/founder/FounderKPICards';
import { FounderOverviewTab } from '@/components/founder/FounderOverviewTab';
import { FounderRevenueTab } from '@/components/founder/FounderRevenueTab';
import { FounderEngagementTab } from '@/components/founder/FounderEngagementTab';
import { FounderReportsTab } from '@/components/founder/FounderReportsTab';
import { FounderDocumentationTab } from '@/components/founder/FounderDocumentationTab';
import { FounderDashboardHeader } from '@/components/founder/FounderDashboardHeader';
import { useAuth } from '@/contexts/AuthContext';
import type { FounderAnalytics, RevenueChartData, ChurnAnalysis, Company, CustomerHealthScore } from '@/types/founder';

export default function FounderDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<FounderAnalytics | null>(null);
  const [revenueChart, setRevenueChart] = useState<RevenueChartData[]>([]);
  const [churnAnalysis, setChurnAnalysis] = useState<ChurnAnalysis[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [healthScores, setHealthScores] = useState<CustomerHealthScore[]>([]);

  useEffect(() => {
    loadFounderData();
  }, [user]);

  const loadFounderData = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      // Mock data - in real app this would come from Supabase
      const mockAnalytics: FounderAnalytics = {
        revenue: {
          total_mrr: 15420,
          total_arr: 185040,
          mrr_growth: 12.5,
          churn_rate: 2.1,
          ltv: 4800,
          cac: 120
        },
        customers: {
          total_customers: 145,
          active_customers: 138,
          trial_customers: 12,
          churned_customers: 7,
          new_customers_this_month: 18
        },
        engagement: {
          dau: 89,
          mau: 125,
          avg_session_duration: 24,
          feature_adoption_rate: 76
        },
        health: {
          healthy_customers: 118,
          at_risk_customers: 20,
          critical_customers: 7,
          avg_health_score: 78
        }
      };

      const mockRevenueChart: RevenueChartData[] = [
        { month: 'Jan', mrr: 12500, arr: 150000, customers: 120, churn_rate: 2.5 },
        { month: 'Feb', mrr: 13200, arr: 158400, customers: 128, churn_rate: 2.3 },
        { month: 'Mar', mrr: 14100, arr: 169200, customers: 135, churn_rate: 2.1 },
        { month: 'Abr', mrr: 14800, arr: 177600, customers: 142, churn_rate: 1.9 },
        { month: 'Mai', mrr: 15420, arr: 185040, customers: 145, churn_rate: 2.1 },
      ];

      const mockChurnAnalysis: ChurnAnalysis[] = [
        {
          period: 'Janeiro',
          churned: 3,
          total: 120,
          rate: 2.5,
          reasons: [
            { reason: 'Preço alto', count: 1, percentage: 33.3 },
            { reason: 'Funcionalidades limitadas', count: 2, percentage: 66.7 }
          ]
        }
      ];

      const mockCompanies: Company[] = [
        {
          id: '1',
          name: 'TechStart Inc',
          domain: 'techstart.com',
          plan_type: 'professional',
          mrr: 299,
          arr: 3588,
          status: 'active',
          trial_ends_at: null,
          subscription_started_at: '2024-01-15T00:00:00Z',
          created_at: '2024-01-15T00:00:00Z',
          updated_at: '2024-01-15T00:00:00Z'
        }
      ];

      const mockHealthScores: CustomerHealthScore[] = [
        {
          company_id: '1',
          health_score: 78,
          last_activity: '2024-01-15T00:00:00Z',
          factors: {
            usage: 85,
            engagement: 75,
            support_tickets: 90,
            payment_status: 100
          }
        }
      ];

      setAnalytics(mockAnalytics);
      setRevenueChart(mockRevenueChart);
      setChurnAnalysis(mockChurnAnalysis);
      setCompanies(mockCompanies);
      setHealthScores(mockHealthScores);

    } catch (error) {
      console.error('Erro ao carregar dados do founder:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadFounderData();
  };

  const exportToCSV = (data: any[], filename: string) => {
    console.log('Exporting to CSV:', filename, data);
    // Mock CSV export functionality
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!analytics) {
    return (
      <DashboardLayout>
        <div className="text-center p-8">
          <h2 className="text-xl font-semibold mb-2">Dados não disponíveis</h2>
          <p className="text-muted-foreground">Não foi possível carregar os dados do dashboard.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <FounderDashboardHeader 
          onRefetch={handleRefresh}
          onExport={exportToCSV}
          companies={companies}
        />
        
        <FounderKPICards analytics={analytics} />

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="revenue">Receita</TabsTrigger>
            <TabsTrigger value="engagement">Engajamento</TabsTrigger>
            <TabsTrigger value="reports">Relatórios</TabsTrigger>
            <TabsTrigger value="docs">Documentação</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <FounderOverviewTab 
              analytics={analytics}
              revenueChart={revenueChart}
            />
          </TabsContent>

          <TabsContent value="revenue">
            <FounderRevenueTab 
              revenueChart={revenueChart}
              churnAnalysis={churnAnalysis}
              companies={companies}
            />
          </TabsContent>

          <TabsContent value="engagement">
            <FounderEngagementTab analytics={analytics} />
          </TabsContent>

          <TabsContent value="reports">
            <FounderReportsTab 
              companies={companies}
              healthScores={healthScores}
              churnAnalysis={churnAnalysis}
              exportToCSV={exportToCSV}
            />
          </TabsContent>

          <TabsContent value="docs">
            <FounderDocumentationTab />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
