
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { refreshSystemData, clearQueryCache, checkSupabaseConnection } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface SystemStatus {
  connectivity: boolean;
  authentication: boolean;
  cache: boolean;
  lastCheck: string;
}

export const useSystemManagement = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    connectivity: false,
    authentication: false,
    cache: true,
    lastCheck: new Date().toISOString()
  });
  const { toast } = useToast();
  const { user } = useAuth();

  const checkSystemStatus = async () => {
    console.log('Verificando status do sistema...');
    
    try {
      const connectivity = await checkSupabaseConnection();
      const authentication = !!user?.id;
      
      const status: SystemStatus = {
        connectivity,
        authentication,
        cache: true,
        lastCheck: new Date().toISOString()
      };
      
      setSystemStatus(status);
      
      console.log('Status do sistema:', status);
      return status;
    } catch (error) {
      console.error('Erro ao verificar status do sistema:', error);
      return {
        connectivity: false,
        authentication: false,
        cache: false,
        lastCheck: new Date().toISOString()
      };
    }
  };

  const refreshSystem = async () => {
    setIsRefreshing(true);
    
    try {
      console.log('Iniciando refresh completo do sistema...');
      
      // Limpar cache
      clearQueryCache();
      
      // Verificar status após limpeza
      await checkSystemStatus();
      
      // Refresh completo se necessário
      const success = await refreshSystemData();
      
      if (success) {
        toast({
          title: "Sistema Atualizado",
          description: "Todas as configurações foram atualizadas com sucesso.",
          variant: "default"
        });
      } else {
        throw new Error('Falha no refresh do sistema');
      }
      
      return true;
    } catch (error) {
      console.error('Erro no refresh do sistema:', error);
      toast({
        title: "Erro no Refresh",
        description: "Não foi possível atualizar completamente o sistema.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsRefreshing(false);
    }
  };

  const clearSystemCache = () => {
    try {
      clearQueryCache();
      toast({
        title: "Cache Limpo",
        description: "Cache do sistema foi limpo com sucesso.",
        variant: "default"
      });
      checkSystemStatus();
    } catch (error) {
      console.error('Erro ao limpar cache:', error);
      toast({
        title: "Erro",
        description: "Não foi possível limpar o cache.",
        variant: "destructive"
      });
    }
  };

  const runDiagnostics = async () => {
    console.log('Executando diagnósticos do sistema...');
    
    const diagnostics = {
      timestamp: new Date().toISOString(),
      connectivity: await checkSupabaseConnection(),
      authentication: !!user?.id,
      localStorage: !!localStorage.getItem('supabase.auth.token'),
      userAgent: navigator.userAgent,
      online: navigator.onLine
    };
    
    console.log('Diagnósticos completos:', diagnostics);
    
    return diagnostics;
  };

  return {
    systemStatus,
    isRefreshing,
    checkSystemStatus,
    refreshSystem,
    clearSystemCache,
    runDiagnostics
  };
};
