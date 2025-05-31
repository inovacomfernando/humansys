
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export const ConnectionStatus = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkConnection = async () => {
    // Cache check - only check every 60 seconds
    if (lastCheck && Date.now() - lastCheck.getTime() < 60000) {
      return;
    }

    setIsChecking(true);
    try {
      // Simplified connection check - just ping auth
      const { data, error } = await supabase.auth.getSession();
      const connected = !error && data.session !== null;
      setIsConnected(connected);
      setLastCheck(new Date());
    } catch {
      // On any error, assume connected (less intrusive)
      setIsConnected(true);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkConnection();
    // Check every 2 minutes instead of 30 seconds
    const interval = setInterval(checkConnection, 120000);
    return () => clearInterval(interval);
  }, []);

  // Don't show anything if we're checking or haven't checked yet
  if (isChecking || isConnected === null) return null;

  // Only show if disconnected
  if (isConnected) return null;

  return (
    <div className="flex items-center space-x-2">
      <Badge 
        variant="destructive"
        className="flex items-center space-x-1"
      >
        <WifiOff className="h-3 w-3" />
        <span>Conexão instável</span>
      </Badge>
    </div>
  );
};
