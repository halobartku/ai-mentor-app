import { createClient } from 'redis';

export class CacheService {
  private client;

  constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL
    });
  }

  async cacheResponse(key: string, response: any, ttl = 3600) {
    await this.client.set(key, JSON.stringify(response), { EX: ttl });
  }

  async getCachedResponse(key: string) {
    const cached = await this.client.get(key);
    return cached ? JSON.parse(cached) : null;
  }

  generateCacheKey(input: string, context: any) {
    return `chat:${input}:${JSON.stringify(context).slice(0, 100)}`;
  }
}