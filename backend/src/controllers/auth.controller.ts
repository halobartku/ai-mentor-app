import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
  static async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, name } = req.body;
      const result = await AuthService.signup({ email, password, name });
      
      res.status(201).json({
        status: 'success',
        data: {
          user: { id: result.user.id, email: result.user.email, name: result.user.name },
          token: result.token
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login({ email, password });

      res.status(200).json({
        status: 'success',
        data: {
          user: { id: result.user.id, email: result.user.email, name: result.user.name },
          token: result.token
        }
      });
    } catch (error) {
      next(error);
    }
  }
}