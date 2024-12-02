export class AIPipelineService extends BaseService {
  private cacheService: CacheService;

  constructor() {
    super();
    this.cacheService = new CacheService();
  }

  async processInput(input: string, context: ConversationContext): Promise<AIResponse> {
    const cacheKey = this.cacheService.generateCacheKey(input, context);
    const cached = await this.cacheService.getCachedResponse(cacheKey);
    
    if (cached) return cached;

    const [rationalAnalysis, processBreakdown] = await Promise.all([
      this.rationalAdvisor.analyze(input, context),
      this.processAdvisor.analyze(input, context)
    ]);

    const response = await this.generateMentorResponse(
      input, 
      rationalAnalysis, 
      processBreakdown
    );

    await this.cacheService.cacheResponse(cacheKey, response);
    return response;
  }
}