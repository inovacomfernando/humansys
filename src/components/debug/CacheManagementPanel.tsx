
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, RefreshCw, Trash2, HardDrive, AlertCircle } from 'lucide-react';
import { useCacheManagement } from '@/hooks/useCacheManagement';
import { useToast } from '@/hooks/use-toast';

export const CacheManagementPanel = () => {
  const { 
    clearAllCaches, 
    checkCacheIntegrity, 
    repairCache, 
    forceRefresh, 
    isClearing, 
    lastCleared 
  } = useCacheManagement();
  const { toast } = useToast();

  const handleClearCache = async () => {
    const success = await clearAllCaches();
    
    toast({
      title: success ? "Cache Limpo" : "Erro",
      description: success 
        ? "Todos os caches foram limpos com sucesso" 
        : "Erro ao limpar cache",
      variant: success ? "default" : "destructive"
    });
  };

  const handleRepairCache = async () => {
    const repaired = await repairCache();
    
    toast({
      title: repaired ? "Cache Reparado" : "Cache Íntegro",
      description: repaired 
        ? "Cache foi reparado com sucesso" 
        : "Nenhum reparo necessário",
    });
  };

  const handleIntegrityCheck = () => {
    const integrity = checkCacheIntegrity();
    
    toast({
      title: integrity.isValid ? "Cache Íntegro" : "Cache Corrompido",
      description: integrity.isValid 
        ? "Todos os caches estão funcionando corretamente"
        : `Problemas encontrados: ${integrity.errors.join(', ')}`,
      variant: integrity.isValid ? "default" : "destructive"
    });
  };

  const handleForceRefresh = () => {
    toast({
      title: "Reiniciando Aplicação",
      description: "A página será recarregada...",
    });
    
    setTimeout(forceRefresh, 1000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <HardDrive className="h-5 w-5" />
          <span>Gerenciamento de Cache</span>
        </CardTitle>
        <CardDescription>
          Ferramentas para limpeza, reparo e verificação do cache do sistema
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status do Cache */}
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <div>
              <p className="text-sm font-medium">Status do Cache</p>
              <p className="text-xs text-muted-foreground">
                {lastCleared 
                  ? `Última limpeza: ${new Date(lastCleared).toLocaleString('pt-BR')}`
                  : 'Nunca foi limpo'
                }
              </p>
            </div>
          </div>
          <Badge variant="outline">Ativo</Badge>
        </div>

        {/* Ações de Cache */}
        <div className="grid gap-3 md:grid-cols-2">
          <Button
            onClick={handleIntegrityCheck}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <AlertCircle className="h-4 w-4" />
            <span>Verificar Integridade</span>
          </Button>

          <Button
            onClick={handleRepairCache}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Reparar Cache</span>
          </Button>

          <Button
            onClick={handleClearCache}
            disabled={isClearing}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <Trash2 className={`h-4 w-4 ${isClearing ? 'animate-spin' : ''}`} />
            <span>{isClearing ? 'Limpando...' : 'Limpar Tudo'}</span>
          </Button>

          <Button
            onClick={handleForceRefresh}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh Forçado</span>
          </Button>
        </div>

        {/* Informações Técnicas */}
        <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
          <p className="text-sm font-medium">Informações de Cache:</p>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>• LocalStorage: {localStorage.length} chaves</p>
            <p>• SessionStorage: {sessionStorage.length} chaves</p>
            <p>• Última verificação: {new Date().toLocaleString('pt-BR')}</p>
          </div>
        </div>

        {/* Aviso */}
        <div className="flex items-start space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-yellow-800">Atenção</p>
            <p className="text-yellow-700">
              A limpeza completa do cache irá deslogar o usuário e remover todos os dados temporários.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
