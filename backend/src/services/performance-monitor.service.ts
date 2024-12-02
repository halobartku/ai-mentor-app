import { BaseService } from './base.service';
import { SystemMetrics, PerformanceThresholds } from '../types/monitoring.types';

export class PerformanceMonitor extends BaseService {
  private readonly metricsCollector: MetricsCollector;
  private readonly thresholdManager: ThresholdManager;
  private readonly alertSystem: AlertSystem;

  constructor() {
    super();
    this.metricsCollector = new MetricsCollector();
    this.thresholdManager = new ThresholdManager();
    this.alertSystem = new AlertSystem();
  }

  async getCurrentMetrics(): Promise<SystemMetrics> {
    // Collect comprehensive system metrics
    const rawMetrics = await this.metricsCollector.collect();
    const analyzedMetrics = await this.analyzeMetrics(rawMetrics);
    
    // Check for performance issues
    await this.checkThresholds(analyzedMetrics);
    
    return analyzedMetrics;
  }

  private async analyzeMetrics(raw: RawMetrics): Promise<SystemMetrics> {
    // Calculate key performance indicators
    const responseTimeMetrics = this.calculateResponseTimeMetrics(raw.responseTimes);
    const throughputMetrics = this.calculateThroughputMetrics(raw.requests);
    const resourceMetrics = this.calculateResourceMetrics(raw.resources);
    const errorMetrics = this.calculateErrorMetrics(raw.errors);

    return {
      responseTime: responseTimeMetrics,
      throughput: throughputMetrics,
      resourceUtilization: resourceMetrics,
      errorRates: errorMetrics,
      timestamp: new Date()
    };
  }

  private calculateResponseTimeMetrics(responseTimes: number[]): ResponseTimeMetrics {
    const sorted = [...responseTimes].sort((a, b) => a - b);
    const len = sorted.length;

    return {
      average: responseTimes.reduce((a, b) => a + b, 0) / len,
      median: len % 2 === 0
        ? (sorted[len/2 - 1] + sorted[len/2]) / 2
        : sorted[Math.floor(len/2)],
      p95: sorted[Math.floor(len * 0.95)],
      p99: sorted[Math.floor(len * 0.99)]
    };
  }

  private calculateThroughputMetrics(requests: RequestData[]): ThroughputMetrics {
    const timeWindows = this.groupByTimeWindow(requests, 60); // 1-minute windows
    
    return {
      currentRps: this.calculateCurrentRps(requests),
      averageRps: this.calculateAverageRps(timeWindows),
      peakRps: this.calculatePeakRps(timeWindows),
      totalRequests: requests.length
    };
  }

  private calculateResourceMetrics(resources: ResourceData): ResourceMetrics {
    return {
      cpuUsage: this.calculateCpuUsage(resources.cpu),
      memoryUsage: this.calculateMemoryUsage(resources.memory),
      diskUsage: this.calculateDiskUsage(resources.disk),
      networkUsage: this.calculateNetworkUsage(resources.network)
    };
  }

  private calculateErrorMetrics(errors: ErrorData[]): ErrorMetrics {
    const total = errors.length;
    const grouped = this.groupErrors(errors);
    
    return {
      errorRate: total / this.metricsCollector.getTotalRequests(),
      errorTypes: grouped,
      criticalErrors: this.countCriticalErrors(errors),
      recentErrors: this.getRecentErrors(errors)
    };
  }

  private async checkThresholds(metrics: SystemMetrics): Promise<void> {
    const thresholds = await this.thresholdManager.getCurrentThresholds();
    const violations = this.findThresholdViolations(metrics, thresholds);
    
    if (violations.length > 0) {
      await this.handleThresholdViolations(violations);
    }
  }

  private findThresholdViolations(
    metrics: SystemMetrics,
    thresholds: PerformanceThresholds
  ): ThresholdViolation[] {
    const violations: ThresholdViolation[] = [];

    // Check response time thresholds
    if (metrics.responseTime.p95 > thresholds.maxP95ResponseTime) {
      violations.push({
        type: 'response_time',
        severity: 'high',
        value: metrics.responseTime.p95,
        threshold: thresholds.maxP95ResponseTime
      });
    }

    // Check error rate thresholds
    if (metrics.errorRates.errorRate > thresholds.maxErrorRate) {
      violations.push({
        type: 'error_rate',
        severity: 'critical',
        value: metrics.errorRates.errorRate,
        threshold: thresholds.maxErrorRate
      });
    }

    // Check resource utilization thresholds
    if (metrics.resourceUtilization.cpuUsage > thresholds.maxCpuUsage) {
      violations.push({
        type: 'cpu_usage',
        severity: 'medium',
        value: metrics.resourceUtilization.cpuUsage,
        threshold: thresholds.maxCpuUsage
      });
    }

    return violations;
  }

  private async handleThresholdViolations(violations: ThresholdViolation[]): Promise<void> {
    // Sort violations by severity
    const criticalViolations = violations.filter(v => v.severity === 'critical');
    const highViolations = violations.filter(v => v.severity === 'high');
    const mediumViolations = violations.filter(v => v.severity === 'medium');

    // Handle critical violations immediately
    if (criticalViolations.length > 0) {
      await this.alertSystem.sendCriticalAlert(criticalViolations);
      await this.initiateAutomaticMitigation(criticalViolations);
    }

    // Handle high-severity violations
    if (highViolations.length > 0) {
      await this.alertSystem.sendHighPriorityAlert(highViolations);
      await this.suggestMitigationStrategies(highViolations);
    }

    // Log medium-severity violations
    if (mediumViolations.length > 0) {
      await this.alertSystem.logWarning(mediumViolations);
    }
  }
}