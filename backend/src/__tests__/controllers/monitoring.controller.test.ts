import { Request, Response } from 'express';
import { MonitoringController } from '../../controllers/monitoring.controller';
import { MonitoringService } from '../../services/monitoring.service';

jest.mock('../../services/monitoring.service');

describe('MonitoringController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockRequest = {
      query: {},
      user: { id: '1', isAdmin: true }
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  describe('getSystemHealth', () => {
    it('should return system health data', async () => {
      const mockHealth = {
        aiPerformance: { averageResponseTime: 500 },
        userActivity: { totalMessages: 1000 },
        errorRate: { total: 50 }
      };

      (MonitoringService.getSystemHealth as jest.Mock).mockResolvedValue(mockHealth);

      await MonitoringController.getSystemHealth(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'success',
        data: mockHealth
      });
    });
  });

  describe('getAIMetrics', () => {
    it('should return AI performance metrics', async () => {
      const mockMetrics = [
        { model: 'gpt-4', averageResponseTime: 500 }
      ];

      mockRequest.query = { timeRange: 'day' };

      (MonitoringService.getAIPerformanceMetrics as jest.Mock).mockResolvedValue(mockMetrics);

      await MonitoringController.getAIMetrics(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'success',
        data: mockMetrics
      });
    });
  });
});