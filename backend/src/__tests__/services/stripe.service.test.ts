import { StripeService } from '../../services/stripe.service';
import { prisma } from '../../config/database';
import Stripe from 'stripe';
import { AppError } from '../../middleware/errorHandler';

jest.mock('stripe');
jest.mock('../../config/database');

describe('StripeService', () => {
  let mockStripe: jest.Mocked<Stripe>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockStripe = new Stripe('fake-key') as jest.Mocked<Stripe>;
  });

  describe('createCustomer', () => {
    it('should create a stripe customer and update user', async () => {
      const mockCustomer = { id: 'cus_123' };
      (mockStripe.customers.create as jest.Mock).mockResolvedValue(mockCustomer);

      await StripeService.createCustomer('user_1', 'test@example.com');

      expect(mockStripe.customers.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        metadata: { userId: 'user_1' }
      });

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user_1' },
        data: { stripeCustomerId: 'cus_123' }
      });
    });
  });

  describe('createSubscription', () => {
    it('should create a subscription for existing customer', async () => {
      const mockUser = {
        id: 'user_1',
        stripeCustomerId: 'cus_123'
      };

      const mockSubscription = {
        id: 'sub_123',
        status: 'active'
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (mockStripe.subscriptions.create as jest.Mock).mockResolvedValue(mockSubscription);

      const result = await StripeService.createSubscription('user_1', 'price_123');

      expect(result).toBe(mockSubscription);
      expect(mockStripe.subscriptions.create).toHaveBeenCalledWith({
        customer: 'cus_123',
        items: [{ price: 'price_123' }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent']
      });
    });

    it('should throw error when user not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        StripeService.createSubscription('user_1', 'price_123')
      ).rejects.toThrow(AppError);
    });

    it('should throw error when customer not found', async () => {
      const mockUser = {
        id: 'user_1',
        stripeCustomerId: null
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      await expect(
        StripeService.createSubscription('user_1', 'price_123')
      ).rejects.toThrow(AppError);
    });
  });

  describe('cancelSubscription', () => {
    it('should cancel subscription successfully', async () => {
      const mockCancelledSubscription = {
        id: 'sub_123',
        status: 'cancelled'
      };

      (mockStripe.subscriptions.cancel as jest.Mock).mockResolvedValue(mockCancelledSubscription);

      const result = await StripeService.cancelSubscription('sub_123');

      expect(result).toBe(mockCancelledSubscription);
      expect(mockStripe.subscriptions.cancel).toHaveBeenCalledWith('sub_123');
    });
  });
});