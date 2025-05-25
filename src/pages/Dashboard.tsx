import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const navigate = useNavigate();

  const stats = [
    {
      title: 'Total de Colaboradores',
      value: '124',
      change: '+12%',
      trend: 'up',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Novos Contratados',
      value: '8',
      change: '+25%',
      trend: 'up',
      icon: UserPlus,
      color: 'text-green-600'
    },
    {
      title: 'Feedbacks Pendentes',
      value: '15',
      change: '-5%',
      trend: 'down',
      icon: MessageSquare,
      color: 'text-orange-600'
    },
    {
      title: 'Metas Concluídas',
      value: '67%',
      change: '+8%',
      trend: 'up',
      icon: Target,
      color: 'text-purple-600'
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
      priority: 'high',
      deadline: '2 dias'
    },
    {
      id: 2,
      title: 'Agendar reunião 1:1 com equipe de vendas',
      priority: 'medium',
      deadline: '1 semana'
    },
    {
      id: 3,
      title: 'Atualizar política de home office',
      priority: 'low',
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
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className={`${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change}
                    </span>
                    {' '}em relação ao mês anterior
                  </p>
                </CardContent>
              </Card>
            );
          })}
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
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.status === 'completed' ? 'bg-green-500' :
                      activity.status === 'in-progress' ? 'bg-blue-500' :
                      'bg-orange-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
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
                  <div key={task.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{task.title}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge 
                          variant={
                            task.priority === 'high' ? 'destructive' :
                            task.priority === 'medium' ? 'default' :
                            'secondary'
                          }
                          className="text-xs"
                        >
                          {task.priority === 'high' ? 'Alta' :
                           task.priority === 'medium' ? 'Média' :
                           'Baixa'}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {task.deadline}
                        </span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Ver
                    </Button>
                  </div>
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
                onClick={() => navigate('/goals')}
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
