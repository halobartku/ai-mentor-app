import Anthropic from '@anthropic-ai/sdk';
import { BaseService } from './base.service';
import { AppError } from '../middleware/errorHandler';
import { PersonalizationService } from './personalization.service';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
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

    // Format conversation history for Claude
    const conversationHistory = recentMessages.messages.map(msg => 
      `\n\n${msg.role === 'user' ? 'Human' : 'Assistant'}: ${msg.content}`
    ).join('');

    const systemPrompt = 'You are Claude, an intelligent and empathetic AI mentor, focused on helping users achieve their personal and professional goals. You provide thoughtful, nuanced advice while maintaining professionalism and ethical boundaries.';

    const startTime = Date.now();

    try {
      // Select Claude model based on subscription tier
      const model = user.subscription?.tier === 'premium' ? 'claude-3-opus-20240229' : 'claude-3-sonnet-20240229';

      // Generate AI response using Claude
      const response = await anthropic.messages.create({
        model: model,
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: `${systemPrompt}\n\nPrevious conversation:${conversationHistory}\n\nHuman: ${personalizedMessage}\n\nAssistant:`
          }
        ],
        temperature: 0.7
      });

      const aiResponse = response.content[0].text;
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
        tokenCount: this.calculateTokenCount(conversationHistory + personalizedMessage, aiResponse),
        modelUsed: model,
        errorOccurred: false,
        contextLength: recentMessages.messages.length + 1
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
        modelUsed: user.subscription?.tier === 'premium' ? 'claude-3-opus-20240229' : 'claude-3-sonnet-20240229',
        errorOccurred: true,
        contextLength: recentMessages.messages.length + 1
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

  private calculateTokenCount(context: string, response: string): number {
    // Claude typically uses ~4 chars per token (rough estimation)
    const totalText = context + response;
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