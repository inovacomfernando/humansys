
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { checkSupabaseConnection } from '@/integrations/supabase/client';

export const ConnectionStatus = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkConnection = async () => {
    setIsChecking(true);
    try {
      const connected = await checkSupabaseConnection();
      setIsConnected(connected);
    } catch {
      setIsConnected(false);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkConnection();
    // Verificar conexão a cada 30 segundos
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  if (isConnected === null && !isChecking) return null;

  return (
    <div className="flex items-center space-x-2">
      <Badge 
        variant={isConnected ? "default" : "destructive"}
        className="flex items-center space-x-1"
      >
        {isChecking ? (
          <AlertCircle className="h-3 w-3 animate-spin" />
        ) : isConnected ? (
          <Wifi className="h-3 w-3" />
        ) : (
          <WifiOff className="h-3 w-3" />
        )}
        <span>
          {isChecking ? 'Verificando...' : isConnected ? 'Conectado' : 'Desconectado'}
        </span>
      </Badge>
    </div>
  );
};
