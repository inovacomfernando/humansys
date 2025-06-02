
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Shield, 
  UserCheck, 
  Key, 
  Mail, 
  AlertTriangle, 
  CheckCircle,
  RefreshCw 
} from 'lucide-react';
import { AccountRecovery } from './AccountRecovery';

export const AdminPanel = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [newUserData, setNewUserData] = useState({
    email: '',
    password: '',
    name: ''
  });

  const handlePasswordReset = async () => {
    if (!resetEmail) {
      toast({
        title: "Email obrigatório",
        description: "Digite o email do usuário para resetar a senha.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/login`,
      });

      if (error) throw error;

      toast({
        title: "Email de reset enviado",
        description: `Um email para resetar a senha foi enviado para ${resetEmail}`,
      });
      setResetEmail('');
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast({
        title: "Erro ao enviar reset",
        description: error.message || "Não foi possível enviar o email de reset.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async () => {
    if (!newUserData.email || !newUserData.password || !newUserData.name) {
      toast({
        title: "Dados incompletos",
        description: "Preencha todos os campos para criar o usuário.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Criar usuário via admin
      const { data, error } = await supabase.auth.admin.createUser({
        email: newUserData.email,
        password: newUserData.password,
        email_confirm: true,
        user_metadata: {
          name: newUserData.name,
          full_name: newUserData.name,
        }
      });

      if (error) throw error;

      // Adicionar na tabela de colaboradores
      if (data.user) {
        const { error: collaboratorError } = await supabase
          .from('collaborators')
          .insert([{
            user_id: data.user.id,
            name: newUserData.name,
            email: newUserData.email,
            status: 'active'
          }]);

        if (collaboratorError) {
          console.error('Error adding to collaborators:', collaboratorError);
        }
      }

      toast({
        title: "Usuário criado com sucesso",
        description: `${newUserData.name} foi adicionado ao sistema.`,
      });

      setNewUserData({ email: '', password: '', name: '' });
    } catch (error: any) {
      console.error('Create user error:', error);
      toast({
        title: "Erro ao criar usuário",
        description: error.message || "Não foi possível criar o usuário.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Painel Administrativo
          </CardTitle>
          <CardDescription>
            Ferramentas para gerenciamento de usuários e sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Este painel é destinado apenas para administradores. Use com cuidado.
            </AlertDescription>
          </Alert>

          {/* Reset de Senha */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              <h4 className="font-medium">Resetar Senha de Usuário</h4>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="reset-email">Email do usuário</Label>
              <div className="flex gap-2">
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="usuario@empresa.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={handlePasswordReset}
                  disabled={isLoading}
                  variant="outline"
                >
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Mail className="h-4 w-4" />
                  )}
                  Enviar Reset
                </Button>
              </div>
            </div>
          </div>

          {/* Criar Usuário */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              <h4 className="font-medium">Criar Novo Usuário</h4>
            </div>
            <div className="grid gap-3">
              <div>
                <Label htmlFor="new-user-name">Nome completo</Label>
                <Input
                  id="new-user-name"
                  placeholder="Nome do usuário"
                  value={newUserData.name}
                  onChange={(e) => setNewUserData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="new-user-email">Email</Label>
                <Input
                  id="new-user-email"
                  type="email"
                  placeholder="usuario@empresa.com"
                  value={newUserData.email}
                  onChange={(e) => setNewUserData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="new-user-password">Senha inicial</Label>
                <Input
                  id="new-user-password"
                  type="password"
                  placeholder="Senha segura"
                  value={newUserData.password}
                  onChange={(e) => setNewUserData(prev => ({ ...prev, password: e.target.value }))}
                />
              </div>
              <Button 
                onClick={handleCreateUser}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                Criar Usuário
              </Button>
            </div>
          </div>

          {/* Recuperação de Conta */}
          <AccountRecovery />

          {/* Informações do Sistema */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-blue-600 mr-2" />
              <h4 className="font-medium text-blue-800">Dicas para Produção</h4>
            </div>
            <div className="text-sm text-blue-700 mt-2 space-y-1">
              <p>• Use senhas fortes para todos os usuários</p>
              <p>• Monitore logs de acesso regularmente</p>
              <p>• Mantenha backups regulares dos dados</p>
              <p>• Configure notificações de segurança</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
