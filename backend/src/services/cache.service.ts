import { Redis } from 'ioredis';
import { logger } from '../utils/logger';

export class CacheService {
  private redis: Redis;
  private defaultTTL: number;

  constructor() {
    this.redis = new Redis(process.env.REDIS_URL);
    this.defaultTTL = 3600; // 1 hour default TTL
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error('Cache get error:', { error, key });
      return null;
    }
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      const stringValue = JSON.stringify(value);
      if (ttl) {
        await this.redis.setex(key, ttl, stringValue);
      } else {
        await this.redis.setex(key, this.defaultTTL, stringValue);
      }
    } catch (error) {
      logger.error('Cache set error:', { error, key });
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (error) {
      logger.error('Cache delete error:', { error, key });
    }
  }

  async clear(pattern: string): Promise<void> {
    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    } catch (error) {
      logger.error('Cache clear error:', { error, pattern });
    }
  }

  // Increment a counter with optional expiry
  async increment(key: string, ttl?: number): Promise<number> {
    try {
      const value = await this.redis.incr(key);
      if (ttl && value === 1) {
        await this.redis.expire(key, ttl);
      }
      return value;
    } catch (error) {
      logger.error('Cache increment error:', { error, key });
      return 0;
    }
  }

  // Get remaining TTL for a key
  async getTTL(key: string): Promise<number> {
    try {
      return await this.redis.ttl(key);
    } catch (error) {
      logger.error('Cache TTL check error:', { error, key });
      return -1;
    }
  }
}