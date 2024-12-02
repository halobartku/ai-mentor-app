import { BaseService } from './base.service';
import { EmotionalState, ConversationContext, AIResponse } from '../types/ai.types';
import { EmotionalProcessor } from './emotional-processor.service';

export class AIResponseGenerator extends BaseService {
  private readonly emotionalProcessor: EmotionalProcessor;
  private readonly anthropic: Anthropic;

  constructor() {
    super();
    this.emotionalProcessor = new EmotionalProcessor();
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });
  }

  async generateResponse(
    message: string,
    context: ConversationContext
  ): Promise<AIResponse> {
    const emotionalState = await this.emotionalProcessor.analyze(message);
    const targetState = await this.emotionalProcessor.projectOptimalState(emotionalState);
    
    const response = await this.anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      messages: [{
        role: 'user',
        content: await this.constructPrompt(message, context, emotionalState, targetState)
      }]
    });

    const aiResponse = {
      content: response.content[0].text,
      emotionalState: await this.emotionalProcessor.analyze(response.content[0].text),
      contextualRelevance: await this.calculateRelevance(response.content[0].text, context)
    };

    return aiResponse;
  }

  private async constructPrompt(
    message: string,
    context: ConversationContext,
    currentState: EmotionalState,
    targetState: EmotionalState
  ): Promise<string> {
    return `You are an emotionally intelligent AI mentor.
Current emotional state: ${JSON.stringify(currentState)}
Target emotional state: ${JSON.stringify(targetState)}

Recent topics: ${context.recentTopics.join(', ')}

User message: ${message}`;
  }

  private async calculateRelevance(response: string, context: ConversationContext): Promise<number> {
    const topicMatches = context.recentTopics.filter(topic =>
      response.toLowerCase().includes(topic.toLowerCase())
    ).length;
    
    return topicMatches / Math.max(context.recentTopics.length, 1);
  }
}