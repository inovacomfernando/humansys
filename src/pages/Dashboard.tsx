
import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { UpdateBanner } from '@/components/layout/UpdateBanner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Widget } from '@/components/dashboard/Widget';
import { TrendChart } from '@/components/dashboard/TrendChart';
import { ActivityItem } from '@/components/dashboard/ActivityItem';
import { TaskItem } from '@/components/dashboard/TaskItem';
import { useOptimizedDashboardData } from '@/hooks/useOptimizedDashboardData';
import { useUserMigration } from '@/hooks/useUserMigration';
import { DashboardStatsSkeleton } from '@/components/common/SkeletonCards';
import {
  Users,
  UserPlus,
  TrendingUp,
  Award,
  Calendar,
  MessageSquare,
  Brain,
  Trophy,
  Zap,
  Target
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const { data, isLoading, cacheStats } = useOptimizedDashboardData();
  const { migrationStatus, runFullMigration } = useUserMigration();
  const navigate = useNavigate();

  // Executar migração apenas se necessário e não durante loading inicial
  React.useEffect(() => {
    if (!migrationStatus.isComplete && !isLoading && data.stats.totalCollaborators >= 0) {
      // Executar migração em background sem bloquear UI
      setTimeout(() => {
        runFullMigration();
      }, 1000);
    }
  }, [migrationStatus.isComplete, isLoading, data.stats.totalCollaborators]);
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <UpdateBanner />
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Bem-vindo ao seu painel de controle otimizado
            </p>
          </div>
          <Button onClick={() => navigate('/changelog')} variant="outline">
            <Trophy className="h-4 w-4 mr-2" />
            Ver Novidades
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total de Colaboradores"
            value={data.stats.totalCollaborators}
            icon={Users}
            trend={12}
          />
          <StatsCard
            title="Processos Ativos"
            value={data.stats.activeProcesses}
            icon={UserPlus}
            trend={8}
          />
          <StatsCard
            title="Taxa de Conclusão"
            value={`${data.stats.completionRate}%`}
            icon={TrendingUp}
            trend={15}
          />
          <StatsCard
            title="Pontos Gamificação"
            value={data.stats.gamificationPoints}
            icon={Trophy}
            trend={25}
            isNew={true}
          />
        </div>

        {/* New Features Highlight */}
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-purple-600" />
              <span>Novas Funcionalidades com IA</span>
              <Badge className="bg-purple-500">Novo</Badge>
            </CardTitle>
            <CardDescription>
              Explore as funcionalidades mais recentes do HumanSys
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center space-x-3 p-4 bg-white rounded-lg cursor-pointer hover:shadow-md transition-shadow" 
                   onClick={() => navigate('/analytics')}>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Brain className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium">Analytics com IA</h4>
                  <p className="text-sm text-muted-foreground">Previsões de turnover</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-4 bg-white rounded-lg cursor-pointer hover:shadow-md transition-shadow"
                   onClick={() => navigate('/onboarding')}>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium">Gamificação</h4>
                  <p className="text-sm text-muted-foreground">Badges e conquistas</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-4 bg-white rounded-lg cursor-pointer hover:shadow-md transition-shadow"
                   onClick={() => navigate('/training')}>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Zap className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium">PWA Móvel</h4>
                  <p className="text-sm text-muted-foreground">Acesso offline</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Widget
              id="trends-widget"
              title="Tendências de Performance"
              description="Análise de performance dos últimos 6 meses"
            >
              <TrendChart data={data.trends} />
            </Widget>

            <Widget
              id="activities-widget"
              title="Atividades Recentes"
              description="Últimas ações realizadas no sistema"
            >
              <div className="space-y-4">
                {data.recentActivities.length > 0 ? (
                  data.recentActivities.map((activity, index) => (
                    <ActivityItem key={index} activity={activity} />
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Nenhuma atividade recente</p>
                )}
              </div>
            </Widget>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Widget
              id="goals-widget"
              title="Metas do Mês"
              description="Progresso das principais metas"
            >
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Onboardings</span>
                    <span className="text-sm text-muted-foreground">75%</span>
                  </div>
                  <Progress value={75} />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Treinamentos</span>
                    <span className="text-sm text-muted-foreground">60%</span>
                  </div>
                  <Progress value={60} />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Feedbacks</span>
                    <span className="text-sm text-muted-foreground">90%</span>
                  </div>
                  <Progress value={90} />
                </div>
              </div>
            </Widget>

            <Widget
              id="tasks-widget"
              title="Tarefas Pendentes"
              description="Itens que precisam da sua atenção"
            >
              <div className="space-y-3">
                {data.pendingTasks.length > 0 ? (
                  data.pendingTasks.map((task, index) => (
                    <TaskItem key={index} task={task} />
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Nenhuma tarefa pendente</p>
                )}
              </div>
            </Widget>

            <Widget
              id="actions-widget"
              title="Ações Rápidas"
              description="Acesso rápido às principais funcionalidades"
            >
              <div className="grid gap-2">
                <Button variant="outline" size="sm" className="justify-start" onClick={() => navigate('/collaborators')}>
                  <Users className="h-4 w-4 mr-2" />
                  Adicionar Colaborador
                </Button>
                <Button variant="outline" size="sm" className="justify-start" onClick={() => navigate('/onboarding')}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Novo Onboarding
                </Button>
                <Button variant="outline" size="sm" className="justify-start" onClick={() => navigate('/feedback')}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Enviar Feedback
                </Button>
                <Button variant="outline" size="sm" className="justify-start" onClick={() => navigate('/goals')}>
                  <Target className="h-4 w-4 mr-2" />
                  Definir Meta
                </Button>
              </div>
            </Widget>
          </div>
        </div>

        {/* Debug info em desenvolvimento */}
        {process.env.NODE_ENV === 'development' && cacheStats && (
          <Card className="p-4 bg-muted/50">
            <p className="text-sm text-muted-foreground">
              Cache Dashboard: {cacheStats.hits} hits, {cacheStats.misses} misses 
              ({cacheStats.hitRate.toFixed(1)}% hit rate)
            </p>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};
