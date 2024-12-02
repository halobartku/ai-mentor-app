    if (delta.mood > 0.1) {
      guidance += '- Gradually elevate mood through encouraging language\n';
    } else if (delta.mood < -0.1) {
      guidance += '- Acknowledge challenges while maintaining supportive tone\n';
    }

    if (delta.stress < -0.1) {
      guidance += '- Use calming language and reassuring metaphors\n';
      guidance += '- Break down complex topics into manageable steps\n';
    }

    if (delta.engagement > 0.1) {
      guidance += '- Incorporate interactive elements and thought-provoking questions\n';
      guidance += '- Use vivid examples and relatable scenarios\n';
    }

    if (delta.confidence > 0.1) {
      guidance += '- Highlight past successes and current capabilities\n';
      guidance += '- Frame challenges as growth opportunities\n';
    }

    return guidance;
  }

  private async formatConversationContext(context: EnrichedContext): Promise<string> {
    // Create a comprehensive context that includes both conversation history
    // and identified patterns
    let formattedContext = 'Conversation Context:\n';

    // Add recent topics with their significance
    if (context.context.recentTopics.length > 0) {
      formattedContext += '\nRecent Topics:\n';
      context.context.recentTopics.forEach(topic => {
        formattedContext += `- ${topic}\n`;
      });
    }

    // Add successful patterns to reinforce
    if (context.relevantPatterns.successes.length > 0) {
      formattedContext += '\nSuccessful Approaches:\n';
      context.relevantPatterns.successes.forEach(([pattern, strength]) => {
        formattedContext += `- ${pattern} (confidence: ${(strength * 100).toFixed(1)}%)\n`;
      });
    }

    // Add areas that need attention
    if (context.relevantPatterns.challenges.length > 0) {
      formattedContext += '\nAreas for Growth:\n';
      context.relevantPatterns.challenges.forEach(challenge => {
        formattedContext += `- ${challenge}\n`;
      });
    }

    return formattedContext;
  }

  private async calculateEmotionalAlignment(
    actual: EmotionalState,
    target: EmotionalState
  ): Promise<number> {
    // Calculate weighted alignment across all emotional dimensions
    const weights = {
      mood: 0.3,
      stress: 0.25,
      engagement: 0.25,
      confidence: 0.2
    };

    const alignments = {
      mood: 1 - Math.abs(actual.currentMood - target.currentMood),
      stress: 1 - Math.abs(actual.stressLevel - target.stressLevel),
      engagement: 1 - Math.abs(actual.engagementScore - target.engagementScore),
      confidence: 1 - Math.abs(actual.confidenceLevel - target.confidenceLevel)
    };

    return Object.entries(alignments).reduce(
      (total, [dimension, value]) => total + (value * weights[dimension]),
      0
    );
  }

  private async calculateContextualRelevance(
    response: string,
    context: EnrichedContext
  ): Promise<number> {
    // Analyze how well the response addresses the context
    const topicRelevance = await this.analyzeTopicRelevance(response, context.context.recentTopics);
    const patternAlignment = await this.analyzePatternAlignment(response, context.relevantPatterns);
    const challengeAddressing = await this.analyzeChallengeAddressing(response, context.relevantPatterns.challenges);

    // Weight the different aspects of relevance
    return (
      topicRelevance * 0.4 +
      patternAlignment * 0.3 +
      challengeAddressing * 0.3
    );
  }

  private async regenerateResponse(params: RegenerationParams): Promise<AIResponse> {
    // Adjust the model configuration for better emotional alignment
    const adjustedConfig = await this.adjustModelConfig({
      original: params.modelConfig,
      targetEmotional: params.targetEmotionalState,
      previousAttempt: params.originalResponse
    });

    // Generate a new response with the adjusted configuration
    return this.generateTargetedResponse({
      ...params,
      modelConfig: adjustedConfig,
      attemptCount: (params.attemptCount || 0) + 1
    });
  }

  private async adjustModelConfig(params: ConfigAdjustmentParams): Promise<ModelConfig> {
    // Fine-tune the model parameters based on previous attempt
    return {
      ...params.original,
      temperature: this.adjustTemperature(params),
      topP: this.adjustTopP(params),
      maxTokens: this.adjustMaxTokens(params)
    };
  }

  private adjustTemperature(params: ConfigAdjustmentParams): number {
    // Adjust temperature based on emotional alignment needs
    const baseTemp = params.original.temperature;
    const emotionalDelta = this.calculateEmotionalDelta(
      params.targetEmotional,
      params.previousAttempt.emotionalState
    );

    // Increase temperature if we need more emotional variation
    if (emotionalDelta > 0.3) {
      return Math.min(baseTemp + 0.1, 1.0);
    }
    // Decrease temperature if we need more focused responses
    if (emotionalDelta < 0.1) {
      return Math.max(baseTemp - 0.1, 0.1);
    }
    return baseTemp;
  }

  private async handleResponseGenerationError(
    error: any,
    params: TargetedResponseParams
  ): Promise<void> {
    // Log the error with context for analysis
    await this.logger.error('Response generation failed', {
      error,
      contextSnapshot: this.createErrorContext(params),
      timestamp: new Date()
    });

    // Adjust system configuration if needed
    await this.performErrorRecovery(error, params);
  }
}