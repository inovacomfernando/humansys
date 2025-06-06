
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';

export const useOptimizedAuth = () => {
  const auth = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Simple initialization check
    if (!auth.isLoading) {
      setIsInitialized(true);
    }
  }, [auth.isLoading]);

  const clearAuthCache = () => {
    try {
      // Clear localStorage auth data
      const keysToRemove = Object.keys(localStorage).filter(key => 
        key.includes('auth') || key.includes('user') || key.includes('session')
      );
      
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
      });

      // Clear sessionStorage
      sessionStorage.clear();
      
      console.log('Auth cache cleared');
    } catch (error) {
      console.error('Error clearing auth cache:', error);
    }
  };

  return {
    ...auth,
    isInitialized,
    clearAuthCache
  };
};
