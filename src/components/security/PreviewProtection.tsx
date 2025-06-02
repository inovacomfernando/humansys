
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const PreviewProtection: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  useEffect(() => {
    // Detectar se está em preview
    const isPreview = window.location.pathname.includes('/preview') ||
                     window.location.search.includes('preview') ||
                     document.referrer.includes('replit') ||
                     window.parent !== window ||
                     window.location.hostname.includes('.repl.co');

    if (isPreview) {
      // Marca d'água removida - usando apenas banner superior

      // Bloquear recursos específicos do preview
      const blockPreviewFeatures = () => {
        // Desabilitar drag and drop
        document.addEventListener('dragstart', (e) => {
          e.preventDefault();
          return false;
        });

        // Bloquear seleção mais agressiva
        document.addEventListener('selectstart', (e) => {
          e.preventDefault();
          return false;
        });

        // Interceptar tentativas de abertura de nova janela
        const originalOpen = window.open;
        window.open = function(...args) {
          console.log('%c⚠️ Tentativa de abertura de nova janela bloqueada no preview', 'color: orange; font-weight: bold;');
          return null;
        };

        // Bloquear downloads no preview
        document.addEventListener('click', (e) => {
          const target = e.target as HTMLElement;
          if (target.tagName === 'A' && target.getAttribute('download')) {
            e.preventDefault();
            console.log('%c⚠️ Download bloqueado no modo preview', 'color: orange; font-weight: bold;');
            return false;
          }
        });
      };

      blockPreviewFeatures();

      // Banner de preview
      const previewBanner = document.createElement('div');
      previewBanner.style.cssText = `
        position: fixed; top: 0; left: 0; right: 0; height: 30px;
        background: linear-gradient(90deg, #ff6b35, #f7931e);
        color: white; display: flex; align-items: center; justify-content: center;
        z-index: 999999; font-family: Arial; font-size: 12px; font-weight: bold;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
      `;
      previewBanner.innerHTML = '🔒 MODO PREVIEW - Sistema Protegido - Funcionalidades Limitadas';
      document.body.appendChild(previewBanner);

      // Ajustar padding do body para compensar o banner
      document.body.style.paddingTop = '30px';

      console.log('%c🔒 PROTEÇÃO DE PREVIEW ATIVADA', 'color: orange; font-size: 18px; font-weight: bold;');
      console.log('%cRecursos limitados para proteção do sistema', 'color: orange; font-size: 14px;');
    }
  }, [user?.email]);

  return <>{children}</>;
};
