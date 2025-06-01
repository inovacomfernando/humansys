import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Database, 
  Key, 
  Mail, 
  Smartphone,
  Settings as SettingsIcon,
  AlertTriangle,
  CheckCircle,
  CreditCard
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CreditsCard } from '@/components/dashboard/CreditsCard';
import { useCredits } from '@/hooks/useCredits';

export const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { credits, updateCredits } = useCredits();

  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      desktop: true,
      marketing: false
    },
    privacy: {
      profileVisible: true,
      activityTracking: true,
      dataCollection: false
    },
    appearance: {
      theme: 'system',
      compactMode: false,
      animations: true
    }
  });

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Configurações salvas",
        description: "Suas preferências foram atualizadas com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie suas preferências e configurações da conta
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="profile" className="flex items-center gap-2" onClick={() => navigate('/app/profile')}>
              <User className="h-4 w-4" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="credits" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Créditos
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notificações
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Privacidade
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Aparência
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Integrações
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <SettingsIcon className="h-4 w-4" />
              Avançado
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Perfil</CardTitle>
                <CardDescription>
                  Atualize suas informações pessoais e de contato
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input id="name" defaultValue={user?.email?.split('@')[0] || ''} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={user?.email || ''} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Empresa</Label>
                  <Input id="company" placeholder="Nome da sua empresa" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Cargo</Label>
                  <Input id="role" placeholder="Seu cargo na empresa" />
                </div>
                <Button onClick={handleSaveSettings} disabled={isLoading}>
                  {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Segurança da Conta</CardTitle>
                <CardDescription>
                  Mantenha sua conta segura
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Autenticação de Dois Fatores</h4>
                    <p className="text-sm text-muted-foreground">
                      Adicione uma camada extra de segurança
                    </p>
                  </div>
                  <Badge variant="secondary">
                    <Shield className="h-3 w-3 mr-1" />
                    Desabilitado
                  </Badge>
                </div>
                <Button variant="outline">
                  <Key className="h-4 w-4 mr-2" />
                  Configurar 2FA
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="credits" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Gestão de Créditos
                </CardTitle>
                <CardDescription>
                  Gerencie seus créditos para cadastro de colaboradores
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <CreditsCard />
                
                <Separator />
                
                <div className="space-y-4">
                  <h4 className="font-medium">Planos Disponíveis</h4>
                  <div className="grid gap-4 md:grid-cols-3">
                    <Card className="p-4">
                      <div className="space-y-2">
                        <h5 className="font-medium">Inicial</h5>
                        <p className="text-sm text-muted-foreground">15 créditos para colaboradores</p>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => updateCredits('inicial')}
                        >
                          Ativar Plano
                        </Button>
                      </div>
                    </Card>
                    
                    <Card className="p-4">
                      <div className="space-y-2">
                        <h5 className="font-medium">Em Crescimento</h5>
                        <p className="text-sm text-muted-foreground">75 créditos para colaboradores</p>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => updateCredits('crescimento')}
                        >
                          Ativar Plano
                        </Button>
                      </div>
                    </Card>
                    
                    <Card className="p-4">
                      <div className="space-y-2">
                        <h5 className="font-medium">Profissional</h5>
                        <p className="text-sm text-muted-foreground">Colaboradores ilimitados</p>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => updateCredits('profissional')}
                        >
                          Ativar Plano
                        </Button>
                      </div>
                    </Card>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Como Funcionam os Créditos</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>• Cada colaborador cadastrado consome 1 crédito</p>
                    <p>• Os créditos são renovados a cada mudança de plano</p>
                    <p>• Durante o período de teste, você tem créditos ilimitados</p>
                    <p>• Créditos não utilizados não são transferidos entre planos</p>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-blue-600 mr-2" />
                    <h4 className="font-medium text-blue-800">Dica</h4>
                  </div>
                  <p className="text-sm text-blue-700 mt-1">
                    Para empresas com muitos colaboradores, recomendamos o plano Profissional que oferece 500 créditos.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Preferências de Notificação</CardTitle>
                <CardDescription>
                  Configure como e quando deseja receber notificações
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Email</h4>
                      <p className="text-sm text-muted-foreground">
                        Receber notificações por email
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.email}
                      onCheckedChange={(checked) => updateSetting('notifications', 'email', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Push Notifications</h4>
                      <p className="text-sm text-muted-foreground">
                        Notificações push no navegador
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.push}
                      onCheckedChange={(checked) => updateSetting('notifications', 'push', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Notificações Desktop</h4>
                      <p className="text-sm text-muted-foreground">
                        Alertas na área de trabalho
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.desktop}
                      onCheckedChange={(checked) => updateSetting('notifications', 'desktop', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Marketing e Novidades</h4>
                      <p className="text-sm text-muted-foreground">
                        Receber updates sobre produtos e funcionalidades
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.marketing}
                      onCheckedChange={(checked) => updateSetting('notifications', 'marketing', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Privacidade</CardTitle>
                <CardDescription>
                  Controle como seus dados são utilizados
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Perfil Visível</h4>
                      <p className="text-sm text-muted-foreground">
                        Outros usuários podem ver seu perfil
                      </p>
                    </div>
                    <Switch
                      checked={settings.privacy.profileVisible}
                      onCheckedChange={(checked) => updateSetting('privacy', 'profileVisible', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Rastreamento de Atividade</h4>
                      <p className="text-sm text-muted-foreground">
                        Permitir análise de uso para melhorar o produto
                      </p>
                    </div>
                    <Switch
                      checked={settings.privacy.activityTracking}
                      onCheckedChange={(checked) => updateSetting('privacy', 'activityTracking', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Coleta de Dados</h4>
                      <p className="text-sm text-muted-foreground">
                        Compartilhar dados anonimizados para pesquisa
                      </p>
                    </div>
                    <Switch
                      checked={settings.privacy.dataCollection}
                      onCheckedChange={(checked) => updateSetting('privacy', 'dataCollection', checked)}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Exportar ou Excluir Dados</h4>
                  <div className="flex gap-2">
                    <Button variant="outline">
                      <Database className="h-4 w-4 mr-2" />
                      Exportar Dados
                    </Button>
                    <Button variant="destructive" size="default">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Excluir Conta
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personalizar Aparência</CardTitle>
                <CardDescription>
                  Ajuste a interface conforme sua preferência
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label>Tema</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      <Button variant="outline" size="sm">Claro</Button>
                      <Button variant="outline" size="sm">Escuro</Button>
                      <Button variant="default" size="sm">Sistema</Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Modo Compacto</h4>
                      <p className="text-sm text-muted-foreground">
                        Interface mais densa com menos espaçamento
                      </p>
                    </div>
                    <Switch
                      checked={settings.appearance.compactMode}
                      onCheckedChange={(checked) => updateSetting('appearance', 'compactMode', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Animações</h4>
                      <p className="text-sm text-muted-foreground">
                        Efeitos de transição e animações
                      </p>
                    </div>
                    <Switch
                      checked={settings.appearance.animations}
                      onCheckedChange={(checked) => updateSetting('appearance', 'animations', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Integrações Disponíveis</CardTitle>
                <CardDescription>
                  Conecte com outras ferramentas e serviços
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-8 w-8 text-blue-500" />
                      <div>
                        <h4 className="font-medium">Email (SMTP)</h4>
                        <p className="text-sm text-muted-foreground">
                          Configure servidor de email personalizado
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Configurar
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="h-8 w-8 text-green-500" />
                      <div>
                        <h4 className="font-medium">WhatsApp Business</h4>
                        <p className="text-sm text-muted-foreground">
                          Notificações via WhatsApp
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Conectado
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Database className="h-8 w-8 text-purple-500" />
                      <div>
                        <h4 className="font-medium">API Personalizada</h4>
                        <p className="text-sm text-muted-foreground">
                          Integração com sistemas próprios
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Ver Docs
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações Avançadas</CardTitle>
                <CardDescription>
                  Opções para usuários avançados
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                    <h4 className="font-medium text-yellow-800">Atenção</h4>
                  </div>
                  <p className="text-sm text-yellow-700 mt-1">
                    As configurações desta seção podem afetar o funcionamento da plataforma. 
                    Altere apenas se souber o que está fazendo.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Modo Desenvolvedor</Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Habilita logs detalhados e ferramentas de debug
                    </p>
                    <Switch />
                  </div>

                  <div>
                    <Label>Cache do Sistema</Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Limpar cache pode resolver problemas de performance
                    </p>
                    <Button variant="outline" size="sm">
                      Limpar Cache
                    </Button>
                  </div>

                  <div>
                    <Label>Exportar Configurações</Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Fazer backup das suas configurações
                    </p>
                    <Button variant="outline" size="sm">
                      Exportar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};