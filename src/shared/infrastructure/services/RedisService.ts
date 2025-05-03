import { createClient, RedisClientType } from 'redis';
import { CacheService } from '../../../core/interfaces/CacheService';

export class RedisService implements CacheService {
  private client: RedisClientType;
  public isConnected: boolean = false;

  constructor(
    private readonly redisUrl: string = process.env.REDIS_URL || 'redis://redis:6379'
  ) {
    this.client = createClient({ url: this.redisUrl });
    
    this.client.on('error', (err) => {
      console.error('Redis Error:', err);
    });
    
    this.client.on('connect', () => {
      this.isConnected = true;
      console.log('Redis connected successfully');
    });
    
    this.client.on('disconnect', () => {
      this.isConnected = false;
      console.log('Redis disconnected');
    });
  }

  async connect(): Promise<void> {
    if (!this.isConnected) {
      await this.client.connect();
    }
  }

  async disconnect(): Promise<void> {
    if (this.isConnected) {
      await this.client.disconnect();
    }
  }

  async set(key: string, value: string, expirationInSeconds?: number): Promise<void> {
    if (!this.isConnected) {
      await this.connect();
    }
    
    if (expirationInSeconds) {
      await this.client.set(key, value, { EX: expirationInSeconds });
    } else {
      await this.client.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    if (!this.isConnected) {
      await this.connect();
    }
    
    return await this.client.get(key);
  }

  async del(key: string): Promise<void> {
    if (!this.isConnected) {
      await this.connect();
    }
    
    await this.client.del(key);
  }

  async flushAll(): Promise<void> {
    if (!this.isConnected) {
      await this.connect();
    }
    
    await this.client.flushAll();
  }
} 