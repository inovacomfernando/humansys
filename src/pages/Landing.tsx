import React from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DynamicBadge } from '@/components/landing/DynamicBadge';
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
  TrendingDown
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
      monthlyPrice: 'R$ 79',
      yearlyPrice: 'R$ 790',
      popular: false,
      features: [
        'Até 10 colaboradores',
        'Onboarding básico',
        'Gestão de documentos',
        'Analytics básicas',
        'Gamificação simples',
        'Dashboard founder simplificado',
        'Suporte por email',
        '1 GB de armazenamento'
      ]
    },
    {
      name: 'Em Crescimento',
      description: 'Ideal para empresas em expansão',
      monthlyPrice: 'R$ 129',
      yearlyPrice: 'R$ 1290',
      popular: true,
      features: [
        'Até 50 colaboradores',
        'Onboarding completo com vídeos',
        'Sistema de feedback 360°',
        'Treinamentos interativos',
        'Gamificação completa',
        'Analytics avançadas',
        'Dashboard founder completo',
        'Alertas departamentais',
        'PWA móvel',
        'Pesquisas de clima',
        'Suporte prioritário',
        '10 GB de armazenamento'
      ]
    },
    {
      name: 'Profissional',
      description: 'Para empresas estabelecidas',
      monthlyPrice: 'R$ 299',
      yearlyPrice: 'R$ 2990',
      popular: false,
      features: [
        'Colaboradores ilimitados',
        'Todas as funcionalidades',
        'IA preditiva para turnover',
        'ML insights avançados',
        'Dashboard founder premium',
        'Alertas inteligentes 24/7',
        'Previsões de receita com IA',
        'Métricas SaaS completas',
        'Relatórios executivos',
        'API personalizada',
        'Suporte 24/7',
        'Armazenamento ilimitado',
        'White label',
        'Consultoria estratégica'
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
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10 py-20 md:py-32">
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

      {/* Novidades Section */}
      <section className="py-20 md:py-32 bg-gradient-to-r from-purple-50 to-blue-50">
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
      <section className="py-20 md:py-32">
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
              <div key={index} className="group relative">
                <div className="relative overflow-hidden bg-background border rounded-lg p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/50">
                  {/* Animated border on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" 
                       style={{
                         background: 'linear-gradient(90deg, transparent 0%, rgba(59, 130, 246, 0.3) 50%, transparent 100%)',
                         animation: 'none'
                       }}>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-all duration-300 rounded-lg"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      {feature.isNew && (
                        <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          Novo
                        </div>
                      )}
                    </div>
                    
                    <h3 className="font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      {feature.description}
                    </p>
                    
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
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 md:py-32 bg-muted/50">
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

      {/* Benefits Section */}
      <section className="py-20 md:py-32">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold md:text-4xl">
                Resultados Comprovados
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Empresas que usam nossa solução veem resultados imediatos
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-lg">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-32 bg-muted/50">
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
      <section className="py-20 md:py-32 bg-primary">
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