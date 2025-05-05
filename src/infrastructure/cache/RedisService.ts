import { createClient, RedisClientType } from 'redis';
import { CacheService } from '../../core/interfaces/CacheService';

export class RedisService implements CacheService {
  private client: RedisClientType;
  public isConnected: boolean = false;

  constructor(
      private readonly redisUrl: string = process.env.REDIS_CONNECTION_STRING || 'redis://localhost:6379',
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

    // Process kapanma olaylarını RedisService içinde dinliyoruz
    process.on('SIGINT', async () => {
      console.log('Received SIGINT, shutting down Redis connection...');
      await this.disconnect();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      console.log('Received SIGTERM, shutting down Redis connection...');
      await this.disconnect();
      process.exit(0);
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
