
import React from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Users, Target, BookOpen, MessageSquare, BarChart3, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Users,
      title: 'Gestão de Colaboradores',
      description: 'Centralize informações e gerencie todo o ciclo de vida dos seus colaboradores',
      color: 'bg-blue-500'
    },
    {
      icon: Target,
      title: 'Metas & PDI',
      description: 'Defina objetivos claros e acompanhe o desenvolvimento individual',
      color: 'bg-green-500'
    },
    {
      icon: BookOpen,
      title: 'Treinamentos',
      description: 'Crie e gerencie programas de capacitação personalizados',
      color: 'bg-purple-500'
    },
    {
      icon: MessageSquare,
      title: 'Feedback 360°',
      description: 'Feedback estruturado e contínuo para desenvolvimento profissional',
      color: 'bg-orange-500'
    },
    {
      icon: BarChart3,
      title: 'Analytics Avançado',
      description: 'Insights inteligentes para tomada de decisão estratégica',
      color: 'bg-red-500'
    },
    {
      icon: Award,
      title: 'Certificações',
      description: 'Emita certificados automaticamente e reconheça conquistas',
      color: 'bg-yellow-500'
    }
  ];

  const plans = [
    {
      name: 'Starter',
      price: 'R$ 49',
      period: '/mês',
      description: 'Perfeito para pequenas empresas',
      features: [
        'Até 50 colaboradores',
        'Gestão básica de RH',
        'Relatórios essenciais',
        'Suporte por email'
      ],
      recommended: false
    },
    {
      name: 'Professional',
      price: 'R$ 99',
      period: '/mês',
      description: 'Ideal para empresas em crescimento',
      features: [
        'Até 200 colaboradores',
        'Módulos avançados',
        'Analytics completo',
        'Integrações API',
        'Suporte prioritário'
      ],
      recommended: true
    },
    {
      name: 'Enterprise',
      price: 'R$ 199',
      period: '/mês',
      description: 'Para grandes organizações',
      features: [
        'Colaboradores ilimitados',
        'Customizações avançadas',
        'AI & Machine Learning',
        'Suporte dedicado',
        'Consultoria estratégica'
      ],
      recommended: false
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header showAuth />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <Badge variant="secondary" className="mb-4">
                🚀 Nova versão com IA disponível
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                Transforme seu
                <span className="text-primary"> RH </span>
                com Inteligência Artificial
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
                A plataforma completa para gestão de pessoas que usa IA para otimizar processos, 
                aumentar engajamento e impulsionar resultados.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" onClick={() => navigate('/checkout')}>
                  Teste Grátis por 14 dias
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate('/app/changelog')}>
                  Ver Novidades
                </Button>
              </div>
            </div>
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-3xl"></div>
                <img 
                  src="/lovable-uploads/hero-dashboard.png" 
                  alt="Dashboard Humansys" 
                  className="relative rounded-2xl shadow-2xl border"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Funcionalidades que Fazem a Diferença
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Descubra como nossa plataforma pode revolucionar a gestão de RH da sua empresa
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index} 
                  className="group hover:shadow-xl transition-all duration-300 border-0 bg-card/50 backdrop-blur"
                >
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Planos que Crescem com sua Empresa
            </h2>
            <p className="text-xl text-muted-foreground">
              Escolha o plano ideal para suas necessidades
            </p>
          </div>
          
          <div className="grid gap-8 lg:grid-cols-3 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.recommended ? 'border-primary shadow-xl scale-105' : ''}`}>
                {plan.recommended && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    Mais Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3">
                        <Check className="h-5 w-5 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full" 
                    variant={plan.recommended ? 'default' : 'outline'}
                    onClick={() => navigate('/checkout', { state: { plan: plan.name } })}
                  >
                    {plan.recommended ? 'Começar Agora' : 'Escolher Plano'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Mais de 500 Empresas Confiam na Humansys
            </h2>
            <div className="flex items-center justify-center gap-2 mb-8">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="ml-2 text-lg font-medium">4.9/5 (127 avaliações)</span>
            </div>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                    M
                  </div>
                  <div>
                    <h4 className="font-semibold">Maria Silva</h4>
                    <p className="text-sm text-muted-foreground">Diretora de RH, TechCorp</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  "A Humansys revolucionou nossos processos de RH. Conseguimos reduzir o turnover em 40% e aumentar o engajamento da equipe significativamente."
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                    J
                  </div>
                  <div>
                    <h4 className="font-semibold">João Santos</h4>
                    <p className="text-sm text-muted-foreground">CEO, StartupX</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  "Interface intuitiva e recursos poderosos. Em 6 meses, nossa produtividade aumentou 60% e os colaboradores estão mais satisfeitos."
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                    A
                  </div>
                  <div>
                    <h4 className="font-semibold">Ana Costa</h4>
                    <p className="text-sm text-muted-foreground">Gerente de Pessoas, InnovaCorp</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  "O suporte é excepcional e as funcionalidades atendem todas nossas necessidades. Recomendo para qualquer empresa que busca excelência em RH."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Pronto para Transformar seu RH?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Junte-se a centenas de empresas que já transformaram sua gestão de pessoas
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate('/checkout')}>
                Começar Teste Gratuito
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/contact')}>
                Falar com Especialista
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <h3 className="font-bold text-lg mb-4">Humansys</h3>
              <p className="text-muted-foreground mb-4">
                Transformando a gestão de RH com inteligência artificial e inovação.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="/app/collaborators" className="hover:text-primary transition-colors">Funcionalidades</a></li>
                <li><a href="/app/analytics" className="hover:text-primary transition-colors">Analytics</a></li>
                <li><a href="/app/training" className="hover:text-primary transition-colors">Treinamentos</a></li>
                <li><a href="/app/certificates" className="hover:text-primary transition-colors">Certificações</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="/about" className="hover:text-primary transition-colors">Sobre</a></li>
                <li><a href="/contact" className="hover:text-primary transition-colors">Contato</a></li>
                <li><a href="/help" className="hover:text-primary transition-colors">Suporte</a></li>
                <li><a href="/app/changelog" className="hover:text-primary transition-colors">Novidades</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="/privacy" className="hover:text-primary transition-colors">Privacidade</a></li>
                <li><a href="/terms" className="hover:text-primary transition-colors">Termos</a></li>
                <li><a href="/security" className="hover:text-primary transition-colors">Segurança</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-12 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 Humansys. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
