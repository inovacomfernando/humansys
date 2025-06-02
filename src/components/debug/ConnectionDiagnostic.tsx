
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, CheckCircle, XCircle, AlertTriangle, Wifi } from 'lucide-react';
import { supabase, checkSupabaseConnection } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const ConnectionDiagnostic: React.FC = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected' | 'error'>('checking');
  const [sessionStatus, setSessionStatus] = useState<'valid' | 'invalid' | 'expired' | 'checking'>('checking');
  const [tableAccess, setTableAccess] = useState<'accessible' | 'restricted' | 'error' | 'checking'>('checking');
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const [errorDetails, setErrorDetails] = useState<string>('');
  const { user } = useAuth();

  const runDiagnostic = async () => {
    setIsChecking(true);
    setConnectionStatus('checking');
    setSessionStatus('checking');
    setTableAccess('checking');
    setErrorDetails('');

    try {
      // 1. Verificar conectividade básica
      const isConnected = await checkSupabaseConnection();
      setConnectionStatus(isConnected ? 'connected' : 'disconnected');

      // 2. Verificar sessão
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        setSessionStatus('error');
        setErrorDetails(prev => prev + `Session Error: ${sessionError.message}\n`);
      } else if (!session) {
        setSessionStatus('invalid');
      } else {
        setSessionStatus('valid');
      }

      // 3. Verificar acesso à tabela colaboradores
      if (session && user?.id) {
        try {
          const { data, error } = await supabase
            .from('collaborators')
            .select('count')
            .eq('user_id', user.id)
            .limit(0);

          if (error) {
            setTableAccess('restricted');
            setErrorDetails(prev => prev + `Table Access Error: ${error.message}\n`);
          } else {
            setTableAccess('accessible');
          }
        } catch (error: any) {
          setTableAccess('error');
          setErrorDetails(prev => prev + `Table Query Error: ${error.message}\n`);
        }
      } else {
        setTableAccess('restricted');
      }

    } catch (error: any) {
      setConnectionStatus('error');
      setErrorDetails(prev => prev + `General Error: ${error.message}\n`);
    }

    setLastCheck(new Date());
    setIsChecking(false);
  };

  useEffect(() => {
    runDiagnostic();
  }, [user?.id]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
      case 'valid':
      case 'accessible':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />OK</Badge>;
      case 'disconnected':
      case 'invalid':
      case 'restricted':
        return <Badge className="bg-yellow-100 text-yellow-800"><AlertTriangle className="h-3 w-3 mr-1" />Limitado</Badge>;
      case 'error':
      case 'expired':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Erro</Badge>;
      case 'checking':
        return <Badge className="bg-blue-100 text-blue-800"><RefreshCw className="h-3 w-3 mr-1 animate-spin" />Verificando</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <Wifi className="h-5 w-5 mr-2" />
            Diagnóstico de Conexão
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={runDiagnostic}
            disabled={isChecking}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
            {isChecking ? 'Verificando...' : 'Verificar'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Conectividade Supabase:</span>
            {getStatusBadge(connectionStatus)}
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status da Sessão:</span>
            {getStatusBadge(sessionStatus)}
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Acesso à Tabela:</span>
            {getStatusBadge(tableAccess)}
          </div>
        </div>

        {lastCheck && (
          <div className="text-xs text-muted-foreground">
            Última verificação: {lastCheck.toLocaleTimeString()}
          </div>
        )}

        {errorDetails && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="text-xs font-mono whitespace-pre-wrap max-h-32 overflow-y-auto">
                {errorDetails}
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="text-xs text-muted-foreground space-y-1">
          <p><strong>User ID:</strong> {user?.id || 'Não autenticado'}</p>
          <p><strong>Email:</strong> {user?.email || 'N/A'}</p>
        </div>
      </CardContent>
    </Card>
  );
};
