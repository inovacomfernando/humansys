
import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Users,
  UserPlus,
  MessageSquare,
  Target,
  BookOpen,
  TrendingUp,
  Clock,
  AlertCircle
} from 'lucide-react';
import { NewCollaboratorDialog } from '@/components/dashboard/NewCollaboratorDialog';
import { FeedbackDialog } from '@/components/dashboard/FeedbackDialog';
import { TrainingDialog } from '@/components/dashboard/TrainingDialog';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ActivityItem } from '@/components/dashboard/ActivityItem';
import { TaskItem } from '@/components/dashboard/TaskItem';
import { useDashboardActions } from '@/hooks/useDashboardActions';

export const Dashboard = () => {
  const { 
    handleStatsClick, 
    handleActivityView, 
    handleTaskView, 
    handleTaskComplete,
    handleQuickAction 
  } = useDashboardActions();

  const stats = [
    {
      title: 'Total de Colaboradores',
      value: '124',
      change: '+12%',
      trend: 'up' as const,
      icon: Users,
      color: 'text-blue-600',
      type: 'collaborators'
    },
    {
      title: 'Novos Contratados',
      value: '8',
      change: '+25%',
      trend: 'up' as const,
      icon: UserPlus,
      color: 'text-green-600',
      type: 'new-hires'
    },
    {
      title: 'Feedbacks Pendentes',
      value: '15',
      change: '-5%',
      trend: 'down' as const,
      icon: MessageSquare,
      color: 'text-orange-600',
      type: 'feedback'
    },
    {
      title: 'Metas Concluídas',
      value: '67%',
      change: '+8%',
      trend: 'up' as const,
      icon: Target,
      color: 'text-purple-600',
      type: 'goals'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'onboarding',
      title: 'João Silva iniciou processo de onboarding',
      time: '2 horas atrás',
      status: 'in-progress'
    },
    {
      id: 2,
      type: 'feedback',
      title: 'Maria Santos enviou feedback para equipe',
      time: '4 horas atrás',
      status: 'completed'
    },
    {
      id: 3,
      type: 'training',
      title: 'Curso de Liderança foi concluído por 5 pessoas',
      time: '1 dia atrás',
      status: 'completed'
    },
    {
      id: 4,
      type: 'recruitment',
      title: 'Nova vaga publicada: Desenvolvedor Senior',
      time: '2 dias atrás',
      status: 'active'
    }
  ];

  const pendingTasks = [
    {
      id: 1,
      title: 'Revisar currículos para vaga de Designer',
      priority: 'high' as const,
      deadline: '2 dias'
    },
    {
      id: 2,
      title: 'Agendar reunião 1:1 com equipe de vendas',
      priority: 'medium' as const,
      deadline: '1 semana'
    },
    {
      id: 3,
      title: 'Atualizar política de home office',
      priority: 'low' as const,
      deadline: '2 semanas'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral da sua gestão de pessoas
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <StatsCard
              key={index}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              trend={stat.trend}
              icon={stat.icon}
              color={stat.color}
              onClick={() => handleStatsClick(stat.type)}
            />
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                Atividades Recentes
              </CardTitle>
              <CardDescription>
                Últimas movimentações no sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <ActivityItem
                    key={activity.id}
                    id={activity.id}
                    type={activity.type}
                    title={activity.title}
                    time={activity.time}
                    status={activity.status}
                    onViewDetails={handleActivityView}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pending Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="mr-2 h-5 w-5" />
                Tarefas Pendentes
              </CardTitle>
              <CardDescription>
                Itens que precisam da sua atenção
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    id={task.id}
                    title={task.title}
                    priority={task.priority}
                    deadline={task.deadline}
                    onView={handleTaskView}
                    onMarkComplete={handleTaskComplete}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>
              Acesso direto às principais funcionalidades
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <NewCollaboratorDialog />
              <FeedbackDialog />
              <TrainingDialog />
              
              <Button 
                variant="outline" 
                className="justify-start h-auto p-4"
                onClick={() => handleQuickAction('reports')}
              >
                <TrendingUp className="mr-2 h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Relatórios</div>
                  <div className="text-xs text-muted-foreground">Análises e métricas</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};
