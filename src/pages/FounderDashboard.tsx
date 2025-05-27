
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useFounderAnalytics } from '@/hooks/useFounderAnalytics';
import { RevenueChart } from '@/components/founder/RevenueChart';
import { CustomerHealthTable } from '@/components/founder/CustomerHealthTable';
import { ChurnAnalysisChart } from '@/components/founder/ChurnAnalysisChart';
import { EngagementMetrics } from '@/components/founder/EngagementMetrics';
import { CompanyOverview } from '@/components/founder/CompanyOverview';
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  AlertTriangle,
  Download,
  RefreshCw,
  Crown,
  BarChart3,
  Activity,
  Target,
  Zap
} from 'lucide-react';

export const FounderDashboard = () => {
  const { 
    analytics, 
    companies, 
    healthScores, 
    revenueChart, 
    churnAnalysis,
    isLoading, 
    isFounder, 
    refetch,
    exportToCSV 
  } = useFounderAnalytics();
  
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  if (!isFounder) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Card className="p-8 text-center">
            <Crown className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Acesso Restrito</h2>
            <p className="text-muted-foreground">
              Este dashboard é exclusivo para usuários Founder.
            </p>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Carregando analytics executivos...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Crown className="h-8 w-8 text-yellow-500" />
              Dashboard Founder
            </h1>
            <p className="text-muted-foreground">
              Visão 360° do seu negócio e crescimento
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={refetch}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
            <Button onClick={() => exportToCSV(companies, 'companies-report')}>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">MRR Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {analytics.revenue.total_mrr.toLocaleString('pt-BR')}
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                +{analytics.revenue.mrr_growth.toFixed(1)}% este mês
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ARR Total</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {analytics.revenue.total_arr.toLocaleString('pt-BR')}
              </div>
              <div className="text-xs text-muted-foreground">
                LTV médio: R$ {analytics.revenue.ltv.toFixed(0)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics.customers.active_customers}
              </div>
              <div className="text-xs text-muted-foreground">
                +{analytics.customers.new_customers_this_month} novos este mês
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Health Score</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics.health.avg_health_score}%
              </div>
              <div className="text-xs text-muted-foreground">
                {analytics.health.at_risk_customers} em risco
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="revenue">Receita</TabsTrigger>
            <TabsTrigger value="customers">Clientes</TabsTrigger>
            <TabsTrigger value="engagement">Engajamento</TabsTrigger>
            <TabsTrigger value="reports">Relatórios</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <RevenueChart data={revenueChart} />
              </div>
              <div className="space-y-6">
                <EngagementMetrics analytics={analytics.engagement} />
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Alerta de Churn</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Clientes em Risco</span>
                        <Badge variant="destructive">
                          {analytics.health.at_risk_customers}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Críticos</span>
                        <Badge variant="destructive">
                          {analytics.health.critical_customers}
                        </Badge>
                      </div>
                      <Progress 
                        value={(analytics.health.healthy_customers / (analytics.health.healthy_customers + analytics.health.at_risk_customers + analytics.health.critical_customers)) * 100} 
                        className="w-full"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="revenue" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <RevenueChart data={revenueChart} />
              <ChurnAnalysisChart data={churnAnalysis} />
            </div>
            
            <CompanyOverview companies={companies} />
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            <CustomerHealthTable healthScores={healthScores} />
          </TabsContent>

          <TabsContent value="engagement" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <EngagementMetrics analytics={analytics.engagement} />
              
              <Card>
                <CardHeader>
                  <CardTitle>Adoção de Features</CardTitle>
                  <CardDescription>
                    Principais funcionalidades utilizadas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Dashboard</span>
                      <span className="text-sm font-medium">95%</span>
                    </div>
                    <Progress value={95} />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Relatórios</span>
                      <span className="text-sm font-medium">78%</span>
                    </div>
                    <Progress value={78} />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Analytics</span>
                      <span className="text-sm font-medium">65%</span>
                    </div>
                    <Progress value={65} />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">API</span>
                      <span className="text-sm font-medium">42%</span>
                    </div>
                    <Progress value={42} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Relatórios Executivos</CardTitle>
                  <CardDescription>
                    Relatórios automatizados para tomada de decisão
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => exportToCSV(companies, 'monthly-revenue-report')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Relatório Mensal de Receita
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => exportToCSV(healthScores, 'customer-health-report')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Análise de Health Score
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => exportToCSV(churnAnalysis, 'churn-analysis-report')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Análise de Churn
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Insights de IA</CardTitle>
                  <CardDescription>
                    Recomendações baseadas em dados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                      <div className="flex items-center mb-2">
                        <Zap className="h-4 w-4 text-blue-500 mr-2" />
                        <span className="font-medium">Oportunidade de Upsell</span>
                      </div>
                      <p className="text-sm text-blue-700">
                        3 clientes do plano básico estão usando 90%+ dos recursos. 
                        Potencial de upgrade.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                      <div className="flex items-center mb-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
                        <span className="font-medium">Risco de Churn</span>
                      </div>
                      <p className="text-sm text-yellow-700">
                        2 clientes com baixo engajamento nos últimos 7 dias. 
                        Intervenção recomendada.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                      <div className="flex items-center mb-2">
                        <Target className="h-4 w-4 text-green-500 mr-2" />
                        <span className="font-medium">Meta de Crescimento</span>
                      </div>
                      <p className="text-sm text-green-700">
                        Crescimento de 15% MRR está acima da meta mensal. 
                        Parabéns pelo resultado!
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};
