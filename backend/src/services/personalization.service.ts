import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';

export interface PersonalizationPreferences {
  learningStyle?: 'visual' | 'auditory' | 'reading' | 'kinesthetic';
  communicationStyle?: 'formal' | 'casual' | 'direct' | 'supportive';
  goalPreferences?: {
    shortTerm: boolean;
    longTerm: boolean;
    daily: boolean;
  };
  interests?: string[];
  focusAreas?: string[];
}

export interface LearningBehavior {
  preferredTimeOfDay?: 'morning' | 'afternoon' | 'evening';
  averageSessionDuration?: number;
  completionPatterns?: {
    weekday: number;
    weekend: number;
  };
  responseToFeedback?: 'positive' | 'neutral' | 'negative';
}

export class PersonalizationService {
  static async getUserPreferences(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        preferences: true,
        learningBehaviors: true
      }
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    return {
      preferences: user.preferences,
      learningBehaviors: user.learningBehaviors
    };
  }

  static async updatePreferences(
    userId: string,
    preferences: PersonalizationPreferences
  ) {
    await prisma.userPreferences.upsert({
      where: { userId },
      create: {
        userId,
        ...preferences
      },
      update: preferences
    });

    return this.getUserPreferences(userId);
  }

  static async updateLearningBehavior(
    userId: string,
    behavior: Partial<LearningBehavior>
  ) {
    await prisma.learningBehavior.upsert({
      where: { userId },
      create: {
        userId,
        ...behavior
      },
      update: behavior
    });
  }

  static async generatePersonalizedPrompt(userId: string, basePrompt: string) {
    const { preferences, learningBehaviors } = await this.getUserPreferences(userId);

    let personalizedPrompt = basePrompt;

    // Adjust language style based on communication preference
    if (preferences?.communicationStyle) {
      switch (preferences.communicationStyle) {
        case 'formal':
          personalizedPrompt = `In a professional and structured manner, ${basePrompt}`;
          break;
        case 'casual':
          personalizedPrompt = `In a friendly and relaxed way, ${basePrompt}`;
          break;
        case 'direct':
          personalizedPrompt = `Briefly and clearly, ${basePrompt}`;
          break;
        case 'supportive':
          personalizedPrompt = `In an encouraging and supportive way, ${basePrompt}`;
          break;
      }
    }

    // Adjust content style based on learning preference
    if (preferences?.learningStyle) {
      personalizedPrompt += `\nPlease format the response to suit a ${preferences.learningStyle} learner.`;
    }

    // Add context about user's interests and focus areas
    if (preferences?.interests?.length || preferences?.focusAreas?.length) {
      personalizedPrompt += '\nConsider incorporating examples or analogies from: ';
      if (preferences.interests?.length) {
        personalizedPrompt += `\n- Interests: ${preferences.interests.join(', ')}`;
      }
      if (preferences.focusAreas?.length) {
        personalizedPrompt += `\n- Focus areas: ${preferences.focusAreas.join(', ')}`;
      }
    }

    return personalizedPrompt;
  }

  static async analyzeUserBehavior(userId: string) {
    const recentActivity = await prisma.message.findMany({
      where: {
        chat: {
          userId
        },
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      },
      include: {
        chat: true
      }
    });

    if (recentActivity.length === 0) {
      return null;
    }

    // Analyze time patterns
    const timeDistribution = recentActivity.reduce((acc, message) => {
      const hour = new Date(message.createdAt).getHours();
      if (hour >= 5 && hour < 12) acc.morning++;
      else if (hour >= 12 && hour < 17) acc.afternoon++;
      else acc.evening++;
      return acc;
    }, { morning: 0, afternoon: 0, evening: 0 });

    const preferredTimeOfDay = Object.entries(timeDistribution)
      .reduce((a, b) => a[1] > b[1] ? a : b)[0] as 'morning' | 'afternoon' | 'evening';

    // Update learning behavior
    await this.updateLearningBehavior(userId, {
      preferredTimeOfDay,
      averageSessionDuration: this.calculateAverageSessionDuration(recentActivity)
    });
  }

  private static calculateAverageSessionDuration(messages: any[]) {
    const sessions = new Map<string, { start: Date; end: Date }>();

    messages.forEach(message => {
      const chatId = message.chat.id;
      const messageTime = new Date(message.createdAt);

      if (!sessions.has(chatId)) {
        sessions.set(chatId, { start: messageTime, end: messageTime });
      } else {
        const session = sessions.get(chatId)!;
        if (messageTime > session.end) {
          session.end = messageTime;
        }
      }
    });

    const durations = Array.from(sessions.values())
      .map(session => session.end.getTime() - session.start.getTime());

    return durations.reduce((a, b) => a + b, 0) / durations.length / 1000 / 60; // Average in minutes
  }
}