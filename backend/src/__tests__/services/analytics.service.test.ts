import { AnalyticsService } from '../../services/analytics.service';
import { prisma } from '../../config/database';
import { AppError } from '../../middleware/errorHandler';

jest.mock('../../config/database', () => ({
  prisma: {
    user: {
      findUnique: jest.fn()
    },
    goal: {
      findMany: jest.fn()
    },
    message: {
      findMany: jest.fn()
    }
  }
}));

describe('AnalyticsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserAnalytics', () => {
    it('should return user analytics successfully', async () => {
      const mockUser = {
        id: '1',
        goals: [
          { status: 'completed' },
          { status: 'completed' },
          { status: 'in_progress' }
        ],
        chats: [
          {
            messages: [{ id: '1' }, { id: '2' }]
          },
          {
            messages: [{ id: '3' }]
          }
        ]
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await AnalyticsService.getUserAnalytics('1');

      expect(result.goalStats.completion_rate).toBe(66.67); // 2/3 * 100
      expect(result.chatStats.total_sessions).toBe(2);
      expect(result.chatStats.total_messages).toBe(3);
    });

    it('should throw error when user not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        AnalyticsService.getUserAnalytics('1')
      ).rejects.toThrow(AppError);
    });
  });

  describe('generateUserInsights', () => {
    it('should generate insights based on analytics', async () => {
      const mockAnalytics = {
        goalStats: {
          completion_rate: 25
        },
        chatStats: {
          avg_messages_per_session: 3
        },
        activityTrends: Array(7).fill({ completedGoals: 0, messages: 0 })
      };

      jest.spyOn(AnalyticsService, 'getUserAnalytics')
        .mockResolvedValue(mockAnalytics as any);

      const insights = await AnalyticsService.generateUserInsights('1');

      expect(insights).toHaveLength(3); // Low completion rate, low interaction, no recent activity
      expect(insights.some(i => i.category === 'improvement')).toBeTruthy();
    });
  });
});