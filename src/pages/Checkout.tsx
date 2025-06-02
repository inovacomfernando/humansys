
import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useNavigate, useLocation } from 'react-router-dom';
import { CreditCard, Lock, Shield, Gift, Check, Star, Users, BarChart3 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useCredits } from '@/hooks/useCredits';

export const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { updateCredits } = useCredits();

  // Get data from state, with fallbacks
  const planData = location.state || {};
  const { plan = 'Inicial', price = '79', billing = 'monthly' } = planData;

  const [selectedPlan, setSelectedPlan] = useState(plan);
  const [selectedBilling, setSelectedBilling] = useState<'monthly' | 'yearly' | 'trial'>(billing);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    email: user?.email || '',
    companyName: '',
    taxId: ''
  });

  const [isProcessing, setIsProcessing] = useState(false);

  // Planos disponíveis
  const plans = [
    {
      name: 'Inicial',
      description: 'Perfeito para startups e pequenas empresas',
      monthlyPrice: 'R$ 127',
      yearlyPrice: 'R$ 1.270',
      features: [
        'Gestão de 15 Colaboradores',
        'Dashboard Principal',
        'Módulo de Treinamentos',
        'Reuniões 1:1 Básicas',
        'Metas & PDI Simples',
        'Feedback Estruturado',
        'Onboarding Básico',
        'Suporte por Email'
      ],
      popular: false
    },
    {
      name: 'Em Crescimento',
      description: 'Para empresas em expansão',
      monthlyPrice: 'R$ 247',
      yearlyPrice: 'R$ 2.470',
      features: [
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
      popular: true
    },
    {
      name: 'Profissional',
      description: 'Para grandes organizações',
      monthlyPrice: 'R$ 497',
      yearlyPrice: 'R$ 4.970',
      features: [
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
      popular: false
    }
  ];

  const getCurrentPlan = () => {
    return plans.find(p => p.name === selectedPlan) || plans[0];
  };

  const getCurrentPrice = () => {
    const plan = getCurrentPlan();
    if (selectedBilling === 'trial') return 'Grátis';
    return selectedBilling === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
  };

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleStartTrial = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setIsProcessing(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "Teste grátis ativado!",
        description: "Você tem 30 dias para explorar todas as funcionalidades do sistema.",
      });

      navigate('/app/dashboard');
    } catch (error) {
      console.error('Error starting trial:', error);
      toast({
        title: "Erro ao ativar teste",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Determinar tipo de plano para créditos
      let planType: 'inicial' | 'crescimento' | 'profissional' = 'inicial';
      switch (selectedPlan.toLowerCase()) {
        case 'em crescimento':
          planType = 'crescimento';
          break;
        case 'profissional':
          planType = 'profissional';
          break;
      }

      await updateCredits(planType);

      toast({
        title: "Pagamento processado!",
        description: `Plano ${selectedPlan} ativado com sucesso.`,
      });

      navigate('/app/dashboard');
    } catch (error) {
      console.error('Error processing payment:', error);
      toast({
        title: "Erro no pagamento",
        description: "Tente novamente ou entre em contato com o suporte.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header showAuth={false} />

      <div className="container py-12">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Escolha Seu Plano</h1>
            <p className="text-muted-foreground">
              Selecione o plano ideal para sua empresa
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-4">
            {/* Seleção de Planos */}
            <div className="lg:col-span-3">
              {/* Opção de Teste Grátis */}
              <Card className="mb-6 border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center text-green-800">
                    <Gift className="mr-2 h-5 w-5" />
                    Teste Grátis de 30 Dias
                  </CardTitle>
                  <CardDescription className="text-green-700">
                    Experimente todas as funcionalidades sem compromisso
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-sm text-green-700">
                      ✅ Acesso completo por 30 dias<br/>
                      ✅ Sem dados de cartão necessários<br/>
                      ✅ Cancele a qualquer momento<br/>
                      ✅ Sem cobrança automática
                    </div>

                    <Button 
                      onClick={handleStartTrial}
                      className="w-full bg-green-600 hover:bg-green-700" 
                      size="lg"
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Ativando...' : 'Começar Teste Grátis Agora'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="text-center mb-6">
                <div className="relative">
                  <Separator />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-background px-4 text-sm text-muted-foreground">
                      ou contrate diretamente
                    </span>
                  </div>
                </div>
              </div>

              {/* Sistema de Créditos */}
              <Card className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                <CardHeader className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Badge className="bg-green-500 text-white px-3 py-1 text-sm">
                      Sistema de Créditos
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">Gestão Inteligente de Créditos</CardTitle>
                  <CardDescription className="text-base">
                    Sistema transparente e flexível para controlar o cadastro de colaboradores
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-3">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Users className="h-6 w-6 text-blue-600" />
                      </div>
                      <h4 className="font-semibold mb-2">1 Crédito = 1 Colaborador</h4>
                      <p className="text-sm text-muted-foreground">
                        Sistema simples: cada colaborador cadastrado consome 1 crédito
                      </p>
                      <div className="mt-2 text-sm font-medium">
                        Cadastro completo: <span className="text-green-600">1 crédito</span>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Shield className="h-6 w-6 text-purple-600" />
                      </div>
                      <h4 className="font-semibold mb-2">Planos Flexíveis</h4>
                      <p className="text-sm text-muted-foreground">
                        Escolha o plano ideal para o tamanho da sua empresa
                      </p>
                      <div className="mt-2">
                        <div className="text-xs text-muted-foreground">Inicial: <span className="text-green-600 font-medium">15 créditos</span></div>
                        <div className="text-xs text-muted-foreground">Crescimento: <span className="text-green-600 font-medium">75 créditos</span></div>
                        <div className="text-xs text-muted-foreground">Profissional: <span className="text-green-600 font-medium">500 créditos</span></div>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <BarChart3 className="h-6 w-6 text-green-600" />
                      </div>
                      <h4 className="font-semibold mb-2">Controle Total</h4>
                      <p className="text-sm text-muted-foreground">
                        Acompanhe o uso de créditos em tempo real no dashboard
                      </p>
                      <div className="mt-2 text-sm font-medium text-green-600">
                        ✓ Histórico completo
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Seleção de Tipo de Cobrança */}
              <div className="flex items-center justify-center mb-6">
                <div className="bg-muted p-1 rounded-lg flex items-center">
                  <Button
                    variant={selectedBilling === 'monthly' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setSelectedBilling('monthly')}
                  >
                    Mensal
                  </Button>
                  <Button
                    variant={selectedBilling === 'yearly' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setSelectedBilling('yearly')}
                    className="relative"
                  >
                    Anual
                    <Badge variant="secondary" className="absolute -top-2 -right-2 px-1 py-0 text-[10px]">
                      -17%
                    </Badge>
                  </Button>
                </div>
              </div>

              {/* Planos */}
              <div className="grid gap-6 md:grid-cols-3 mb-8">
                {plans.map((planOption, index) => (
                  <Card 
                    key={index} 
                    className={`relative cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      selectedPlan === planOption.name 
                        ? 'border-primary shadow-lg ring-2 ring-primary/20' 
                        : planOption.popular 
                        ? 'border-orange-200' 
                        : ''
                    }`}
                    onClick={() => setSelectedPlan(planOption.name)}
                  >
                    {planOption.popular && (
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-medium z-10 shadow-sm">
                        <Star className="mr-1 h-3 w-3 inline" />
                        Mais Popular
                      </div>
                    )}
                    
                    <CardHeader className="text-center pb-2">
                      <CardTitle className="text-xl">{planOption.name}</CardTitle>
                      <CardDescription>{planOption.description}</CardDescription>
                    </CardHeader>
                    
                    <CardContent className="text-center">
                      <div className="mb-6">
                        <div className="text-3xl font-bold text-primary mb-2">
                          {selectedBilling === 'monthly' ? planOption.monthlyPrice : planOption.yearlyPrice}
                          <span className="text-base text-muted-foreground font-normal">
                            /{selectedBilling === 'monthly' ? 'mês' : 'ano'}
                          </span>
                        </div>
                        {selectedBilling === 'yearly' && (
                          <div className="text-sm text-green-600">
                            Economize 2 meses!
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2 mb-6">
                        {planOption.features.slice(0, 4).map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center text-left text-sm">
                            <Check className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                        {planOption.features.length > 4 && (
                          <div className="text-sm text-muted-foreground">
                            +{planOption.features.length - 4} funcionalidades
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Formulário de Pagamento */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="mr-2 h-5 w-5" />
                    Informações de Pagamento
                  </CardTitle>
                  <CardDescription>
                    Seus dados estão protegidos com criptografia SSL
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Dados da Empresa */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Dados da Empresa</h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="companyName">Nome da Empresa</Label>
                          <Input
                            id="companyName"
                            placeholder="Sua Empresa Ltda"
                            value={formData.companyName}
                            onChange={handleInputChange('companyName')}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="taxId">CNPJ</Label>
                          <Input
                            id="taxId"
                            placeholder="00.000.000/0000-00"
                            value={formData.taxId}
                            onChange={handleInputChange('taxId')}
                            required
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="email">Email para Fatura</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="contato@empresa.com"
                            value={formData.email}
                            onChange={handleInputChange('email')}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Dados do Cartão */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Dados do Cartão</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="cardNumber">Número do Cartão</Label>
                          <Input
                            id="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            value={formData.cardNumber}
                            onChange={handleInputChange('cardNumber')}
                            required
                          />
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="expiryDate">Validade</Label>
                            <Input
                              id="expiryDate"
                              placeholder="MM/AA"
                              value={formData.expiryDate}
                              onChange={handleInputChange('expiryDate')}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cvv">CVV</Label>
                            <Input
                              id="cvv"
                              placeholder="123"
                              value={formData.cvv}
                              onChange={handleInputChange('cvv')}
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cardName">Nome no Cartão</Label>
                          <Input
                            id="cardName"
                            placeholder="Nome como está no cartão"
                            value={formData.cardName}
                            onChange={handleInputChange('cardName')}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full" 
                      size="lg"
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Processando...' : `Contratar Plano ${selectedPlan}`}
                    </Button>

                    <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                      <Lock className="h-4 w-4" />
                      <span>Pagamento seguro e criptografado</span>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Resumo do Pedido */}
            <div>
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Plano {selectedPlan}</span>
                    <Badge variant="secondary">
                      {selectedBilling === 'yearly' ? 'Anual' : 'Mensal'}
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total</span>
                    <span>{getCurrentPrice()}</span>
                  </div>

                  {selectedBilling === 'yearly' && (
                    <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
                      🎉 Você está economizando 2 meses com o plano anual!
                    </div>
                  )}

                  <Separator />

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-green-600" />
                      <span>30 dias de teste grátis</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-green-600" />
                      <span>Cancele a qualquer momento</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-green-600" />
                      <span>Suporte técnico incluído</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h4 className="font-medium">Funcionalidades Incluídas:</h4>
                    <div className="space-y-1 text-sm">
                      {getCurrentPlan().features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Check className="h-3 w-3 text-green-600" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
