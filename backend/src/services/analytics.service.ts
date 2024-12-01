import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';

export class AnalyticsService {
  static async getUserAnalytics(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        goals: true,
        chats: {
          include: {
            messages: true
          }
        }
      }
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    // Calculate goal statistics
    const goalStats = {
      total: user.goals.length,
      completed: user.goals.filter(goal => goal.status === 'completed').length,
      inProgress: user.goals.filter(goal => goal.status === 'in_progress').length,
      completion_rate: user.goals.length > 0
        ? (user.goals.filter(goal => goal.status === 'completed').length / user.goals.length) * 100
        : 0
    };

    // Calculate interaction statistics
    const chatStats = {
      total_sessions: user.chats.length,
      total_messages: user.chats.reduce((acc, chat) => acc + chat.messages.length, 0),
      avg_messages_per_session: user.chats.length > 0
        ? user.chats.reduce((acc, chat) => acc + chat.messages.length, 0) / user.chats.length
        : 0
    };

    // Calculate activity trends
    const activityTrends = await this.calculateActivityTrends(userId);

    return {
      goalStats,
      chatStats,
      activityTrends
    };
  }

  private static async calculateActivityTrends(userId: string) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const activities = await prisma.$transaction([
      // Goal completion trend
      prisma.goal.findMany({
        where: {
          userId,
          status: 'completed',
          updatedAt: {
            gte: thirtyDaysAgo
          }
        },
        orderBy: {
          updatedAt: 'asc'
        }
      }),

      // Chat interaction trend
      prisma.message.findMany({
        where: {
          chat: {
            userId
          },
          createdAt: {
            gte: thirtyDaysAgo
          }
        },
        orderBy: {
          createdAt: 'asc'
        }
      })
    ]);

    const [completedGoals, messages] = activities;

    // Group activities by date
    const dailyActivity = new Map();
    const currentDate = new Date(thirtyDaysAgo);

    while (currentDate <= new Date()) {
      const dateStr = currentDate.toISOString().split('T')[0];
      dailyActivity.set(dateStr, {
        completedGoals: 0,
        messages: 0
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Record goal completions
    completedGoals.forEach(goal => {
      const dateStr = goal.updatedAt.toISOString().split('T')[0];
      if (dailyActivity.has(dateStr)) {
        dailyActivity.get(dateStr).completedGoals++;
      }
    });

    // Record message counts
    messages.forEach(message => {
      const dateStr = message.createdAt.toISOString().split('T')[0];
      if (dailyActivity.has(dateStr)) {
        dailyActivity.get(dateStr).messages++;
      }
    });

    return Array.from(dailyActivity.entries()).map(([date, data]) => ({
      date,
      ...data
    }));
  }

  static async generateUserInsights(userId: string) {
    const analytics = await this.getUserAnalytics(userId);
    
    const insights = [];

    // Goal-related insights
    if (analytics.goalStats.total > 0) {
      if (analytics.goalStats.completion_rate < 30) {
        insights.push({
          type: 'goal',
          category: 'improvement',
          message: 'Your goal completion rate is low. Consider breaking down goals into smaller, more manageable tasks.'
        });
      } else if (analytics.goalStats.completion_rate > 70) {
        insights.push({
          type: 'goal',
          category: 'achievement',
          message: 'Great job maintaining a high goal completion rate! Consider setting more challenging goals.'
        });
      }
    }

    // Interaction insights
    if (analytics.chatStats.total_sessions > 0) {
      if (analytics.chatStats.avg_messages_per_session < 5) {
        insights.push({
          type: 'interaction',
          category: 'improvement',
          message: 'Try having more detailed discussions with your AI mentor to get better guidance.'
        });
      }
    }

    // Activity trend insights
    const recentActivity = analytics.activityTrends.slice(-7);
    const hasRecentActivity = recentActivity.some(day => 
      day.completedGoals > 0 || day.messages > 0
    );

    if (!hasRecentActivity) {
      insights.push({
        type: 'engagement',
        category: 'improvement',
        message: 'You haven\'t been active recently. Regular engagement helps in achieving your goals.'
      });
    }

    return insights;
  }
}