import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  RefreshCw, 
  Database, 
  Wifi, 
  User, 
  HardDrive,
  Activity,
  Settings,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useSystemManagement } from '@/hooks/useSystemManagement';
import { AuthDebugPanel } from '@/components/debug/AuthDebugPanel';
import { SystemLogsViewer } from '@/components/debug/SystemLogsViewer';
import { ConnectionStatus } from '@/components/feedback/ConnectionStatus';
import { supabase } from '@/integrations/supabase/client';

const StatusIcon = ({ status }: { status: boolean }) => {
  return status ? (
    <CheckCircle className="h-4 w-4 text-green-500" />
  ) : (
    <XCircle className="h-4 w-4 text-red-500" />
  );
};

export const SystemDebugPanel = () => {
  console.log("DEBUG PANEL ATUALIZADO ATIVO");

  const {
    systemStatus,
    isRefreshing,
    checkSystemStatus,
    refreshSystem,
    clearSystemCache,
    runDiagnostics
  } = useSystemManagement();


  const [ttl, setTtl] = useState("5");
  const [loading, setLoading] = useState(false);

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from("system_settings")
      .select("cache_ttl_minutes")
      .eq("id", "00000000-0000-0000-0000-000000000001")
      .single();

    if (!error && data) setTtl(String(data.cache_ttl_minutes));
  };

  const updateTTL = async () => {
    setLoading(true);
    await supabase
      .from("system_settings")
      .update({ cache_ttl_minutes: Number(ttl) })
      .eq("id", "00000000-0000-0000-0000-000000000001");
    setLoading(false);
  };

  const clearCacheVersion = async () => {
    setLoading(true);
    await supabase.rpc("increment_cache_version");
    setLoading(false);
  };

  useEffect(() => {
    checkSystemStatus();
    fetchSettings();
  }, []);

  const handleFullRefresh = async () => {
    await refreshSystem();
  };

  const handleRunDiagnostics = async () => {
    const diagnostics = await runDiagnostics();
    console.table(diagnostics);
  };

  return (
    <div className="space-y-6">
      {/* Status do Sistema */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Status do Sistema</span>
              </CardTitle>
              <CardDescription>
                Monitore a saúde e conectividade do sistema
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <ConnectionStatus />
              <Button
                onClick={checkSystemStatus}
                variant="outline"
                size="sm"
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <div className="flex items-center space-x-2">
                <Wifi className="h-4 w-4" />
                <StatusIcon status={systemStatus.connectivity} />
              </div>
              <div>
                <p className="text-sm font-medium">Conectividade</p>
                <p className="text-xs text-muted-foreground">
                  {systemStatus.connectivity ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <StatusIcon status={systemStatus.authentication} />
              </div>
              <div>
                <p className="text-sm font-medium">Autenticação</p>
                <p className="text-xs text-muted-foreground">
                  {systemStatus.authentication ? 'Logado' : 'Deslogado'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <div className="flex items-center space-x-2">
                <HardDrive className="h-4 w-4" />
                <StatusIcon status={systemStatus.cache} />
              </div>
              <div>
                <p className="text-sm font-medium">Cache</p>
                <p className="text-xs text-muted-foreground">
                  {systemStatus.cache ? 'Ativo' : 'Inativo'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <div className="flex items-center space-x-2">
                <Database className="h-4 w-4" />
                <StatusIcon status={systemStatus.connectivity} />
              </div>
              <div>
                <p className="text-sm font-medium">Database</p>
                <p className="text-xs text-muted-foreground">
                  {systemStatus.connectivity ? 'Conectado' : 'Desconectado'}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 text-xs text-muted-foreground">
            Última verificação: {new Date(systemStatus.lastCheck).toLocaleString('pt-BR')}
          </div>
        </CardContent>
      </Card>

      {/* Ações do Sistema */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Ações do Sistema</span>
          </CardTitle>
          <CardDescription>
            Ferramentas para manutenção e diagnóstico do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Button
              onClick={handleFullRefresh}
              disabled={isRefreshing}
              className="flex items-center space-x-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh Completo</span>
            </Button>

            <Button
              onClick={clearSystemCache}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <HardDrive className="h-4 w-4" />
              <span>Limpar Cache</span>
            </Button>

            <Button
              onClick={handleRunDiagnostics}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Activity className="h-4 w-4" />
              <span>Executar Diagnósticos</span>
            </Button>
          </div>

          <div className="mt-6 grid gap-2 max-w-xs">
            <Label htmlFor="ttl">Tempo de cache (minutos)</Label>
            <Input
              id="ttl"
              type="number"
              value={ttl}
              onChange={(e) => setTtl(e.target.value)}
            />
            <Button onClick={updateTTL} disabled={loading}>
              Atualizar TTL
            </Button>
            <Button variant="destructive" onClick={clearCacheVersion} disabled={loading}>
              Limpar Cache Global
            </Button>
          </div>

          {isRefreshing && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center space-x-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span className="text-sm">Atualizando sistema...</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      <AuthDebugPanel />
      <SystemLogsViewer />

      <Card>
        <CardHeader>
          <CardTitle>Informações Técnicas</CardTitle>
          <CardDescription>
            Detalhes técnicos sobre o ambiente e configurações
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Versão do Sistema</Label>
              <Input value="v2.1.0" readOnly />
            </div>
            <div className="space-y-2">
              <Label>Ambiente</Label>
              <Input value="Produção" readOnly />
            </div>
            <div className="space-y-2">
              <Label>Build</Label>
              <Input value={new Date().toISOString().split('T')[0]} readOnly />
            </div>
            <div className="space-y-2">
              <Label>Navegador</Label>
              <Input value={navigator.userAgent.split(' ')[0]} readOnly />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

