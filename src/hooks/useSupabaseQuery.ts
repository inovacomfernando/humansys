
import { useState, useCallback } from 'react';
import { supabase, checkSupabaseConnection, queryCache } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface QueryOptions {
  maxRetries?: number;
  retryDelay?: number;
  requireAuth?: boolean;
  timeout?: number;
  useCache?: boolean;
}

export const useSupabaseQuery = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const executeQuery = useCallback(async <T>(
    queryFn: () => any,
    options: QueryOptions = {}
  ): Promise<T | null> => {
    const { 
      maxRetries = 3, 
      retryDelay = 1000, 
      requireAuth = true,
      timeout = 10000,
      useCache = false
    } = options;

    // Verificar autenticação se necessário
    if (requireAuth && !user?.id) {
      console.warn('useSupabaseQuery: Query requer autenticação mas usuário não está logado');
      toast({
        title: "Erro de Autenticação",
        description: "Você precisa estar logado para acessar esses dados.",
        variant: "destructive"
      });
      return null;
    }

    // Gerar chave de cache
    const cacheKey = useCache ? JSON.stringify(queryFn.toString()) : null;
    if (cacheKey && queryCache.has(cacheKey)) {
      console.log('useSupabaseQuery: Retornando dados do cache');
      return queryCache.get(cacheKey);
    }

    setIsLoading(true);
    let lastError: any = null;

    // Verificar conectividade melhorada
    console.log('useSupabaseQuery: Verificando conectividade...');
    const isConnected = await checkSupabaseConnection();
    if (!isConnected) {
      console.error('useSupabaseQuery: Sem conectividade com Supabase');
      setIsLoading(false);
      toast({
        title: "Erro de Conectividade",
        description: "Não foi possível conectar ao servidor. Verifique sua conexão.",
        variant: "destructive"
      });
      return null;
    }

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`useSupabaseQuery: Tentativa ${attempt}/${maxRetries}`);

        // Verificar sessão antes da query se autenticação for necessária
        if (requireAuth) {
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError || !session) {
            console.error('useSupabaseQuery: Erro de sessão:', sessionError);
            throw new Error('Sessão inválida ou expirada');
          }
          
          console.log('useSupabaseQuery: Sessão válida confirmada');
        }

        // Executar query com timeout
        const queryBuilder = queryFn();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Query timeout')), timeout)
        );

        const result = await Promise.race([queryBuilder, timeoutPromise]);

        if (result.error) {
          console.error(`useSupabaseQuery: Erro na tentativa ${attempt}:`, result.error);
          lastError = result.error;

          // Erros críticos que não devem ser retentados
          if (result.error.code === 'PGRST301' || 
              result.error.message?.includes('JWT') ||
              result.error.message?.includes('permission denied')) {
            console.error('useSupabaseQuery: Erro crítico detectado, parando tentativas');
            break;
          }

          // Se não é a última tentativa, esperar antes de tentar novamente
          if (attempt < maxRetries) {
            console.log(`useSupabaseQuery: Aguardando ${retryDelay * attempt}ms antes da próxima tentativa`);
            await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
            continue;
          }
        } else {
          console.log(`useSupabaseQuery: Sucesso na tentativa ${attempt}`);
          
          // Armazenar no cache se solicitado
          if (cacheKey && result.data) {
            queryCache.set(cacheKey, result.data);
          }
          
          setIsLoading(false);
          return result.data;
        }
      } catch (error: any) {
        console.error(`useSupabaseQuery: Erro inesperado na tentativa ${attempt}:`, error);
        lastError = error;

        if (attempt < maxRetries && !error.message?.includes('timeout')) {
          await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
        } else if (error.message?.includes('timeout')) {
          console.error('useSupabaseQuery: Timeout - parando tentativas');
          break;
        }
      }
    }

    // Se chegou aqui, todas as tentativas falharam
    setIsLoading(false);
    
    const errorMessage = lastError?.message || 'Erro desconhecido ao carregar dados';
    console.error('useSupabaseQuery: Todas as tentativas falharam:', lastError);
    
    // Diferentes tipos de erro requerem mensagens diferentes
    let userMessage = errorMessage;
    if (errorMessage.includes('timeout')) {
      userMessage = 'Timeout na conexão. Tente novamente.';
    } else if (errorMessage.includes('Failed to fetch')) {
      userMessage = 'Erro de conectividade. Verifique sua internet.';
    } else if (errorMessage.includes('JWT') || errorMessage.includes('session')) {
      userMessage = 'Sessão expirada. Faça login novamente.';
    }
    
    toast({
      title: "Erro ao carregar dados",
      description: `${userMessage} (${maxRetries} tentativas)`,
      variant: "destructive"
    });

    return null;
  }, [user, toast]);

  return {
    executeQuery,
    isLoading
  };
};
