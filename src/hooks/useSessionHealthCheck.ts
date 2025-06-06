
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface HealthMetrics {
  sessionDuration: number;
  lastActivity: number;
  isHealthy: boolean;
  warnings: string[];
}

export const useSessionHealthCheck = () => {
  const { user } = useAuth();
  const [healthMetrics, setHealthMetrics] = useState<HealthMetrics>({
    sessionDuration: 0,
    lastActivity: Date.now(),
    isHealthy: true,
    warnings: []
  });
  const [isMonitoring, setIsMonitoring] = useState(false);

  const updateActivity = useCallback(() => {
    setHealthMetrics(prev => ({
      ...prev,
      lastActivity: Date.now()
    }));
  }, []);

  const checkSessionHealth = useCallback(() => {
    const now = Date.now();
    const timeSinceActivity = now - healthMetrics.lastActivity;
    const sessionDuration = now - (healthMetrics.lastActivity - healthMetrics.sessionDuration);
    
    const warnings: string[] = [];
    let isHealthy = true;

    // Check for inactivity (30 minutes)
    if (timeSinceActivity > 30 * 60 * 1000) {
      warnings.push('Sessão inativa por mais de 30 minutos');
      isHealthy = false;
    }

    // Check for very long session (8 hours)
    if (sessionDuration > 8 * 60 * 60 * 1000) {
      warnings.push('Sessão muito longa (mais de 8 horas)');
    }

    setHealthMetrics(prev => ({
      ...prev,
      sessionDuration,
      isHealthy,
      warnings
    }));
  }, [healthMetrics.lastActivity, healthMetrics.sessionDuration]);

  useEffect(() => {
    if (user && !isMonitoring) {
      setIsMonitoring(true);
      
      // Update activity on various events
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
      
      events.forEach(event => {
        document.addEventListener(event, updateActivity, true);
      });

      // Health check interval
      const healthInterval = setInterval(checkSessionHealth, 60000); // Every minute

      return () => {
        events.forEach(event => {
          document.removeEventListener(event, updateActivity, true);
        });
        clearInterval(healthInterval);
        setIsMonitoring(false);
      };
    }
  }, [user, isMonitoring, updateActivity, checkSessionHealth]);

  const forceHealthCheck = () => {
    checkSessionHealth();
  };

  const resetSession = () => {
    // Clear any cache or session data
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (error) {
      console.error('Error clearing session data:', error);
    }

    setHealthMetrics({
      sessionDuration: 0,
      lastActivity: Date.now(),
      isHealthy: true,
      warnings: []
    });
  };

  return {
    healthMetrics,
    isMonitoring,
    forceHealthCheck,
    resetSession,
    updateActivity
  };
};
