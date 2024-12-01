import OpenAI from 'openai';
import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { PersonalizationService } from './personalization.service';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export class AIService {
  static async generateMentorResponse(userId: string, message: string, chatId?: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscription: true
      }
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    // Get recent chat context
    const recentMessages = await this.getRecentContext(userId, chatId);

    // Generate personalized prompt
    const personalizedMessage = await PersonalizationService.generatePersonalizedPrompt(
      userId,
      message
    );

    // Prepare conversation context
    const conversationContext = [
      {
        role: 'system',
        content: 'You are an intelligent and empathetic AI mentor, focused on helping users achieve their personal and professional goals. Adapt your communication style and approach based on the user\'s preferences and learning style.'
      },
      ...recentMessages.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      })),
      { role: 'user' as const, content: personalizedMessage }
    ];

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

    // Store the conversation
    const chat = await this.storeConversation(
      userId,
      message,
      aiResponse,
      chatId
    );

    // Update learning behavior
    await PersonalizationService.analyzeUserBehavior(userId);

    return {
      response: aiResponse,
      chatId: chat.id
    };
  }

  private static async getRecentContext(userId: string, chatId?: string) {
    const query = chatId
      ? { chatId }
      : {
          chat: {
            userId
          }
        };

    return await prisma.message.findMany({
      where: query,
      orderBy: {
        createdAt: 'desc'
      },
      take: 10,
      select: {
        content: true,
        role: true
      }
    });
  }

  private static async storeConversation(
    userId: string,
    userMessage: string,
    aiResponse: string,
    chatId?: string
  ) {
    if (chatId) {
      // Add to existing chat
      await prisma.message.createMany({
        data: [
          {
            chatId,
            content: userMessage,
            role: 'user'
          },
          {
            chatId,
            content: aiResponse,
            role: 'assistant'
          }
        ]
      });

      return await prisma.chat.findUnique({
        where: { id: chatId }
      });
    } else {
      // Create new chat
      return await prisma.chat.create({
        data: {
          userId,
          messages: {
            create: [
              {
                content: userMessage,
                role: 'user'
              },
              {
                content: aiResponse,
                role: 'assistant'
              }
            ]
          }
        }
      });
    }
  }

  static async generateGoalSuggestions(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        goals: true,
        preferences: true
      }
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    const completedGoals = user.goals.filter(g => g.status === 'completed');
    const inProgressGoals = user.goals.filter(g => g.status === 'in_progress');

    const prompt = `Based on the user's preferences and completed goals, suggest 3 new goals.

User interests: ${user.preferences?.interests?.join(', ') || 'Not specified'}
Focus areas: ${user.preferences?.focusAreas?.join(', ') || 'Not specified'}

Completed goals:
${completedGoals.map(g => `- ${g.title}`).join('\n')}

Current goals:
${inProgressGoals.map(g => `- ${g.title}`).join('\n')}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an AI mentor helping users set meaningful and achievable goals.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7
    });

    return response.choices[0]?.message?.content || '';
  }
}