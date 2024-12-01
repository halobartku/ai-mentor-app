import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/user', authenticate, AnalyticsController.getUserAnalytics);
router.get('/insights', authenticate, AnalyticsController.getUserInsights);

export { router as analyticsRoutes };