# API Reference

## Chat Endpoints

### Process Message
`POST /api/chat`

```typescript
interface Request {
  message: string
  context?: {
    recentMessages?: Message[]
    userPreferences?: UserPreferences
  }
}

interface Response {
  content: string
  analysis: {
    rational: RationalAnalysis
    process: ProcessAnalysis
  }
  emotionalState: EmotionalState
}
```

### Stream Response
`POST /api/chat/stream`

Returns chunked response with Server-Sent Events

## User Management

### Get Profile
`GET /api/user/profile`

```typescript
interface Response {
  id: string
  preferences: UserPreferences
  subscription: SubscriptionStatus
  progress: ProgressMetrics
}
```

### Update Preferences
`PUT /api/user/preferences`

```typescript
interface Request {
  learningStyle?: 'visual' | 'auditory' | 'kinesthetic'
  communicationStyle?: 'formal' | 'casual'
  goals?: string[]
}
```

## Analytics

### Track Event
`POST /api/analytics/event`

```typescript
interface Request {
  eventType: string
  metadata: Record<string, any>
  timestamp: Date
}
```

## Error Handling

### Error Responses
```typescript
interface ErrorResponse {
  error: {
    code: string
    message: string
    details?: any
  }
  status: number
}
```

### Error Codes
- `rate_limit_exceeded`
- `invalid_input`
- `processing_failed`
- `unauthorized`
- `subscription_required`

## WebSocket Events

### Client Events
- `message`: Send user message
- `typing_start`: User starts typing
- `typing_end`: User stops typing

### Server Events
- `message`: Receive AI response
- `stream_chunk`: Receive response chunk
- `error`: Error notification