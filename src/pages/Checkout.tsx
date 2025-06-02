import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useNavigate, useLocation } from 'react-router-dom';
import { CreditCard, Lock, Shield, Gift } from 'lucide-react';
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
  const { plan = 'Teste Grátis', price = '0', billing = 'trial' } = planData;

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

  // If no plan data and user came directly, show default values but warn
  useEffect(() => {
    if (!location.state) {
      toast({
        title: "Teste grátis selecionado",
        description: "Comece já seu teste gratuito de 30 dias.",
        variant: "default",
      });
    }
  }, [location.state, toast]);

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
      // Determinar o tipo de plano baseado no nome
      let planType: 'inicial' | 'crescimento' | 'profissional' | 'trial' = 'trial';

      if (billing !== 'trial') {
        switch (plan.toLowerCase()) {
          case 'inicial':
            planType = 'inicial';
            break;
          case 'em crescimento':
            planType = 'crescimento';
            break;
          case 'profissional':
            planType = 'profissional';
            break;
          default:
            planType = 'trial';
        }
      }

      // Simular ativação do plano
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Atualizar créditos se não for teste grátis
      if (planType !== 'trial') {
        await updateCredits(planType);
      }

      console.log('Plano ativado para:', { user: user.email, plan, planType });

      const isTrialMessage = billing === 'trial';

      toast({
        title: isTrialMessage ? "Teste grátis ativado!" : "Plano ativado!",
        description: isTrialMessage 
          ? "Você tem 30 dias para explorar todas as funcionalidades do sistema."
          : `Plano ${plan} ativado com sucesso. Seus créditos foram atualizados.`,
      });

      navigate('/app/dashboard');
    } catch (error) {
      console.error('Error starting plan:', error);
      toast({
        title: "Erro ao ativar plano",
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
      // Simular processamento do pagamento
      await new Promise(resolve => setTimeout(resolve, 3000));

      console.log('Dados do pagamento:', { plan, price, billing, ...formData });

      toast({
        title: "Pagamento processado!",
        description: "Sua assinatura foi ativada com sucesso.",
      });

      // Redirect to appropriate dashboard
      const response = await fetch('/api/check-user-role', {
        headers: { 'Authorization': `Bearer ${user?.id}` }
      }).catch(() => null);

      if (response?.ok) {
        const { isFounder } = await response.json();
        navigate(isFounder ? '/founder/dashboard' : '/app/dashboard');
      } else {
        navigate('/app/dashboard');
      }
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

  const formatPrice = (value: string) => {
    if (billing === 'trial' || value === '0') {
      return 'Grátis por 30 dias';
    }
    const numericValue = value.replace(/\D/g, '');
    return billing === 'yearly' ? 
      `R$ ${numericValue} (${Math.round(parseInt(numericValue) / 12)} por mês)` :
      `R$ ${numericValue} por mês`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header showAuth={false} />

      <div className="container py-12">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Finalizar Contratação</h1>
            <p className="text-muted-foreground">
              Complete seus dados para ativar o plano {plan}
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Opção de Teste Grátis */}
            <div className="lg:col-span-2">
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
                      {isProcessing ? 'Processando...' : `Contratar ${plan}`}
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
              <Card>
                <CardHeader>
                  <CardTitle>Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Plano {plan}</span>
                    <Badge variant="secondary">
                      {billing === 'yearly' ? 'Anual' : 'Mensal'}
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(price)}</span>
                  </div>

                  {billing === 'yearly' && (
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
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};