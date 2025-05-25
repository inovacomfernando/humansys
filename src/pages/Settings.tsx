import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings as SettingsIcon, Building, Users, Database, Palette } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useToast } from '@/hooks/use-toast';

export const Settings = () => {
  const { brandColors, setBrandColors, companyLogo, setCompanyLogo, applyBrandColors } = useTheme();
  const [companyData, setCompanyData] = useLocalStorage('company-data', {
    name: 'Minha Empresa',
    cnpj: '',
    email: '',
    phone: '',
    address: ''
  });
  
  const [tempColors, setTempColors] = useState(brandColors);
  const { toast } = useToast();

  const handleSaveCompany = () => {
    toast({
      title: "Dados salvos",
      description: "Informações da empresa foram atualizadas com sucesso.",
    });
  };

  const handleColorChange = (type: 'primary' | 'secondary', color: string) => {
    setTempColors(prev => ({ ...prev, [type]: color }));
  };

  const handleSaveAppearance = () => {
    setBrandColors(tempColors);
    applyBrandColors();
    toast({
      title: "Aparência atualizada",
      description: "As cores da marca foram aplicadas com sucesso.",
    });
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setCompanyLogo(result);
        toast({
          title: "Logo atualizada",
          description: "A logo da empresa foi alterada com sucesso.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const predefinedColors = [
    '#22c55e', // Verde
    '#3b82f6', // Azul
    '#8b5cf6', // Roxo
    '#ef4444', // Vermelho
    '#f59e0b', // Amarelo
    '#06b6d4', // Ciano
  ];

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
                    <Input 
                      id="company-name" 
                      value={companyData.name}
                      onChange={(e) => setCompanyData({...companyData, name: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company-cnpj">CNPJ</Label>
                    <Input 
                      id="company-cnpj" 
                      placeholder="00.000.000/0001-00"
                      value={companyData.cnpj}
                      onChange={(e) => setCompanyData({...companyData, cnpj: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company-email">Email</Label>
                    <Input 
                      id="company-email" 
                      type="email" 
                      placeholder="contato@empresa.com"
                      value={companyData.email}
                      onChange={(e) => setCompanyData({...companyData, email: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company-phone">Telefone</Label>
                    <Input 
                      id="company-phone" 
                      placeholder="(11) 9999-9999"
                      value={companyData.phone}
                      onChange={(e) => setCompanyData({...companyData, phone: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company-address">Endereço</Label>
                  <Input 
                    id="company-address" 
                    placeholder="Rua da Empresa, 123, Cidade - UF"
                    value={companyData.address}
                    onChange={(e) => setCompanyData({...companyData, address: e.target.value})}
                  />
                </div>
                
                <Button onClick={handleSaveCompany}>Salvar Alterações</Button>
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
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Logo da Empresa</h4>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center border">
                      {companyLogo ? (
                        <img src={companyLogo} alt="Logo" className="w-full h-full object-contain rounded" />
                      ) : (
                        <Building className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <Label htmlFor="logo-upload" className="cursor-pointer">
                        <Button variant="outline" size="sm" asChild>
                          <span>Alterar Logo</span>
                        </Button>
                      </Label>
                      <Input
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleLogoUpload}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        PNG, JPG ou SVG (máx. 2MB)
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Cores da Marca</h4>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm">Cor Primária</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Input
                          type="color"
                          value={tempColors.primary}
                          onChange={(e) => handleColorChange('primary', e.target.value)}
                          className="w-12 h-8 p-0 border-0"
                        />
                        <Input
                          type="text"
                          value={tempColors.primary}
                          onChange={(e) => handleColorChange('primary', e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm">Cor Secundária</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Input
                          type="color"
                          value={tempColors.secondary}
                          onChange={(e) => handleColorChange('secondary', e.target.value)}
                          className="w-12 h-8 p-0 border-0"
                        />
                        <Input
                          type="text"
                          value={tempColors.secondary}
                          onChange={(e) => handleColorChange('secondary', e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Label className="text-sm mb-2 block">Cores Predefinidas</Label>
                    <div className="flex space-x-2">
                      {predefinedColors.map((color) => (
                        <button
                          key={color}
                          className="w-8 h-8 rounded border-2 border-gray-200 hover:border-gray-400 transition-colors"
                          style={{ backgroundColor: color }}
                          onClick={() => handleColorChange('primary', color)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                <Button onClick={handleSaveAppearance}>Salvar Aparência</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};
