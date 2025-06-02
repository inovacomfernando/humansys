import { useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface SecurityEvent {
  type: 'devtools_attempt' | 'right_click_attempt' | 'screenshot_attempt' | 'copy_attempt' | 'suspicious_activity';
  user_id?: string;
  ip_address?: string;
  user_agent: string;
  timestamp: string;
  details?: any;
}

export const useSecurityProtection = () => {
  const { user } = useAuth();

  const logSecurityEvent = useCallback(async (event: SecurityEvent) => {
    try {
      // Obter IP do usuário
      const response = await fetch('https://api.ipify.org?format=json');
      const { ip } = await response.json();

      await supabase.from('security_logs').insert({
        event_type: event.type,
        user_id: user?.id,
        ip_address: ip,
        user_agent: navigator.userAgent,
        details: event.details,
        created_at: new Date().toISOString()
      });

      // Alertar administradores sobre atividade suspeita
      if (event.type !== 'right_click_attempt') {
        await supabase.from('security_alerts').insert({
          alert_type: 'security_violation',
          severity: 'high',
          message: `Tentativa de ${event.type} detectada`,
          user_id: user?.id,
          ip_address: ip,
          created_at: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Erro ao registrar evento de segurança:', error);
    }
  }, [user?.id]);

  useEffect(() => {
    // Verificar se está no ambiente Replit de desenvolvimento
    const isReplitDev = window.location.hostname.includes('replit') || 
                       window.location.hostname.includes('repl.co') ||
                       window.location.hostname.includes('localhost') ||
                       window.location.hostname.includes('127.0.0.1') ||
                       window.location.hostname.includes('replit.dev');

    // Apenas logs básicos, sem proteções visuais
    if (!isReplitDev) {
      console.log('%c🔒 SISTEMA PROTEGIDO', 'color: red; font-size: 24px; font-weight: bold;');
      console.log('%cTodas as atividades são monitoradas e registradas.', 'color: red; font-size: 16px;');
    } else {
      console.log('%c🛠️ MODO DESENVOLVIMENTO', 'color: blue; font-size: 16px; font-weight: bold;');
      console.log('%cSistema em modo de desenvolvimento', 'color: blue; font-size: 12px;');
    }
  }, [logSecurityEvent, user?.email]);

  return { logSecurityEvent };
};