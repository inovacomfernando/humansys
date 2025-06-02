
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
    // Bloquear DevTools
    const blockDevTools = () => {
      // Verificar se está no ambiente Replit de desenvolvimento
      const isReplitDev = window.location.hostname.includes('replit') || 
                         window.location.hostname.includes('repl.co') ||
                         window.location.hostname.includes('localhost') ||
                         window.location.hostname.includes('127.0.0.1');
      
      // Verificar se está no preview (mesmo sendo Replit)
      const isPreview = window.location.pathname.includes('/preview') ||
                       window.location.search.includes('preview') ||
                       document.referrer.includes('replit') ||
                       window.parent !== window;

      // Detectar abertura de DevTools (em produção E preview)
      if (!isReplitDev || isPreview) {
        let devtools = { open: false, orientation: null };
        const threshold = 160;

        setInterval(() => {
          if (window.outerHeight - window.innerHeight > threshold || 
              window.outerWidth - window.innerWidth > threshold) {
            if (!devtools.open) {
              devtools.open = true;
              logSecurityEvent({
                type: 'devtools_attempt',
                user_agent: navigator.userAgent,
                timestamp: new Date().toISOString(),
                details: { window_dimensions: { inner: { width: window.innerWidth, height: window.innerHeight }, outer: { width: window.outerWidth, height: window.outerHeight } } }
              });
              
              // Bloquear tela
              document.body.innerHTML = `
                <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #000; color: #fff; display: flex; align-items: center; justify-content: center; z-index: 999999; font-family: Arial;">
                  <div style="text-align: center;">
                    <h1>🔒 Acesso Bloqueado</h1>
                    <p>Tentativa de inspeção detectada</p>
                    <p>Seu IP foi registrado por motivos de segurança</p>
                    <p>Entre em contato com o suporte se necessário</p>
                  </div>
                </div>
              `;
            }
          } else {
            devtools.open = false;
          }
        }, 500);
      }

      // Bloquear F12, Ctrl+Shift+I, Ctrl+U, etc. (em produção E preview)
      if (!isReplitDev || isPreview) {
        document.addEventListener('keydown', (e) => {
          if (
            e.key === 'F12' ||
            (e.ctrlKey && e.shiftKey && e.key === 'I') ||
            (e.ctrlKey && e.shiftKey && e.key === 'C') ||
            (e.ctrlKey && e.shiftKey && e.key === 'J') ||
            (e.ctrlKey && e.key === 'U')
          ) {
            e.preventDefault();
            logSecurityEvent({
              type: 'devtools_attempt',
              user_agent: navigator.userAgent,
              timestamp: new Date().toISOString(),
              details: { key_combination: `${e.ctrlKey ? 'Ctrl+' : ''}${e.shiftKey ? 'Shift+' : ''}${e.key}` }
            });
            return false;
          }
        });
      }
    };

    // Bloquear botão direito
    const blockRightClick = (e: MouseEvent) => {
      e.preventDefault();
      logSecurityEvent({
        type: 'right_click_attempt',
        user_agent: navigator.userAgent,
        timestamp: new Date().toISOString()
      });
      return false;
    };

    // Bloquear seleção de texto
    const blockTextSelection = () => {
      document.body.style.userSelect = 'none';
      document.body.style.webkitUserSelect = 'none';
      document.body.style.mozUserSelect = 'none';
      document.body.style.msUserSelect = 'none';
      
      document.addEventListener('selectstart', (e) => {
        e.preventDefault();
        return false;
      });

      document.addEventListener('dragstart', (e) => {
        e.preventDefault();
        return false;
      });
    };

    // Bloquear copiar/colar
    const blockCopyPaste = (e: KeyboardEvent) => {
      if (e.ctrlKey && (e.key === 'c' || e.key === 'v' || e.key === 'a' || e.key === 's')) {
        e.preventDefault();
        logSecurityEvent({
          type: 'copy_attempt',
          user_agent: navigator.userAgent,
          timestamp: new Date().toISOString(),
          details: { action: e.key }
        });
        return false;
      }
    };

    // Detectar tentativas de screenshot
    const detectScreenshot = () => {
      // Detectar mudanças de foco que podem indicar screenshot
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          logSecurityEvent({
            type: 'screenshot_attempt',
            user_agent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            details: { visibility_change: 'hidden' }
          });
        }
      });

      // Detectar Print Screen
      document.addEventListener('keydown', (e) => {
        if (e.key === 'PrintScreen') {
          e.preventDefault();
          logSecurityEvent({
            type: 'screenshot_attempt',
            user_agent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            details: { method: 'print_screen' }
          });
          
          // Mostrar aviso
          const warning = document.createElement('div');
          warning.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: #dc2626; color: white; padding: 20px; border-radius: 8px;
            z-index: 999999; font-family: Arial; text-align: center;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
          `;
          warning.innerHTML = `
            <h3>⚠️ Captura de Tela Detectada</h3>
            <p>Esta ação foi registrada por motivos de segurança</p>
            <p>IP: <span id="user-ip">Obtendo...</span></p>
          `;
          document.body.appendChild(warning);

          // Obter e mostrar IP
          fetch('https://api.ipify.org?format=json')
            .then(res => res.json())
            .then(data => {
              const ipElement = document.getElementById('user-ip');
              if (ipElement) ipElement.textContent = data.ip;
            });

          setTimeout(() => {
            document.body.removeChild(warning);
          }, 5000);

          return false;
        }
      });
    };

    // Watermark dinâmico
    const addWatermark = () => {
      const watermark = document.createElement('div');
      watermark.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        pointer-events: none; z-index: 999998; opacity: 0.1;
        background-image: repeating-linear-gradient(
          45deg,
          transparent,
          transparent 100px,
          rgba(139, 69, 19, 0.1) 100px,
          rgba(139, 69, 19, 0.1) 120px
        );
      `;
      
      const watermarkText = document.createElement('div');
      watermarkText.style.cssText = `
        position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg);
        font-size: 48px; color: rgba(139, 69, 19, 0.1); font-weight: bold;
        white-space: nowrap; user-select: none; pointer-events: none;
      `;
      watermarkText.textContent = `HumanSys - ${user?.email || 'Sistema Protegido'} - ${new Date().toLocaleDateString()}`;
      
      watermark.appendChild(watermarkText);
      document.body.appendChild(watermark);
    };

    // Anti-bot e rate limiting
    const detectBotActivity = () => {
      let requestCount = 0;
      const requestLimit = 100; // requests per minute
      const timeWindow = 60000; // 1 minute

      const originalFetch = window.fetch;
      window.fetch = async (...args) => {
        requestCount++;
        
        if (requestCount > requestLimit) {
          logSecurityEvent({
            type: 'suspicious_activity',
            user_agent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            details: { reason: 'rate_limit_exceeded', requests: requestCount }
          });
          
          throw new Error('Rate limit exceeded - Suspicious activity detected');
        }
        
        return originalFetch(...args);
      };

      // Reset counter every minute
      setInterval(() => {
        requestCount = 0;
      }, timeWindow);
    };

    // Ativar proteções
    blockDevTools();
    blockTextSelection();
    addWatermark();
    detectScreenshot();
    detectBotActivity();

    document.addEventListener('contextmenu', blockRightClick);
    document.addEventListener('keydown', blockCopyPaste);

    // Console warning (em produção E preview)
    const isReplitDev = window.location.hostname.includes('replit') || 
                       window.location.hostname.includes('repl.co') ||
                       window.location.hostname.includes('localhost') ||
                       window.location.hostname.includes('127.0.0.1');
    
    const isPreview = window.location.pathname.includes('/preview') ||
                     window.location.search.includes('preview') ||
                     document.referrer.includes('replit') ||
                     window.parent !== window;

    if (!isReplitDev || isPreview) {
      console.clear();
      console.log('%c🔒 SISTEMA PROTEGIDO', 'color: red; font-size: 24px; font-weight: bold;');
      console.log('%cTodas as atividades são monitoradas e registradas.', 'color: red; font-size: 16px;');
      console.log('%cQualquer tentativa de acesso não autorizado será reportada.', 'color: red; font-size: 16px;');
      if (isPreview) {
        console.log('%c📱 MODO PREVIEW - Proteções Ativas', 'color: orange; font-size: 14px; font-weight: bold;');
      }
    } else {
      console.log('%c🛠️ MODO DESENVOLVIMENTO', 'color: blue; font-size: 16px; font-weight: bold;');
      console.log('%cSistema de segurança em modo de desenvolvimento - Proteções reduzidas', 'color: blue; font-size: 12px;');
    }

    return () => {
      document.removeEventListener('contextmenu', blockRightClick);
      document.removeEventListener('keydown', blockCopyPaste);
    };
  }, [logSecurityEvent, user?.email]);

  return { logSecurityEvent };
};
