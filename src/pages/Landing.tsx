import React from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DynamicBadge } from '@/components/landing/DynamicBadge';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Users,
  UserPlus,
  MessageSquare,
  Target,
  BookOpen,
  Award,
  FileText,
  BarChart3,
  Check,
  Star,
  Zap,
  Shield,
  Sparkles,
  Linkedin,
  Instagram,
  Facebook,
  Github,
  Brain,
  Trophy,
  Smartphone,
  TrendingUp,
  Video,
  Crown,
  DollarSign,
  TrendingDown,
  CreditCard
} from 'lucide-react';
import { useDebounceNavigation } from '@/hooks/useDebounceNavigation';
import { FeatureCard } from '@/components/landing/FeatureCard';

export const Landing = () => {
  const { debouncedNavigate } = useDebounceNavigation();

  const features = [
    {
      icon: Brain,
      title: 'Analytics com IA',
      description: 'Machine Learning para prever turnover e identificar talentos em risco.',
      path: '/app/analytics',
      isNew: true,
      realImpact: {
        metric: 'Precisão de 85% na previsão de turnover',
        example: 'Empresa TechCorp identificou 12 colaboradores em risco',
        benefit: 'Redução de 60% na rotatividade não planejada'
      }
    },
    {
      icon: Crown,
      title: 'Founder Dashboard',
      description: 'Métricas estratégicas de negócio com IA preditiva para founders.',
      path: '/app/founder/dashboard',
      isNew: true,
      realImpact: {
        metric: 'Visibilidade 360° do negócio em tempo real',
        example: 'MRR, Churn, LTV/CAC e previsões de crescimento',
        benefit: 'Decisões estratégicas baseadas em dados e IA'
      }
    },
    {
      icon: Trophy,
      title: 'Gamificação Completa',
      description: 'Sistema de badges, conquistas e ranking para engajar colaboradores.',
      path: '/app/dashboard',
      isNew: true,
      realImpact: {
        metric: 'Aumento de 45% no engajamento',
        example: 'Startup XYZ viu 90% de participação em treinamentos',
        benefit: 'Melhoria de 35% na produtividade da equipe'
      }
    },
    {
      icon: UserPlus,
      title: 'Onboarding Inteligente',
      description: 'Processo estruturado de integração com acompanhamento automático.',
      path: '/app/onboarding',
      realImpact: {
        metric: 'Redução de 70% no tempo de integração',
        example: 'De 30 dias para 9 dias para produtividade total',
        benefit: 'Satisfação de novos funcionários em 95%'
      }
    },
    {
      icon: Users,
      title: 'Gestão de Colaboradores',
      description: 'Controle completo do quadro de funcionários, estagiários e terceiros.',
      path: '/app/collaborators',
      realImpact: {
        metric: 'Centralização de 100% dos dados',
        example: 'Visão unificada de 500+ colaboradores em tempo real',
        benefit: 'Economia de 8h semanais em relatórios'
      }
    },
    {
      icon: MessageSquare,
      title: 'Feedback 360°',
      description: 'Sistema completo de feedbacks e avaliações de performance.',
      path: '/app/feedback',
      realImpact: {
        metric: 'Aumento de 60% na comunicação',
        example: '95% dos feedbacks entregues dentro do prazo',
        benefit: 'Melhoria de 40% no clima organizacional'
      }
    },
    {
      icon: Target,
      title: 'Metas & PDI',
      description: 'Plano de Desenvolvimento Individual com controle de metas e indicadores.',
      path: '/app/goals',
      realImpact: {
        metric: 'Aumento de 55% no alcance de metas',
        example: '80% das metas atingidas vs. 45% anterior',
        benefit: 'Crescimento profissional estruturado para todos'
      }
    },
    {
      icon: Video,
      title: 'Treinamentos Interativos',
      description: 'Plataforma de cursos com player de vídeo integrado e certificação.',
      path: '/app/training',
      realImpact: {
        metric: 'Conclusão de 85% dos treinamentos',
        example: 'Certificação automática de 200+ colaboradores',
        benefit: 'ROI de 300% em desenvolvimento de talentos'
      }
    },
    {
      icon: Smartphone,
      title: 'Progressive Web App',
      description: 'Funciona offline e pode ser instalado como aplicativo nativo.',
      path: '/app/dashboard',
      isNew: true,
      realImpact: {
        metric: 'Acesso 24/7 mesmo offline',
        example: 'Funcionários remotos mantêm produtividade',
        benefit: 'Aumento de 25% na utilização do sistema'
      }
    }
  ];

  const benefits = [
    'Redução de 70% no tempo de onboarding',
    'Aumento de 45% na retenção de talentos',
    'Melhoria de 60% na comunicação interna',
    'Economia de 50% em processos manuais',
    'IA prevê turnover com 85% de precisão',
    'Gamificação aumenta engajamento em 40%',
    'Dashboard founder com métricas em tempo real',
    'Alertas inteligentes para departamentos',
    'Previsões de receita com IA preditiva'
  ];

  const plans = [
    {
      name: 'Inicial',
      description: 'Perfeito para empresas iniciantes',
      monthlyPrice: 'R$ 127',
      yearlyPrice: 'R$ 1270',
      popular: false,
      features: [
        'Até 15 colaboradores',
        'Onboarding estruturado',
        'Gestão de documentos',
        'Gamificação básica',
        'Análise DISC básica',
        'Suporte por email',
        'Relatórios essenciais'
      ]
    },
    {
      name: 'Em Crescimento',
      description: 'Ideal para empresas em expansão',
      monthlyPrice: 'R$ 247',
      yearlyPrice: 'R$ 2470',
      popular: true,
      features: [
        'Até 75 colaboradores',
        'Onboarding completo com gamificação',
        'Sistema de feedback 360°',
        'Treinamentos e certificados',
        'Pesquisas de clima organizacional',
        'Analytics com IA preditiva',
        'Análise DISC completa',
        'Suporte prioritário',
        'Integração com sistemas externos'
      ]
    },
    {
      name: 'Profissional',
      description: 'Para empresas estabelecidas',
      monthlyPrice: 'R$ 497',
      yearlyPrice: 'R$ 4970',
      popular: false,
      features: [
        'Colaboradores ilimitados',
        'Todas as funcionalidades premium',
        'IA avançada para predição de turnover',
        'Gamificação completa com leaderboards',
        'Relatórios executivos automatizados',
        'API personalizada e webhooks',
        'Suporte 24/7 com CSM dedicado',
        'White label completo',
        'Consultoria estratégica mensal',
        'Implementação assistida'
      ]
    }
  ];

  const testimonials = [
    {
      name: 'Maria Silva',
      role: 'Diretora de RH',
      company: 'TechCorp',
      content: 'A IA da Humansys nos ajudou a reduzir o turnover em 60%. Incrível!',
      rating: 5
    },
    {
      name: 'João Santos',
      role: 'CEO',
      company: 'StartupXYZ',
      content: 'O sistema de gamificação transformou o engajamento da nossa equipe.',
      rating: 5
    }
  ];

  const socialLinks = [
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Github, href: '#', label: 'GitHub' }
  ];

  const handleFeatureClick = (path: string) => {
    debouncedNavigate(path);
  };

  const handlePlanSelection = (planName: string, price: string, billing: 'monthly' | 'yearly') => {
    debouncedNavigate('/plans', { 
      state: { 
        selectedPlan: planName, 
        selectedPrice: price,
        selectedBilling: billing 
      } 
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header showAuth />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10 py-16 md:py-24">
        <div className="container relative z-10">
          <div className="mx-auto max-w-4xl text-center animate-fade-in">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg animate-pulse">
                  🚀 Novo: Founder Dashboard com IA Preditiva
                </div>
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              Transforme sua
              <span className="text-primary"> Gestão de Pessoas</span>
              <span className="block text-3xl md:text-4xl lg:text-5xl mt-2 text-muted-foreground">
                com Inteligência Artificial
              </span>
            </h1>
            <p className="mt-6 text-xl text-muted-foreground md:text-2xl">
              A Humansys é uma plataforma completa com IA preditiva, gamificação e PWA. 
              Preveja turnover, engaje colaboradores e transforme seu RH.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6"
                onClick={() => debouncedNavigate('/checkout', { 
                  state: { 
                    selectedPlan: 'Teste Grátis', 
                    selectedPrice: 'Grátis',
                    selectedBilling: 'trial' 
                  } 
                })}
              >
                <Zap className="mr-2 h-5 w-5" />
                Começar Teste Grátis
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-6"
                onClick={() => debouncedNavigate('/changelog')}
              >
                <TrendingUp className="mr-2 h-5 w-5" />
                Ver Novidades
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Screenshots Carousel Section */}
      <section className="py-12 md:py-20 bg-gradient-to-r from-slate-50 to-gray-50">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg border border-blue-300">
                <Smartphone className="mr-1 h-3 w-3 inline" />
                Interface Moderna
              </div>
            </div>
            <h2 className="text-3xl font-bold md:text-4xl">
              Visual Moderno e Intuitivo
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Conheça nossa interface elegante e funcional que facilita a gestão de RH
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                <CarouselItem className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                  <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-500 border-0 bg-white">
                    <div className="aspect-video bg-gradient-to-br from-blue-500 to-indigo-600 relative overflow-hidden">
                      <div className="absolute inset-0 bg-black/20"></div>
                      <div className="absolute inset-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 flex items-center justify-center">
                        <div className="text-center text-white">
                          <Users className="h-12 w-12 mx-auto mb-2 opacity-80" />
                          <h3 className="font-semibold text-lg">Dashboard Principal</h3>
                          <p className="text-sm opacity-90">Visão geral completa</p>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">Dashboard Executivo</h3>
                      <p className="text-sm text-muted-foreground">Central de controle com métricas em tempo real e insights de IA</p>
                    </CardContent>
                  </Card>
                </CarouselItem>

                <CarouselItem className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                  <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-500 border-0 bg-white">
                    <div className="aspect-video bg-gradient-to-br from-green-500 to-emerald-600 relative overflow-hidden">
                      <div className="absolute inset-0 bg-black/20"></div>
                      <div className="absolute inset-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 flex items-center justify-center">
                        <div className="text-center text-white">
                          <UserPlus className="h-12 w-12 mx-auto mb-2 opacity-80" />
                          <h3 className="font-semibold text-lg">Gestão de Pessoas</h3>
                          <p className="text-sm opacity-90">Controle total</p>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">Gestão de Colaboradores</h3>
                      <p className="text-sm text-muted-foreground">Interface moderna para gerenciar toda sua equipe com facilidade</p>
                    </CardContent>
                  </Card>
                </CarouselItem>

                <CarouselItem className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                  <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-500 border-0 bg-white">
                    <div className="aspect-video bg-gradient-to-br from-purple-500 to-pink-600 relative overflow-hidden">
                      <div className="absolute inset-0 bg-black/20"></div>
                      <div className="absolute inset-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 flex items-center justify-center">
                        <div className="text-center text-white">
                          <Trophy className="h-12 w-12 mx-auto mb-2 opacity-80" />
                          <h3 className="font-semibold text-lg">Gamificação</h3>
                          <p className="text-sm opacity-90">Engajamento total</p>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">Sistema de Badges</h3>
                      <p className="text-sm text-muted-foreground">Gamificação completa com conquistas e ranking para motivar sua equipe</p>
                    </CardContent>
                  </Card>
                </CarouselItem>

                <CarouselItem className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                  <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-500 border-0 bg-white">
                    <div className="aspect-video bg-gradient-to-br from-orange-500 to-red-600 relative overflow-hidden">
                      <div className="absolute inset-0 bg-black/20"></div>
                      <div className="absolute inset-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 flex items-center justify-center">
                        <div className="text-center text-white">
                          <Brain className="h-12 w-12 mx-auto mb-2 opacity-80" />
                          <h3 className="font-semibold text-lg">IA Analytics</h3>
                          <p className="text-sm opacity-90">Insights inteligentes</p>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">Analytics com IA</h3>
                      <p className="text-sm text-muted-foreground">Análises preditivas e insights automáticos para decisões estratégicas</p>
                    </CardContent>
                  </Card>
                </CarouselItem>

                <CarouselItem className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                  <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-500 border-0 bg-white">
                    <div className="aspect-video bg-gradient-to-br from-teal-500 to-cyan-600 relative overflow-hidden">
                      <div className="absolute inset-0 bg-black/20"></div>
                      <div className="absolute inset-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 flex items-center justify-center">
                        <div className="text-center text-white">
                          <Video className="h-12 w-12 mx-auto mb-2 opacity-80" />
                          <h3 className="font-semibold text-lg">Treinamentos</h3>
                          <p className="text-sm opacity-90">Plataforma completa</p>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">Portal de Treinamentos</h3>
                      <p className="text-sm text-muted-foreground">Plataforma de cursos com certificação automática e player integrado</p>
                    </CardContent>
                  </Card>
                </CarouselItem>

                <CarouselItem className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                  <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-500 border-0 bg-white">
                    <div className="aspect-video bg-gradient-to-br from-indigo-500 to-blue-600 relative overflow-hidden">
                      <div className="absolute inset-0 bg-black/20"></div>
                      <div className="absolute inset-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 flex items-center justify-center">
                        <div className="text-center text-white">
                          <Target className="h-12 w-12 mx-auto mb-2 opacity-80" />
                          <h3 className="font-semibold text-lg">Metas & PDI</h3>
                          <p className="text-sm opacity-90">Desenvolvimento contínuo</p>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">Gestão de Metas</h3>
                      <p className="text-sm text-muted-foreground">Plano de desenvolvimento individual com acompanhamento em tempo real</p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>

            <div className="text-center mt-12">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6"
                onClick={() => debouncedNavigate('/app/dashboard')}
              >
                <Smartphone className="mr-2 h-5 w-5" />
                Explorar Interface
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Novidades Section */}
      <section className="py-12 md:py-20 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg border border-purple-300 animate-pulse">
                <Sparkles className="mr-1 h-3 w-3 inline" />
                Lançamento Oficial
              </div>
            </div>
            <h2 className="text-3xl font-bold md:text-4xl">
              <Crown className="inline h-8 w-8 mr-2 text-yellow-500" />
              Novo Founder Dashboard
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Tome decisões estratégicas com métricas de negócio em tempo real e IA preditiva
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
            <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 group-hover:bg-green-200 transition-colors">
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">Métricas SaaS</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">
                  MRR, ARR, Churn Rate, LTV/CAC, NRR e todas as métricas essenciais para SaaS
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>MRR Tracking</span>
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex justify-between">
                    <span>Churn Analysis</span>
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex justify-between">
                    <span>Revenue Forecasting</span>
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 group-hover:bg-purple-200 transition-colors">
                  <Brain className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl">IA Preditiva</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">
                  Previsões inteligentes de churn, crescimento e otimizações automáticas
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Churn Prediction</span>
                    <Brain className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex justify-between">
                    <span>Revenue Forecast</span>
                    <Brain className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex justify-between">
                    <span>Smart Recommendations</span>
                    <Brain className="h-4 w-4 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 group-hover:bg-orange-200 transition-colors">
                  <Trophy className="h-8 w-8 text-orange-600" />
                </div>
                <CardTitle className="text-xl">Gamificação</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">
                  Sistema de níveis, conquistas e ranking para founders
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Level System</span>
                    <Trophy className="h-4 w-4 text-orange-600" />
                  </div>
                  <div className="flex justify-between">
                    <span>Achievements</span>
                    <Trophy className="h-4 w-4 text-orange-600" />
                  </div>
                  <div className="flex justify-between">
                    <span>Leaderboard</span>
                    <Trophy className="h-4 w-4 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6"
              onClick={() => debouncedNavigate('/app/founder/dashboard')}
            >
              <Crown className="mr-2 h-5 w-5" />
              Acessar Founder Dashboard
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold md:text-4xl">
              Funcionalidades Completas
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Todas as ferramentas que você precisa para uma gestão de RH eficiente
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card key={index} className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    {feature.isNew && (
                      <Badge className="bg-green-500 text-white">
                        Novo
                      </Badge>
                    )}
                  </div>

                  <CardTitle className="text-lg">
                    {feature.title}
                  </CardTitle>
                  <CardDescription>
                    {feature.description}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  {feature.realImpact && (
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center text-green-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        {feature.realImpact.metric}
                      </div>
                      <div className="text-muted-foreground">
                        {feature.realImpact.example}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-12 md:py-20 bg-muted/50">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold md:text-4xl">
              Planos Atualizados
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Agora com IA, gamificação e funcionalidades premium
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 mb-16">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'border-primary shadow-lg scale-105' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg border border-orange-300">
                    <Star className="mr-1 h-3 w-3 inline" />
                    Mais Popular
                  </div>
                )}

                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="text-base">{plan.description}</CardDescription>
                </CardHeader>

                <CardContent className="text-center">
                  <div className="mb-6">
                    <div className="text-4xl font-bold text-primary mb-2">
                      {plan.monthlyPrice}
                      <span className="text-base text-muted-foreground font-normal">/mês</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      ou {plan.yearlyPrice}/ano (2 meses grátis)
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center text-left">
                        <Check className="h-4 w-4 text-primary mr-3 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <Button 
                      className="w-full" 
                      variant={plan.popular ? "default" : "outline"}
                      onClick={() => handlePlanSelection(plan.name, plan.monthlyPrice, 'monthly')}
                    >
                      Contratar Mensal
                    </Button>
                    <Button 
                      className="w-full" 
                      variant="secondary"
                      onClick={() => handlePlanSelection(plan.name, plan.yearlyPrice, 'yearly')}
                    >
                      Contratar Anual
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Sistema de Créditos */}
      <section className="py-12 md:py-20 bg-gradient-to-r from-emerald-50 to-green-50">
        <div className="container">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <div className="flex justify-center mb-4">
                <div className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg border border-emerald-300">
                  <CreditCard className="mr-1 h-3 w-3 inline" />
                  Sistema de Créditos
                </div>
              </div>
              <h2 className="text-3xl font-bold md:text-4xl">
                Gestão Inteligente de Créditos
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Sistema transparente e flexível para controlar o cadastro de colaboradores
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3 mb-12">
              <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">1 Crédito = 1 Colaborador</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground mb-4">
                    Sistema simples: cada colaborador cadastrado consome 1 crédito
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Cadastro completo</span>
                      <Badge variant="outline">1 crédito</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Onboarding incluído</span>
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex justify-between">
                      <span>Gamificação ativa</span>
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-primary">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                    <Shield className="h-8 w-8 text-purple-600" />
                  </div>
                  <CardTitle className="text-xl">Planos Flexíveis</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground mb-4">
                    Escolha o plano ideal para o tamanho da sua empresa
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Inicial</span>
                      <Badge className="bg-green-100 text-green-800">10 créditos</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Crescimento</span>
                      <Badge className="bg-blue-100 text-blue-800">50 créditos</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Profissional</span>
                      <Badge className="bg-purple-100 text-purple-800">500 créditos</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                    <BarChart3 className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle className="text-xl">Controle Total</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground mb-4">
                    Acompanhe o uso de créditos em tempo real no dashboard
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Histórico completo</span>
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex justify-between">
                      <span>Alertas automáticos</span>
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex justify-between">
                      <span>Upgrade fácil</span>
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <Card className="inline-block bg-gradient-to-r from-emerald-500 to-green-500 text-white p-6">
                <CardContent className="pt-0">
                  <h3 className="text-xl font-bold mb-2">🎁 Teste Grátis com Créditos Ilimitados</h3>
                  <p className="mb-4">Experimente todas as funcionalidades por 30 dias sem limitações</p>
                  <Button 
                    variant="secondary" 
                    size="lg"
                    onClick={() => debouncedNavigate('/checkout', { 
                      state: { 
                        selectedPlan: 'Teste Grátis', 
                        selectedPrice: 'Grátis',
                        selectedBilling: 'trial' 
                      } 
                    })}
                  >
                    Começar Teste Grátis
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Análise DISC Section */}
      <section className="py-12 md:py-20 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="container">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <div className="flex justify-center mb-4">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg border border-indigo-300 animate-pulse">
                  <Brain className="mr-1 h-3 w-3 inline" />
                  Nova Funcionalidade
                </div>
              </div>
              <h2 className="text-3xl font-bold md:text-4xl">
                <Brain className="inline h-8 w-8 mr-2 text-indigo-600" />
                Análise de Perfil DISC com IA
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Descubra o perfil comportamental dos seus colaboradores com análise avançada e insights de IA
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-12">
              <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-200 transition-colors">
                    <span className="text-2xl font-bold text-red-600">D</span>
                  </div>
                  <CardTitle className="text-xl">Dominante</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    Orientado para resultados, direto e determinado
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-center">
                      <Badge className="bg-red-100 text-red-800">Liderança Natural</Badge>
                    </div>
                    <div className="flex justify-center">
                      <Badge className="bg-red-100 text-red-800">Foco em Resultados</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-yellow-200 transition-colors">
                    <span className="text-2xl font-bold text-yellow-600">I</span>
                  </div>
                  <CardTitle className="text-xl">Influente</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    Sociável, otimista e persuasivo
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-center">
                      <Badge className="bg-yellow-100 text-yellow-800">Comunicativo</Badge>
                    </div>
                    <div className="flex justify-center">
                      <Badge className="bg-yellow-100 text-yellow-800">Motivador</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                    <span className="text-2xl font-bold text-green-600">S</span>
                  </div>
                  <CardTitle className="text-xl">Estável</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    Paciente, confiável e colaborativo
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-center">
                      <Badge className="bg-green-100 text-green-800">Trabalho em Equipe</Badge>
                    </div>
                    <div className="flex justify-center">
                      <Badge className="bg-green-100 text-green-800">Estabilidade</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                    <span className="text-2xl font-bold text-blue-600">C</span>
                  </div>
                  <CardTitle className="text-xl">Consciencioso</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    Preciso, analítico e sistemático
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-center">
                      <Badge className="bg-blue-100 text-blue-800">Atenção aos Detalhes</Badge>
                    </div>
                    <div className="flex justify-center">
                      <Badge className="bg-blue-100 text-blue-800">Analítico</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Benefícios da Análise DISC */}
            <div className="grid gap-8 md:grid-cols-2 mb-12">
              <Card className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5"></div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-6 w-6 text-purple-600" />
                    Insights de Inteligência Artificial
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Análise comportamental avançada com IA</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Previsões de performance e adaptabilidade</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Recomendações personalizadas de carreira</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Gamificação com badges e conquistas</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-blue-500/5"></div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-6 w-6 text-indigo-600" />
                    Aplicações Práticas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Formação de equipes complementares</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Desenvolvimento de lideranças</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Otimização da comunicação interna</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Relatórios detalhados em HTML</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <Card className="inline-block bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-6">
                <CardContent className="pt-0">
                  <h3 className="text-xl font-bold mb-2">🧠 Análise DISC Disponível Agora!</h3>
                  <p className="mb-4">Descubra o perfil comportamental dos seus colaboradores</p>
                  <Button 
                    variant="secondary" 
                    size="lg"
                    onClick={() => debouncedNavigate('/app/disc')}
                  >
                    <Brain className="mr-2 h-5 w-5" />
                    Fazer Análise DISC
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold md:text-4xl">
                Resultados Comprovados
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Empresas que usam nossa solução veem resultados imediatos
              </p>
            </div>

            {/* Métricas Principais com Gráficos */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
              <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-green-600">70%</CardTitle>
                  <p className="text-sm text-muted-foreground">Redução no tempo de onboarding</p>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full animate-pulse"
                        style={{ width: '70%', animation: 'progress-fill 2s ease-in-out' }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Antes: 30 dias</span>
                      <span>Agora: 9 dias</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-blue-600">45%</CardTitle>
                  <p className="text-sm text-muted-foreground">Aumento na retenção de talentos</p>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                      <div 
                        className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full animate-pulse"
                        style={{ width: '45%', animation: 'progress-fill 2.5s ease-in-out' }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Turnover: -45%</span>
                      <span>Satisfação: +60%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                    <Brain className="h-8 w-8 text-purple-600" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-purple-600">85%</CardTitle>
                  <p className="text-sm text-muted-foreground">Precisão da IA em previsão de turnover</p>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                      <div 
                        className="bg-gradient-to-r from-purple-400 to-purple-600 h-3 rounded-full animate-pulse"
                        style={{ width: '85%', animation: 'progress-fill 3s ease-in-out' }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Predições corretas</span>
                      <span>Machine Learning</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Gráfico de ROI */}
            <Card className="mb-12">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Retorno do Investimento</CardTitle>
                <CardDescription>Economia média por empresa nos primeiros 12 meses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">R$ 2.5M</div>
                    <p className="text-sm text-muted-foreground">Economia em processos</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: '0%', animation: 'progress-fill 2s ease-in-out forwards' }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">R$ 1.8M</div>
                    <p className="text-sm text-muted-foreground">Redução em recontratações</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: '0%', animation: 'progress-fill 2.5s ease-in-out forwards' }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">R$ 3.2M</div>
                    <p className="text-sm text-muted-foreground">Aumento de produtividade</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full"
                        style={{ width: '0%', animation: 'progress-fill 3s ease-in-out forwards' }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>


          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 md:py-20 bg-muted/50">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold md:text-4xl">
              Cases de Sucesso
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Veja o que nossos clientes estão dizendo
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="relative">
                <CardHeader>
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardDescription className="text-base italic">
                    "{testimonial.content}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role} - {testimonial.company}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center text-white">
            <h2 className="text-3xl font-bold md:text-4xl">
              Pronto para Revolucionar seu RH?
            </h2>
            <p className="mt-4 text-lg opacity-90">
              Junte-se a centenas de empresas que já transformaram sua gestão de RH com IA
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                className="text-lg px-8 py-6"
                onClick={() => debouncedNavigate('/checkout', { 
                  state: { 
                    selectedPlan: 'Teste Grátis', 
                    selectedPrice: 'Grátis',
                    selectedBilling: 'trial' 
                  } 
                })}
              >
                <Shield className="mr-2 h-5 w-5" />
                Teste Grátis por 30 Dias
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-primary"
                onClick={() => debouncedNavigate('/plans')}
              >
                Ver Planos
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="font-semibold mb-4">Produto</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button onClick={() => debouncedNavigate('/app/dashboard')} className="hover:text-primary text-left">Funcionalidades</button></li>
                <li><button onClick={() => debouncedNavigate('/plans')} className="hover:text-primary text-left">Preços</button></li>
                <li><button onClick={() => debouncedNavigate('/changelog')} className="hover:text-primary text-left">Novidades</button></li>
                <li><button onClick={() => debouncedNavigate('/app/settings')} className="hover:text-primary text-left">Integrações</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Empresa</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button onClick={() => debouncedNavigate('/about')} className="hover:text-primary text-left">Sobre</button></li>
                <li><button onClick={() => debouncedNavigate('/careers')} className="hover:text-primary text-left">Carreiras</button></li>
                <li><button onClick={() => debouncedNavigate('/blog')} className="hover:text-primary text-left">Blog</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Suporte</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button onClick={() => debouncedNavigate('/documentation')} className="hover:text-primary text-left">Documentação</button></li>
                <li><button onClick={() => debouncedNavigate('/help')} className="hover:text-primary text-left">Ajuda</button></li>
                <li><button onClick={() => debouncedNavigate('/contact')} className="hover:text-primary text-left">Contato</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button onClick={() => debouncedNavigate('/privacy')} className="hover:text-primary text-left">Política de Privacidade</button></li>
                <li><button onClick={() => debouncedNavigate('/terms')} className="hover:text-primary text-left">Termos de Uso</button></li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">
              &copy; 2024 Humansys. Todos os direitos reservados.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label={social.label}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};