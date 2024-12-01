import { Router } from 'express';
import { MonitoringController } from '../controllers/monitoring.controller';
import { authenticate } from '../middleware/auth';
import { requireAdmin } from '../middleware/admin';

const router = Router();

router.get(
  '/health',
  authenticate,
  requireAdmin,
  MonitoringController.getSystemHealth
);

router.get(
  '/ai-metrics',
  authenticate,
  requireAdmin,
  MonitoringController.getAIMetrics
);

router.get(
  '/errors',
  authenticate,
  requireAdmin,
  MonitoringController.getErrorLogs
);

export { router as monitoringRoutes };