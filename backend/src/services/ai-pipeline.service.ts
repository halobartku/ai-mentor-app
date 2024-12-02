import { BaseService } from './base.service';
import { retry } from '@/utils/retry';
import { AIPipelineError } from '@/errors/AIPipelineError';

export class AIPipelineService extends BaseService {
  async processInput(input: string, context: ConversationContext): Promise<AIResponse> {
    try {
      const [rationalAnalysis, processBreakdown] = await Promise.all([
        retry(() => this.rationalAdvisor.analyze(input, context), {
          maxAttempts: 3,
          delayMs: 1000,
          errorType: 'ADVISOR_ERROR'
        }),
        retry(() => this.processAdvisor.analyze(input, context), {
          maxAttempts: 3,
          delayMs: 1000,
          errorType: 'ADVISOR_ERROR'
        })
      ]);

      const response = await retry(
        () => this.generateMentorResponse(input, rationalAnalysis, processBreakdown),
        {
          maxAttempts: 3,
          delayMs: 2000,
          errorType: 'MENTOR_ERROR'
        }
      );

      return response;

    } catch (error) {
      await this.errorLogger.logError(error);
      throw new AIPipelineError(error);
    }
  }

  private async generateMentorResponse(input: string, rational: any, process: any) {
    const enrichedPrompt = this.constructEnrichedPrompt(input, rational, process);
    const start = Date.now();

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-opus-20240229',
        messages: [{ role: 'user', content: enrichedPrompt }],
        temperature: 0.7,
        stream: true
      });

      return {
        content: response.content[0].text,
        analysis: { rational, process },
        emotionalState: await this.emotionalProcessor.analyze(response.content[0].text),
        metadata: {
          processingTime: Date.now() - start,
          attempts: 1
        }
      };
    } catch (error) {
      throw new Error(`Mentor response generation failed: ${error.message}`);
    }
  }
}