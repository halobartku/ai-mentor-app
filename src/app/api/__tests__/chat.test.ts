import { describe, expect, it, vi } from 'vitest';
import { POST } from '../chat/route';
import { auth } from '@clerk/nextjs';
import { processMessage } from '@/lib/ai-pipeline';

vi.mock('@clerk/nextjs');
vi.mock('@/lib/ai-pipeline');

describe('Chat API', () => {
  it('should return 401 for unauthorized requests', async () => {
    vi.mocked(auth).mockReturnValue({ userId: null });

    const response = await POST(new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({})
    }));

    expect(response.status).toBe(401);
  });

  it('should process messages for authorized requests', async () => {
    vi.mocked(auth).mockReturnValue({ userId: 'user123' });
    vi.mocked(processMessage).mockResolvedValue(
      new Response('test response')
    );

    const response = await POST(new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({
        messages: [{ content: 'test', role: 'user' }],
        context: {}
      })
    }));

    expect(response.status).toBe(200);
    expect(await response.text()).toBe('test response');
  });
});