import { BaseService } from './base.service';
import { EmotionalState } from '../types/ai.types';

export class EmotionalProcessor extends BaseService {
  async analyze(message: string): Promise<EmotionalState> {
    const sentimentScores = await this.analyzeSentiment(message);
    
    return {
      currentMood: this.normalizeScore(sentimentScores.positivity),
      stressLevel: this.normalizeScore(sentimentScores.anxiety),
      engagementScore: this.calculateEngagement(message),
      confidenceLevel: this.normalizeScore(sentimentScores.confidence)
    };
  }

  async projectOptimalState(current: EmotionalState): Promise<EmotionalState> {
    return {
      currentMood: Math.min(current.currentMood + 0.2, 1),
      stressLevel: Math.max(current.stressLevel - 0.2, 0),
      engagementScore: Math.min(current.engagementScore + 0.1, 1),
      confidenceLevel: Math.min(current.confidenceLevel + 0.15, 1)
    };
  }

  private normalizeScore(score: number): number {
    return Math.max(0, Math.min(1, score));
  }

  private calculateEngagement(message: string): number {
    const length = message.length;
    const questionMarks = (message.match(/\?/g) || []).length;
    const exclamationMarks = (message.match(/!/g) || []).length;
    
    return this.normalizeScore(
      (length / 500) * 0.5 +
      (questionMarks / 3) * 0.3 +
      (exclamationMarks / 2) * 0.2
    );
  }
}