import { Injectable } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

export const DEFAULT_CACHE_TIME = 60 * 5;

@Injectable()
export class RedisService {
  private redisClient: RedisClientType;

  constructor() {
    this.redisClient = createClient({
      url: 'redis://localhost:6379',
    });

    this.redisClient.on('error', (error) => {
      console.error('Redis error:', error.message);
    });
  }

  async onModuleInit() {
    try {
      await this.redisClient.connect();
      console.log('Connected to Redis');
    } catch (error) {
      console.error('Failed to connect to Redis:', error.message);
    }
  }

  async onModuleDestroy() {
    await this.redisClient.quit();
    console.log('Redis connection closed');
  }

  getClient(): RedisClientType {
    return this.redisClient;
  }
  async get(key: string): Promise<string | null> {
    return this.redisClient.get(key);
  }

  async set(
    key: string,
    value: string,
    expiresIn: number = DEFAULT_CACHE_TIME,
  ): Promise<void> {
    await this.redisClient.set(key, value, { EX: expiresIn });
  }

  async delete(key: string): Promise<void> {
    await this.redisClient.del(key);
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.redisClient.exists(key);
    return result === 1;
  }

  async getCachedData(
    key: string,
    fetchFunction: () => Promise<any>,
    ex: number = DEFAULT_CACHE_TIME,
  ) {
    const cache = await this.redisClient.get(key);
    if (cache) return JSON.parse(cache);

    const data = await fetchFunction();
    this.set(key, JSON.stringify(data), ex).catch(console.error);
    return data;
  }

  handleError(error: Error): void {
    console.error('Redis error: ', error.message);
  }
}
