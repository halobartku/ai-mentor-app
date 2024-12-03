import { Anthropic } from '@anthropic-ai/sdk';
import { StreamingTextResponse } from 'ai';
import { get } from '@vercel/edge-config';
import { nanoid } from 'nanoid';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!
});

interface AiContext {
  userId: string;
  sessionId: string;
  previousMessages: any[];
}

export async function processMessage(message: string, context: AiContext) {
  try {
    // Check Edge Config cache
    const cacheKey = `cache:${context.userId}:${Buffer.from(message).toString('base64')}`;
    const cached = await get(cacheKey);
    
    if (cached) return new Response(cached as string);

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

    return new StreamingTextResponse(response.body!);
  } catch (error) {
    console.error('AI Pipeline Error:', error);
    throw error;
  }
}