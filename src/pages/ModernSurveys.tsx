
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SurveyBuilder } from '@/components/surveys/SurveyBuilder';
import { RealTimeSurveyAnalytics } from '@/components/surveys/RealTimeSurveyAnalytics';
import { Survey, SurveyAnalytics } from '@/types/surveys';
import { Plus, BarChart3, Users, Clock, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const ModernSurveys = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('surveys');
  const [editingSurvey, setEditingSurvey] = useState<Survey | undefined>();
  const [showBuilder, setShowBuilder] = useState(false);
  const [selectedSurveyForAnalytics, setSelectedSurveyForAnalytics] = useState<Survey | undefined>();

  // Mock data
  const mockSurveys: Survey[] = [
    {
      id: '1',
      title: 'Pesquisa de Clima Organizacional 2024',
      description: 'Avaliação anual do clima organizacional da empresa',
      type: 'climate',
      status: 'active',
      questions: [],
      target_audience: ['all'],
      start_date: '2024-01-15T09:00:00Z',
      end_date: '2024-02-15T18:00:00Z',
      anonymous: true,
      created_by: 'admin',
      created_at: '2024-01-10T10:00:00Z',
      updated_at: '2024-01-10T10:00:00Z'
    },
    {
      id: '2',
      title: 'Feedback sobre Treinamento de Liderança',
      description: 'Avaliação do treinamento de liderança realizado em janeiro',
      type: 'feedback',
      status: 'completed',
      questions: [],
      target_audience: ['leaders'],
      start_date: '2024-01-20T09:00:00Z',
      end_date: '2024-01-25T18:00:00Z',
      anonymous: false,
      created_by: 'admin',
      created_at: '2024-01-18T14:00:00Z',
      updated_at: '2024-01-25T18:00:00Z'
    }
  ];

  const mockAnalytics: SurveyAnalytics = {
    total_responses: 89,
    completion_rate: 67.5,
    average_completion_time: 420,
    real_time_responses: [
      {
        id: '1',
        survey_id: '1',
        answers: [],
        completed_at: new Date(Date.now() - 300000).toISOString()
      },
      {
        id: '2',
        survey_id: '1',
        answers: [],
        completed_at: new Date(Date.now() - 600000).toISOString()
      }
    ],
    sentiment_analysis: {
      positive: 65,
      neutral: 25,
      negative: 10
    },
    response_trends: [
      { date: '2024-01-15', count: 12 },
      { date: '2024-01-16', count: 18 },
      { date: '2024-01-17', count: 25 },
      { date: '2024-01-18', count: 22 },
      { date: '2024-01-19', count: 15 }
    ]
  };

  const handleSaveSurvey = (survey: Survey) => {
    console.log('Salvando pesquisa:', survey);
    toast({
      title: "Pesquisa salva",
      description: "Pesquisa criada com sucesso!"
    });
    setShowBuilder(false);
    setEditingSurvey(undefined);
  };

  const handlePreviewSurvey = (survey: Survey) => {
    console.log('Visualizando pesquisa:', survey);
    toast({
      title: "Gerando preview",
      description: "Preview da pesquisa será exibido em breve."
    });
  };

  const editSurvey = (survey: Survey) => {
    setEditingSurvey(survey);
    setShowBuilder(true);
  };

  const createNewSurvey = () => {
    setEditingSurvey(undefined);
    setShowBuilder(true);
  };

  const viewAnalytics = (survey: Survey) => {
    setSelectedSurveyForAnalytics(survey);
    setActiveTab('analytics');
  };

  if (showBuilder) {
    return (
      <DashboardLayout>
        <SurveyBuilder
          survey={editingSurvey}
          onSave={handleSaveSurvey}
          onPreview={handlePreviewSurvey}
        />
      </DashboardLayout>
    );
  }

  if (selectedSurveyForAnalytics) {
    return (
      <DashboardLayout>
        <div className="space-y-4">
          <Button 
            variant="outline" 
            onClick={() => {
              setSelectedSurveyForAnalytics(undefined);
              setActiveTab('surveys');
            }}
          >
            ← Voltar para Pesquisas
          </Button>
          <RealTimeSurveyAnalytics
            survey={selectedSurveyForAnalytics}
            analytics={mockAnalytics}
            isLive={selectedSurveyForAnalytics.status === 'active'}
          />
        </div>
      </DashboardLayout>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'completed': return 'bg-blue-500';
      case 'draft': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativa';
      case 'completed': return 'Finalizada';
      case 'draft': return 'Rascunho';
      default: return status;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Pesquisas Inteligentes</h1>
            <p className="text-muted-foreground">
              Crie pesquisas com análise em tempo real e inteligência artificial
            </p>
          </div>
          <Button onClick={createNewSurvey}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Pesquisa
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pesquisas Ativas</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockSurveys.filter(s => s.status === 'active').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Respostas Totais</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockAnalytics.total_responses}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockAnalytics.completion_rate}%</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sentimento Positivo</CardTitle>
              <MessageSquare className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {mockAnalytics.sentiment_analysis.positive}%
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="surveys">Minhas Pesquisas</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="analytics">Analytics Globais</TabsTrigger>
          </TabsList>

          <TabsContent value="surveys" className="space-y-4">
            <div className="space-y-4">
              {mockSurveys.map((survey) => (
                <Card key={survey.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{survey.title}</h3>
                          <Badge className={getStatusColor(survey.status)}>
                            {getStatusText(survey.status)}
                          </Badge>
                          {survey.status === 'active' && (
                            <Badge variant="secondary" className="animate-pulse">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                              Ao vivo
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground">{survey.description}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>📊 {survey.type}</span>
                          <span>👥 {survey.anonymous ? 'Anônima' : 'Identificada'}</span>
                          <span>📅 {new Date(survey.start_date).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => editSurvey(survey)}>
                          Editar
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => viewAnalytics(survey)}>
                          <BarChart3 className="h-4 w-4 mr-1" />
                          Analytics
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Templates de Pesquisa</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Templates pré-configurados em breve</p>
                  <p className="text-sm">Templates para diferentes tipos de pesquisa</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Globais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Dashboard global de analytics em breve</p>
                  <p className="text-sm">Visão consolidada de todas as pesquisas</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};
