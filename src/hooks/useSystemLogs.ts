
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
    // Verificar se o usuário está autenticado
    if (!user?.id) {
      console.warn('Tentativa de criar log sem usuário autenticado:', { level, message, source });
      return;
    }

    try {
      console.log('Criando log:', { level, message, source, userId: user.id });
      
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
        console.error('Erro ao criar log no Supabase:', error);
        // Não criar um loop infinito tentando logar o erro de log
        return;
      }
      
      console.log('Log criado com sucesso');
    } catch (err) {
      console.error('Erro crítico na função de log:', err);
      // Não tentar logar este erro para evitar loops infinitos
    }
  };

  const logError = (message: string, source: string, details?: any) => {
    console.error(`[${source}] ${message}`, details);
    createLog('error', message, source, details);
  };

  const logWarning = (message: string, source: string, details?: any) => {
    console.warn(`[${source}] ${message}`, details);
    createLog('warning', message, source, details);
  };

  const logInfo = (message: string, source: string, details?: any) => {
    console.info(`[${source}] ${message}`, details);
    createLog('info', message, source, details);
  };

  const logDebug = (message: string, source: string, details?: any) => {
    console.debug(`[${source}] ${message}`, details);
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
