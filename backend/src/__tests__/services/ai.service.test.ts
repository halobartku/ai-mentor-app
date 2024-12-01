import { AIService } from '../../services/ai.service';
import { prisma } from '../../config/database';
import { AppError } from '../../middleware/errorHandler';
import { OpenAI } from 'openai';

jest.mock('openai');
jest.mock('../../config/database');

describe('AIService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateMentorResponse', () => {
    it('should generate AI response for free tier user', async () => {
      const mockUser = {
        id: '1',
        subscription: { tier: 'free' }
      };

      const mockMessages = [];

      const mockAIResponse = {
        choices: [{
          message: {
            content: 'AI response content'
          }
        }]
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (prisma.message.findMany as jest.Mock).mockResolvedValue(mockMessages);
      (OpenAI.prototype.chat.completions.create as jest.Mock).mockResolvedValue(mockAIResponse);

      const result = await AIService.generateMentorResponse('1', 'test message');

      expect(result.response).toBe('AI response content');
      expect(OpenAI.prototype.chat.completions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'gpt-3.5-turbo'
        })
      );
    });

    it('should generate AI response for premium tier user', async () => {
      const mockUser = {
        id: '1',
        subscription: { tier: 'premium' }
      };

      const mockMessages = [];

      const mockAIResponse = {
        choices: [{
          message: {
            content: 'Premium AI response content'
          }
        }]
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (prisma.message.findMany as jest.Mock).mockResolvedValue(mockMessages);
      (OpenAI.prototype.chat.completions.create as jest.Mock).mockResolvedValue(mockAIResponse);

      const result = await AIService.generateMentorResponse('1', 'test message');

      expect(result.response).toBe('Premium AI response content');
      expect(OpenAI.prototype.chat.completions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'gpt-4'
        })
      );
    });

    it('should throw error when user not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        AIService.generateMentorResponse('1', 'test message')
      ).rejects.toThrow(AppError);
    });

    it('should throw error when AI response fails', async () => {
      const mockUser = {
        id: '1',
        subscription: { tier: 'free' }
      };

      const mockMessages = [];

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (prisma.message.findMany as jest.Mock).mockResolvedValue(mockMessages);
      (OpenAI.prototype.chat.completions.create as jest.Mock).mockRejectedValue(new Error('AI Error'));

      await expect(
        AIService.generateMentorResponse('1', 'test message')
      ).rejects.toThrow();
    });
  });
});