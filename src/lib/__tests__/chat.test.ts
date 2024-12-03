import { describe, expect, it, vi, beforeEach } from 'vitest';
import { getChat, createChat, addMessage } from '../chat';
import { kv } from '@vercel/kv';

vi.mock('@vercel/kv');

describe('Chat Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getChat', () => {
    it('should return null for non-existent chat', async () => {
      vi.mocked(kv.hgetall).mockResolvedValueOnce(null);

      const result = await getChat('123', 'user123');
      expect(result).toBeNull();
    });

    it('should return chat for valid id and user', async () => {
      const mockChat = {
        id: '123',
        userId: 'user123',
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      vi.mocked(kv.hgetall).mockResolvedValueOnce(mockChat);

      const result = await getChat('123', 'user123');
      expect(result).toEqual(mockChat);
    });
  });

  describe('createChat', () => {
    it('should create new chat with correct structure', async () => {
      const userId = 'user123';
      const result = await createChat(userId);

      expect(result).toHaveProperty('id');
      expect(result.userId).toBe(userId);
      expect(result.messages).toEqual([]);
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
    });
  });
});