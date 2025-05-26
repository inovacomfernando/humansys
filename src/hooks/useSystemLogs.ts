
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type LogLevel = 'info' | 'warning' | 'error' | 'debug';

export interface SystemLog {
  id: string;
  user_id: string;
  level: LogLevel;
  message: string;
  details?: any;
  source: string;
  created_at: string;
}

export const useSystemLogs = () => {
  const { user } = useAuth();

  const createLog = async (
    level: LogLevel,
    message: string,
    source: string,
    details?: any
  ) => {
    if (!user?.id) {
      console.warn('Tentativa de criar log sem usuário autenticado');
      return;
    }

    try {
      const { error } = await supabase
        .from('system_logs')
        .insert([{
          user_id: user.id,
          level,
          message,
          source,
          details: details ? JSON.stringify(details) : null
        }]);

      if (error) {
        console.error('Erro ao criar log:', error);
      }
    } catch (err) {
      console.error('Erro na função de log:', err);
    }
  };

  const logError = (message: string, source: string, details?: any) => {
    createLog('error', message, source, details);
  };

  const logWarning = (message: string, source: string, details?: any) => {
    createLog('warning', message, source, details);
  };

  const logInfo = (message: string, source: string, details?: any) => {
    createLog('info', message, source, details);
  };

  const logDebug = (message: string, source: string, details?: any) => {
    createLog('debug', message, source, details);
  };

  return {
    createLog,
    logError,
    logWarning,
    logInfo,
    logDebug
  };
};
