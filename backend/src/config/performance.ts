import { performance } from 'perf_hooks';
import { logger } from '../utils/logger';

export class PerformanceMonitor {
  private metrics: {
    [key: string]: {
      count: number;
      totalDuration: number;
      maxDuration: number;
      minDuration: number;
    };
  };

  private static instance: PerformanceMonitor;

  private constructor() {
    this.metrics = {};
    this.startPeriodicReport();
  }

  static getInstance() {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  async measureAsync<T>(
    operationName: string,
    operation: () => Promise<T>
  ): Promise<T> {
    const start = performance.now();
    try {
      return await operation();
    } finally {
      this.recordMetric(operationName, performance.now() - start);
    }
  }

  measure<T>(operationName: string, operation: () => T): T {
    const start = performance.now();
    try {
      return operation();
    } finally {
      this.recordMetric(operationName, performance.now() - start);
    }
  }

  private recordMetric(operationName: string, duration: number) {
    if (!this.metrics[operationName]) {
      this.metrics[operationName] = {
        count: 0,
        totalDuration: 0,
        maxDuration: 0,
        minDuration: Number.MAX_VALUE
      };
    }

    const metric = this.metrics[operationName];
    metric.count++;
    metric.totalDuration += duration;
    metric.maxDuration = Math.max(metric.maxDuration, duration);
    metric.minDuration = Math.min(metric.minDuration, duration);
  }

  getMetrics() {
    const result: { [key: string]: any } = {};

    for (const [operation, metric] of Object.entries(this.metrics)) {
      result[operation] = {
        count: metric.count,
        averageDuration: metric.totalDuration / metric.count,
        maxDuration: metric.maxDuration,
        minDuration: metric.minDuration
      };
    }

    return result;
  }

  private startPeriodicReport() {
    setInterval(() => {
      const metrics = this.getMetrics();
      logger.info('Performance metrics:', { metrics });

      // Reset metrics after reporting
      this.metrics = {};
    }, 300000); // Report every 5 minutes
  }

  // Additional monitoring methods
  async monitorMemoryUsage() {
    const used = process.memoryUsage();
    logger.info('Memory usage:', {
      heapTotal: `${Math.round(used.heapTotal / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(used.heapUsed / 1024 / 1024)}MB`,
      rss: `${Math.round(used.rss / 1024 / 1024)}MB`
    });
  }

  monitorEventLoopLag(threshold = 100) {
    let lastCheck = process.hrtime.bigint();

    setInterval(() => {
      const now = process.hrtime.bigint();
      const lag = Number(now - lastCheck) / 1e6 - 500; // Convert to ms
      lastCheck = now;

      if (lag > threshold) {
        logger.warn('Event loop lag detected:', { lag });
      }
    }, 500);
  }
}