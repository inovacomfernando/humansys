
import { useEffect, useCallback, useState, useRef } from 'react';
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
  
  // Refs para evitar race conditions
  const isCheckingRef = useRef(false);
  const lastCheckRef = useRef(Date.now());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Detectar qualidade da conexão com throttling
  const checkNetworkSpeed = useCallback(async (): Promise<'online' | 'offline' | 'slow'> => {
    try {
      const startTime = Date.now();
      
      // Throttling: não verificar se a última verificação foi há menos de 10s
      if (Date.now() - lastCheckRef.current < 10000) {
        return sessionHealth.networkStatus;
      }
      
      const response = await fetch('https://hdugxslfoujddlbkvvak.supabase.co/rest/v1/', {
        method: 'HEAD',
        signal: AbortSignal.timeout(5000)
      });
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      lastCheckRef.current = Date.now();
      
      if (!response.ok) return 'offline';
      if (responseTime > 3000) return 'slow';
      return 'online';
    } catch {
      return 'offline';
    }
  }, [sessionHealth.networkStatus]);

  // Verificar saúde da sessão com mutex
  const checkSessionHealth = useCallback(async () => {
    if (!user || isCheckingRef.current) return;

    isCheckingRef.current = true;

    try {
      const networkStatus = await checkNetworkSpeed();
      
      // Tentar uma query simples para testar a sessão
      const { error } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);

      const isHealthy = !error;
      const newConsecutiveFailures = isHealthy ? 0 : sessionHealth.consecutiveFailures + 1;
      
      setSessionHealth(prev => ({
        isHealthy,
        lastCheck: new Date(),
        consecutiveFailures: newConsecutiveFailures,
        networkStatus
      }));

      // Auto-logout apenas após 5 falhas consecutivas para evitar logouts desnecessários
      if (!isHealthy && newConsecutiveFailures >= 5) {
        console.log('Session unhealthy after 5 attempts, forcing logout');
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
    } finally {
      isCheckingRef.current = false;
    }
  }, [user, checkNetworkSpeed, sessionHealth.consecutiveFailures, signOut, toast]);

  // Configurar health checks periódicos otimizados
  useEffect(() => {
    if (!user) {
      // Limpar interval se não há usuário
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Check imediato apenas se não houve check recente
    const timeSinceLastCheck = Date.now() - lastCheckRef.current;
    if (timeSinceLastCheck > 30000) { // 30s
      checkSessionHealth();
    }
    
    // Limpar interval anterior
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Interval inteligente baseado na qualidade da rede e atividade
    const getCheckInterval = () => {
      switch (sessionHealth.networkStatus) {
        case 'offline': return 30000; // 30s quando offline
        case 'slow': return 60000; // 1min quando lento
        default: return 120000; // 2min quando normal
      }
    };

    intervalRef.current = setInterval(() => {
      // Só verificar se a janela está ativa para economizar recursos
      if (!document.hidden) {
        checkSessionHealth();
      }
    }, getCheckInterval());

    // Check quando a página ganha foco (com debounce)
    const handleFocus = () => {
      const timeSinceLastCheck = Date.now() - lastCheckRef.current;
      if (timeSinceLastCheck > 30000) { // Debounce de 30s
        checkSessionHealth();
      }
    };

    // Check quando a conexão muda
    const handleOnline = () => {
      setTimeout(() => {
        checkSessionHealth();
      }, 1000); // Delay para estabilizar conexão
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('online', handleOnline);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('online', handleOnline);
    };
  }, [user, checkSessionHealth, sessionHealth.networkStatus]);

  // Cleanup no unmount
  useEffect(() => {
    return () => {
      isCheckingRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  return {
    sessionHealth,
    checkSessionHealth,
    forceRefresh: checkSessionHealth
  };
};
