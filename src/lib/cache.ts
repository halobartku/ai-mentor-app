import { kv } from '@vercel/kv';
import { Message } from 'ai';

interface CacheConfig {
  ttl?: number;
  priority?: 'speed' | 'freshness';
}

export class CacheManager {
  private static instance: CacheManager;
  private defaultTTL = 3600; // 1 hour

  private constructor() {}

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  private generateKey(userId: string, input: string): string {
    return `cache:${userId}:${Buffer.from(input).toString('base64')}`;
  }

  async get(userId: string, input: string): Promise<string | null> {
    const key = this.generateKey(userId, input);
    return kv.get(key);
  }

  async set(
    userId: string,
    input: string,
    response: string,
    config: CacheConfig = {}
  ): Promise<void> {
    const key = this.generateKey(userId, input);
    const ttl = config.ttl || this.defaultTTL;
    
    await kv.set(key, response, { ex: ttl });
  }

  async invalidate(userId: string, input: string): Promise<void> {
    const key = this.generateKey(userId, input);
    await kv.del(key);
  }

  async getMessageHistory(chatId: string): Promise<Message[]> {
    const messages = await kv.lrange(`chat:${chatId}:messages`, 0, -1);
    return messages || [];
  }

  async addMessage(chatId: string, message: Message): Promise<void> {
    await kv.rpush(`chat:${chatId}:messages`, message);
  }

  async clearHistory(chatId: string): Promise<void> {
    await kv.del(`chat:${chatId}:messages`);
  }

  async getChatContext(chatId: string): Promise<any> {
    return kv.hgetall(`chat:${chatId}:context`) || {};
  }

  async updateChatContext(chatId: string, context: any): Promise<void> {
    await kv.hset(`chat:${chatId}:context`, context);
  }
}

export const cacheManager = CacheManager.getInstance();