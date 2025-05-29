
import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  version: number;
  synced: boolean;
}

interface OfflineOperation {
  id: string;
  type: 'create' | 'update' | 'delete';
  table: string;
  data: any;
  timestamp: number;
  retries: number;
}

export const useOfflineCache = <T>(key: string, ttl: number = 5 * 60 * 1000) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncQueue, setSyncQueue] = useState<OfflineOperation[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const getStorageKey = (cacheKey: string) => `@humansys:${user?.id}:${cacheKey}`;
  const getQueueKey = () => `@humansys:${user?.id}:sync_queue`;

  const get = useCallback((cacheKey: string): T | null => {
    try {
      const item = localStorage.getItem(getStorageKey(cacheKey));
      if (!item) return null;

      const entry: CacheEntry<T> = JSON.parse(item);
      const isExpired = Date.now() - entry.timestamp > ttl;
      
      if (isExpired && isOnline) {
        localStorage.removeItem(getStorageKey(cacheKey));
        return null;
      }

      return entry.data;
    } catch (error) {
      console.warn('Error reading from cache:', error);
      return null;
    }
  }, [ttl, isOnline, user?.id]);

  const set = useCallback((cacheKey: string, data: T, synced: boolean = true) => {
    try {
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        version: 1,
        synced
      };
      localStorage.setItem(getStorageKey(cacheKey), JSON.stringify(entry));
    } catch (error) {
      console.warn('Error writing to cache:', error);
    }
  }, [user?.id]);

  const addToSyncQueue = useCallback((operation: Omit<OfflineOperation, 'id' | 'timestamp' | 'retries'>) => {
    const newOperation: OfflineOperation = {
      ...operation,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      retries: 0
    };

    setSyncQueue(prev => {
      const updated = [...prev, newOperation];
      localStorage.setItem(getQueueKey(), JSON.stringify(updated));
      return updated;
    });
  }, [user?.id]);

  const processSyncQueue = useCallback(async (executor: (op: OfflineOperation) => Promise<boolean>) => {
    if (!isOnline || syncQueue.length === 0) return;

    const queue = [...syncQueue];
    const processed: string[] = [];

    for (const operation of queue) {
      try {
        const success = await executor(operation);
        if (success) {
          processed.push(operation.id);
        }
      } catch (error) {
        console.warn('Sync operation failed:', error);
      }
    }

    if (processed.length > 0) {
      setSyncQueue(prev => {
        const updated = prev.filter(op => !processed.includes(op.id));
        localStorage.setItem(getQueueKey(), JSON.stringify(updated));
        return updated;
      });
    }
  }, [isOnline, syncQueue, user?.id]);

  // Load sync queue on mount
  useEffect(() => {
    if (user?.id) {
      try {
        const stored = localStorage.getItem(getQueueKey());
        if (stored) {
          setSyncQueue(JSON.parse(stored));
        }
      } catch (error) {
        console.warn('Error loading sync queue:', error);
      }
    }
  }, [user?.id]);

  return {
    get,
    set,
    addToSyncQueue,
    processSyncQueue,
    isOnline,
    syncQueueLength: syncQueue.length
  };
};
