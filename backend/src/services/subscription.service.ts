import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';

export class SubscriptionService {
  static async updateSubscription(userId: string, tier: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true }
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    const subscription = await prisma.subscription.upsert({
      where: {
        userId: userId
      },
      update: {
        tier: tier,
        status: 'active',
        startDate: new Date()
      },
      create: {
        userId: userId,
        tier: tier,
        status: 'active'
      }
    });

    return subscription;
  }

  static async getSubscriptionStatus(userId: string) {
    const subscription = await prisma.subscription.findUnique({
      where: { userId: userId }
    });

    return subscription || { tier: 'free', status: 'active' };
  }
}