import { Analytics } from '@vercel/analytics/react';
import * as Sentry from '@sentry/nextjs';

export class MonitoringService {
  logError(error: Error, context?: any) {
    Sentry.captureException(error, { extra: context });
  }

  logMetric(name: string, value: number) {
    Analytics.track(name, { value });
  }
}