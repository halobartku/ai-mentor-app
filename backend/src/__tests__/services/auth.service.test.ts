import { AuthService } from '../../services/auth.service';
import { prisma } from '../../config/database';
import bcrypt from 'bcrypt';
import { AppError } from '../../middleware/errorHandler';

jest.mock('../../config/database', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn()
    }
  }
}));

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('signup', () => {
    it('should create a new user successfully', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedPassword',
        name: 'Test User'
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await AuthService.signup({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      });

      expect(result.user).toBeDefined();
      expect(result.token).toBeDefined();
    });

    it('should throw an error if email already exists', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: '1' });

      await expect(
        AuthService.signup({
          email: 'test@example.com',
          password: 'password123'
        })
      ).rejects.toThrow(AppError);
    });
  });

  describe('login', () => {
    it('should login user successfully with correct credentials', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: hashedPassword
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await AuthService.login({
        email: 'test@example.com',
        password: 'password123'
      });

      expect(result.user).toBeDefined();
      expect(result.token).toBeDefined();
    });

    it('should throw an error if user not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        AuthService.login({
          email: 'test@example.com',
          password: 'password123'
        })
      ).rejects.toThrow(AppError);
    });

    it('should throw an error if password is incorrect', async () => {
      const hashedPassword = await bcrypt.hash('correctpassword', 10);
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: hashedPassword
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      await expect(
        AuthService.login({
          email: 'test@example.com',
          password: 'wrongpassword'
        })
      ).rejects.toThrow(AppError);
    });
  });
});