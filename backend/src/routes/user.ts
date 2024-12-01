import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { GoalController } from '../controllers/goal.controller';
import { authenticate } from '../middleware/auth';
import { validateProfileUpdate, validateGoal } from '../middleware/validation';

const router = Router();

// User profile routes
router.get('/profile', authenticate, UserController.getProfile);
router.patch('/profile', authenticate, validateProfileUpdate, UserController.updateProfile);
router.delete('/profile', authenticate, UserController.deleteAccount);

// Goals routes
router.get('/goals', authenticate, GoalController.getUserGoals);
router.post('/goals', authenticate, validateGoal, GoalController.createGoal);
router.patch('/goals/:goalId/status', authenticate, GoalController.updateGoalStatus);
router.delete('/goals/:goalId', authenticate, GoalController.deleteGoal);

export { router as userRoutes };