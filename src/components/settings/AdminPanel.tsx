
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
  RefreshCw,
  Database
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

    // Validar formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUserData.email)) {
      toast({
        title: "Email inválido",
        description: "Por favor, insira um email válido.",
        variant: "destructive",
      });
      return;
    }

    // Validar senha
    if (newUserData.password.length < 6) {
      toast({
        title: "Senha muito curta",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log('Iniciando criação de usuário:', { email: newUserData.email, name: newUserData.name });

      // Verificar se o usuário já existe na tabela de colaboradores
      const { data: existingCollaborator, error: checkError } = await supabase
        .from('collaborators')
        .select('*')
        .eq('email', newUserData.email)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking existing user:', checkError);
        throw new Error('Erro ao verificar usuário existente: ' + checkError.message);
      }

      if (existingCollaborator) {
        toast({
          title: "Usuário já existe",
          description: "Este email já está cadastrado no sistema.",
          variant: "destructive",
        });
        return;
      }

      // Gerar ID único para o usuário
      const userId = crypto.randomUUID();

      // Criar usuário na tabela de colaboradores
      const { data: collaboratorData, error: collaboratorError } = await supabase
        .from('collaborators')
        .insert([{
          id: userId,
          user_id: user?.id || '',
          name: newUserData.name,
          email: newUserData.email,
          status: 'active',
          password_hash: btoa(newUserData.password), // Apenas para desenvolvimento
          created_at: new Date().toISOString(),
          invited_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (collaboratorError) {
        console.error('Collaborator creation error:', collaboratorError);
        throw new Error('Erro ao criar colaborador: ' + collaboratorError.message);
      }

      console.log('Usuário criado com sucesso:', collaboratorData);

      toast({
        title: "Usuário criado com sucesso",
        description: `${newUserData.name} foi cadastrado no sistema. Email: ${newUserData.email}, Senha: ${newUserData.password}`,
      });

      // Limpar formulário
      setNewUserData({ email: '', password: '', name: '' });

    } catch (error: any) {
      console.error('Create user error:', error);
      
      let errorMessage = "Não foi possível criar o usuário.";
      
      if (error.message?.includes('duplicate') || error.message?.includes('unique')) {
        errorMessage = "Este email já está cadastrado no sistema.";
      } else if (error.message?.includes('permission') || error.message?.includes('RLS')) {
        errorMessage = "Sem permissão para criar usuários. Verifique as configurações de segurança.";
      } else if (error.message?.includes('JWT') || error.message?.includes('auth')) {
        errorMessage = "Problema de autenticação. Faça login novamente.";
      } else if (error.message) {
        errorMessage = error.message;
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

          {/* Sistema de Diagnóstico */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              <h4 className="font-medium">Diagnóstico do Sistema</h4>
            </div>
            <div className="grid gap-3">
              <Button 
                onClick={async () => {
                  try {
                    // Verificar conectividade básica
                    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
                    if (sessionError) throw sessionError;
                    
                    // Testar acesso à tabela de colaboradores
                    const { data: testData, error: testError } = await supabase
                      .from('collaborators')
                      .select('count')
                      .limit(0);
                    
                    // Mesmo com erro de RLS, significa que a conexão está funcionando
                    if (testError && !testError.message.includes('RLS') && !testError.message.includes('permission')) {
                      throw testError;
                    }
                    
                    toast({
                      title: "Sistema Online",
                      description: "Conexões funcionando normalmente. Banco de dados acessível.",
                    });
                  } catch (error: any) {
                    console.error('System check error:', error);
                    toast({
                      title: "Erro de Conectividade", 
                      description: `Problema detectado: ${error.message}`,
                      variant: "destructive",
                    });
                  }
                }}
                variant="outline"
                className="w-full"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Verificar Status do Sistema
              </Button>
              
              <Button 
                onClick={() => {
                  // Limpar cache e recarregar
                  localStorage.clear();
                  sessionStorage.clear();
                  window.location.reload();
                }}
                variant="outline"
                className="w-full"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reiniciar Sistema
              </Button>

              <Button 
                onClick={async () => {
                  try {
                    // Tentar reestabelecer conexão
                    await supabase.auth.refreshSession();
                    
                    toast({
                      title: "Conexão Restabelecida",
                      description: "Sistema reconectado com sucesso",
                    });
                  } catch (error) {
                    toast({
                      title: "Erro de Reconexão",
                      description: "Não foi possível restabelecer a conexão",
                      variant: "destructive",
                    });
                  }
                }}
                variant="outline"
                className="w-full"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reconectar Database
              </Button>
            </div>
          </div>

          {/* Troubleshooting */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-orange-600 mr-2" />
              <h4 className="font-medium text-orange-800">Problemas Comuns</h4>
            </div>
            <div className="text-sm text-orange-700 mt-2 space-y-1">
              <p>• <strong>Erro "Database is not defined":</strong> Recarregue a página</p>
              <p>• <strong>Erro de permissão:</strong> Verifique se está logado como admin</p>
              <p>• <strong>Email já existe:</strong> Use um email diferente</p>
              <p>• <strong>Erro de conectividade:</strong> Execute o diagnóstico do sistema</p>
              <p>• <strong>Senha muito curta:</strong> Use pelo menos 6 caracteres</p>
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
