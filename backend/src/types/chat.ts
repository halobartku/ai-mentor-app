export interface RationalAnalysis {
  assumptions: string[];
  logicalFlow: {
    consistency: number;
    gaps: string[];
  };
  biases: {
    cognitive: string[];
    emotional: string[];
  };
  evidenceStrength: {
    strength: number;
    sources: string[];
  };
}

export interface ProcessBreakdown {
  objectives: {
    primary: string;
    secondary: string[];
  };
  steps: Array<{
    order: number;
    description: string;
    estimatedDuration: string;
  }>;
  obstacles: Array<{
    description: string;
    severity: 'low' | 'medium' | 'high';
    mitigation: string;
  }>;
  metrics: Array<{
    metric: string;
    target: string;
    timeframe: string;
  }>;
}

export interface FullContext extends ConversationContext {
  rationalAnalysis: RationalAnalysis;
  processBreakdown: ProcessBreakdown;
}

export interface AIResponse {
  content: string;
  analysis: {
    rational: RationalAnalysis;
    process: ProcessBreakdown;
  };
  emotionalState: EmotionalState;
  metadata: {
    timestamp: Date;
    modelVersion: string;
    processingTime: number;
  };
}