import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';
import { AppError } from './errorHandler';

const redis = new Redis(process.env.REDIS_URL);

// Base rate limiter configuration
const createLimiter = (options: {
  windowMs: number;
  max: number;
  keyPrefix: string;
}) => {
  return rateLimit({
    store: new RedisStore({
      redis,
      prefix: `${options.keyPrefix}:`
    }),
    windowMs: options.windowMs,
    max: options.max,
    handler: (req, res, next) => {
      next(new AppError(429, 'Too many requests, please try again later'));
    },
    keyGenerator: (req) => {
      // Use user ID if available, otherwise use IP
      return req.user?.id || req.ip;
    }
  });
};

// Different rate limiters for different endpoints
export const rateLimiters = {
  // General API endpoints
  api: createLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window
    keyPrefix: 'rl-api'
  }),

  // Authentication endpoints
  auth: createLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // 5 attempts per hour
    keyPrefix: 'rl-auth'
  }),

  // AI chat endpoints
  chat: {
    free: createLimiter({
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 20, // 20 messages per hour for free tier
      keyPrefix: 'rl-chat-free'
    }),
    premium: createLimiter({
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 100, // 100 messages per hour for premium tier
      keyPrefix: 'rl-chat-premium'
    })
  }
};

// Middleware to apply different limits based on subscription tier
export const chatRateLimit = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { subscription: true }
    });

    const limiter = user?.subscription?.tier === 'premium'
      ? rateLimiters.chat.premium
      : rateLimiters.chat.free;

    return limiter(req, res, next);
  } catch (error) {
    // Default to free tier limits if there's an error
    return rateLimiters.chat.free(req, res, next);
  }
};