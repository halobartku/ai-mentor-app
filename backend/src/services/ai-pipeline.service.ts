import { BaseService } from './base.service';
import { RationalAdvisor } from './advisors/rational.advisor';
import { ProcessAdvisor } from './advisors/process.advisor';
import { MentorService } from './mentor.service';

export class AIPipelineService extends BaseService {
  private rationalAdvisor: RationalAdvisor;
  private processAdvisor: ProcessAdvisor;
  private mentor: MentorService;

  async processInput(input: string, context: ConversationContext): Promise<AIResponse> {
    const [rationalAnalysis, processBreakdown] = await Promise.all([
      this.rationalAdvisor.analyze(input, context),
      this.processAdvisor.analyze(input, context)
    ]);

    const enrichedPrompt = `As a mentor, synthesize this analysis into a single, comprehensive response:

User Input: ${input}

Rational Analysis:
${JSON.stringify(rationalAnalysis)}

Process Breakdown:
${JSON.stringify(processBreakdown)}

Provide a response that:
1. Integrates logical analysis and practical steps
2. Maintains a supportive, mentoring tone
3. Offers clear, actionable guidance
4. Acknowledges both challenges and opportunities`;

    const response = await this.anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      messages: [{ role: 'user', content: enrichedPrompt }],
      temperature: 0.7,
      stream: true
    });

    return {
      content: response.content[0].text,
      analysis: { rational: rationalAnalysis, process: processBreakdown },
      emotionalState: await this.emotionalProcessor.analyze(response.content[0].text)
    };
  }
}