import { describe, expect, it, vi, beforeEach } from 'vitest';
import { CacheManager } from '../cache';
import { kv } from '@vercel/kv';

vi.mock('@vercel/kv');

describe('CacheManager', () => {
  let cacheManager: CacheManager;

  beforeEach(() => {
    vi.clearAllMocks();
    cacheManager = CacheManager.getInstance();
  });

  describe('get', () => {
    it('should return cached value if exists', async () => {
      const mockValue = 'cached response';
      vi.mocked(kv.get).mockResolvedValueOnce(mockValue);

      const result = await cacheManager.get('user123', 'test input');
      expect(result).toBe(mockValue);
    });

    it('should return null if cache miss', async () => {
      vi.mocked(kv.get).mockResolvedValueOnce(null);

      const result = await cacheManager.get('user123', 'test input');
      expect(result).toBeNull();
    });
  });

  describe('set', () => {
    it('should set cache with default TTL', async () => {
      await cacheManager.set('user123', 'test input', 'test response');

      expect(kv.set).toHaveBeenCalledWith(
        expect.any(String),
        'test response',
        { ex: 3600 }
      );
    });

    it('should set cache with custom TTL', async () => {
      await cacheManager.set('user123', 'test input', 'test response', { ttl: 7200 });

      expect(kv.set).toHaveBeenCalledWith(
        expect.any(String),
        'test response',
        { ex: 7200 }
      );
    });
  });

  describe('message history', () => {
    it('should get message history', async () => {
      const mockMessages = [
        { role: 'user', content: 'test1' },
        { role: 'assistant', content: 'test2' }
      ];
      vi.mocked(kv.lrange).mockResolvedValueOnce(mockMessages);

      const result = await cacheManager.getMessageHistory('chat123');
      expect(result).toEqual(mockMessages);
    });

    it('should add message to history', async () => {
      const mockMessage = { role: 'user', content: 'test' };
      await cacheManager.addMessage('chat123', mockMessage);

      expect(kv.rpush).toHaveBeenCalledWith(
        'chat:chat123:messages',
        mockMessage
      );
    });
  });
});