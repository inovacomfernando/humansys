
import { useEffect, useCallback, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SessionHealth {
  isHealthy: boolean;
  lastCheck: Date;
  consecutiveFailures: number;
  networkStatus: 'online' | 'offline' | 'slow';
}

export const useSessionHealthCheck = () => {
  const [sessionHealth, setSessionHealth] = useState<SessionHealth>({
    isHealthy: true,
    lastCheck: new Date(),
    consecutiveFailures: 0,
    networkStatus: 'online'
  });
  
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  
  // Detectar qualidade da conexão
  const checkNetworkSpeed = useCallback(async (): Promise<'online' | 'offline' | 'slow'> => {
    try {
      const startTime = Date.now();
      const response = await fetch(`${supabase.supabaseUrl}/rest/v1/`, {
        method: 'HEAD',
        signal: AbortSignal.timeout(5000)
      });
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      if (!response.ok) return 'offline';
      if (responseTime > 3000) return 'slow';
      return 'online';
    } catch {
      return 'offline';
    }
  }, []);

  // Verificar saúde da sessão
  const checkSessionHealth = useCallback(async () => {
    if (!user) return;

    try {
      const networkStatus = await checkNetworkSpeed();
      
      // Tentar uma query simples para testar a sessão
      const { error } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);

      const isHealthy = !error;
      
      setSessionHealth(prev => ({
        isHealthy,
        lastCheck: new Date(),
        consecutiveFailures: isHealthy ? 0 : prev.consecutiveFailures + 1,
        networkStatus
      }));

      // Auto-logout após 3 falhas consecutivas
      if (!isHealthy && sessionHealth.consecutiveFailures >= 2) {
        console.log('Session unhealthy, forcing logout');
        toast({
          title: "Sessão Expirada",
          description: "Fazendo logout automático por inatividade.",
          variant: "destructive"
        });
        
        // Limpar tudo e fazer logout
        localStorage.clear();
        sessionStorage.clear();
        if (window.queryCache) {
          window.queryCache.clear();
        }
        
        await signOut();
        window.location.href = '/login';
      }
      
    } catch (error) {
      console.error('Session health check failed:', error);
      setSessionHealth(prev => ({
        ...prev,
        isHealthy: false,
        consecutiveFailures: prev.consecutiveFailures + 1,
        networkStatus: 'offline'
      }));
    }
  }, [user, checkNetworkSpeed, sessionHealth.consecutiveFailures, signOut, toast]);

  // Configurar health checks periódicos
  useEffect(() => {
    if (!user) return;

    // Check imediato
    checkSessionHealth();
    
    // Checks periódicos baseados na qualidade da rede
    const getCheckInterval = () => {
      switch (sessionHealth.networkStatus) {
        case 'offline': return 10000; // 10s quando offline
        case 'slow': return 30000; // 30s quando lento
        default: return 60000; // 1min quando normal
      }
    };

    const interval = setInterval(checkSessionHealth, getCheckInterval());

    // Check quando a página ganha foco
    const handleFocus = () => {
      checkSessionHealth();
    };

    // Check quando a conexão muda
    const handleOnline = () => {
      checkSessionHealth();
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('online', handleOnline);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('online', handleOnline);
    };
  }, [user, checkSessionHealth, sessionHealth.networkStatus]);

  return {
    sessionHealth,
    checkSessionHealth,
    forceRefresh: checkSessionHealth
  };
};
