import { Analytics } from '@vercel/analytics/react';
import * as Sentry from '@sentry/nextjs';

export enum MetricType {
  RESPONSE_TIME = 'response_time',
  ERROR_RATE = 'error_rate',
  CACHE_HIT = 'cache_hit',
  TOKEN_USAGE = 'token_usage'
}

export interface Metric {
  type: MetricType;
  value: number;
  tags?: Record<string, string>;
  timestamp?: Date;
}

class Monitor {
  private static instance: Monitor;

  private constructor() {
    if (process.env.SENTRY_DSN) {
      Sentry.init({
        dsn: process.env.SENTRY_DSN,
        tracesSampleRate: 0.1,
        integrations: [new Sentry.BrowserTracing()]
      });
    }
  }

  static getInstance(): Monitor {
    if (!Monitor.instance) {
      Monitor.instance = new Monitor();
    }
    return Monitor.instance;
  }

  trackMetric(metric: Metric): void {
    // Track in Vercel Analytics
    if (typeof window !== 'undefined' && window.va) {
      window.va.track(metric.type, {
        value: metric.value,
        ...metric.tags
      });
    }

    // Track in Sentry if error related
    if (metric.type === MetricType.ERROR_RATE && metric.value > 0) {
      Sentry.captureMessage(`High error rate: ${metric.value}`, {
        level: 'warning',
        tags: metric.tags
      });
    }
  }

  trackError(error: Error, context?: Record<string, any>): void {
    console.error('Error:', error);
    
    Sentry.captureException(error, {
      tags: context
    });

    this.trackMetric({
      type: MetricType.ERROR_RATE,
      value: 1,
      tags: context
    });
  }

  startTimer(): () => number {
    const start = performance.now();
    return () => performance.now() - start;
  }
}

export const monitor = Monitor.getInstance();
