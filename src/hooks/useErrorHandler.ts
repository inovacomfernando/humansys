
import { useSystemLogs } from './useSystemLogs';
import { useToast } from '@/hooks/use-toast';

export const useErrorHandler = () => {
  const { logError } = useSystemLogs();
  const { toast } = useToast();

  const handleError = (
    error: any,
    source: string,
    userFriendlyMessage?: string,
    showToast: boolean = true
  ) => {
    console.error(`[${source}] Erro capturado:`, error);
    
    // Log do erro no sistema
    logError(
      error.message || 'Erro desconhecido',
      source,
      {
        error: error,
        stack: error.stack,
        timestamp: new Date().toISOString()
      }
    );

    // Mostrar toast para o usuário se solicitado
    if (showToast) {
      toast({
        title: "Erro",
        description: userFriendlyMessage || "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleAsyncError = async (
    asyncFunction: () => Promise<any>,
    source: string,
    userFriendlyMessage?: string
  ) => {
    try {
      return await asyncFunction();
    } catch (error) {
      handleError(error, source, userFriendlyMessage);
      throw error;
    }
  };

  return {
    handleError,
    handleAsyncError
  };
};
