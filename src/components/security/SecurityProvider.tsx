
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSecurityProtection } from '@/hooks/useSecurityProtection';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface SecurityContextType {
  isSecure: boolean;
  securityLevel: 'low' | 'medium' | 'high';
  blockAccess: (reason: string) => void;
}

const SecurityContext = createContext<SecurityContextType | null>(null);

export const useSecurityContext = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurityContext must be used within SecurityProvider');
  }
  return context;
};

interface SecurityProviderProps {
  children: React.ReactNode;
}

export const SecurityProvider: React.FC<SecurityProviderProps> = ({ children }) => {
  const { logSecurityEvent } = useSecurityProtection();
  const { user } = useAuth();
  const [isSecure, setIsSecure] = useState(true);
  const [securityLevel, setSecurityLevel] = useState<'low' | 'medium' | 'high'>('high');

  useEffect(() => {
    // Verificar integridade do sistema
    const checkSystemIntegrity = async () => {
      try {
        // Verificar se existem modificações suspeitas
        const scripts = document.querySelectorAll('script');
        const suspiciousScripts = Array.from(scripts).filter(script => 
          script.src && !script.src.includes(window.location.origin) && 
          !script.src.includes('cdn') && !script.src.includes('googleapis')
        );

        if (suspiciousScripts.length > 0) {
          await logSecurityEvent({
            type: 'suspicious_activity',
            user_agent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            details: { reason: 'suspicious_scripts', count: suspiciousScripts.length }
          });
          setIsSecure(false);
        }

        // Verificar extensões do navegador que podem ser usadas para scraping
        if (navigator.webdriver) {
          await logSecurityEvent({
            type: 'suspicious_activity',
            user_agent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            details: { reason: 'webdriver_detected' }
          });
          setIsSecure(false);
        }

        // Verificar se está rodando em iframe (possível embedding malicioso)
        // Exceto se for o preview do Replit
        if (window.top !== window.self) {
          const isReplitPreview = window.location.hostname.includes('replit') || 
                                 window.location.hostname.includes('repl.co') ||
                                 window.parent?.location?.hostname?.includes('replit') ||
                                 window.parent?.location?.hostname?.includes('repl.co');
          
          if (!isReplitPreview) {
            await logSecurityEvent({
              type: 'suspicious_activity',
              user_agent: navigator.userAgent,
              timestamp: new Date().toISOString(),
              details: { reason: 'iframe_detected', hostname: window.location.hostname }
            });
            setIsSecure(false);
          }
        }

      } catch (error) {
        console.error('Erro na verificação de integridade:', error);
      }
    };

    checkSystemIntegrity();

    // Verificar periodicamente
    const interval = setInterval(checkSystemIntegrity, 30000); // A cada 30 segundos

    return () => clearInterval(interval);
  }, [logSecurityEvent]);

  const blockAccess = async (reason: string) => {
    setIsSecure(false);
    
    await logSecurityEvent({
      type: 'suspicious_activity',
      user_agent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      details: { reason, blocked: true }
    });

    // Renderizar tela de bloqueio
    document.body.innerHTML = `
      <div style="
        position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
        background: linear-gradient(135deg, #dc2626, #991b1b); 
        color: white; display: flex; align-items: center; justify-content: center; 
        z-index: 999999; font-family: 'Inter', Arial, sans-serif;
      ">
        <div style="text-align: center; max-width: 600px; padding: 40px;">
          <div style="font-size: 64px; margin-bottom: 20px;">🔒</div>
          <h1 style="font-size: 32px; margin-bottom: 20px; font-weight: 600;">
            Acesso Bloqueado por Segurança
          </h1>
          <p style="font-size: 18px; margin-bottom: 30px; opacity: 0.9;">
            Atividade suspeita detectada: ${reason}
          </p>
          <div style="
            background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; 
            margin-bottom: 30px; backdrop-filter: blur(10px);
          ">
            <p style="margin: 0; font-size: 14px;">
              <strong>Usuário:</strong> ${user?.email || 'Não identificado'}<br>
              <strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-BR')}<br>
              <strong>Sessão:</strong> Bloqueada permanentemente
            </p>
          </div>
          <p style="font-size: 14px; opacity: 0.8;">
            Este evento foi registrado automaticamente.<br>
            Entre em contato com o suporte técnico se acredita que isso é um erro.
          </p>
        </div>
      </div>
    `;
  };

  const contextValue: SecurityContextType = {
    isSecure,
    securityLevel,
    blockAccess
  };

  if (!isSecure) {
    return null; // Não renderizar nada se o sistema não estiver seguro
  }

  return (
    <SecurityContext.Provider value={contextValue}>
      {children}
    </SecurityContext.Provider>
  );
};
