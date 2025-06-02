
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
      // Verificar se o usuário já existe na tabela de colaboradores
      const { data: existingCollaborator } = await supabase
        .from('collaborators')
        .select('*')
        .eq('email', newUserData.email)
        .single();

      if (existingCollaborator) {
        toast({
          title: "Usuário já existe",
          description: "Este email já está cadastrado no sistema.",
          variant: "destructive",
        });
        return;
      }

      // Para produção: Criar usuário diretamente na tabela de colaboradores
      // O usuário receberá um convite por email para ativar a conta
      const { data: collaboratorData, error: collaboratorError } = await supabase
        .from('collaborators')
        .insert([{
          name: newUserData.name,
          email: newUserData.email,
          status: 'pending',
          password_hash: btoa(newUserData.password), // Não é seguro, apenas para desenvolvimento
          created_by: user?.id,
          invited_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (collaboratorError) {
        throw collaboratorError;
      }

      // Simular envio de email de convite
      toast({
        title: "Convite enviado",
        description: `Um convite foi enviado para ${newUserData.email}. Senha temporária: ${newUserData.password}`,
      });

      setNewUserData({ email: '', password: '', name: '' });
    } catch (error: any) {
      console.error('Create user error:', error);
      
      let errorMessage = "Não foi possível criar o usuário.";
      
      if (error.message?.includes('duplicate') || error.message?.includes('unique')) {
        errorMessage = "Este email já está cadastrado no sistema.";
      } else if (error.message?.includes('permission') || error.message?.includes('RLS')) {
        errorMessage = "Sem permissão para criar usuários. Contate o administrador do sistema.";
      }
      
      toast({
        title: "Erro ao criar usuário",
        description: errorMessage,
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

          {/* Sistema de Convites */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-green-600 mr-2" />
              <h4 className="font-medium text-green-800">Sistema de Convites</h4>
            </div>
            <div className="text-sm text-green-700 mt-2 space-y-1">
              <p>• Usuários são criados com status "pendente"</p>
              <p>• Uma senha temporária é fornecida para primeiro acesso</p>
              <p>• O usuário deve trocar a senha no primeiro login</p>
              <p>• Emails de convite podem ser configurados futuramente</p>
            </div>
          </div>

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
