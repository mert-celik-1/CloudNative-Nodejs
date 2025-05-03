export interface CacheService {
  set(key: string, value: string, expirationInSeconds?: number): Promise<void>;
  get(key: string): Promise<string | null>;
  del(key: string): Promise<void>;
  flushAll(): Promise<void>;
} 