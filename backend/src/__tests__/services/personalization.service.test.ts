import { PersonalizationService } from '../../services/personalization.service';
import { prisma } from '../../config/database';
import { AppError } from '../../middleware/errorHandler';

jest.mock('../../config/database');

describe('PersonalizationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserPreferences', () => {
    it('should return user preferences', async () => {
      const mockUser = {
        id: '1',
        preferences: {
          learningStyle: 'visual',
          communicationStyle: 'casual',
          interests: ['programming', 'AI'],
          focusAreas: ['web development']
        },
        learningBehaviors: {
          preferredTimeOfDay: 'morning',
          averageSessionDuration: 30
        }
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await PersonalizationService.getUserPreferences('1');

      expect(result).toEqual({
        preferences: mockUser.preferences,
        learningBehaviors: mockUser.learningBehaviors
      });
    });

    it('should throw error when user not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        PersonalizationService.getUserPreferences('1')
      ).rejects.toThrow(AppError);
    });
  });

  describe('updatePreferences', () => {
    it('should update user preferences', async () => {
      const mockPreferences = {
        learningStyle: 'visual',
        communicationStyle: 'casual',
        interests: ['programming'],
        focusAreas: ['web development']
      };

      (prisma.userPreferences.upsert as jest.Mock).mockResolvedValue(mockPreferences);
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: '1',
        preferences: mockPreferences
      });

      const result = await PersonalizationService.updatePreferences('1', mockPreferences);

      expect(result.preferences).toEqual(mockPreferences);
      expect(prisma.userPreferences.upsert).toHaveBeenCalledWith({
        where: { userId: '1' },
        create: {
          userId: '1',
          ...mockPreferences
        },
        update: mockPreferences
      });
    });
  });

  describe('generatePersonalizedPrompt', () => {
    it('should generate personalized prompt based on preferences', async () => {
      const mockUser = {
        id: '1',
        preferences: {
          learningStyle: 'visual',
          communicationStyle: 'casual',
          interests: ['programming'],
          focusAreas: ['web development']
        }
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const basePrompt = 'How can I improve my coding skills?';
      const result = await PersonalizationService.generatePersonalizedPrompt('1', basePrompt);

      expect(result).toContain('friendly and relaxed way');
      expect(result).toContain('visual learner');
      expect(result).toContain('programming');
      expect(result).toContain('web development');
    });
  });

  describe('analyzeUserBehavior', () => {
    it('should analyze and update user behavior patterns', async () => {
      const mockMessages = Array.from({ length: 10 }, (_, i) => ({
        createdAt: new Date(Date.now() - i * 3600000), // Last 10 hours
        chat: { id: '1' }
      }));

      (prisma.message.findMany as jest.Mock).mockResolvedValue(mockMessages);

      await PersonalizationService.analyzeUserBehavior('1');

      expect(prisma.learningBehavior.upsert).toHaveBeenCalled();
    });

    it('should handle no recent activity', async () => {
      (prisma.message.findMany as jest.Mock).mockResolvedValue([]);

      const result = await PersonalizationService.analyzeUserBehavior('1');

      expect(result).toBeNull();
    });
  });
});