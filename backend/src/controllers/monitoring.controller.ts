import { Request, Response, NextFunction } from 'express';
import { MonitoringService } from '../services/monitoring.service';

export class MonitoringController {
  static async getSystemHealth(req: Request, res: Response, next: NextFunction) {
    try {
      const health = await MonitoringService.getSystemHealth();
      
      res.status(200).json({
        status: 'success',
        data: health
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAIMetrics(req: Request, res: Response, next: NextFunction) {
    try {
      const timeRange = req.query.timeRange as 'day' | 'week' | 'month' || 'day';
      const metrics = await MonitoringService.getAIPerformanceMetrics(timeRange);
      
      res.status(200).json({
        status: 'success',
        data: metrics
      });
    } catch (error) {
      next(error);
    }
  }

  static async getErrorLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;

      const logs = await prisma.errorLog.findMany({
        take: limit,
        skip: offset,
        orderBy: {
          timestamp: 'desc'
        }
      });

      const total = await prisma.errorLog.count();
      
      res.status(200).json({
        status: 'success',
        data: {
          logs,
          total
        }
      });
    } catch (error) {
      next(error);
    }
  }
}