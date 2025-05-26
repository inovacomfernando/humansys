
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
import { useDashboardActions } from '@/hooks/useDashboardActions';

export const Dashboard = () => {
  const { handleStatsClick, handleQuickAction } = useDashboardActions();

  const stats = [
    {
      title: 'Total de Colaboradores',
      value: '0',
      change: '0%',
      trend: 'up' as const,
      icon: Users,
      color: 'text-blue-600',
      type: 'collaborators'
    },
    {
      title: 'Novos Contratados',
      value: '0',
      change: '0%',
      trend: 'up' as const,
      icon: UserPlus,
      color: 'text-green-600',
      type: 'new-hires'
    },
    {
      title: 'Feedbacks Pendentes',
      value: '0',
      change: '0%',
      trend: 'down' as const,
      icon: MessageSquare,
      color: 'text-orange-600',
      type: 'feedback'
    },
    {
      title: 'Metas Concluídas',
      value: '0%',
      change: '0%',
      trend: 'up' as const,
      icon: Target,
      color: 'text-purple-600',
      type: 'goals'
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
              <div className="flex flex-col items-center justify-center py-8">
                <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhuma atividade recente</h3>
                <p className="text-muted-foreground text-center">
                  As atividades aparecerão aqui conforme você usar o sistema.
                </p>
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
              <div className="flex flex-col items-center justify-center py-8">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhuma tarefa pendente</h3>
                <p className="text-muted-foreground text-center">
                  Suas tarefas aparecerão aqui quando houver itens para revisar.
                </p>
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
