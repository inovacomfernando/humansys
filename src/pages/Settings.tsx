
import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building, Bell, Shield, Palette, Award, Settings as SettingsIcon, RefreshCw } from 'lucide-react';
import { CertificateTemplates } from '@/components/settings/CertificateTemplates';
import { SystemSettingsPanel } from '@/components/settings/SystemDebugPanel';

export const Settings = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie as configurações do sistema e da empresa
          </p>
        </div>

        <Tabs defaultValue="company" className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="company">Empresa</TabsTrigger>
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
            <TabsTrigger value="security">Segurança</TabsTrigger>
            <TabsTrigger value="appearance">Aparência</TabsTrigger>
            <TabsTrigger value="certificates">Certificados</TabsTrigger>
            <TabsTrigger value="system">Sistema</TabsTrigger>
          </TabsList>

          <TabsContent value="company">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Building className="h-5 w-5" />
                  <CardTitle>Informações da Empresa</CardTitle>
                </div>
                <CardDescription>
                  Configure as informações básicas da sua empresa
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="company-name">Nome da Empresa</Label>
                  <Input id="company-name" defaultValue="Minha Empresa Ltda" />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="company-email">Email Principal</Label>
                  <Input id="company-email" defaultValue="contato@minhaempresa.com" />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="company-phone">Telefone</Label>
                  <Input id="company-phone" defaultValue="(11) 99999-9999" />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="company-address">Endereço</Label>
                  <Input id="company-address" defaultValue="Rua Exemplo, 123 - São Paulo, SP" />
                </div>
                
                <Button>Salvar Alterações</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <CardTitle>Notificações</CardTitle>
                </div>
                <CardDescription>
                  Configure quando e como receber notificações
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Novos colaboradores</Label>
                    <p className="text-sm text-muted-foreground">
                      Notificar quando um novo colaborador for adicionado
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Feedbacks recebidos</Label>
                    <p className="text-sm text-muted-foreground">
                      Notificar quando um feedback for enviado
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Treinamentos concluídos</Label>
                    <p className="text-sm text-muted-foreground">
                      Notificar quando um treinamento for concluído
                    </p>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Onboarding completado</Label>
                    <p className="text-sm text-muted-foreground">
                      Notificar quando um onboarding for concluído
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <Button>Salvar Preferências</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <CardTitle>Segurança</CardTitle>
                </div>
                <CardDescription>
                  Configurações de segurança e acesso
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Autenticação de dois fatores</Label>
                    <p className="text-sm text-muted-foreground">
                      Adiciona uma camada extra de segurança
                    </p>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Sessão única</Label>
                    <p className="text-sm text-muted-foreground">
                      Permite apenas uma sessão ativa por usuário
                    </p>
                  </div>
                  <Switch />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="session-timeout">Timeout de sessão (minutos)</Label>
                  <Input id="session-timeout" type="number" defaultValue="60" />
                </div>
                
                <Button>Salvar Configurações</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Palette className="h-5 w-5" />
                  <CardTitle>Aparência</CardTitle>
                </div>
                <CardDescription>
                  Personalize a aparência do sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="logo">Logo da Empresa</Label>
                  <Input id="logo" type="file" accept="image/*" />
                  <p className="text-sm text-muted-foreground">
                    Formato recomendado: PNG, tamanho máximo: 2MB
                  </p>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="primary-color">Cor Primária</Label>
                  <Input id="primary-color" type="color" defaultValue="#0f172a" />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="secondary-color">Cor Secundária</Label>
                  <Input id="secondary-color" type="color" defaultValue="#64748b" />
                </div>
                
                <Button>Aplicar Mudanças</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="certificates">
            <CertificateTemplates />
          </TabsContent>

<TabsContent value="system">
  <SystemSettingsPanel />
</TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};
