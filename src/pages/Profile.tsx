
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditsCard } from '@/components/dashboard/CreditsCard';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { simpleAuth } from '@/integrations/supabase/client';
import {
  User,
  Mail,
  Building,
  Briefcase,
  Camera,
  Save,
  Crown,
  Users,
  CreditCard,
  Settings
} from 'lucide-react';

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  company_name?: string;
  company_cnpj?: string;
  position?: string;
  avatar_url?: string;
  is_company_owner: boolean;
}

export const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isCompanyOwner, setIsCompanyOwner] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [user?.id]);

  const loadProfile = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      console.log('Carregando perfil para usuário:', user.id);
      
      // Simular delay de carregamento
      await new Promise(resolve => setTimeout(resolve, 500));

      // Verificar se é o usuário Amanda (owner)
      const isAmanda = user.email === 'amanda@vendasimples.com.br';
      
      const userProfile: UserProfile = {
        id: user.id,
        full_name: user.name || user.email?.split('@')[0] || 'Usuário',
        email: user.email || '',
        company_name: isAmanda ? 'VendaSimples' : 'Empresa Exemplo',
        company_cnpj: isAmanda ? '12.345.678/0001-90' : '98.765.432/0001-10',
        position: isAmanda ? 'CEO & Founder' : 'Colaborador',
        avatar_url: '',
        is_company_owner: isAmanda
      };

      setProfile(userProfile);
      setIsCompanyOwner(isAmanda);
      
      console.log('Perfil carregado com sucesso:', userProfile);
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar o perfil",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile || !user?.id) return;

    setSaving(true);
    try {
      console.log('Salvando perfil:', profile);
      
      // Simular delay de salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // No sistema mock, apenas simular o salvamento
      // Em um sistema real, aqui faria a chamada para o banco
      
      toast({
        title: "Sucesso",
        description: "Perfil atualizado com sucesso!"
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o perfil",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user?.id) return;

    try {
      console.log('Simulando upload de avatar:', file.name);
      
      // Simular delay de upload
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simular URL de avatar (usando um placeholder)
      const mockAvatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.full_name || 'User')}&size=200&background=random`;

      if (profile) {
        setProfile({ ...profile, avatar_url: mockAvatarUrl });
      }

      toast({
        title: "Sucesso",
        description: "Foto de perfil atualizada!"
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Erro",
        description: "Não foi possível fazer upload da imagem",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!profile) return null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <User className="h-8 w-8" />
              Perfil
              {isCompanyOwner && (
                <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600">
                  <Crown className="h-3 w-3 mr-1" />
                  Owner
                </Badge>
              )}
            </h1>
            <p className="text-muted-foreground">
              Gerencie suas informações pessoais e preferências da conta
            </p>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Informações Pessoais</TabsTrigger>
            <TabsTrigger value="company">Empresa</TabsTrigger>
            {isCompanyOwner && (
              <TabsTrigger value="credits">Gestão de Créditos</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Foto de Perfil</CardTitle>
                <CardDescription>
                  Clique na foto para alterar sua imagem de perfil
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Avatar className="h-20 w-20 cursor-pointer" onClick={() => document.getElementById('avatar-upload')?.click()}>
                      <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
                      <AvatarFallback>
                        {profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-0 right-0 bg-primary rounded-full p-1">
                      <Camera className="h-3 w-3 text-white" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{profile.full_name}</p>
                    <p className="text-sm text-muted-foreground">{profile.email}</p>
                  </div>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
                <CardDescription>
                  Atualize suas informações básicas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Nome Completo</Label>
                    <Input
                      id="full_name"
                      value={profile.full_name}
                      onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                      placeholder="Seu nome completo"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Cargo</Label>
                  <Input
                    id="position"
                    value={profile.position}
                    onChange={(e) => setProfile({ ...profile, position: e.target.value })}
                    placeholder="Seu cargo na empresa"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="company" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Informações da Empresa
                </CardTitle>
                <CardDescription>
                  Dados da sua empresa ou organização
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company_name">Nome da Empresa</Label>
                  <Input
                    id="company_name"
                    value={profile.company_name}
                    onChange={(e) => setProfile({ ...profile, company_name: e.target.value })}
                    placeholder="Nome da sua empresa"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company_cnpj">CNPJ</Label>
                  <Input
                    id="company_cnpj"
                    value={profile.company_cnpj}
                    onChange={(e) => setProfile({ ...profile, company_cnpj: e.target.value })}
                    placeholder="00.000.000/0000-00"
                    disabled={!isCompanyOwner}
                    className={!isCompanyOwner ? "bg-muted" : ""}
                  />
                  {!isCompanyOwner && (
                    <p className="text-xs text-muted-foreground">
                      Apenas o proprietário da empresa pode alterar o CNPJ
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {isCompanyOwner && (
            <TabsContent value="credits" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Gestão de Créditos
                    <Badge variant="outline">Apenas Owner</Badge>
                  </CardTitle>
                  <CardDescription>
                    Gerencie os créditos para cadastro de colaboradores
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CreditsCard />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Permissões de Empresa
                  </CardTitle>
                  <CardDescription>
                    Suas permissões como proprietário da empresa
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Cadastro de Colaboradores</p>
                        <p className="text-sm text-muted-foreground">Gerenciar equipe e créditos</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Autorizado</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Founder Dashboard</p>
                        <p className="text-sm text-muted-foreground">Acesso a métricas de negócio</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Autorizado</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Configurações da Empresa</p>
                        <p className="text-sm text-muted-foreground">Alterar dados corporativos</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Autorizado</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving} size="lg">
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};
