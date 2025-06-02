
import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Check, 
  Crown, 
  Users, 
  Brain, 
  Shield, 
  Zap,
  TrendingUp,
  Award,
  Sparkles,
  Building,
  Target,
  BarChart3
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Plans = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Inicial',
      description: 'Perfeito para startups e pequenas empresas',
      price: isAnnual ? 'R$ 297' : 'R$ 47',
      period: isAnnual ? '/ano' : '/mês',
      originalPrice: isAnnual ? 'R$ 564' : null,
      credits: 15,
      features: [
        'Dashboard Principal',
        'Gestão de 15 Colaboradores',
        'Módulo de Treinamentos',
        'Reuniões 1:1 Básicas',
        'Metas & PDI Simples',
        'Feedback Estruturado',
        'Suporte por Email',
        'Onboarding Básico'
      ],
      icon: Building,
      color: 'border-blue-200 bg-blue-50',
      buttonStyle: 'default'
    },
    {
      name: 'Em Crescimento',
      description: 'Para empresas em expansão',
      price: isAnnual ? 'R$ 1.197' : 'R$ 147',
      period: isAnnual ? '/ano' : '/mês',
      originalPrice: isAnnual ? 'R$ 1.764' : null,
      credits: 75,
      features: [
        'Tudo do Plano Inicial',
        'Gestão de 75 Colaboradores',
        'Análise DISC com IA',
        'Analytics Avançados',
        'Pesquisas de Engajamento',
        'Certificados Personalizados',
        'Gamificação Completa',
        'Recrutamento Inteligente',
        'Documentos Avançados',
        'Suporte Prioritário'
      ],
      icon: TrendingUp,
      color: 'border-green-200 bg-green-50',
      buttonStyle: 'default',
      popular: true
    },
    {
      name: 'Profissional',
      description: 'Para grandes empresas e corporações',
      price: isAnnual ? 'R$ 4.797' : 'R$ 497',
      period: isAnnual ? '/ano' : '/mês',
      originalPrice: isAnnual ? 'R$ 5.964' : null,
      credits: 500,
      features: [
        'Tudo do Plano Em Crescimento',
        'Gestão de 500 Colaboradores',
        'Founder Dashboard Premium',
        'IA Preditiva Avançada',
        'Brainsys IAO V.1 Completo',
        'Security Management',
        'API Personalizada',
        'Integrações Ilimitadas',
        'White Label Disponível',
        'Suporte 24/7 Dedicado',
        'Consultor Especializado'
      ],
      icon: Crown,
      color: 'border-yellow-200 bg-yellow-50',
      buttonStyle: 'premium'
    }
  ];

  const enterprise = {
    name: 'Enterprise',
    description: 'Soluções customizadas para grandes corporações',
    features: [
      'Colaboradores Ilimitados',
      'Customização Completa',
      'Deployment On-Premise',
      'SLA Garantido',
      'Treinamento da Equipe',
      'Suporte Técnico Dedicado',
      'Integração com Sistemas Legados',
      'Compliance e Auditoria',
      'Multi-tenancy',
      'Relatórios Executivos'
    ]
  };

  const allFeatures = [
    {
      category: 'Core & Gestão',
      items: [
        { name: 'Dashboard Principal', inicial: true, crescimento: true, profissional: true },
        { name: 'Gestão de Colaboradores', inicial: '15', crescimento: '75', profissional: '500' },
        { name: 'Founder Dashboard', inicial: false, crescimento: false, profissional: true },
        { name: 'Brainsys IAO V.1', inicial: false, crescimento: 'Básico', profissional: 'Completo' }
      ]
    },
    {
      category: 'IA & Analytics',
      items: [
        { name: 'Análise DISC com IA', inicial: false, crescimento: true, profissional: true },
        { name: 'Analytics Preditivos', inicial: false, crescimento: 'Básico', profissional: 'Avançado' },
        { name: 'Machine Learning', inicial: false, crescimento: false, profissional: true },
        { name: 'Insights Inteligentes', inicial: false, crescimento: true, profissional: true }
      ]
    },
    {
      category: 'Desenvolvimento',
      items: [
        { name: 'Treinamentos', inicial: 'Básico', crescimento: 'Avançado', profissional: 'Completo' },
        { name: 'Reuniões 1:1', inicial: 'Básico', crescimento: 'Avançado', profissional: 'IA Assisted' },
        { name: 'Metas & PDI', inicial: 'Simples', crescimento: 'Avançado', profissional: 'IA Powered' },
        { name: 'Certificados', inicial: false, crescimento: true, profissional: true }
      ]
    },
    {
      category: 'Engajamento',
      items: [
        { name: 'Feedback 360°', inicial: 'Básico', crescimento: 'Completo', profissional: 'IA Enhanced' },
        { name: 'Pesquisas', inicial: false, crescimento: true, profissional: true },
        { name: 'Gamificação', inicial: false, crescimento: true, profissional: true },
        { name: 'Onboarding', inicial: 'Básico', crescimento: 'Avançado', profissional: 'Personalizado' }
      ]
    },
    {
      category: 'Segurança & Suporte',
      items: [
        { name: 'Security Management', inicial: false, crescimento: false, profissional: true },
        { name: 'Suporte', inicial: 'Email', crescimento: 'Prioritário', profissional: '24/7 Dedicado' },
        { name: 'API Access', inicial: false, crescimento: 'Limitado', profissional: 'Completo' },
        { name: 'Integrações', inicial: 'Básicas', crescimento: 'Avançadas', profissional: 'Ilimitadas' }
      ]
    }
  ];

  const renderFeatureValue = (value: any) => {
    if (value === true) return <Check className="h-4 w-4 text-green-600" />;
    if (value === false) return <span className="text-muted-foreground">-</span>;
    return <span className="text-sm font-medium">{value}</span>;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header showAuth />
      
      <div className="container py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl mb-6">
            Planos e <span className="text-green-600">Preços</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Escolha o plano ideal para sua empresa. Todas as funcionalidades, 
            sem pegadinhas, com suporte especializado.
          </p>
          
          {/* Toggle Anual/Mensal */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <Label htmlFor="billing-toggle" className={!isAnnual ? 'font-semibold' : ''}>
              Mensal
            </Label>
            <Switch
              id="billing-toggle"
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
            />
            <Label htmlFor="billing-toggle" className={isAnnual ? 'font-semibold' : ''}>
              Anual
            </Label>
            {isAnnual && (
              <Badge className="bg-green-500 text-white">
                Economize até 47%
              </Badge>
            )}
          </div>
        </div>

        {/* Planos Principais */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <Card 
                key={index} 
                className={`relative ${plan.color} ${plan.popular ? 'ring-2 ring-green-500 shadow-lg scale-105' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-green-500 text-white px-4 py-1">
                      MAIS POPULAR
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <Icon className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="text-base">{plan.description}</CardDescription>
                  
                  <div className="py-4">
                    <div className="flex items-center justify-center gap-2">
                      {plan.originalPrice && (
                        <span className="text-lg text-muted-foreground line-through">
                          {plan.originalPrice}
                        </span>
                      )}
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground">{plan.period}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      {plan.credits} créditos para colaboradores
                    </p>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className="w-full" 
                    variant={plan.buttonStyle === 'premium' ? 'default' : 'default'}
                    size="lg"
                    onClick={() => navigate('/checkout')}
                  >
                    {plan.buttonStyle === 'premium' && <Crown className="h-4 w-4 mr-2" />}
                    Começar Agora
                  </Button>
                  
                  <p className="text-xs text-center text-muted-foreground mt-3">
                    14 dias grátis • Cancele quando quiser
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Enterprise */}
        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50 mb-16">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                <Building className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-2">{enterprise.name}</h3>
              <p className="text-lg text-muted-foreground mb-6">{enterprise.description}</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {enterprise.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-purple-600 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <Button size="lg" variant="outline" onClick={() => navigate('/contact')}>
                <Building className="h-4 w-4 mr-2" />
                Falar com Especialista
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Comparação Detalhada */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            Comparação Detalhada de Funcionalidades
          </h2>
          
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {allFeatures.map((category, categoryIndex) => (
                <Card key={categoryIndex} className="mb-6">
                  <CardHeader>
                    <CardTitle className="text-lg">{category.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-4 gap-4 text-sm font-medium text-muted-foreground border-b pb-2">
                        <div>Funcionalidade</div>
                        <div className="text-center">Inicial</div>
                        <div className="text-center">Em Crescimento</div>
                        <div className="text-center">Profissional</div>
                      </div>
                      
                      {category.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="grid grid-cols-4 gap-4 text-sm items-center py-2">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-center">{renderFeatureValue(item.inicial)}</div>
                          <div className="text-center">{renderFeatureValue(item.crescimento)}</div>
                          <div className="text-center">{renderFeatureValue(item.profissional)}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Rápido */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Perguntas Frequentes</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-2">Como funcionam os créditos?</h3>
              <p className="text-sm text-muted-foreground">
                Cada usuário cadastrado consome 1 crédito. Os créditos são renovados mensalmente 
                e não acumulam entre períodos.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Posso mudar de plano a qualquer momento?</h3>
              <p className="text-sm text-muted-foreground">
                Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. 
                As mudanças são aplicadas no próximo ciclo de cobrança.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Tem teste grátis?</h3>
              <p className="text-sm text-muted-foreground">
                Todos os planos incluem 14 dias de teste grátis com acesso completo às 
                funcionalidades do plano escolhido.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Como funciona o suporte?</h3>
              <p className="text-sm text-muted-foreground">
                Oferecemos suporte por email no plano Inicial, prioritário no Em Crescimento 
                e dedicado 24/7 no Profissional.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Final */}
        <div className="text-center">
          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-4">
                Comece sua Transformação Hoje
              </h2>
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                Junte-se a centenas de empresas que já revolucionaram 
                sua gestão de pessoas com a HumanSys.
              </p>
              <div className="flex justify-center gap-4">
                <Button size="lg" onClick={() => navigate('/checkout')}>
                  <Zap className="h-4 w-4 mr-2" />
                  Testar 14 Dias Grátis
                </Button>
                <Button variant="outline" size="lg" onClick={() => navigate('/contact')}>
                  Falar com Consultor
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
