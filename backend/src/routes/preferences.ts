import { Router } from 'express';
import { PreferencesController } from '../controllers/preferences.controller';
import { authenticate } from '../middleware/auth';
import { validatePreferences } from '../middleware/validation';

const router = Router();

router.get(
  '/',
  authenticate,
  PreferencesController.getUserPreferences
);

router.patch(
  '/',
  authenticate,
  validatePreferences,
  PreferencesController.updatePreferences
);

router.get(
  '/behavior',
  authenticate,
  PreferencesController.getLearningBehavior
);

export { router as preferencesRoutes };