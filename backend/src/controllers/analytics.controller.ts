import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from '../services/analytics.service';

export class AnalyticsController {
  static async getUserAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new Error('User ID is required');
      }

      const analytics = await AnalyticsService.getUserAnalytics(userId);
      
      res.status(200).json({
        status: 'success',
        data: analytics
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUserInsights(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new Error('User ID is required');
      }

      const insights = await AnalyticsService.generateUserInsights(userId);
      
      res.status(200).json({
        status: 'success',
        data: insights
      });
    } catch (error) {
      next(error);
    }
  }
}