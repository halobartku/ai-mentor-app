import { prisma } from '../config/database';
import { CacheService } from './cache.service';
import { logger } from '../utils/logger';

export class QueryOptimizer {
  private cache: CacheService;

  constructor() {
    this.cache = new CacheService();
  }

  // Optimized user profile fetching with caching
  async getUserProfile(userId: string) {
    const cacheKey = `user:${userId}:profile`;
    
    try {
      // Try to get from cache first
      const cached = await this.cache.get(cacheKey);
      if (cached) return cached;

      // If not in cache, fetch from database with optimized query
      const profile = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          subscription: {
            select: {
              tier: true,
              status: true,
              endDate: true
            }
          },
          preferences: true,
          _count: {
            select: {
              goals: true,
              chats: true
            }
          }
        }
      });

      if (profile) {
        // Cache for 5 minutes
        await this.cache.set(cacheKey, profile, 300);
      }

      return profile;
    } catch (error) {
      logger.error('Error fetching user profile:', { error, userId });
      throw error;
    }
  }

  // Optimized goals fetching with pagination and caching
  async getUserGoals(userId: string, options: {
    page?: number;
    limit?: number;
    status?: string;
  }) {
    const { page = 1, limit = 10, status } = options;
    const cacheKey = `user:${userId}:goals:${page}:${limit}:${status || 'all'}`;
    
    try {
      const cached = await this.cache.get(cacheKey);
      if (cached) return cached;

      const [goals, total] = await prisma.$transaction([
        prisma.goal.findMany({
          where: {
            userId,
            ...(status ? { status } : {})
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: limit,
          skip: (page - 1) * limit,
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
            deadline: true,
            createdAt: true,
            updatedAt: true
          }
        }),
        prisma.goal.count({
          where: {
            userId,
            ...(status ? { status } : {})
          }
        })
      ]);

      const result = {
        goals,
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          currentPage: page
        }
      };

      // Cache for 1 minute
      await this.cache.set(cacheKey, result, 60);

      return result;
    } catch (error) {
      logger.error('Error fetching user goals:', { error, userId });
      throw error;
    }
  }

  // Optimized chat history fetching with cursor-based pagination
  async getChatHistory(userId: string, options: {
    cursor?: string;
    limit?: number;
  }) {
    const { cursor, limit = 20 } = options;
    const cacheKey = `user:${userId}:chats:${cursor || 'latest'}:${limit}`;

    try {
      const cached = await this.cache.get(cacheKey);
      if (cached) return cached;

      const messages = await prisma.message.findMany({
        where: {
          chat: { userId }
        },
        take: limit,
        ...(cursor ? {
          cursor: {
            id: cursor
          },
          skip: 1 // Skip the cursor
        } : {}),
        orderBy: {
          createdAt: 'desc'
        },
        select: {
          id: true,
          content: true,
          role: true,
          createdAt: true,
          chat: {
            select: {
              id: true
            }
          }
        }
      });

      const result = {
        messages,
        nextCursor: messages.length === limit ? messages[messages.length - 1].id : null
      };

      // Cache for 30 seconds
      await this.cache.set(cacheKey, result, 30);

      return result;
    } catch (error) {
      logger.error('Error fetching chat history:', { error, userId });
      throw error;
    }
  }

  // Invalidate cache for user-related data
  async invalidateUserCache(userId: string) {
    try {
      await Promise.all([
        this.cache.clear(`user:${userId}:profile*`),
        this.cache.clear(`user:${userId}:goals:*`),
        this.cache.clear(`user:${userId}:chats:*`)
      ]);
    } catch (error) {
      logger.error('Error invalidating user cache:', { error, userId });
    }
  }
}