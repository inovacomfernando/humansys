
import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings as SettingsIcon, Building, Users, Database, Palette } from 'lucide-react';

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
          <TabsList>
            <TabsTrigger value="company">Empresa</TabsTrigger>
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="integrations">Integrações</TabsTrigger>
            <TabsTrigger value="appearance">Aparência</TabsTrigger>
          </TabsList>

          <TabsContent value="company">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="mr-2 h-5 w-5" />
                  Informações da Empresa
                </CardTitle>
                <CardDescription>
                  Configure os dados básicos da sua empresa
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Nome da Empresa</Label>
                    <Input id="company-name" defaultValue="Minha Empresa" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company-cnpj">CNPJ</Label>
                    <Input id="company-cnpj" placeholder="00.000.000/0001-00" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company-email">Email</Label>
                    <Input id="company-email" type="email" placeholder="contato@empresa.com" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company-phone">Telefone</Label>
                    <Input id="company-phone" placeholder="(11) 9999-9999" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company-address">Endereço</Label>
                  <Input id="company-address" placeholder="Rua da Empresa, 123, Cidade - UF" />
                </div>
                
                <Button>Salvar Alterações</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Gestão de Usuários
                </CardTitle>
                <CardDescription>
                  Configure permissões e acessos de usuários
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Administradores</h4>
                      <p className="text-sm text-muted-foreground">Acesso total ao sistema</p>
                    </div>
                    <Button variant="outline">Gerenciar</Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Colaboradores</h4>
                      <p className="text-sm text-muted-foreground">Acesso limitado às suas informações</p>
                    </div>
                    <Button variant="outline">Gerenciar</Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Terceiros</h4>
                      <p className="text-sm text-muted-foreground">Acesso restrito a módulos específicos</p>
                    </div>
                    <Button variant="outline">Gerenciar</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="mr-2 h-5 w-5" />
                  Integrações
                </CardTitle>
                <CardDescription>
                  Configure integrações com bancos de dados e APIs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Supabase</h4>
                      <p className="text-sm text-muted-foreground">Banco de dados principal</p>
                    </div>
                    <Button variant="outline">Configurar</Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Gateway de Pagamento</h4>
                      <p className="text-sm text-muted-foreground">Processamento de pagamentos</p>
                    </div>
                    <Button variant="outline">Configurar</Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">API de Email</h4>
                      <p className="text-sm text-muted-foreground">Envio de notificações</p>
                    </div>
                    <Button variant="outline">Configurar</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="mr-2 h-5 w-5" />
                  Aparência
                </CardTitle>
                <CardDescription>
                  Personalize a aparência do sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Logo da Empresa</h4>
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                        <Building className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div>
                        <Button variant="outline">Alterar Logo</Button>
                        <p className="text-xs text-muted-foreground mt-1">
                          PNG ou SVG (máx. 2MB)
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Cores Primárias</h4>
                    <div className="flex space-x-2">
                      <div className="w-8 h-8 bg-green-500 rounded border cursor-pointer"></div>
                      <div className="w-8 h-8 bg-blue-500 rounded border cursor-pointer"></div>
                      <div className="w-8 h-8 bg-purple-500 rounded border cursor-pointer"></div>
                      <div className="w-8 h-8 bg-red-500 rounded border cursor-pointer"></div>
                    </div>
                  </div>
                </div>
                
                <Button>Salvar Aparência</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};
