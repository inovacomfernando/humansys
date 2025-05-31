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
  Video
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
    'Gamificação aumenta engajamento em 40%'
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
            <DynamicBadge className="mb-4">
              <Sparkles className="mr-1 h-3 w-3" />
              Agora com IA e Gamificação
            </DynamicBadge>
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
                onClick={() => debouncedNavigate('/plans')}
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
              <FeatureCard
                key={index}
                {...feature}
                onClick={handleFeatureClick}
              />
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
                  <DynamicBadge className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Star className="mr-1 h-3 w-3" />
                    Mais Popular
                  </DynamicBadge>
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
                onClick={() => debouncedNavigate('/plans')}
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
