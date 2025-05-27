
import { useState, useEffect, useCallback } from 'react';
import { queryCache } from '@/integrations/supabase/client';

interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number;
}

export const useSmartCache = () => {
  const [cacheStats, setCacheStats] = useState({
    totalEntries: 0,
    hitRate: 0,
    missRate: 0,
    lastClear: Date.now()
  });

  const getCachedData = useCallback((key: string, ttlMinutes: number = 5) => {
    const entry = queryCache.get(key) as CacheEntry;
    
    if (!entry) {
      return null;
    }

    const now = Date.now();
    const isExpired = (now - entry.timestamp) > (ttlMinutes * 60 * 1000);
    
    if (isExpired) {
      queryCache.delete(key);
      return null;
    }

    return entry.data;
  }, []);

  const setCachedData = useCallback((key: string, data: any, ttlMinutes: number = 5) => {
    const entry: CacheEntry = {
      data,
      timestamp: Date.now(),
      ttl: ttlMinutes * 60 * 1000
    };
    
    queryCache.set(key, entry);
    updateCacheStats();
  }, []);

  const updateCacheStats = useCallback(() => {
    setCacheStats({
      totalEntries: queryCache.size,
      hitRate: 0, // Seria calculado com métricas reais
      missRate: 0,
      lastClear: Date.now()
    });
  }, []);

  const clearExpiredEntries = useCallback(() => {
    const now = Date.now();
    let cleared = 0;
    
    for (const [key, entry] of queryCache.entries()) {
      const cacheEntry = entry as CacheEntry;
      if (cacheEntry && (now - cacheEntry.timestamp) > cacheEntry.ttl) {
        queryCache.delete(key);
        cleared++;
      }
    }
    
    console.log(`Cache: ${cleared} entradas expiradas removidas`);
    updateCacheStats();
    
    return cleared;
  }, [updateCacheStats]);

  const clearAllCache = useCallback(() => {
    const size = queryCache.size;
    queryCache.clear();
    updateCacheStats();
    console.log(`Cache: ${size} entradas removidas`);
    return size;
  }, [updateCacheStats]);

  // Limpeza automática a cada 5 minutos
  useEffect(() => {
    const interval = setInterval(clearExpiredEntries, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [clearExpiredEntries]);

  // Atualizar stats na inicialização
  useEffect(() => {
    updateCacheStats();
  }, [updateCacheStats]);

  return {
    cacheStats,
    getCachedData,
    setCachedData,
    clearExpiredEntries,
    clearAllCache,
    updateCacheStats
  };
};
