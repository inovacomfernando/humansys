
import { useState, useEffect, useCallback } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  accessCount: number;
  lastAccess: number;
  ttl: number;
  priority: 'high' | 'medium' | 'low';
}

interface CacheStats {
  totalEntries: number;
  hitRate: number;
  memoryUsage: number;
  lastCleanup: number;
}

class IntelligentCacheManager {
  private cache = new Map<string, CacheEntry<any>>();
  private maxEntries = 1000;
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.startCleanupTimer();
    this.loadFromIndexedDB();
  }

  private startCleanupTimer() {
    // Limpeza automática a cada 5 minutos
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  private async loadFromIndexedDB() {
    try {
      const request = indexedDB.open('HumansysCache', 1);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('cache')) {
          db.createObjectStore('cache', { keyPath: 'key' });
        }
      };

      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const transaction = db.transaction(['cache'], 'readonly');
        const store = transaction.objectStore('cache');
        const getAllRequest = store.getAll();

        getAllRequest.onsuccess = () => {
          const items = getAllRequest.result;
          items.forEach((item: any) => {
            if (this.isValidEntry(item.value)) {
              this.cache.set(item.key, item.value);
            }
          });
          console.log(`Loaded ${items.length} cache entries from IndexedDB`);
        };
      };
    } catch (error) {
      console.warn('Failed to load cache from IndexedDB:', error);
    }
  }

  private async saveToIndexedDB(key: string, entry: CacheEntry<any>) {
    try {
      const request = indexedDB.open('HumansysCache', 1);
      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const transaction = db.transaction(['cache'], 'readwrite');
        const store = transaction.objectStore('cache');
        store.put({ key, value: entry });
      };
    } catch (error) {
      console.warn('Failed to save to IndexedDB:', error);
    }
  }

  private isValidEntry(entry: CacheEntry<any>): boolean {
    const now = Date.now();
    return (now - entry.timestamp) < entry.ttl;
  }

  set<T>(key: string, data: T, options: {
    ttl?: number;
    priority?: 'high' | 'medium' | 'low';
  } = {}) {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      accessCount: 1,
      lastAccess: Date.now(),
      ttl: options.ttl || 5 * 60 * 1000, // 5 min default
      priority: options.priority || 'medium'
    };

    this.cache.set(key, entry);
    this.saveToIndexedDB(key, entry);

    // Limpar cache se exceder limite
    if (this.cache.size > this.maxEntries) {
      this.evictLeastUsed();
    }
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry || !this.isValidEntry(entry)) {
      this.cache.delete(key);
      return null;
    }

    // Atualizar estatísticas de acesso
    entry.accessCount++;
    entry.lastAccess = Date.now();
    this.cache.set(key, entry);

    return entry.data;
  }

  private evictLeastUsed() {
    const entries = Array.from(this.cache.entries());
    
    // Ordenar por prioridade e frequência de acesso
    entries.sort(([, a], [, b]) => {
      const priorityWeight = { high: 3, medium: 2, low: 1 };
      const aScore = a.accessCount * priorityWeight[a.priority];
      const bScore = b.accessCount * priorityWeight[b.priority];
      return aScore - bScore;
    });

    // Remover 20% dos itens menos usados
    const toRemove = Math.floor(entries.length * 0.2);
    for (let i = 0; i < toRemove; i++) {
      this.cache.delete(entries[i][0]);
    }

    console.log(`Evicted ${toRemove} cache entries`);
  }

  private cleanup() {
    const now = Date.now();
    const beforeSize = this.cache.size;
    
    for (const [key, entry] of this.cache.entries()) {
      if (!this.isValidEntry(entry)) {
        this.cache.delete(key);
      }
    }

    const removed = beforeSize - this.cache.size;
    if (removed > 0) {
      console.log(`Cache cleanup: removed ${removed} expired entries`);
    }
  }

  clear() {
    this.cache.clear();
    
    // Limpar IndexedDB também
    try {
      const request = indexedDB.open('HumansysCache', 1);
      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const transaction = db.transaction(['cache'], 'readwrite');
        const store = transaction.objectStore('cache');
        store.clear();
      };
    } catch (error) {
      console.warn('Failed to clear IndexedDB:', error);
    }
  }

  getStats(): CacheStats {
    const entries = Array.from(this.cache.values());
    const totalRequests = entries.reduce((sum, entry) => sum + entry.accessCount, 0);
    const estimatedMemory = JSON.stringify(Array.from(this.cache.entries())).length;
    
    return {
      totalEntries: this.cache.size,
      hitRate: totalRequests > 0 ? (entries.length / totalRequests) * 100 : 0,
      memoryUsage: estimatedMemory,
      lastCleanup: Date.now()
    };
  }

  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.cache.clear();
  }
}

// Singleton instance
const cacheManager = new IntelligentCacheManager();

export const useIntelligentCache = () => {
  const [stats, setStats] = useState<CacheStats>(cacheManager.getStats());

  const updateStats = useCallback(() => {
    setStats(cacheManager.getStats());
  }, []);

  useEffect(() => {
    const interval = setInterval(updateStats, 10000); // Update stats every 10s
    return () => clearInterval(interval);
  }, [updateStats]);

  const set = useCallback(<T>(key: string, data: T, options?: {
    ttl?: number;
    priority?: 'high' | 'medium' | 'low';
  }) => {
    cacheManager.set(key, data, options);
    updateStats();
  }, [updateStats]);

  const get = useCallback(<T>(key: string): T | null => {
    const result = cacheManager.get<T>(key);
    updateStats();
    return result;
  }, [updateStats]);

  const clear = useCallback(() => {
    cacheManager.clear();
    updateStats();
  }, [updateStats]);

  return {
    set,
    get,
    clear,
    stats
  };
};

// Limpar quando usuário sair
window.addEventListener('beforeunload', () => {
  cacheManager.destroy();
});
