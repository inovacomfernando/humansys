
import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DynamicBadge } from '@/components/landing/DynamicBadge';
import { Check, Star, Brain, Trophy, Zap, Smartphone, Users } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export const Plans = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  
  // Pre-select plan if coming from landing page
  useEffect(() => {
    if (location.state?.selectedBilling) {
      setBilling(location.state.selectedBilling);
    }
  }, [location.state]);

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
        'Gamificação básica',
        'Suporte por email',
        '1 GB de armazenamento',
        'PWA para acesso mobile'
      ]
    },
    {
      name: 'Em Crescimento',
      description: 'Ideal para empresas em expansão',
      monthlyPrice: 'R$ 149',
      yearlyPrice: 'R$ 1490',
      popular: true,
      features: [
        'Até 50 colaboradores',
        'Onboarding completo com gamificação',
        'Sistema de feedback avançado',
        'Treinamentos e certificados',
        'Pesquisas de clima',
        'Analytics básica com IA',
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
        'IA para triagem e análises preditivas',
        'Gamificação completa com leaderboards',
        'Relatórios avançados',
        'API personalizada',
        'Suporte 24/7',
        'Armazenamento ilimitado',
        'White label'
      ]
    }
  ];

  const featureIcons = {
    'Até 10 colaboradores': <Users className="h-4 w-4 text-primary mr-2" />,
    'Até 50 colaboradores': <Users className="h-4 w-4 text-primary mr-2" />,
    'Colaboradores ilimitados': <Users className="h-4 w-4 text-primary mr-2" />,
    'Gamificação básica': <Trophy className="h-4 w-4 text-yellow-500 mr-2" />,
    'Onboarding completo com gamificação': <Trophy className="h-4 w-4 text-yellow-500 mr-2" />,
    'Gamificação completa com leaderboards': <Trophy className="h-4 w-4 text-yellow-500 mr-2" />,
    'Analytics básica com IA': <Brain className="h-4 w-4 text-purple-500 mr-2" />,
    'IA para triagem e análises preditivas': <Brain className="h-4 w-4 text-purple-500 mr-2" />,
    'PWA para acesso mobile': <Smartphone className="h-4 w-4 text-blue-500 mr-2" />,
  };

  const handlePlanSelection = (planName: string, price: string, selectedBilling: 'monthly' | 'yearly') => {
    console.log('Navegando para checkout com:', { planName, price, selectedBilling });
    
    navigate('/checkout', { 
      state: { 
        plan: planName, 
        price: price.replace('R$ ', ''),
        billing: selectedBilling
      } 
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header showAuth />
      
      <div className="container py-20">
        <div className="mx-auto max-w-4xl text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Escolha o Plano Ideal
          </h1>
          <p className="mt-4 text-xl text-muted-foreground">
            Planos flexíveis para empresas de todos os tamanhos
          </p>
          
          <div className="flex items-center justify-center mt-6">
            <div className="bg-muted p-1 rounded-lg flex items-center">
              <Button
                variant={billing === 'monthly' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setBilling('monthly')}
                className="relative"
              >
                Mensal
              </Button>
              <Button
                variant={billing === 'yearly' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setBilling('yearly')}
                className="relative"
              >
                Anual
                <Badge variant="secondary" className="absolute -top-2 -right-2 px-1 py-0 text-[10px]">
                  -17%
                </Badge>
              </Button>
            </div>
          </div>
        </div>

        {/* Novidades em destaque */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-100">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 font-medium text-purple-700 mb-2">
                <Brain className="h-5 w-5" />
                <span>Inteligência Artificial</span>
                <DynamicBadge>Novo</DynamicBadge>
              </div>
              <p className="text-sm text-muted-foreground">
                Analytics preditiva, recomendações inteligentes e insights automáticos para decisões estratégicas.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-100">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 font-medium text-yellow-700 mb-2">
                <Trophy className="h-5 w-5" />
                <span>Sistema de Gamificação</span>
                <DynamicBadge>Novo</DynamicBadge>
              </div>
              <p className="text-sm text-muted-foreground">
                Aumente o engajamento com badges, pontos, leaderboards e prêmios virtuais para sua equipe.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-blue-50 to-sky-50 border-blue-100">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 font-medium text-blue-700 mb-2">
                <Smartphone className="h-5 w-5" />
                <span>Experiência Mobile (PWA)</span>
                <DynamicBadge>Novo</DynamicBadge>
              </div>
              <p className="text-sm text-muted-foreground">
                Acesse suas informações de qualquer lugar com nosso aplicativo progressivo para dispositivos móveis.
              </p>
            </CardContent>
          </Card>
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
                    {billing === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                    <span className="text-base text-muted-foreground font-normal">/{billing === 'monthly' ? 'mês' : 'ano'}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {billing === 'monthly' 
                      ? `Economize com o plano anual (${plan.yearlyPrice})` 
                      : 'Inclui 2 meses grátis'}
                  </div>
                </div>
                
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center text-left">
                      {featureIcons[feature as keyof typeof featureIcons] || (
                        <Check className="h-4 w-4 text-primary mr-3 flex-shrink-0" />
                      )}
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-2">
                  <Button 
                    className="w-full" 
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => handlePlanSelection(
                      plan.name, 
                      billing === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice,
                      billing
                    )}
                  >
                    {billing === 'monthly' ? 'Contratar Mensal' : 'Contratar Anual'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <div className="inline-flex flex-col sm:flex-row items-center bg-muted p-4 rounded-lg gap-4 mb-6">
            <Zap className="h-10 w-10 text-yellow-500" />
            <div className="text-left">
              <h3 className="text-lg font-medium mb-1">Transforme sua empresa com nossa plataforma atualizada</h3>
              <p className="text-muted-foreground">Novas funcionalidades de Inteligência Artificial, Gamificação e Acesso Mobile</p>
            </div>
          </div>
          
          <p className="text-muted-foreground mb-4">
            Todos os planos incluem teste grátis de 30 dias sem compromisso
          </p>
          <Button variant="outline" onClick={() => navigate('/plans')} className="px-8">
            Começar Teste Grátis
          </Button>
        </div>
      </div>
    </div>
  );
};
