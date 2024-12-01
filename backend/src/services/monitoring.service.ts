import { prisma } from '../config/database';
import { logger } from '../utils/logger';

export interface AIMetrics {
  responseTime: number;
  tokenCount: number;
  modelUsed: string;
  errorOccurred: boolean;
  contextLength: number;
}

export interface UserMetrics {
  userId: string;
  sessionDuration: number;
  messageCount: number;
  aiInteractions: number;
  errorCount: number;
}

export class MonitoringService {
  static async logAIMetrics(metrics: AIMetrics & { userId: string }) {
    try {
      await prisma.aiMetrics.create({
        data: {
          userId: metrics.userId,
          responseTime: metrics.responseTime,
          tokenCount: metrics.tokenCount,
          modelUsed: metrics.modelUsed,
          errorOccurred: metrics.errorOccurred,
          contextLength: metrics.contextLength,
          timestamp: new Date()
        }
      });

      logger.info('AI Metrics logged', { metrics });
    } catch (error) {
      logger.error('Failed to log AI metrics', { error, metrics });
    }
  }

  static async logUserActivity(metrics: UserMetrics) {
    try {
      await prisma.userActivity.create({
        data: {
          userId: metrics.userId,
          sessionDuration: metrics.sessionDuration,
          messageCount: metrics.messageCount,
          aiInteractions: metrics.aiInteractions,
          errorCount: metrics.errorCount,
          timestamp: new Date()
        }
      });

      logger.info('User activity logged', { metrics });
    } catch (error) {
      logger.error('Failed to log user activity', { error, metrics });
    }
  }

  static async trackError(error: any, context: any) {
    try {
      await prisma.errorLog.create({
        data: {
          errorMessage: error.message,
          errorStack: error.stack,
          context: context,
          timestamp: new Date()
        }
      });

      logger.error('Error tracked', { error, context });
    } catch (logError) {
      logger.error('Failed to track error', { error, logError, context });
    }
  }

  static async getSystemHealth() {
    try {
      const [aiMetrics, userActivity, errorLogs] = await Promise.all([
        // Get AI performance metrics
        prisma.aiMetrics.aggregate({
          _avg: {
            responseTime: true,
            tokenCount: true
          },
          _count: {
            id: true
          },
          where: {
            timestamp: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
            }
          }
        }),

        // Get user activity metrics
        prisma.userActivity.aggregate({
          _sum: {
            messageCount: true,
            aiInteractions: true
          },
          _avg: {
            sessionDuration: true
          },
          where: {
            timestamp: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
            }
          }
        }),

        // Get error count
        prisma.errorLog.count({
          where: {
            timestamp: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
            }
          }
        })
      ]);

      return {
        aiPerformance: {
          averageResponseTime: aiMetrics._avg.responseTime || 0,
          averageTokenCount: aiMetrics._avg.tokenCount || 0,
          totalRequests: aiMetrics._count.id
        },
        userActivity: {
          totalMessages: userActivity._sum.messageCount || 0,
          totalInteractions: userActivity._sum.aiInteractions || 0,
          averageSessionDuration: userActivity._avg.sessionDuration || 0
        },
        errorRate: {
          total: errorLogs,
          perHour: errorLogs / 24
        },
        timestamp: new Date()
      };
    } catch (error) {
      logger.error('Failed to get system health', { error });
      throw error;
    }
  }

  static async getAIPerformanceMetrics(timeRange: 'day' | 'week' | 'month') {
    const timeRanges = {
      day: 24 * 60 * 60 * 1000,
      week: 7 * 24 * 60 * 60 * 1000,
      month: 30 * 24 * 60 * 60 * 1000
    };

    try {
      const metrics = await prisma.aiMetrics.groupBy({
        by: ['modelUsed'],
        _avg: {
          responseTime: true,
          tokenCount: true
        },
        _count: {
          id: true
        },
        where: {
          timestamp: {
            gte: new Date(Date.now() - timeRanges[timeRange])
          }
        }
      });

      return metrics.map(metric => ({
        model: metric.modelUsed,
        averageResponseTime: metric._avg.responseTime || 0,
        averageTokenCount: metric._avg.tokenCount || 0,
        totalRequests: metric._count.id
      }));
    } catch (error) {
      logger.error('Failed to get AI performance metrics', { error, timeRange });
      throw error;
    }
  }
}