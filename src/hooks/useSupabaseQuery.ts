
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface QueryOptions {
  maxRetries?: number;
  retryDelay?: number;
  requireAuth?: boolean;
}

export const useSupabaseQuery = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const executeQuery = useCallback(async <T>(
    queryFn: () => Promise<{ data: T | null; error: any }>,
    options: QueryOptions = {}
  ): Promise<T | null> => {
    const { maxRetries = 3, retryDelay = 1000, requireAuth = true } = options;

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

    setIsLoading(true);
    let lastError: any = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`useSupabaseQuery: Tentativa ${attempt}/${maxRetries}`);

        // Verificar sessão antes da query
        if (requireAuth) {
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError || !session) {
            console.error('useSupabaseQuery: Erro de sessão:', sessionError);
            throw new Error('Sessão inválida ou expirada');
          }
          
          console.log('useSupabaseQuery: Sessão válida confirmada');
        }

        const result = await queryFn();

        if (result.error) {
          console.error(`useSupabaseQuery: Erro na tentativa ${attempt}:`, result.error);
          lastError = result.error;

          // Se é erro de autenticação, não tentar novamente
          if (result.error.code === 'PGRST301' || result.error.message?.includes('JWT')) {
            console.error('useSupabaseQuery: Erro de autenticação detectado, parando tentativas');
            break;
          }

          // Se não é a última tentativa, esperar antes de tentar novamente
          if (attempt < maxRetries) {
            console.log(`useSupabaseQuery: Aguardando ${retryDelay}ms antes da próxima tentativa`);
            await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
            continue;
          }
        } else {
          console.log(`useSupabaseQuery: Sucesso na tentativa ${attempt}`);
          setIsLoading(false);
          return result.data;
        }
      } catch (error: any) {
        console.error(`useSupabaseQuery: Erro inesperado na tentativa ${attempt}:`, error);
        lastError = error;

        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
        }
      }
    }

    // Se chegou aqui, todas as tentativas falharam
    setIsLoading(false);
    
    const errorMessage = lastError?.message || 'Erro desconhecido ao carregar dados';
    console.error('useSupabaseQuery: Todas as tentativas falharam:', lastError);
    
    toast({
      title: "Erro ao carregar dados",
      description: `${errorMessage} (${maxRetries} tentativas)`,
      variant: "destructive"
    });

    return null;
  }, [user, toast]);

  return {
    executeQuery,
    isLoading
  };
};
