import { Anthropic } from '@anthropic-ai/sdk';
import { StreamingTextResponse } from 'ai';
import { cacheManager } from './cache';
import { handleAIError } from './error-handlers';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!
});

interface AiContext {
  userId: string;
  previousMessages: any[];
  chatId?: string;
  emotionalState?: string;
}

export async function processMessage(message: string, context: AiContext) {
  try {
    // Check cache first
    const cached = await cacheManager.get(context.userId, message);
    if (cached) return new Response(cached);

    // Prepare chat context
    let chatContext = {};
    if (context.chatId) {
      chatContext = await cacheManager.getChatContext(context.chatId);
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

    // Cache the response
    response.controller.signal.addEventListener('done', async () => {
      const fullResponse = await response.text();
      await cacheManager.set(context.userId, message, fullResponse);
      
      // Update chat context if needed
      if (context.chatId) {
        await cacheManager.updateChatContext(context.chatId, {
          ...chatContext,
          lastInteraction: new Date().toISOString()
        });
      }
    });

    return new StreamingTextResponse(response.body!);
  } catch (error) {
    return handleAIError(error);
  }
}