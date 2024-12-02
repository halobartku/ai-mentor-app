export interface EmotionalState {
  currentMood: number;
  stressLevel: number;
  engagementScore: number;
  confidenceLevel: number;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  emotionalState?: EmotionalState;
  timestamp: Date;
}

export interface ChatState {
  messages: Message[];
  isTyping: boolean;
  isLoading: boolean;
}