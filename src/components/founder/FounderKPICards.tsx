
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MetricTooltip } from './MetricTooltip';
import {
  TrendingUp,
  DollarSign,
  Users,
  Activity,
  BarChart3
} from 'lucide-react';
import { FounderAnalytics } from '@/types/founder';

interface FounderKPICardsProps {
  analytics: FounderAnalytics;
}

export const FounderKPICards: React.FC<FounderKPICardsProps> = ({ analytics }) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            <MetricTooltip metric="mrr">
              <span>MRR Total</span>
            </MetricTooltip>
          </CardTitle>
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
          <CardTitle className="text-sm font-medium">
            <MetricTooltip metric="arr">
              <span>ARR Total</span>
            </MetricTooltip>
          </CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            R$ {analytics.revenue.total_arr.toLocaleString('pt-BR')}
          </div>
          <div className="text-xs text-muted-foreground">
            <MetricTooltip metric="ltv">
              <span>LTV médio: R$ {analytics.revenue.ltv.toFixed(0)}</span>
            </MetricTooltip>
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
          <CardTitle className="text-sm font-medium">
            <MetricTooltip metric="health_score">
              <span>Health Score</span>
            </MetricTooltip>
          </CardTitle>
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
  );
};
