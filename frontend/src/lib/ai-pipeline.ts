import { Anthropic } from '@anthropic-ai/sdk';
import { StreamingTextResponse } from 'ai';
import { getCachedResponse, saveChatMessage } from './chat-storage';

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
    const cached = await getCachedResponse(context.userId, message);
    if (cached) {
      await saveChatMessage(context.sessionId, {
        role: 'assistant',
        content: cached
      });
      return new Response(cached);
    }

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