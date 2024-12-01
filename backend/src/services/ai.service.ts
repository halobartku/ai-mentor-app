import OpenAI from 'openai';
import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export class AIService {
  static async generateMentorResponse(userId: string, message: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true }
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    // Get recent chat context
    const recentMessages = await prisma.message.findMany({
      where: {
        chat: {
          userId: userId
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    });

    const response = await openai.chat.completions.create({
      model: user.subscription?.tier === 'premium' ? 'gpt-4' : 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an intelligent and empathetic AI mentor, focused on helping users achieve their personal and professional goals.'
        },
        ...recentMessages.reverse().map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content
        })),
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const aiResponse = response.choices[0]?.message?.content;
    if (!aiResponse) {
      throw new AppError(500, 'Failed to generate AI response');
    }

    // Store the conversation
    const chat = await prisma.chat.create({
      data: {
        userId,
        messages: {
          create: [
            {
              content: message,
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

    return {
      response: aiResponse,
      chatId: chat.id
    };
  }
}