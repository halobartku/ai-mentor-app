import { prisma } from '../config/database';
import { RealtimeService } from './realtime.service';
import { logger } from '../utils/logger';

export interface Notification {
  type: 'message' | 'goal' | 'achievement' | 'system';
  title: string;
  body: string;
  data?: any;
  userId: string;
}

export class NotificationService {
  private realtimeService: RealtimeService;

  constructor(realtimeService: RealtimeService) {
    this.realtimeService = realtimeService;
  }

  async createNotification(notification: Notification) {
    try {
      const stored = await prisma.notification.create({
        data: {
          type: notification.type,
          title: notification.title,
          body: notification.body,
          data: notification.data,
          userId: notification.userId
        }
      });

      // Send realtime notification
      this.realtimeService.sendNotification(notification.userId, {
        id: stored.id,
        ...notification
      });

      return stored;
    } catch (error) {
      logger.error('Error creating notification', { error, notification });
      throw error;
    }
  }

  async getUserNotifications(userId: string, options?: {
    unreadOnly?: boolean;
    limit?: number;
    offset?: number;
  }) {
    const { unreadOnly = false, limit = 20, offset = 0 } = options || {};

    return await prisma.notification.findMany({
      where: {
        userId,
        ...(unreadOnly ? { read: false } : {})
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: offset
    });
  }

  async markAsRead(notificationId: string, userId: string) {
    return await prisma.notification.update({
      where: {
        id: notificationId,
        userId // Ensure notification belongs to user
      },
      data: {
        read: true,
        readAt: new Date()
      }
    });
  }

  async markAllAsRead(userId: string) {
    return await prisma.notification.updateMany({
      where: {
        userId,
        read: false
      },
      data: {
        read: true,
        readAt: new Date()
      }
    });
  }

  async getUnreadCount(userId: string) {
    return await prisma.notification.count({
      where: {
        userId,
        read: false
      }
    });
  }

  async deleteNotification(notificationId: string, userId: string) {
    return await prisma.notification.delete({
      where: {
        id: notificationId,
        userId // Ensure notification belongs to user
      }
    });
  }
}