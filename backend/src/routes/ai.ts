import { Router } from 'express';
import { AIController } from '../controllers/ai.controller';
import { authenticate } from '../middleware/auth';
import { validateMessage } from '../middleware/validation';

const router = Router();

router.post(
  '/chat',
  authenticate,
  validateMessage,
  AIController.getMentorResponse
);

export { router as aiRoutes };