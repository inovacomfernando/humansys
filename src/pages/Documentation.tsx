import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Users, 
  Trophy, 
  BookOpen, 
  FileText,
  Video,
  MessageSquare,
  Target,
  Award,
  Zap,
  Crown,
  TrendingUp,
  UserPlus,
  ArrowRight,
  CreditCard
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Documentation = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: 'Análise DISC',
      description: 'Sistema completo de análise de perfil comportamental com IA',
      path: '/app/disc',
      isNew: true,
      category: 'Recursos Humanos'
    },
    {
      icon: Crown,
      title: 'Founder Dashboard',
      description: 'Métricas estratégicas de negócio com IA preditiva',
      path: '/app/founder/dashboard',
      isNew: true,
      category: 'Analytics'
    },
    {
      icon: Trophy,
      title: 'Gamificação',
      description: 'Sistema de badges, conquistas e ranking',
      path: '/app/dashboard',
      isNew: true,
      category: 'Engajamento'
    },
    {
      icon: Users,
      title: 'Gestão de Colaboradores',
      description: 'Controle completo do quadro de funcionários',
      path: '/app/collaborators',
      category: 'Recursos Humanos'
    },
    {
      icon: UserPlus,
      title: 'Onboarding',
      description: 'Processo estruturado de integração',
      path: '/app/onboarding',
      category: 'Recursos Humanos'
    },
    {
      icon: MessageSquare,
      title: 'Feedback 360°',
      description: 'Sistema completo de feedbacks e avaliações',
      path: '/app/feedback',
      category: 'Avaliação'
    },
    {
      icon: Target,
      title: 'Metas & PDI',
      description: 'Plano de Desenvolvimento Individual',
      path: '/app/goals',
      category: 'Desenvolvimento'
    },
    {
      icon: Video,
      title: 'Treinamentos',
      description: 'Plataforma de cursos com certificação',
      path: '/app/training',
      category: 'Educação'
    }
  ];

  const discGuide = [
    {
      step: 1,
      title: 'Acesse a Análise DISC',
      description: 'No menu principal, clique em "Análise DISC" ou acesse pelo dashboard.',
      icon: Brain
    },
    {
      step: 2,
      title: 'Inicie o Questionário',
      description: 'Clique em "Nova Análise" para começar o questionário de 12 perguntas.',
      icon: FileText
    },
    {
      step: 3,
      title: 'Responda com Honestidade',
      description: 'Escolha as opções que melhor descrevem seu comportamento natural.',
      icon: Users
    },
    {
      step: 4,
      title: 'Receba Seu Relatório',
      description: 'Visualize seus resultados com insights de IA e recomendações personalizadas.',
      icon: Award
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-primary" />
              Documentação
            </h1>
            <p className="text-muted-foreground">
              Guias completos e documentação das funcionalidades da plataforma
            </p>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="disc">Análise DISC</TabsTrigger>
            <TabsTrigger value="features">Funcionalidades</TabsTrigger>
            <TabsTrigger value="api">API & Integrações</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Bem-vindo à Humansys</CardTitle>
                <CardDescription>
                  Uma plataforma completa de gestão de recursos humanos com inteligência artificial
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  A Humansys é uma solução moderna que combina gestão de RH tradicional com 
                  tecnologias avançadas como inteligência artificial, gamificação e análise comportamental.
                </p>

                <div className="grid gap-4 md:grid-cols-3">
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Brain className="h-5 w-5 text-green-600" />
                        <span className="font-medium">IA Avançada</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Análise preditiva de turnover e insights comportamentais
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Trophy className="h-5 w-5 text-blue-600" />
                        <span className="font-medium">Gamificação</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Sistema de badges e conquistas para engajar colaboradores
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-purple-50 border-purple-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-5 w-5 text-purple-600" />
                        <span className="font-medium">Analytics</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Métricas em tempo real e relatórios automatizados
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="disc" className="space-y-6">
            <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-6 w-6 text-indigo-600" />
                  Análise de Perfil DISC
                  <Badge className="bg-indigo-500">Nova Funcionalidade</Badge>
                </CardTitle>
                <CardDescription>
                  Descubra e desenvolva o perfil comportamental dos seus colaboradores
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">O que é a Análise DISC?</h3>
                  <p className="text-muted-foreground mb-4">
                    A análise DISC é uma ferramenta de avaliação comportamental que identifica quatro estilos 
                    principais de personalidade: Dominante, Influente, Estável e Consciencioso. Nossa implementação 
                    utiliza inteligência artificial para fornecer insights mais profundos e precisos.
                  </p>

                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-red-200 bg-red-50">
                      <CardContent className="p-4 text-center">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-xl font-bold text-red-600">D</span>
                        </div>
                        <h4 className="font-medium">Dominante</h4>
                        <p className="text-xs text-muted-foreground">Direto, decidido, orientado para resultados</p>
                      </CardContent>
                    </Card>

                    <Card className="border-yellow-200 bg-yellow-50">
                      <CardContent className="p-4 text-center">
                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-xl font-bold text-yellow-600">I</span>
                        </div>
                        <h4 className="font-medium">Influente</h4>
                        <p className="text-xs text-muted-foreground">Sociável, otimista, persuasivo</p>
                      </CardContent>
                    </Card>

                    <Card className="border-green-200 bg-green-50">
                      <CardContent className="p-4 text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-xl font-bold text-green-600">S</span>
                        </div>
                        <h4 className="font-medium">Estável</h4>
                        <p className="text-xs text-muted-foreground">Paciente, confiável, colaborativo</p>
                      </CardContent>
                    </Card>

                    <Card className="border-blue-200 bg-blue-50">
                      <CardContent className="p-4 text-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-xl font-bold text-blue-600">C</span>
                        </div>
                        <h4 className="font-medium">Consciencioso</h4>
                        <p className="text-xs text-muted-foreground">Preciso, analítico, sistemático</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Como Fazer a Análise</h3>
                  <div className="space-y-4">
                    {discGuide.map((step) => (
                      <div key={step.step} className="flex gap-4 p-4 border rounded-lg">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <step.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">Passo {step.step}: {step.title}</h4>
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button onClick={() => navigate('/app/disc')} size="lg">
                    <Brain className="h-5 w-5 mr-2" />
                    Fazer Análise DISC
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <Card key={index} className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                      onClick={() => navigate(feature.path)}>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex flex-col gap-1">
                        {feature.isNew && (
                          <Badge className="bg-green-500 text-white text-xs">
                            Novo
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {feature.category}
                        </Badge>
                      </div>
                    </div>

                    <CardTitle className="text-lg">
                      {feature.title}
                    </CardTitle>
                    <CardDescription>
                      {feature.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <Button variant="outline" size="sm" className="w-full">
                      Acessar <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="api" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>API e Integrações</CardTitle>
                <CardDescription>
                  Documentação técnica para integrações e uso da API
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Em Desenvolvimento</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    A documentação da API estará disponível em breve. 
                    Entre em contato conosco para mais informações sobre integrações.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};