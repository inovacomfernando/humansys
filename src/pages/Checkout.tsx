
import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, CreditCard, Shield, Clock } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState(location.state?.plan || 'Professional');
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = {
    Starter: {
      name: 'Starter',
      monthlyPrice: 49,
      yearlyPrice: 490,
      description: 'Perfeito para pequenas empresas',
      features: [
        'Até 50 colaboradores',
        'Gestão básica de RH',
        'Relatórios essenciais',
        'Suporte por email'
      ]
    },
    Professional: {
      name: 'Professional',
      monthlyPrice: 99,
      yearlyPrice: 990,
      description: 'Ideal para empresas em crescimento',
      features: [
        'Até 200 colaboradores',
        'Módulos avançados',
        'Analytics completo',
        'Integrações API',
        'Suporte prioritário'
      ]
    },
    Enterprise: {
      name: 'Enterprise',
      monthlyPrice: 199,
      yearlyPrice: 1990,
      description: 'Para grandes organizações',
      features: [
        'Colaboradores ilimitados',
        'Customizações avançadas',
        'AI & Machine Learning',
        'Suporte dedicado',
        'Consultoria estratégica'
      ]
    }
  };

  const currentPlan = plans[selectedPlan as keyof typeof plans];
  const price = billingCycle === 'yearly' ? currentPlan.yearlyPrice : currentPlan.monthlyPrice;
  const savings = billingCycle === 'yearly' ? (currentPlan.monthlyPrice * 12 - currentPlan.yearlyPrice) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Teste iniciado!",
      description: "Seu teste gratuito de 14 dias foi ativado. Redirecionando para o dashboard...",
    });
    
    setTimeout(() => {
      navigate('/app/dashboard');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header showAuth />
      
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Comece seu Teste Gratuito</h1>
            <p className="text-muted-foreground">
              14 dias grátis • Sem compromisso • Cancele a qualquer momento
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Plan Selection */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Escolha seu plano</h2>
                <div className="space-y-3">
                  {Object.entries(plans).map(([key, plan]) => (
                    <Card 
                      key={key}
                      className={`cursor-pointer transition-all ${
                        selectedPlan === key ? 'border-primary bg-primary/5' : ''
                      }`}
                      onClick={() => setSelectedPlan(key)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">{plan.name}</h3>
                            <p className="text-sm text-muted-foreground">{plan.description}</p>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">
                              R$ {billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              /{billingCycle === 'yearly' ? 'ano' : 'mês'}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Billing Cycle */}
              <div>
                <h3 className="font-medium mb-3">Ciclo de cobrança</h3>
                <div className="flex gap-2">
                  <Button
                    variant={billingCycle === 'monthly' ? 'default' : 'outline'}
                    onClick={() => setBillingCycle('monthly')}
                    className="flex-1"
                  >
                    Mensal
                  </Button>
                  <Button
                    variant={billingCycle === 'yearly' ? 'default' : 'outline'}
                    onClick={() => setBillingCycle('yearly')}
                    className="flex-1"
                  >
                    Anual
                    {savings > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        Economize R$ {savings}
                      </Badge>
                    )}
                  </Button>
                </div>
              </div>

              {/* Features */}
              <div>
                <h3 className="font-medium mb-3">Recursos inclusos</h3>
                <ul className="space-y-2">
                  {currentPlan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Checkout Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Informações de Pagamento
                  </CardTitle>
                  <CardDescription>
                    Você não será cobrado durante o período de teste
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="firstName">Nome</Label>
                        <Input id="firstName" placeholder="João" required />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Sobrenome</Label>
                        <Input id="lastName" placeholder="Silva" required />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="joao@empresa.com" required />
                    </div>
                    
                    <div>
                      <Label htmlFor="company">Empresa</Label>
                      <Input id="company" placeholder="Nome da sua empresa" required />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Telefone</Label>
                      <Input id="phone" placeholder="(11) 99999-9999" />
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-3">Resumo do pedido</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>{currentPlan.name} - {billingCycle === 'yearly' ? 'Anual' : 'Mensal'}</span>
                          <span>R$ {price}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>Teste gratuito (14 dias)</span>
                          <span>R$ 0</span>
                        </div>
                        {savings > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span>Economia anual</span>
                            <span>-R$ {savings}</span>
                          </div>
                        )}
                        <div className="border-t pt-2 flex justify-between font-medium">
                          <span>Total hoje</span>
                          <span>R$ 0</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Shield className="h-4 w-4" />
                        <span>Pagamento seguro e criptografado</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Cancele a qualquer momento durante o teste</span>
                      </div>
                    </div>

                    <Button type="submit" className="w-full" size="lg">
                      Iniciar Teste Gratuito
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
