import { Anthropic } from '@anthropic-ai/sdk';
import { StreamingTextResponse } from 'ai';
import { getCachedResponse, saveChatMessage } from './chat-storage';
import { createEdgeConfigClient } from '@vercel/edge-config';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!
});

const edge = createEdgeConfigClient(process.env.EDGE_CONFIG!);

interface AiContext {
  userId: string;
  sessionId: string;
  previousMessages: any[];
}

export async function processMessage(message: string, context: AiContext) {
  try {
    // Check Edge Config cache first
    const cached = await getCachedResponse(context.userId, message);
    if (cached) {
      // Save to Supabase for persistence
      await saveChatMessage(context.sessionId, {
        role: 'assistant',
        content: cached
      });
      return new Response(cached);
    }

    // Process with AI
    const response = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 1000,
      messages: [
        ...context.previousMessages,
        {
          role: 'user',
          content: message
        }
      ],
      stream: true
    });

    // Cache in Edge Config and save to Supabase
    response.controller.signal.addEventListener('done', async () => {
      const fullResponse = await response.text();
      
      // Cache in Edge Config
      const cacheKey = `cache:${context.userId}:${Buffer.from(message).toString('base64')}`;
      await edge.set(cacheKey, fullResponse);

      // Save to Supabase
      await saveChatMessage(context.sessionId, {
        role: 'assistant',
        content: fullResponse
      });
    });

    return new StreamingTextResponse(response.body!);
  } catch (error) {
    console.error('AI Pipeline Error:', error);
    throw error;
  }
}
