export interface EmotionalState {
  currentMood: number;
  stressLevel: number;
  engagementScore: number;
  confidenceLevel: number;
}

export interface ConversationContext {
  recentTopics: string[];
  successPatterns: Map<string, number>;
  challengeAreas: Set<string>;
  emotionalJourney: EmotionalState[];
}

export interface AIResponse {
  content: string;
  emotionalState: EmotionalState;
  contextualRelevance: number;
}