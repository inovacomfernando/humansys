
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NewGoalDialog } from '@/components/goals/NewGoalDialog';
import { ModernGoalProgress } from '@/components/goals/ModernGoalProgress';
import { GoalProgress } from '@/types/gamification';
import { Target, TrendingUp, CheckCircle, Award, Users, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const Goals = () => {
  const { toast } = useToast();

  // Mock data with modern goal structure
  const mockGoals: GoalProgress[] = [
    {
      id: '1',
      title: 'Aumentar vendas em 20%',
      description: 'Meta trimestral de crescimento nas vendas da equipe',
      target_value: 100,
      current_value: 75,
      progress_percentage: 75,
      due_date: '2024-03-31',
      status: 'in-progress',
      priority: 'high',
      category: 'Vendas',
      milestones: [
        {
          id: '1a',
          title: 'Primeiro trimestre +15%',
          target_value: 50,
          completed: true,
          completed_at: '2024-01-31'
        },
        {
          id: '1b',
          title: 'Segundo trimestre +20%',
          target_value: 100,
          completed: false
        }
      ]
    },
    {
      id: '2',
      title: 'Concluir curso de liderança',
      description: 'Programa de desenvolvimento em liderança executiva',
      target_value: 100,
      current_value: 100,
      progress_percentage: 100,
      due_date: '2024-02-15',
      status: 'completed',
      priority: 'medium',
      category: 'Desenvolvimento',
      milestones: [
        {
          id: '2a',
          title: 'Módulo 1: Fundamentos',
          target_value: 25,
          completed: true,
          completed_at: '2024-01-15'
        },
        {
          id: '2b',
          title: 'Módulo 2: Comunicação',
          target_value: 50,
          completed: true,
          completed_at: '2024-01-30'
        },
        {
          id: '2c',
          title: 'Módulo 3: Gestão de Equipe',
          target_value: 75,
          completed: true,
          completed_at: '2024-02-10'
        },
        {
          id: '2d',
          title: 'Projeto Final',
          target_value: 100,
          completed: true,
          completed_at: '2024-02-15'
        }
      ]
    },
    {
      id: '3',
      title: 'Melhorar satisfação do cliente',
      description: 'Elevar o NPS da equipe para 8.5+',
      target_value: 85,
      current_value: 72,
      progress_percentage: 84.7,
      due_date: '2024-06-30',
      status: 'in-progress',
      priority: 'critical',
      category: 'Qualidade',
      milestones: [
        {
          id: '3a',
          title: 'Implementar novo processo',
          target_value: 30,
          completed: true,
          completed_at: '2024-01-20'
        },
        {
          id: '3b',
          title: 'Treinamento da equipe',
          target_value: 60,
          completed: true,
          completed_at: '2024-02-01'
        },
        {
          id: '3c',
          title: 'Análise e ajustes',
          target_value: 85,
          completed: false
        }
      ]
    },
    {
      id: '4',
      title: 'Certificação em Product Management',
      description: 'Obter certificação internacional em gestão de produtos',
      target_value: 100,
      current_value: 25,
      progress_percentage: 25,
      due_date: '2024-12-31',
      status: 'in-progress',
      priority: 'medium',
      category: 'Certificação',
      milestones: [
        {
          id: '4a',
          title: 'Inscrição no curso',
          target_value: 10,
          completed: true,
          completed_at: '2024-01-10'
        },
        {
          id: '4b',
          title: 'Primeira fase do curso',
          target_value: 40,
          completed: false
        },
        {
          id: '4c',
          title: 'Projeto prático',
          target_value: 80,
          completed: false
        },
        {
          id: '4d',
          title: 'Exame final',
          target_value: 100,
          completed: false
        }
      ]
    }
  ];

  const activeGoals = mockGoals.filter(g => g.status !== 'completed');
  const completedGoals = mockGoals.filter(g => g.status === 'completed');
  const overdueGoals = mockGoals.filter(g => new Date(g.due_date) < new Date() && g.status !== 'completed');
  const successRate = Math.round((completedGoals.length / mockGoals.length) * 100);

  const handleUpdateProgress = (goalId: string, newProgress: number) => {
    toast({
      title: "Progresso atualizado",
      description: "O progresso da meta foi atualizado com sucesso."
    });
  };

  const handleCompleteGoal = (goalId: string) => {
    toast({
      title: "Meta concluída!",
      description: "Parabéns! Você concluiu sua meta. 🎉"
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Metas & PDI Modernizado</h1>
            <p className="text-muted-foreground">
              Plano de Desenvolvimento Individual com gamificação e acompanhamento inteligente
            </p>
          </div>
          <NewGoalDialog />
        </div>

        {/* KPIs Modernos */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Metas Ativas</CardTitle>
              <Target className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{activeGoals.length}</div>
              <p className="text-xs text-muted-foreground">
                {overdueGoals.length > 0 && `${overdueGoals.length} em atraso`}
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{completedGoals.length}</div>
              <p className="text-xs text-muted-foreground">
                +{completedGoals.length} este período
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Progresso</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {activeGoals.filter(g => g.status === 'in-progress').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Média: {Math.round(activeGoals.reduce((acc, g) => acc + g.progress_percentage, 0) / activeGoals.length || 0)}%
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
              <Award className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{successRate}%</div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                <div 
                  className="bg-purple-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${successRate}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Badges Ganhos</CardTitle>
              <Users className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">12</div>
              <p className="text-xs text-muted-foreground">
                +3 este mês
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="active" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="active">Metas Ativas</TabsTrigger>
            <TabsTrigger value="completed">Concluídas</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
              {activeGoals.map((goal) => (
                <ModernGoalProgress
                  key={goal.id}
                  goal={goal}
                  onUpdateProgress={handleUpdateProgress}
                  onCompleteGoal={handleCompleteGoal}
                />
              ))}
            </div>
            
            {activeGoals.length === 0 && (
              <Card>
                <CardContent className="py-8">
                  <div className="text-center">
                    <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Nenhuma meta ativa</h3>
                    <p className="text-muted-foreground mb-4">Comece criando uma nova meta para seu PDI</p>
                    <NewGoalDialog />
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
              {completedGoals.map((goal) => (
                <ModernGoalProgress
                  key={goal.id}
                  goal={goal}
                />
              ))}
            </div>
            
            {completedGoals.length === 0 && (
              <Card>
                <CardContent className="py-8">
                  <div className="text-center">
                    <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Nenhuma meta concluída ainda</h3>
                    <p className="text-muted-foreground">As metas concluídas aparecerão aqui</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Analytics de Metas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Analytics detalhados em desenvolvimento</p>
                  <p className="text-sm">Gráficos de performance, tendências e insights</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Templates de Metas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Templates pré-configurados em breve</p>
                  <p className="text-sm">Modelos para diferentes tipos de metas</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};
