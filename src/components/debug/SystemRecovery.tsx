
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle, 
  Database,
  Wifi,
  Power,
  Settings
} from 'lucide-react';

export const SystemRecovery = () => {
  const [isRecovering, setIsRecovering] = useState(false);
  const [systemStatus, setSystemStatus] = useState({
    database: false,
    authentication: false,
    network: false,
    lastCheck: new Date()
  });
  const { toast } = useToast();

  const checkSystemHealth = async () => {
    setIsRecovering(true);
    
    try {
      // Verificar conectividade de rede
      const networkCheck = await fetch(window.location.origin, { method: 'HEAD' });
      const networkStatus = networkCheck.ok;

      // Verificar autenticação
      const { data: authData, error: authError } = await supabase.auth.getSession();
      const authStatus = !authError && !!authData.session;

      // Verificar database
      const { error: dbError } = await supabase
        .from('collaborators')
        .select('count')
        .limit(0);
      const dbStatus = !dbError || dbError.code === 'PGRST301'; // RLS error ainda indica conectividade

      setSystemStatus({
        database: dbStatus,
        authentication: authStatus,
        network: networkStatus,
        lastCheck: new Date()
      });

      const overallHealth = dbStatus && authStatus && networkStatus;
      
      toast({
        title: overallHealth ? "Sistema Saudável" : "Problemas Detectados",
        description: overallHealth 
          ? "Todos os componentes estão funcionando" 
          : "Alguns componentes precisam de atenção",
        variant: overallHealth ? "default" : "destructive"
      });

    } catch (error) {
      console.error('Health check failed:', error);
      setSystemStatus({
        database: false,
        authentication: false,
        network: false,
        lastCheck: new Date()
      });
      
      toast({
        title: "Erro no Diagnóstico",
        description: "Não foi possível verificar o status do sistema",
        variant: "destructive"
      });
    } finally {
      setIsRecovering(false);
    }
  };

  const performSystemRecovery = async () => {
    setIsRecovering(true);
    
    try {
      // 1. Limpar cache
      localStorage.clear();
      sessionStorage.clear();
      
      // 2. Tentar reconectar autenticação
      await supabase.auth.refreshSession();
      
      // 3. Aguardar um momento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 4. Recarregar página
      window.location.reload();
      
    } catch (error) {
      console.error('Recovery failed:', error);
      toast({
        title: "Erro na Recuperação",
        description: "A recuperação automática falhou. Tente recarregar a página manualmente.",
        variant: "destructive"
      });
    } finally {
      setIsRecovering(false);
    }
  };

  const StatusIndicator = ({ status, label }: { status: boolean; label: string }) => (
    <div className="flex items-center gap-2 p-2 border rounded">
      {status ? (
        <CheckCircle className="h-4 w-4 text-green-500" />
      ) : (
        <AlertTriangle className="h-4 w-4 text-red-500" />
      )}
      <span className="text-sm">{label}</span>
      <span className={`text-xs px-2 py-1 rounded ${status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
        {status ? 'OK' : 'ERRO'}
      </span>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Recuperação do Sistema
        </CardTitle>
        <CardDescription>
          Diagnostique e resolva problemas do sistema
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Use estas ferramentas quando o sistema apresentar problemas de conectividade ou funcionamento.
          </AlertDescription>
        </Alert>

        {/* Status dos Componentes */}
        <div className="space-y-3">
          <h4 className="font-medium">Status dos Componentes</h4>
          <div className="grid gap-2">
            <StatusIndicator status={systemStatus.network} label="Conectividade de Rede" />
            <StatusIndicator status={systemStatus.database} label="Banco de Dados" />
            <StatusIndicator status={systemStatus.authentication} label="Autenticação" />
          </div>
          <p className="text-xs text-muted-foreground">
            Última verificação: {systemStatus.lastCheck.toLocaleString('pt-BR')}
          </p>
        </div>

        {/* Ações de Recuperação */}
        <div className="space-y-3">
          <h4 className="font-medium">Ações de Recuperação</h4>
          <div className="grid gap-2">
            <Button
              onClick={checkSystemHealth}
              disabled={isRecovering}
              variant="outline"
              className="w-full"
            >
              {isRecovering ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4 mr-2" />
              )}
              Verificar Sistema
            </Button>

            <Button
              onClick={performSystemRecovery}
              disabled={isRecovering}
              variant="outline"
              className="w-full"
            >
              {isRecovering ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Power className="h-4 w-4 mr-2" />
              )}
              Recuperação Completa
            </Button>

            <Button
              onClick={() => {
                window.location.href = '/login';
              }}
              variant="outline"
              className="w-full"
            >
              <Wifi className="h-4 w-4 mr-2" />
              Ir para Login
            </Button>
          </div>
        </div>

        {/* Instruções de Emergência */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-medium text-yellow-800 mb-2">Se o problema persistir:</h4>
          <div className="text-sm text-yellow-700 space-y-1">
            <p>1. Feche todas as abas do navegador</p>
            <p>2. Aguarde 30 segundos</p>
            <p>3. Abra uma nova aba e acesse o sistema novamente</p>
            <p>4. Se ainda houver problemas, contate o suporte</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
