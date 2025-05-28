
import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useSupabaseInterceptor = () => {
  const { signOut } = useAuth();

  const handleAuthError = useCallback(async (error: any) => {
    // Verificar se é erro de autenticação
    if (
      error?.message?.includes('JWT') ||
      error?.message?.includes('auth') ||
      error?.message?.includes('unauthorized') ||
      error?.code === 401
    ) {
      console.log('Auth error detected, attempting token refresh');
      
      try {
        // Tentar refresh do token
        const { data, error: refreshError } = await supabase.auth.refreshSession();
        
        if (refreshError || !data.session) {
          console.log('Token refresh failed, logging out');
          
          // Limpar tudo
          localStorage.clear();
          sessionStorage.clear();
          
          if (window.queryCache) {
            window.queryCache.clear();
          }
          
          await signOut();
          window.location.href = '/login';
          
          return false; // Indica que não deve retry
        }
        
        console.log('Token refreshed successfully');
        return true; // Indica que pode fazer retry
        
      } catch (refreshError) {
        console.error('Failed to refresh token:', refreshError);
        await signOut();
        window.location.href = '/login';
        return false;
      }
    }
    
    return false; // Não é erro de auth, não fazer retry
  }, [signOut]);

  // Interceptador global para requests do Supabase
  useEffect(() => {
    // Monkey patch para interceptar erros do Supabase
    const originalQuery = supabase.from;
    
    supabase.from = function(table: string) {
      const originalFrom = originalQuery.call(this, table);
      
      // Interceptar métodos que fazem requests
      const wrapMethod = (method: string) => {
        const originalMethod = originalFrom[method];
        if (typeof originalMethod === 'function') {
          originalFrom[method] = async function(...args: any[]) {
            try {
              const result = await originalMethod.apply(this, args);
              
              // Se há erro, tentar interceptar
              if (result.error) {
                const shouldRetry = await handleAuthError(result.error);
                
                if (shouldRetry) {
                  // Fazer retry uma vez após refresh
                  return await originalMethod.apply(this, args);
                }
              }
              
              return result;
            } catch (error) {
              const shouldRetry = await handleAuthError(error);
              
              if (shouldRetry) {
                // Fazer retry uma vez após refresh
                return await originalMethod.apply(this, args);
              }
              
              throw error;
            }
          };
        }
      };
      
      // Wrap métodos comuns
      ['select', 'insert', 'update', 'delete', 'upsert'].forEach(wrapMethod);
      
      return originalFrom;
    };

    // Cleanup não é necessário pois modificamos o singleton
    return () => {
      // Não há como restaurar facilmente, mas não é crítico
    };
  }, [handleAuthError]);

  return {
    handleAuthError
  };
};
