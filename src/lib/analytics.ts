import { Analytics } from '@vercel/analytics/react';

export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
}

export function trackEvent(event: AnalyticsEvent) {
  if (typeof window !== 'undefined' && window.va) {
    window.va.track(event.name, event.properties);
  }
}

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Analytics />
    </>
  );
}