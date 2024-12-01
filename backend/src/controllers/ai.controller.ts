import { Request, Response, NextFunction } from 'express';
import { AIService } from '../services/ai.service';

export class AIController {
  static async getMentorResponse(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const { message } = req.body;

      if (!userId) {
        throw new Error('User ID is required');
      }

      const result = await AIService.generateMentorResponse(userId, message);

      res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}