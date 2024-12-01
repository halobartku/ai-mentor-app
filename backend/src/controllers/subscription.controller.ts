import { Request, Response, NextFunction } from 'express';
import { StripeService } from '../services/stripe.service';

export class SubscriptionController {
  static async createSubscription(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const { priceId } = req.body;

      if (!userId) {
        throw new Error('User ID is required');
      }

      const subscription = await StripeService.createSubscription(userId, priceId);
      
      res.status(200).json({
        status: 'success',
        data: subscription
      });
    } catch (error) {
      next(error);
    }
  }

  static async cancelSubscription(req: Request, res: Response, next: NextFunction) {
    try {
      const { subscriptionId } = req.params;
      
      await StripeService.cancelSubscription(subscriptionId);
      
      res.status(200).json({
        status: 'success',
        message: 'Subscription cancelled successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  static async handleWebhook(req: Request, res: Response, next: NextFunction) {
    try {
      const sig = req.headers['stripe-signature'];
      
      if (!sig) {
        throw new Error('Stripe signature missing');
      }

      await StripeService.handleWebhook(req.body);
      
      res.status(200).json({ received: true });
    } catch (error) {
      next(error);
    }
  }
}