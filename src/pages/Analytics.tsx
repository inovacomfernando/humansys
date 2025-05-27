
import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  TrendingUp, 
  Users, 
  Target,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { SmartAlerts } from '@/components/analytics/SmartAlerts';
import { AutoReportGenerator } from '@/components/analytics/AutoReportGenerator';
import { 
  LazyPredictiveAnalytics,
  LazyEngagementAnalytics,
  LazyProductivityAnalytics,
  LazyMLInsights
} from '@/components/common/LazyWrapper';

export const Analytics = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Analytics Avançados</h1>
            <p className="text-muted-foreground">
              IA Preditiva e insights inteligentes para tomada de decisão estratégica
            </p>
          </div>
        </div>

        <Tabs defaultValue="predictive" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="predictive" className="flex items-center space-x-2">
              <Brain className="h-4 w-4" />
              <span>IA Preditiva</span>
            </TabsTrigger>
            <TabsTrigger value="engagement" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Engajamento</span>
            </TabsTrigger>
            <TabsTrigger value="productivity" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Produtividade</span>
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4" />
              <span>Alertas</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Relatórios</span>
            </TabsTrigger>
            <TabsTrigger value="ml" className="flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span>ML Insights</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="predictive">
            <LazyPredictiveAnalytics />
          </TabsContent>

          <TabsContent value="engagement">
            <LazyEngagementAnalytics />
          </TabsContent>

          <TabsContent value="productivity">
            <LazyProductivityAnalytics />
          </TabsContent>

          <TabsContent value="alerts">
            <SmartAlerts />
          </TabsContent>

          <TabsContent value="reports">
            <AutoReportGenerator />
          </TabsContent>

          <TabsContent value="ml">
            <LazyMLInsights />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};
