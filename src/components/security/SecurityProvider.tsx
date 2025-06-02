import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSecurityProtection } from '@/hooks/useSecurityProtection';
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
  const [securityLevel, setSecurityLevel] = useState<'low' | 'medium' | 'high'>('medium');

  useEffect(() => {
    // Verificação básica de integridade apenas
    const checkBasicSecurity = async () => {
      try {
        // Verificar se está rodando em iframe
        if (window.top !== window.self) {
          const isReplitDev = window.location.hostname.includes('replit') || 
                             window.location.hostname.includes('repl.co') ||
                             window.location.hostname.includes('replit.dev');

          if (!isReplitDev) {
            await logSecurityEvent({
              type: 'suspicious_activity',
              user_agent: navigator.userAgent,
              timestamp: new Date().toISOString(),
              details: { 
                reason: 'iframe_detected', 
                hostname: window.location.hostname,
                referrer: document.referrer,
                blocked: false
              }
            });
          }
        }
      } catch (error) {
        console.error('Erro na verificação de segurança:', error);
      }
    };

    checkBasicSecurity();
  }, [logSecurityEvent]);

  const blockAccess = async (reason: string) => {
    setIsSecure(false);

    await logSecurityEvent({
      type: 'suspicious_activity',
      user_agent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      details: { reason, blocked: true }
    });

    // Apenas log, sem bloqueio visual
    console.warn(`Acesso bloqueado: ${reason}`);
  };

  const contextValue: SecurityContextType = {
    isSecure,
    securityLevel,
    blockAccess
  };

  return (
    <SecurityContext.Provider value={contextValue}>
      {children}
    </SecurityContext.Provider>
  );
};