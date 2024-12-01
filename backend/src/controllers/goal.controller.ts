import { Request, Response, NextFunction } from 'express';
import { GoalService } from '../services/goal.service';

export class GoalController {
  static async createGoal(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) throw new Error('User ID is required');

      const goal = await GoalService.createGoal(userId, req.body);
      
      res.status(201).json({
        status: 'success',
        data: goal
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateGoalStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const { goalId } = req.params;
      const { status } = req.body;

      if (!userId) throw new Error('User ID is required');

      const updatedGoal = await GoalService.updateGoalStatus(userId, goalId, status);
      
      res.status(200).json({
        status: 'success',
        data: updatedGoal
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteGoal(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const { goalId } = req.params;

      if (!userId) throw new Error('User ID is required');

      await GoalService.deleteGoal(userId, goalId);
      
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  static async getUserGoals(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) throw new Error('User ID is required');

      const goals = await GoalService.getUserGoals(userId);
      
      res.status(200).json({
        status: 'success',
        data: goals
      });
    } catch (error) {
      next(error);
    }
  }
}