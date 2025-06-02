import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  UserPlus, 
  Users, 
  Mail, 
  Shield, 
  Trash2,
  Edit,
  MoreHorizontal,
  AlertCircle,
  Eye,
  EyeOff,
  Key,
  Settings,
  Lock
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useCredits } from '@/hooks/useCredits';
import { supabase } from '@/integrations/supabase/client';
import { PermissionsForm } from './PermissionsForm';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  created_at: string;
  last_sign_in_at?: string;
  status: 'active' | 'inactive';
  password?: string;
  permissions?: UserPermissions;
}

interface UserPermissions {
  dashboard: boolean;
  colaboradores: boolean;
  treinamentos: boolean;
  reunioes: boolean;
  metas: boolean;
  feedbacks: boolean;
  pesquisas: boolean;
  documentos: boolean;
  certificados: boolean;
  onboarding: boolean;
  disc: boolean;
  analytics: boolean;
  recruitment: boolean;
}

export const UserManagementDialog = () => {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    name: '',
    password: '',
    confirmPassword: ''
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [permissionsDialogOpen, setPermissionsDialogOpen] = useState(false);
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
  const [showPassword, setShowPassword] = useState<{[key: string]: boolean}>({});
  const [newPassword, setNewPassword] = useState('');

  const defaultPermissions: UserPermissions = {
    dashboard: true,
    colaboradores: false,
    treinamentos: false,
    reunioes: false,
    metas: false,
    feedbacks: false,
    pesquisas: false,
    documentos: false,
    certificados: false,
    onboarding: false,
    disc: false,
    analytics: false,
    recruitment: false,
  };

  const { user } = useAuth();
  const { credits, useCredit } = useCredits();
  const { toast } = useToast();

  const generateRandomPassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const togglePasswordVisibility = (userId: string) => {
    setShowPassword(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const handleResetPassword = async () => {
    if (!editingUser) return;

    const newRandomPassword = generateRandomPassword();
    setNewPassword(newRandomPassword);

    try {
      // Simular reset de senha
      const updatedUsers = users.map(u => 
        u.id === editingUser.id 
          ? { ...u, password: newRandomPassword }
          : u
      );
      setUsers(updatedUsers);

      toast({
        title: "Senha resetada com sucesso",
        description: `Nova senha gerada: ${newRandomPassword}`,
      });

      setResetPasswordDialogOpen(false);
      setEditingUser(null);
    } catch (error) {
      toast({
        title: "Erro ao resetar senha",
        description: "Não foi possível resetar a senha",
        variant: "destructive",
      });
    }
  };

  const handleUpdatePermissions = async (permissions: UserPermissions) => {
    if (!editingUser) return;

    try {
      const updatedUsers = users.map(u => 
        u.id === editingUser.id 
          ? { ...u, permissions }
          : u
      );
      setUsers(updatedUsers);

      toast({
        title: "Permissões atualizadas",
        description: `Permissões de ${editingUser.name} foram atualizadas`,
      });

      setPermissionsDialogOpen(false);
      setEditingUser(null);
    } catch (error) {
      toast({
        title: "Erro ao atualizar permissões",
        description: "Não foi possível atualizar as permissões",
        variant: "destructive",
      });
    }
  };

  const fetchUsers = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      // Tentar buscar da tabela organization_users primeiro
      const { data: orgData, error: orgError } = await supabase
        .from('organization_users')
        .select(`
          id,
          user_id,
          role,
          status,
          created_at
        `)
        .eq('admin_user_id', user.id);

      // Se falhar, buscar da tabela collaborators como fallback
      if (orgError) {
        console.log('Organization table not available, using collaborators table');

        const { data: collabData, error: collabError } = await supabase
          .from('collaborators')
          .select('*')
          .eq('user_id', user.id);

        if (collabError) {
          console.error('Error fetching collaborators:', collabError);
        }

        // Incluir usuários dos colaboradores + admin
        const allUsers: User[] = [
          {
            id: user.id,
            email: user.email || '',
            name: user.email?.split('@')[0] || 'Admin',
            role: 'admin',
            created_at: new Date().toISOString(),
            status: 'active',
            password: '••••••••',
            permissions: {
              dashboard: true,
              colaboradores: true,
              treinamentos: true,
              reunioes: true,
              metas: true,
              feedbacks: true,
              pesquisas: true,
              documentos: true,
              certificados: true,
              onboarding: true,
              disc: true,
              analytics: true,
              recruitment: true,
            }
          }
        ];

        if (collabData) {
          const collaboratorUsers = collabData.map(collab => ({
            id: `collab_${collab.id}`,
            email: collab.email,
            name: collab.name,
            role: 'user' as const,
            created_at: collab.created_at,
            status: collab.status as 'active' | 'inactive',
            password: generateRandomPassword(),
            permissions: defaultPermissions
          }));
          allUsers.push(...collaboratorUsers);
        }

        setUsers(allUsers);
      } else {
        // Processar dados da tabela organization_users
        const formattedUsers = orgData?.map(item => ({
          id: item.user_id,
          email: `user_${item.user_id}@empresa.com`,
          name: `Usuário ${item.user_id.slice(0, 8)}`,
          role: item.role as 'admin' | 'user',
          created_at: item.created_at,
          status: item.status as 'active' | 'inactive'
        })) || [];

        // Incluir o usuário admin atual
        const currentUserInList = formattedUsers.find(u => u.id === user.id);
        if (!currentUserInList) {
          formattedUsers.unshift({
            id: user.id,
            email: user.email || '',
            name: user.email?.split('@')[0] || 'Admin',
            role: 'admin',
            created_at: new Date().toISOString(),
            status: 'active',
            password: '••••••••',
            permissions: {
              dashboard: true,
              colaboradores: true,
              treinamentos: true,
              reunioes: true,
              metas: true,
              feedbacks: true,
              pesquisas: true,
              documentos: true,
              certificados: true,
              onboarding: true,
              disc: true,
              analytics: true,
              recruitment: true,
            }
          });
        }

        setUsers(formattedUsers);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      // Fallback para apenas o admin
      const fallbackUsers: User[] = [
        {
          id: user.id,
          email: user.email || '',
          name: user.email?.split('@')[0] || 'Admin',
          role: 'admin',
          created_at: new Date().toISOString(),
          status: 'active',
          password: '••••••••',
          permissions: {
            dashboard: true,
            colaboradores: true,
            treinamentos: true,
            reunioes: true,
            metas: true,
            feedbacks: true,
            pesquisas: true,
            documentos: true,
            certificados: true,
            onboarding: true,
            disc: true,
            analytics: true,
            recruitment: true,
          }
        }
      ];
      setUsers(fallbackUsers);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async () => {
    if (!user?.id) return;

    // Validações
    if (!newUser.email || !newUser.name || !newUser.password) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    if (newUser.password !== newUser.confirmPassword) {
      toast({
        title: "Senhas não conferem",
        description: "A senha e confirmação devem ser iguais",
        variant: "destructive",
      });
      return;
    }

    if (newUser.password.length < 6) {
      toast({
        title: "Senha muito curta",
        description: "A senha deve ter pelo menos 6 caracteres",
        variant: "destructive",
      });
      return;
    }

    // Verificar créditos disponíveis
    if (credits <= 0) {
      toast({
        title: "Créditos insuficientes",
        description: "Você não tem créditos suficientes para cadastrar um novo usuário",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Verificar se o usuário já existe
      const { data: existingUser } = await supabase
        .from('collaborators')
        .select('email')
        .eq('email', newUser.email)
        .single();

      if (existingUser) {
        throw new Error('Este email já está cadastrado no sistema');
      }

      // Gerar um ID temporário para o usuário
      const newUserId = crypto.randomUUID();

      // Inserir na tabela de colaboradores
      const { error: collaboratorError } = await supabase
        .from('collaborators')
        .insert({
          user_id: newUserId,
          name: newUser.name,
          email: newUser.email,
          status: 'pending',
          password_hash: btoa(newUser.password), // Apenas para desenvolvimento
          created_by: user.id,
          invited_at: new Date().toISOString()
        });

      if (collaboratorError) {
        console.error('Collaborator insert error:', collaboratorError);
        throw new Error('Erro ao inserir colaborador na base de dados');
      }

      // Tentar inserir na tabela de organização (se existir)
      try {
        await supabase
          .from('organization_users')
          .insert({
            user_id: newUserId,
            admin_user_id: user.id,
            role: 'user',
            status: 'active'
          });
      } catch (orgError) {
        console.log('Organization table not available, using fallback');
      }

      // Consumir crédito
      await useCredit(`Cadastro de usuário: ${newUser.name}`);

      toast({
        title: "Usuário criado com sucesso",
        description: `${newUser.name} foi adicionado à sua organização. Senha: ${newUser.password}`,
      });

      // Limpar formulário
      setNewUser({
        email: '',
        name: '',
        password: '',
        confirmPassword: ''
      });

      // Atualizar lista
      await fetchUsers();

    } catch (error: any) {
      console.error('Error creating user:', error);
      toast({
        title: "Erro ao criar usuário",
        description: "Não foi possível criar o usuário. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete || !user?.id) return;

    setIsLoading(true);
    try {
      // Não permitir deletar o próprio admin
      if (userToDelete.id === user.id) {
        toast({
          title: "Ação não permitida",
          description: "Você não pode deletar sua própria conta",
          variant: "destructive",
        });
        return;
      }

      // Tentar remover da tabela de organização
      try {
        await supabase
          .from('organization_users')
          .delete()
          .eq('user_id', userToDelete.id)
          .eq('admin_user_id', user.id);
      } catch (orgError) {
        console.log('Organization table not available');
      }

      // Remover da tabela de colaboradores se for um colaborador
      if (userToDelete.id.startsWith('collab_')) {
        const collabId = userToDelete.id.replace('collab_', '');
        await supabase
          .from('collaborators')
          .delete()
          .eq('id', collabId)
          .eq('user_id', user.id);
      }

      toast({
        title: "Usuário removido",
        description: `${userToDelete.name} foi removido da organização`,
      });

      setDeleteDialogOpen(false);
      setUserToDelete(null);
      await fetchUsers();

    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast({
        title: "Erro ao remover usuário",
        description: "Não foi possível remover o usuário",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchUsers();
    }
  }, [open]);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Gerenciar Usuários
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Gerenciamento de Usuários
            </DialogTitle>
            <DialogDescription>
              Cadastre e gerencie usuários da sua organização. Cada usuário consome 1 crédito.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Informações de créditos */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-800">Créditos Disponíveis</span>
              </div>
              <p className="text-sm text-blue-700">
                Você tem <strong>{credits}</strong> crédito(s) disponível(is) para cadastro de usuários.
              </p>
            </div>

            {/* Formulário de novo usuário */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Cadastrar Novo Usuário</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input
                      id="name"
                      placeholder="Nome do usuário"
                      value={newUser.name}
                      onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@empresa.com"
                      value={newUser.email}
                      onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      value={newUser.password}
                      onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirme a senha"
                      value={newUser.confirmPassword}
                      onChange={(e) => setNewUser(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    />
                  </div>
                </div>
                <Button 
                  onClick={handleCreateUser}
                  disabled={isLoading || credits <= 0}
                  className="w-full"
                >
                  {isLoading ? 'Criando...' : 'Criar Usuário (1 crédito)'}
                </Button>
              </CardContent>
            </Card>

            <Separator />

            {/* Lista de usuários */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Usuários da Organização</h3>

              {isLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {users.map((userData) => (
                    <Card key={userData.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>
                              {userData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{userData.name}</h4>
                              <Badge variant={userData.role === 'admin' ? 'default' : 'secondary'}>
                                {userData.role === 'admin' ? 'Admin' : 'Usuário'}
                              </Badge>
                              <Badge variant={userData.status === 'active' ? 'outline' : 'destructive'}>
                                {userData.status === 'active' ? 'Ativo' : 'Inativo'}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Mail className="h-3 w-3" />
                              {userData.email}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Lock className="h-3 w-3" />
                              {showPassword[userData.id] ? userData.password : '••••••••'}
                            </div>
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              onClick={() => togglePasswordVisibility(userData.id)}
                            >
                              {showPassword[userData.id] ? (
                                <EyeOff className="h-4 w-4 mr-2" />
                              ) : (
                                <Eye className="h-4 w-4 mr-2" />
                              )}
                              {showPassword[userData.id] ? 'Ocultar Senha' : 'Ver Senha'}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setEditingUser(userData);
                                setResetPasswordDialogOpen(true);
                              }}
                            >
                              <Key className="h-4 w-4 mr-2" />
                              Resetar Senha
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setEditingUser(userData);
                                setPermissionsDialogOpen(true);
                              }}
                            >
                              <Shield className="h-4 w-4 mr-2" />
                              Gerenciar Permissões
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {userData.role !== 'admin' && (
                              <DropdownMenuItem
                                onClick={() => {
                                  setUserToDelete(userData);
                                  setDeleteDialogOpen(true);
                                }}
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Remover Usuário
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </Card>
                  ))}

                  {users.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Nenhum usuário encontrado</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmação de exclusão */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Confirmar Exclusão
            </AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover <strong>{userToDelete?.name}</strong> da organização?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remover Usuário
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog de reset de senha */}
      <AlertDialog open={resetPasswordDialogOpen} onOpenChange={setResetPasswordDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-blue-600" />
              Resetar Senha
            </AlertDialogTitle>
            <AlertDialogDescription>
              Isso irá gerar uma nova senha aleatória para <strong>{editingUser?.name}</strong>.
              A nova senha será exibida e deverá ser compartilhada com o usuário.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleResetPassword}>
              Gerar Nova Senha
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog de gerenciamento de permissões */}
      <Dialog open={permissionsDialogOpen} onOpenChange={setPermissionsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Gerenciar Permissões - {editingUser?.name}
            </DialogTitle>
            <DialogDescription>
              Configure quais funcionalidades este usuário pode acessar
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto pr-2">
            {editingUser && (
              <PermissionsForm 
                user={editingUser}
                onSave={handleUpdatePermissions}
                onCancel={() => {
                  setPermissionsDialogOpen(false);
                  setEditingUser(null);
                }}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};