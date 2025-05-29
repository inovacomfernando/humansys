
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useOptimizedFounderAnalytics } from '@/hooks/useOptimizedFounderAnalytics';
import { CustomerHealthTable } from '@/components/founder/CustomerHealthTable';
import { FounderDashboardHeader } from '@/components/founder/FounderDashboardHeader';
import { FounderKPICards } from '@/components/founder/FounderKPICards';
import { FounderOverviewTab } from '@/components/founder/FounderOverviewTab';
import { FounderRevenueTab } from '@/components/founder/FounderRevenueTab';
import { FounderEngagementTab } from '@/components/founder/FounderEngagementTab';
import { FounderReportsTab } from '@/components/founder/FounderReportsTab';
import { FounderDocumentationTab } from '@/components/founder/FounderDocumentationTab';
import { KPICardsSkeleton, TabsContentSkeleton } from '@/components/common/SkeletonCards';
import { Crown, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

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
    exportToCSV,
    cacheStats
  } = useOptimizedFounderAnalytics();
  
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const navigate = useNavigate();

  // Mostra skeleton enquanto carrega
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <KPICardsSkeleton />
          <TabsContentSkeleton />
        </div>
      </DashboardLayout>
    );
  }

  // Bloqueia acesso se não for founder
  if (!isFounder) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Card className="p-8 text-center max-w-md">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Acesso Restrito</h2>
            <p className="text-muted-foreground mb-4">
              Este dashboard é exclusivo para usuários com role de Founder.
            </p>
            <Button onClick={() => navigate('/app/dashboard')} className="w-full">
              Ir para Dashboard Principal
            </Button>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <FounderDashboardHeader 
          onRefetch={refetch}
          onExport={exportToCSV}
          companies={companies}
        />

        <FounderKPICards analytics={analytics} />

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="revenue">Receita</TabsTrigger>
            <TabsTrigger value="customers">Clientes</TabsTrigger>
            <TabsTrigger value="engagement">Engajamento</TabsTrigger>
            <TabsTrigger value="reports">Relatórios</TabsTrigger>
            <TabsTrigger value="documentation">Documentação</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <FounderOverviewTab 
              analytics={analytics} 
              revenueChart={revenueChart} 
            />
          </TabsContent>

          <TabsContent value="revenue" className="space-y-6">
            <FounderRevenueTab 
              revenueChart={revenueChart}
              churnAnalysis={churnAnalysis}
              companies={companies}
            />
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            <CustomerHealthTable healthScores={healthScores} />
          </TabsContent>

          <TabsContent value="engagement" className="space-y-6">
            <FounderEngagementTab analytics={analytics} />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <FounderReportsTab 
              companies={companies}
              healthScores={healthScores}
              churnAnalysis={churnAnalysis}
              exportToCSV={exportToCSV}
            />
          </TabsContent>

          <TabsContent value="documentation" className="space-y-6">
            <FounderDocumentationTab />
          </TabsContent>
        </Tabs>

        {/* Debug info em desenvolvimento */}
        {process.env.NODE_ENV === 'development' && cacheStats && (
          <Card className="p-4 bg-muted/50">
            <p className="text-sm text-muted-foreground">
              Cache: {cacheStats.hits} hits, {cacheStats.misses} misses 
              ({cacheStats.hitRate.toFixed(1)}% hit rate)
            </p>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};
