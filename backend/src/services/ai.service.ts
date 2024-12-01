import OpenAI from 'openai';
import { BaseService } from './base.service';
import { AppError } from '../middleware/errorHandler';
import { PersonalizationService } from './personalization.service';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export class AIService extends BaseService {
  private personalizationService: PersonalizationService;

  constructor() {
    super();
    this.personalizationService = new PersonalizationService();
  }

  async generateMentorResponse(userId: string, message: string, chatId?: string) {
    const user = await this.getCachedOrFetch(
      `user:${userId}:subscription`,
      async () => {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: {
            subscription: {
              select: {
                tier: true,
                status: true
              }
            }
          }
        });
        if (!user) throw new AppError(404, 'User not found');
        return user;
      },
      300 // Cache for 5 minutes
    );

    // Get recent chat context with optimized query
    const recentMessages = await this.queryOptimizer.getChatHistory(userId, {
      limit: 10
    });

    // Generate personalized prompt
    const personalizedMessage = await this.personalizationService.generatePersonalizedPrompt(
      userId,
      message
    );

    // Prepare conversation context
    const conversationContext = [
      {
        role: 'system',
        content: 'You are an intelligent and empathetic AI mentor, focused on helping users achieve their personal and professional goals.'
      },
      ...recentMessages.messages.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      })),
      { role: 'user' as const, content: personalizedMessage }
    ];

    const startTime = Date.now();

    try {
      // Generate AI response
      const response = await openai.chat.completions.create({
        model: user.subscription?.tier === 'premium' ? 'gpt-4' : 'gpt-3.5-turbo',
        messages: conversationContext,
        temperature: 0.7,
        max_tokens: 500
      });

      const aiResponse = response.choices[0]?.message?.content;
      if (!aiResponse) {
        throw new AppError(500, 'Failed to generate AI response');
      }

      // Store the conversation with optimized query
      const chat = chatId
        ? await this.appendToExistingChat(chatId, message, aiResponse)
        : await this.createNewChat(userId, message, aiResponse);

      // Log metrics
      await this.logAIMetrics({
        userId,
        responseTime: Date.now() - startTime,
        tokenCount: this.calculateTokenCount(conversationContext, aiResponse),
        modelUsed: user.subscription?.tier === 'premium' ? 'gpt-4' : 'gpt-3.5-turbo',
        errorOccurred: false,
        contextLength: conversationContext.length
      });

      // Update cache
      await this.queryOptimizer.invalidateUserCache(userId);

      return {
        response: aiResponse,
        chatId: chat.id
      };
    } catch (error) {
      // Log error metrics
      await this.logAIMetrics({
        userId,
        responseTime: Date.now() - startTime,
        tokenCount: 0,
        modelUsed: user.subscription?.tier === 'premium' ? 'gpt-4' : 'gpt-3.5-turbo',
        errorOccurred: true,
        contextLength: conversationContext.length
      });

      throw error;
    }
  }

  private async appendToExistingChat(chatId: string, userMessage: string, aiResponse: string) {
    return await prisma.chat.update({
      where: { id: chatId },
      data: {
        messages: {
          createMany: {
            data: [
              { content: userMessage, role: 'user' },
              { content: aiResponse, role: 'assistant' }
            ]
          }
        }
      }
    });
  }

  private async createNewChat(userId: string, userMessage: string, aiResponse: string) {
    return await prisma.chat.create({
      data: {
        userId,
        messages: {
          createMany: {
            data: [
              { content: userMessage, role: 'user' },
              { content: aiResponse, role: 'assistant' }
            ]
          }
        }
      }
    });
  }

  private calculateTokenCount(context: any[], response: string): number {
    // Simple estimation: ~4 chars per token
    const totalText = [...context.map(msg => msg.content), response].join('');
    return Math.ceil(totalText.length / 4);
  }

  private async logAIMetrics(metrics: {
    userId: string;
    responseTime: number;
    tokenCount: number;
    modelUsed: string;
    errorOccurred: boolean;
    contextLength: number;
  }) {
    await prisma.aiMetrics.create({
      data: metrics
    });
  }
}