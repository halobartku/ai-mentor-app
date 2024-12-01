import Stripe from 'stripe';
import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16'
});

export class StripeService {
  static async createCustomer(userId: string, email: string) {
    const customer = await stripe.customers.create({
      email,
      metadata: {
        userId
      }
    });

    await prisma.user.update({
      where: { id: userId },
      data: {
        stripeCustomerId: customer.id
      }
    });

    return customer;
  }

  static async createSubscription(userId: string, priceId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    if (!user.stripeCustomerId) {
      throw new AppError(400, 'Stripe customer not found');
    }

    const subscription = await stripe.subscriptions.create({
      customer: user.stripeCustomerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent']
    });

    return subscription;
  }

  static async cancelSubscription(subscriptionId: string) {
    return await stripe.subscriptions.cancel(subscriptionId);
  }

  static async handleWebhook(event: Stripe.Event) {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        const subscription = event.data.object as Stripe.Subscription;
        await this.updateSubscriptionStatus(subscription);
        break;

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object as Stripe.Subscription;
        await this.handleSubscriptionCancellation(deletedSubscription);
        break;
    }
  }

  private static async updateSubscriptionStatus(subscription: Stripe.Subscription) {
    const customer = await stripe.customers.retrieve(subscription.customer as string);
    const userId = customer.metadata.userId;

    await prisma.subscription.upsert({
      where: {
        userId
      },
      create: {
        userId,
        stripeSubscriptionId: subscription.id,
        status: subscription.status,
        tier: 'premium',
        startDate: new Date(subscription.current_period_start * 1000),
        endDate: new Date(subscription.current_period_end * 1000)
      },
      update: {
        status: subscription.status,
        endDate: new Date(subscription.current_period_end * 1000)
      }
    });
  }

  private static async handleSubscriptionCancellation(subscription: Stripe.Subscription) {
    const customer = await stripe.customers.retrieve(subscription.customer as string);
    const userId = customer.metadata.userId;

    await prisma.subscription.update({
      where: {
        userId
      },
      data: {
        status: 'canceled',
        tier: 'free',
        endDate: new Date()
      }
    });
  }
}