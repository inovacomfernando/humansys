
import React from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Plans = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Inicial',
      description: 'Perfeito para empresas iniciantes',
      monthlyPrice: 'R$ 49',
      yearlyPrice: 'R$ 490',
      popular: false,
      features: [
        'Até 10 colaboradores',
        'Onboarding básico',
        'Gestão de documentos',
        'Suporte por email',
        '1 GB de armazenamento'
      ]
    },
    {
      name: 'Em Crescimento',
      description: 'Ideal para empresas em expansão',
      monthlyPrice: 'R$ 99',
      yearlyPrice: 'R$ 990',
      popular: true,
      features: [
        'Até 50 colaboradores',
        'Onboarding completo',
        'Sistema de feedback',
        'Treinamentos básicos',
        'Pesquisas de clima',
        'Suporte prioritário',
        '10 GB de armazenamento'
      ]
    },
    {
      name: 'Profissional',
      description: 'Para empresas estabelecidas',
      monthlyPrice: 'R$ 199',
      yearlyPrice: 'R$ 1990',
      popular: false,
      features: [
        'Colaboradores ilimitados',
        'Todas as funcionalidades',
        'IA para triagem de currículos',
        'Relatórios avançados',
        'API personalizada',
        'Suporte 24/7',
        'Armazenamento ilimitado',
        'White label'
      ]
    }
  ];

  const handlePlanSelection = (planName: string, price: string, billing: 'monthly' | 'yearly') => {
    navigate('/checkout', { 
      state: { 
        plan: planName, 
        price: price.replace('R$ ', ''),
        billing 
      } 
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header showAuth />
      
      <div className="container py-20">
        <div className="mx-auto max-w-4xl text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Escolha o Plano Ideal
          </h1>
          <p className="mt-4 text-xl text-muted-foreground">
            Planos flexíveis para empresas de todos os tamanhos
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 mb-16">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.popular ? 'border-primary shadow-lg scale-105' : ''}`}>
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">
                  <Star className="mr-1 h-3 w-3" />
                  Mais Popular
                </Badge>
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

        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Todos os planos incluem teste grátis de 30 dias
          </p>
          <Button variant="outline" onClick={() => navigate('/trial')}>
            Começar Teste Grátis
          </Button>
        </div>
      </div>
    </div>
  );
};
