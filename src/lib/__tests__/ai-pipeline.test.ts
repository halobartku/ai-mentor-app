import { describe, expect, it, vi, beforeEach } from 'vitest';
import { processMessage } from '../ai-pipeline';
import { kv } from '@vercel/kv';

vi.mock('@vercel/kv');
vi.mock('@anthropic-ai/sdk');

describe('AI Pipeline', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return cached response if available', async () => {
    const mockMessage = 'test message';
    const mockUserId = 'user123';
    const mockCachedResponse = 'cached response';

    vi.mocked(kv.get).mockResolvedValueOnce(mockCachedResponse);

    const response = await processMessage(mockMessage, {
      userId: mockUserId,
      previousMessages: []
    });

    expect(response).toBeInstanceOf(Response);
    expect(await response.text()).toBe(mockCachedResponse);
  });

  it('should process new message if no cache exists', async () => {
    const mockMessage = 'test message';
    const mockUserId = 'user123';

    vi.mocked(kv.get).mockResolvedValueOnce(null);

    const response = await processMessage(mockMessage, {
      userId: mockUserId,
      previousMessages: []
    });

    expect(response).toBeInstanceOf(StreamingTextResponse);
  });
});