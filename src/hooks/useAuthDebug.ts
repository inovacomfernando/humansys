
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface AuthDebugInfo {
  frontendUser: any;
  supabaseUser: any;
  session: any;
  isConnected: boolean;
  lastChecked: string;
  errors: string[];
}

export const useAuthDebug = () => {
  const [debugInfo, setDebugInfo] = useState<AuthDebugInfo>({
    frontendUser: null,
    supabaseUser: null,
    session: null,
    isConnected: false,
    lastChecked: '',
    errors: []
  });

  const { user } = useAuth();

  const checkAuth = async () => {
    const errors: string[] = [];
    let supabaseUser = null;
    let session = null;
    let isConnected = false;

    try {
      // Verificar sessão do Supabase
      const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        errors.push(`Session Error: ${sessionError.message}`);
      } else {
        session = currentSession;
        supabaseUser = currentSession?.user || null;
        isConnected = !!currentSession;
      }

      // Testar conectividade básica
      const { error: testError } = await supabase.from('profiles').select('id').limit(1);
      if (testError) {
        errors.push(`Connectivity Error: ${testError.message}`);
        isConnected = false;
      }

    } catch (error: any) {
      errors.push(`General Error: ${error.message}`);
      isConnected = false;
    }

    setDebugInfo({
      frontendUser: user,
      supabaseUser,
      session,
      isConnected,
      lastChecked: new Date().toISOString(),
      errors
    });
  };

  useEffect(() => {
    checkAuth();
  }, [user]);

  return {
    debugInfo,
    refreshDebug: checkAuth
  };
};
