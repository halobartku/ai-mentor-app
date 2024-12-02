import pino from 'pino';

export class MonitoringService {
  private logger = pino({
    level: 'info',
    transport: {
      target: 'pino-pretty'
    }
  });

  logAPICall(type: string, duration: number, success: boolean) {
    this.logger.info({
      type,
      duration,
      success,
      timestamp: new Date()
    });
  }

  logError(error: Error, context?: any) {
    this.logger.error({
      error: error.message,
      stack: error.stack,
      context,
      timestamp: new Date()
    });
  }

  logPerformanceMetric(metric: {
    name: string;
    value: number;
    context?: any;
  }) {
    this.logger.info({
      type: 'performance',
      ...metric,
      timestamp: new Date()
    });
  }
}