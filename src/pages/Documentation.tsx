
import React, { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
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
  CreditCard,
  BarChart3,
  Calendar,
  ClipboardList,
  Settings,
  Briefcase,
  Star,
  Play,
  Download,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Documentation = () => {
  const navigate = useNavigate();
  const [scrollProgress, setScrollProgress] = useState(0);

  // Dados das funcionalidades para o carrossel
  const platformFeatures = [
    {
      id: 1,
      title: 'Dashboard Principal',
      description: 'Visão geral completa com métricas em tempo real e ações rápidas',
      image: '/placeholder.svg?height=300&width=500&text=Dashboard+Principal',
      category: 'Analytics',
      path: '/app/dashboard'
    },
    {
      id: 2,
      title: 'Análise DISC com IA',
      description: 'Sistema avançado de análise comportamental com insights de inteligência artificial',
      image: '/placeholder.svg?height=300&width=500&text=Análise+DISC',
      category: 'RH',
      path: '/app/disc',
      isNew: true
    },
    {
      id: 3,
      title: 'Founder Dashboard',
      description: 'Métricas estratégicas de negócio com análise preditiva',
      image: '/placeholder.svg?height=300&width=500&text=Founder+Dashboard',
      category: 'Estratégia',
      path: '/founder/dashboard',
      isNew: true
    },
    {
      id: 4,
      title: 'Gestão de Colaboradores',
      description: 'Controle completo do quadro de funcionários com filtros inteligentes',
      image: '/placeholder.svg?height=300&width=500&text=Gestão+Colaboradores',
      category: 'RH',
      path: '/app/collaborators'
    },
    {
      id: 5,
      title: 'Sistema de Gamificação',
      description: 'Badges, conquistas e ranking para engajar sua equipe',
      image: '/placeholder.svg?height=300&width=500&text=Gamificação',
      category: 'Engajamento',
      path: '/app/dashboard'
    },
    {
      id: 6,
      title: 'Onboarding Estruturado',
      description: 'Processo guiado de integração de novos colaboradores',
      image: '/placeholder.svg?height=300&width=500&text=Onboarding',
      category: 'RH',
      path: '/app/onboarding'
    }
  ];

  const quickStartGuide = [
    {
      step: 1,
      title: 'Configure sua Empresa',
      description: 'Defina departamentos, cargos e estrutura organizacional',
      icon: Settings,
      time: '5 min'
    },
    {
      step: 2,
      title: 'Adicione Colaboradores',
      description: 'Cadastre sua equipe e organize por departamentos',
      icon: Users,
      time: '10 min'
    },
    {
      step: 3,
      title: 'Execute Análise DISC',
      description: 'Conheça os perfis comportamentais da sua equipe',
      icon: Brain,
      time: '15 min'
    },
    {
      step: 4,
      title: 'Configure Metas',
      description: 'Defina objetivos e acompanhe o progresso',
      icon: Target,
      time: '8 min'
    }
  ];

  const resources = [
    {
      title: 'Guia de Primeiros Passos',
      description: 'Tutorial completo para começar a usar a plataforma',
      type: 'PDF',
      icon: FileText,
      downloadUrl: '#'
    },
    {
      title: 'Vídeo Tutorial - DISC',
      description: 'Como fazer e interpretar análises DISC',
      type: 'Vídeo',
      icon: Video,
      watchUrl: '#'
    },
    {
      title: 'Manual de Gamificação',
      description: 'Como implementar e gerenciar o sistema de badges',
      type: 'PDF',
      icon: Trophy,
      downloadUrl: '#'
    },
    {
      title: 'API Documentation',
      description: 'Documentação técnica para integrações',
      type: 'Web',
      icon: ExternalLink,
      externalUrl: '#'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header Moderno */}
      <div className="border-b bg-gradient-to-r from-primary/5 to-purple-100/50">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4">
              <BookOpen className="h-10 w-10 text-primary" />
              <h1 className="text-4xl font-bold">Central de Documentação</h1>
            </div>
            <p className="text-xl text-muted-foreground mb-6">
              Explore todas as funcionalidades da Humansys e maximize o potencial da sua gestão de RH
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button size="lg" onClick={() => navigate('/app/dashboard')}>
                <Play className="h-5 w-5 mr-2" />
                Começar Agora
              </Button>
              <Button variant="outline" size="lg">
                <Video className="h-5 w-5 mr-2" />
                Ver Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="showcase" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
            <TabsTrigger value="showcase">Showcase</TabsTrigger>
            <TabsTrigger value="quickstart">Início Rápido</TabsTrigger>
            <TabsTrigger value="features">Funcionalidades</TabsTrigger>
            <TabsTrigger value="resources">Recursos</TabsTrigger>
          </TabsList>

          <TabsContent value="showcase" className="space-y-8">
            {/* Carrossel Principal */}
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Conheça Nossa Plataforma</CardTitle>
                <CardDescription className="text-center">
                  Explore visualmente as principais funcionalidades que vão transformar sua gestão de RH
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Carousel className="w-full max-w-5xl mx-auto">
                  <CarouselContent>
                    {platformFeatures.map((feature) => (
                      <CarouselItem key={feature.id} className="md:basis-1/2 lg:basis-1/3">
                        <Card className="h-full cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1" 
                              onClick={() => navigate(feature.path)}>
                          <CardContent className="p-0">
                            <div className="relative">
                              <img 
                                src={feature.image} 
                                alt={feature.title}
                                className="w-full h-48 object-cover rounded-t-lg"
                              />
                              <div className="absolute top-3 right-3 flex gap-1">
                                {feature.isNew && (
                                  <Badge className="bg-green-500 text-white">Novo</Badge>
                                )}
                                <Badge variant="outline">{feature.category}</Badge>
                              </div>
                            </div>
                            <div className="p-4">
                              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                              <p className="text-sm text-muted-foreground mb-3">
                                {feature.description}
                              </p>
                              <Button variant="outline" size="sm" className="w-full">
                                Explorar <ArrowRight className="h-4 w-4 ml-2" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </CardContent>
            </Card>

            {/* Estatísticas da Plataforma */}
            <div className="grid gap-6 md:grid-cols-4">
              <Card className="text-center">
                <CardContent className="p-6">
                  <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">50+</div>
                  <div className="text-sm text-muted-foreground">Funcionalidades</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <Brain className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">IA</div>
                  <div className="text-sm text-muted-foreground">Insights Inteligentes</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">100%</div>
                  <div className="text-sm text-muted-foreground">Gamificado</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <BarChart3 className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">Real-time</div>
                  <div className="text-sm text-muted-foreground">Analytics</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="quickstart" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Primeiros Passos</CardTitle>
                <CardDescription>
                  Siga este guia para configurar sua plataforma em menos de 30 minutos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {quickStartGuide.map((step) => (
                    <div key={step.step} className="flex gap-4 p-4 border rounded-lg">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <step.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">Passo {step.step}: {step.title}</h3>
                          <Badge variant="outline">{step.time}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-800">Dica Pro</span>
                  </div>
                  <p className="text-sm text-green-700">
                    Use o assistente virtual durante a configuração inicial para dicas personalizadas baseadas no seu setor.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: Brain, title: 'Análise DISC', desc: 'IA para perfil comportamental', path: '/app/disc', new: true },
                { icon: Crown, title: 'Founder Dashboard', desc: 'Métricas estratégicas', path: '/founder/dashboard', new: true },
                { icon: Users, title: 'Colaboradores', desc: 'Gestão completa da equipe', path: '/app/collaborators' },
                { icon: UserPlus, title: 'Onboarding', desc: 'Integração estruturada', path: '/app/onboarding' },
                { icon: MessageSquare, title: 'Feedback 360°', desc: 'Avaliações completas', path: '/app/feedback' },
                { icon: Target, title: 'Metas & PDI', desc: 'Desenvolvimento individual', path: '/app/goals' },
                { icon: Video, title: 'Treinamentos', desc: 'Plataforma de cursos', path: '/app/training' },
                { icon: Calendar, title: 'Reuniões 1:1', desc: 'Agendamento inteligente', path: '/app/meetings' },
                { icon: Trophy, title: 'Gamificação', desc: 'Badges e conquistas', path: '/app/dashboard' }
              ].map((feature, index) => (
                <Card key={index} className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                      onClick={() => navigate(feature.path)}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      {feature.new && (
                        <Badge className="bg-green-500 text-white">Novo</Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription>{feature.desc}</CardDescription>
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

          <TabsContent value="resources" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {resources.map((resource, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <resource.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{resource.title}</CardTitle>
                        <Badge variant="outline">{resource.type}</Badge>
                      </div>
                    </div>
                    <CardDescription>{resource.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      {resource.type === 'PDF' && <Download className="h-4 w-4 mr-2" />}
                      {resource.type === 'Vídeo' && <Play className="h-4 w-4 mr-2" />}
                      {resource.type === 'Web' && <ExternalLink className="h-4 w-4 mr-2" />}
                      {resource.type === 'PDF' ? 'Download' : resource.type === 'Vídeo' ? 'Assistir' : 'Acessar'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-6 w-6 text-blue-600" />
                  Precisa de Ajuda Personalizada?
                </CardTitle>
                <CardDescription>
                  Nossa equipe está disponível para orientações específicas sobre implementação
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Button>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Chat de Suporte
                  </Button>
                  <Button variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    Agendar Consultoria
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
