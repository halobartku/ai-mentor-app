export class AIPipelineService extends BaseService {
  private monitoring: MonitoringService;

  constructor() {
    super();
    this.monitoring = new MonitoringService();
  }

  async processInput(input: string, context: ConversationContext): Promise<AIResponse> {
    const start = Date.now();
    try {
      const response = await this.generateResponse(input, context);
      
      this.monitoring.logAPICall('ai_pipeline', Date.now() - start, true);
      this.monitoring.logPerformanceMetric({
        name: 'response_time',
        value: Date.now() - start
      });
      
      return response;
    } catch (error) {
      this.monitoring.logError(error, { input, context });
      this.monitoring.logAPICall('ai_pipeline', Date.now() - start, false);
      throw error;
    }
  }
}