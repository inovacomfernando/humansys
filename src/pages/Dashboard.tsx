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
import { CreditsCard } from '@/components/dashboard/CreditsCard';
import { useOptimizedDashboardData } from '@/hooks/useOptimizedDashboardData';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';
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
  Target,
  Crown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { IAAssistantDialog } from '@/components/dashboard/IAAssistantDialog';

export const Dashboard = () => {
  const { data, isLoading, loadingStage } = useOptimizedDashboardData();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isFounder, setIsFounder] = useState(false);
  const [isIAAssistantOpen, setIsIAAssistantOpen] = useState(false);

  useEffect(() => {
    const checkFounderRole = async () => {
      if (!user?.id) return;

      try {
        const { data } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'founder')
          .maybeSingle();

        setIsFounder(!!data);
      } catch (error) {
        console.log('Error checking founder role:', error);
      }
    };

    checkFounderRole();

    // Listen for IA Assistant open event from Sidebar
    const handleOpenIAAssistant = () => {
      setIsIAAssistantOpen(true);
    };

    window.addEventListener('openIAAssistant', handleOpenIAAssistant);

    return () => {
      window.removeEventListener('openIAAssistant', handleOpenIAAssistant);
    };
  }, [user?.id]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <UpdateBanner />

        {/* Brainsys IAO V.1 Module */}
        <Card className="relative overflow-hidden bg-gradient-to-r from-purple-900/90 via-blue-900/90 to-indigo-900/90 border-purple-500/20 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-30"></div>
          <CardContent className="relative p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center animate-pulse shadow-lg shadow-purple-500/30">
                    <Brain className="h-8 w-8 text-white animate-bounce" style={{ animationDuration: '2s' }} />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full"></div>
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h2 className="text-2xl font-bold text-white">Brainsys IAO V.1</h2>
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none animate-pulse">
                      BETA
                    </Badge>
                  </div>
                  <p className="text-purple-100 text-sm mb-2">
                    Orquestrador de Inteligência Organizacional
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-purple-200">
                    <span className="flex items-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></div>
                      IA Preditiva Ativa
                    </span>
                    <span className="flex items-center">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mr-1 animate-pulse"></div>
                      ML Learning
                    </span>
                    <span className="flex items-center">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mr-1 animate-pulse"></div>
                      Memória Contextual
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <Button 
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-none shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  onClick={() => setIsIAAssistantOpen(true)}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Acessar IAO
                </Button>
                <div className="text-right">
                  <div className="text-xs text-purple-200">Powered by</div>
                  <div className="text-sm font-medium text-white">Anthropic API</div>
                </div>
              </div>
            </div>

            {/* Quick Insights Preview */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-purple-200">Análise Preditiva</span>
                  <Brain className="h-3 w-3 text-purple-400" />
                </div>
                <div className="text-lg font-bold text-white">94.7%</div>
                <div className="text-xs text-purple-200">Precisão dos Insights</div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-purple-200">Recomendações</span>
                  <Target className="h-3 w-3 text-blue-400" />
                </div>
                <div className="text-lg font-bold text-white">12</div>
                <div className="text-xs text-purple-200">Ações Sugeridas</div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-purple-200">Economia</span>
                  <TrendingUp className="h-3 w-3 text-green-400" />
                </div>
                <div className="text-lg font-bold text-white">R$ 45.2K</div>
                <div className="text-xs text-purple-200">Potencial/Mês</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Bem-vindo ao seu painel de controle otimizado
            </p>
          </div>
          <div className="flex space-x-2">
            {isFounder && (
              <Button onClick={() => navigate('/app/founder/dashboard')} variant="outline">
                <Crown className="h-4 w-4 mr-2" />
                Founder Dashboard
              </Button>
            )}
            <Button onClick={() => navigate('/changelog')} variant="outline">
              <Trophy className="h-4 w-4 mr-2" />
              Ver Novidades
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
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
          <CreditsCard />
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
                   onClick={() => navigate('/app/disc')}>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Brain className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium">Análise DISC</h4>
                  <p className="text-sm text-muted-foreground">Perfil comportamental</p>
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
              {isLoading && loadingStage !== 'complete' ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <TrendChart data={data.trends} />
              )}
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
                <Button variant="outline" size="sm" className="justify-start" onClick={() => navigate('/app/disc')}>
                  <Brain className="h-4 w-4 mr-2" />
                  Análise DISC
                </Button>
              </div>
            </Widget>
          </div>
        </div>

        {/* IA Assistant Dialog */}
        <IAAssistantDialog 
          open={isIAAssistantOpen} 
          onOpenChange={setIsIAAssistantOpen} 
        />
      </div>
    </DashboardLayout>
  );
};