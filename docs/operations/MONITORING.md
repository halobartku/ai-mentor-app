# Operations Monitoring

## Key Metrics

### Performance
- Response Time (p95, p99)
- Time to First Response
- Streaming Latency
- Cache Hit Rate

### Usage
- Active Users (DAU/MAU)
- Messages per Session
- Session Duration
- Response Length

### AI Pipeline
- AI Processing Time
- Token Usage
- Model Temperature
- Context Length

### System Health
- Error Rate
- API Success Rate
- Memory Usage
- CPU Utilization

## Alerting Rules

### Critical Alerts
```json
{
  "errorRate": {
    "threshold": "1%",
    "window": "5m",
    "action": "page"
  },
  "responseTime": {
    "threshold": "2s",
    "window": "1m",
    "action": "notify"
  },
  "aiFailure": {
    "consecutive": 3,
    "window": "1m",
    "action": "page"
  }
}
```

### Warning Alerts
```json
{
  "cacheHitRate": {
    "threshold": "80%",
    "window": "1h",
    "action": "notify"
  },
  "activeUsers": {
    "threshold": "-20%",
    "window": "1d",
    "action": "notify"
  }
}
```

## Dashboards

### User Experience
- Session Analytics
- Response Times
- Error Rates
- User Satisfaction

### AI Performance
- Model Latency
- Token Usage
- Cache Efficiency
- Response Quality

### System Status
- API Health
- Resource Usage
- Rate Limits
- Error Logs

## Logging

### Log Levels
```typescript
enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}
```

### Log Structure
```typescript
interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  service: string;
  event: string;
  userId?: string;
  data?: Record<string, any>;
  error?: Error;
}
```

### Key Events
1. Chat Interactions
   - Message Received
   - AI Processing Start/End
   - Response Sent

2. System Events
   - Cache Operations
   - AI Model Calls
   - Rate Limiting

3. Error Events
   - API Failures
   - AI Processing Errors
   - Client Errors

## Health Checks

### Endpoints
```typescript
interface HealthStatus {
  status: 'healthy' | 'degraded' | 'down';
  checks: {
    ai: boolean;
    cache: boolean;
    database: boolean;
  };
  latency: {
    ai: number;
    cache: number;
    database: number;
  };
  timestamp: Date;
}
```

### Service Dependencies
- Claude API
- Vercel KV
- Clerk Auth
- Analytics