
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  UserPlus,
  MessageSquare,
  Target,
  BookOpen,
  TrendingUp,
  Clock,
  AlertCircle,
  Plus,
  LayoutGrid,
  BarChart3
} from 'lucide-react';
import { NewCollaboratorDialog } from '@/components/dashboard/NewCollaboratorDialog';
import { FeedbackDialog } from '@/components/dashboard/FeedbackDialog';
import { TrainingDialog } from '@/components/dashboard/TrainingDialog';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Widget } from '@/components/dashboard/Widget';
import { TrendChart } from '@/components/dashboard/TrendChart';
import { useDashboardActions } from '@/hooks/useDashboardActions';
import { useDashboardData } from '@/hooks/useDashboardData';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const Dashboard = () => {
  const { handleStatsClick, handleQuickAction } = useDashboardActions();
  const { stats, recentActivities, isLoading } = useDashboardData();
  const [expandedWidget, setExpandedWidget] = useState<string | null>(null);
  const [widgets, setWidgets] = useState([
    'stats',
    'trends',
    'activities',
    'tasks',
    'quick-actions'
  ]);

  // Dados de exemplo para gráficos de tendência
  const trendData = [
    { date: '2024-01-15', value: 45 },
    { date: '2024-01-16', value: 52 },
    { date: '2024-01-17', value: 48 },
    { date: '2024-01-18', value: 61 },
    { date: '2024-01-19', value: 55 },
    { date: '2024-01-20', value: 67 },
    { date: '2024-01-21', value: 73 },
  ];

  const collaboratorsTrend = [
    { date: '2024-01-15', value: 145 },
    { date: '2024-01-16', value: 147 },
    { date: '2024-01-17', value: 149 },
    { date: '2024-01-18', value: 152 },
    { date: '2024-01-19', value: 155 },
    { date: '2024-01-20', value: 158 },
    { date: '2024-01-21', value: 162 },
  ];

  const statsConfig = [
    {
      title: 'Total de Colaboradores',
      value: stats.totalCollaborators.toString(),
      change: '+2.5%',
      trend: 'up' as const,
      icon: Users,
      color: 'text-blue-600',
      type: 'collaborators'
    },
    {
      title: 'Novos Contratados',
      value: stats.newHires.toString(),
      change: '+12%',
      trend: 'up' as const,
      icon: UserPlus,
      color: 'text-green-600',
      type: 'new-hires'
    },
    {
      title: 'Feedbacks Pendentes',
      value: stats.pendingFeedbacks.toString(),
      change: '-8%',
      trend: 'down' as const,
      icon: MessageSquare,
      color: 'text-orange-600',
      type: 'feedback'
    },
    {
      title: 'Metas Concluídas',
      value: `${stats.completedGoals}%`,
      change: '+5%',
      trend: 'up' as const,
      icon: Target,
      color: 'text-purple-600',
      type: 'goals'
    }
  ];

  const handleWidgetExpand = (widgetId: string) => {
    setExpandedWidget(expandedWidget === widgetId ? null : widgetId);
  };

  const handleWidgetRemove = (widgetId: string) => {
    setWidgets(widgets.filter(w => w !== widgetId));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with Actions */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold animate-fade-in">Dashboard</h1>
            <p className="text-muted-foreground animate-fade-in">
              Visão geral da sua gestão de pessoas
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <LayoutGrid className="mr-2 h-4 w-4" />
              Personalizar
            </Button>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Widget
            </Button>
          </div>
        </div>

        {/* Widgets Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 auto-rows-min">
          {/* Stats Widget */}
          {widgets.includes('stats') && (
            <Widget
              id="stats"
              title="Estatísticas Principais"
              description="Métricas chave do sistema"
              className={expandedWidget === 'stats' ? 'md:col-span-2 lg:col-span-4' : 'md:col-span-2 lg:col-span-4'}
              onExpand={handleWidgetExpand}
              onRemove={handleWidgetRemove}
              isExpanded={expandedWidget === 'stats'}
            >
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {statsConfig.map((stat, index) => (
                  <StatsCard
                    key={index}
                    title={stat.title}
                    value={isLoading ? '...' : stat.value}
                    change={stat.change}
                    trend={stat.trend}
                    icon={stat.icon}
                    color={stat.color}
                    onClick={() => handleStatsClick(stat.type)}
                  />
                ))}
              </div>
            </Widget>
          )}

          {/* Trends Widget */}
          {widgets.includes('trends') && (
            <Widget
              id="trends"
              title="Tendências"
              description="Evolução ao longo do tempo"
              className={expandedWidget === 'trends' ? 'md:col-span-2' : ''}
              onExpand={handleWidgetExpand}
              onRemove={handleWidgetRemove}
              isExpanded={expandedWidget === 'trends'}
            >
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Performance Geral</h4>
                  <TrendChart 
                    data={trendData} 
                    type="area" 
                    color="#22c55e"
                    height={expandedWidget === 'trends' ? 300 : 150}
                  />
                </div>
                {expandedWidget === 'trends' && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Crescimento de Colaboradores</h4>
                    <TrendChart 
                      data={collaboratorsTrend} 
                      type="line" 
                      color="#3b82f6"
                      height={200}
                    />
                  </div>
                )}
              </div>
            </Widget>
          )}

          {/* Activities Widget */}
          {widgets.includes('activities') && (
            <Widget
              id="activities"
              title="Atividades Recentes"
              description="Últimas movimentações"
              onExpand={handleWidgetExpand}
              onRemove={handleWidgetRemove}
              isExpanded={expandedWidget === 'activities'}
            >
              {recentActivities.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Clock className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground text-center">
                    Nenhuma atividade recente
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentActivities.slice(0, expandedWidget === 'activities' ? 10 : 3).map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-2 bg-muted/50 rounded-lg transition-colors hover:bg-muted/80">
                      <div className="flex-1">
                        <p className="text-xs font-medium">{activity.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(activity.created_at), 'dd/MM HH:mm', { locale: ptBR })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Widget>
          )}

          {/* Tasks Widget */}
          {widgets.includes('tasks') && (
            <Widget
              id="tasks"
              title="Tarefas Pendentes"
              description="Itens para sua atenção"
              onExpand={handleWidgetExpand}
              onRemove={handleWidgetRemove}
              isExpanded={expandedWidget === 'tasks'}
            >
              <div className="flex flex-col items-center justify-center py-8">
                <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground text-center">
                  Nenhuma tarefa pendente
                </p>
                <Badge variant="secondary" className="mt-2">Em dia!</Badge>
              </div>
            </Widget>
          )}

          {/* Quick Actions Widget */}
          {widgets.includes('quick-actions') && (
            <Widget
              id="quick-actions"
              title="Ações Rápidas"
              description="Acesso direto às funcionalidades"
              className={expandedWidget === 'quick-actions' ? 'md:col-span-2' : 'md:col-span-2'}
              onExpand={handleWidgetExpand}
              onRemove={handleWidgetRemove}
              isExpanded={expandedWidget === 'quick-actions'}
            >
              <div className="grid gap-3 md:grid-cols-2">
                <NewCollaboratorDialog />
                <FeedbackDialog />
                <TrainingDialog />
                
                <Button 
                  variant="outline" 
                  className="justify-start h-auto p-3 transition-all duration-200 hover:scale-105"
                  onClick={() => handleQuickAction('reports')}
                >
                  <TrendingUp className="mr-2 h-4 w-4" />
                  <div className="text-left">
                    <div className="text-sm font-medium">Relatórios</div>
                    <div className="text-xs text-muted-foreground">Análises e métricas</div>
                  </div>
                </Button>
              </div>
            </Widget>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
