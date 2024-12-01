import { Request, Response } from 'express';
import { PreferencesController } from '../../controllers/preferences.controller';
import { PersonalizationService } from '../../services/personalization.service';

jest.mock('../../services/personalization.service');

describe('PreferencesController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockRequest = {
      user: { id: '1' },
      body: {}
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  describe('getUserPreferences', () => {
    it('should return user preferences successfully', async () => {
      const mockPreferences = {
        learningStyle: 'visual',
        communicationStyle: 'casual'
      };

      (PersonalizationService.getUserPreferences as jest.Mock).mockResolvedValue(mockPreferences);

      await PreferencesController.getUserPreferences(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'success',
        data: mockPreferences
      });
    });

    it('should handle missing user ID', async () => {
      mockRequest.user = undefined;

      await PreferencesController.getUserPreferences(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });

    it('should handle service errors', async () => {
      const error = new Error('Service error');
      (PersonalizationService.getUserPreferences as jest.Mock).mockRejectedValue(error);

      await PreferencesController.getUserPreferences(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('updatePreferences', () => {
    it('should update preferences successfully', async () => {
      const mockPreferences = {
        learningStyle: 'visual',
        communicationStyle: 'casual'
      };
      mockRequest.body = mockPreferences;

      (PersonalizationService.updatePreferences as jest.Mock).mockResolvedValue(mockPreferences);

      await PreferencesController.updatePreferences(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'success',
        data: mockPreferences
      });
    });
  });
});