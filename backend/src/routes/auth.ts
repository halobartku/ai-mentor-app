import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validateSignup, validateLogin } from '../middleware/validation';

const router = Router();

router.post('/signup', validateSignup, AuthController.signup);
router.post('/login', validateLogin, AuthController.login);

export { router as authRoutes };