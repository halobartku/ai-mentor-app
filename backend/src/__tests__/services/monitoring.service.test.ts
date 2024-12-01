import { MonitoringService } from '../../services/monitoring.service';
import { prisma } from '../../config/database';

jest.mock('../../config/database');

describe('MonitoringService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('logAIMetrics', () => {
    it('should log AI metrics successfully', async () => {
      const mockMetrics = {
        userId: '1',
        responseTime: 500,
        tokenCount: 100,
        modelUsed: 'gpt-4',
        errorOccurred: false,
        contextLength: 200
      };

      await MonitoringService.logAIMetrics(mockMetrics);

      expect(prisma.aiMetrics.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          ...mockMetrics,
          timestamp: expect.any(Date)
        })
      });
    });
  });

  describe('getSystemHealth', () => {
    it('should return system health metrics', async () => {
      const mockAiMetrics = {
        _avg: {
          responseTime: 450,
          tokenCount: 120
        },
        _count: {
          id: 1000
        }
      };

      const mockUserActivity = {
        _sum: {
          messageCount: 5000,
          aiInteractions: 3000
        },
        _avg: {
          sessionDuration: 600
        }
      };

      const mockErrorCount = 50;

      (prisma.aiMetrics.aggregate as jest.Mock).mockResolvedValue(mockAiMetrics);
      (prisma.userActivity.aggregate as jest.Mock).mockResolvedValue(mockUserActivity);
      (prisma.errorLog.count as jest.Mock).mockResolvedValue(mockErrorCount);

      const health = await MonitoringService.getSystemHealth();

      expect(health).toEqual({
        aiPerformance: {
          averageResponseTime: 450,
          averageTokenCount: 120,
          totalRequests: 1000
        },
        userActivity: {
          totalMessages: 5000,
          totalInteractions: 3000,
          averageSessionDuration: 600
        },
        errorRate: {
          total: 50,
          perHour: expect.any(Number)
        },
        timestamp: expect.any(Date)
      });
    });
  });

  describe('getAIPerformanceMetrics', () => {
    it('should return metrics for specified time range', async () => {
      const mockMetrics = [
        {
          modelUsed: 'gpt-4',
          _avg: {
            responseTime: 500,
            tokenCount: 150
          },
          _count: {
            id: 800
          }
        },
        {
          modelUsed: 'gpt-3.5-turbo',
          _avg: {
            responseTime: 300,
            tokenCount: 100
          },
          _count: {
            id: 1200
          }
        }
      ];

      (prisma.aiMetrics.groupBy as jest.Mock).mockResolvedValue(mockMetrics);

      const result = await MonitoringService.getAIPerformanceMetrics('day');

      expect(result).toEqual([
        {
          model: 'gpt-4',
          averageResponseTime: 500,
          averageTokenCount: 150,
          totalRequests: 800
        },
        {
          model: 'gpt-3.5-turbo',
          averageResponseTime: 300,
          averageTokenCount: 100,
          totalRequests: 1200
        }
      ]);
    });

    it('should handle errors gracefully', async () => {
      (prisma.aiMetrics.groupBy as jest.Mock).mockRejectedValue(new Error('Database error'));

      await expect(
        MonitoringService.getAIPerformanceMetrics('day')
      ).rejects.toThrow();
    });
  });
});