import { Request, Response, NextFunction } from 'express';
import { PerformanceMonitor } from '../config/performance';

export const performanceMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const performanceMonitor = PerformanceMonitor.getInstance();
  const start = process.hrtime();

  // Add response hook
  res.on('finish', () => {
    const [seconds, nanoseconds] = process.hrtime(start);
    const duration = seconds * 1000 + nanoseconds / 1e6; // Convert to milliseconds

    performanceMonitor.measure(`http:${req.method}:${req.path}`, () => {});

    // Log slow requests
    if (duration > 1000) { // 1 second threshold
      logger.warn('Slow request detected:', {
        method: req.method,
        path: req.path,
        duration,
        query: req.query,
        body: req.body
      });
    }
  });

  next();
};