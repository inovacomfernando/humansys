
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
      
      // Implementar timeout para evitar travamento
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout ao criar log')), 5000);
      });

      const logPromise = supabase
        .from('system_logs')
        .insert([{
          user_id: user.id,
          level,
          message,
          source,
          details: details ? JSON.stringify(details) : null
        }]);

      const { error } = await Promise.race([logPromise, timeoutPromise]) as any;

      if (error) {
        console.error('Erro ao criar log no Supabase:', error);
        return;
      }
      
      console.log('Log criado com sucesso');
    } catch (err) {
      console.warn('Erro crítico na função de log (ignorando):', err);
    }
  };

  const logError = (message: string, source: string, details?: any) => {
    console.error(`[${source}] ${message}`, details);
    // Criar log de forma assíncrona sem bloquear a execução
    createLog('error', message, source, details).catch(() => {
      // Ignorar erros de log silenciosamente
    });
  };

  const logWarning = (message: string, source: string, details?: any) => {
    console.warn(`[${source}] ${message}`, details);
    createLog('warning', message, source, details).catch(() => {
      // Ignorar erros de log silenciosamente
    });
  };

  const logInfo = (message: string, source: string, details?: any) => {
    console.info(`[${source}] ${message}`, details);
    createLog('info', message, source, details).catch(() => {
      // Ignorar erros de log silenciosamente
    });
  };

  const logDebug = (message: string, source: string, details?: any) => {
    console.debug(`[${source}] ${message}`, details);
    createLog('debug', message, source, details).catch(() => {
      // Ignorar erros de log silenciosamente
    });
  };

  return {
    createLog,
    logError,
    logWarning,
    logInfo,
    logDebug
  };
};
