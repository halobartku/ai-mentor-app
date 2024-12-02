# Frontend Architecture

## Component Structure

### Core Components
```
src/
├── components/
│   ├── chat/
│   │   ├── ChatInterface.tsx    # Main chat container
│   │   ├── MessageList.tsx      # Message display
│   │   ├── MessageInput.tsx     # Input handling
│   │   ├── EmotionalFeedback.tsx # Emotion visualization
│   │   └── TypingIndicator.tsx  # Real-time feedback
│   ├── auth/
│   ├── profile/
│   └── shared/
```

### State Management
```typescript
interface ChatState {
  messages: Message[];
  isTyping: boolean;
  emotionalState: EmotionalState;
  context: ConversationContext;
}

interface UserState {
  profile: UserProfile;
  preferences: UserPreferences;
  subscription: SubscriptionStatus;
}
```

### Real-time Features

#### WebSocket Integration
```typescript
interface WebSocketEvents {
  'typing_start': () => void;
  'typing_end': () => void;
  'message_received': (message: Message) => void;
  'stream_chunk': (chunk: string) => void;
}
```

#### Stream Processing
```typescript
interface StreamConfig {
  chunkSize: number;
  retryAttempts: number;
  timeoutMs: number;
}
```

### UI/UX Guidelines

#### Component Patterns
1. Atomic Design
   - Atoms (buttons, inputs)
   - Molecules (message bubbles)
   - Organisms (chat interface)

2. State Handling
   - Local state for UI
   - Global state for app data
   - Context for theme/config

3. Error Boundaries
   - Component-level recovery
   - Fallback UI
   - Error reporting