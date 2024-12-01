import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';

export interface GoalInput {
  title: string;
  description?: string;
  deadline?: Date;
}

export class GoalService {
  static async createGoal(userId: string, goalData: GoalInput) {
    const goal = await prisma.goal.create({
      data: {
        userId,
        ...goalData
      }
    });

    return goal;
  }

  static async updateGoalStatus(userId: string, goalId: string, status: string) {
    const goal = await prisma.goal.findFirst({
      where: {
        id: goalId,
        userId
      }
    });

    if (!goal) {
      throw new AppError(404, 'Goal not found');
    }

    return await prisma.goal.update({
      where: { id: goalId },
      data: { status }
    });
  }

  static async deleteGoal(userId: string, goalId: string) {
    const goal = await prisma.goal.findFirst({
      where: {
        id: goalId,
        userId
      }
    });

    if (!goal) {
      throw new AppError(404, 'Goal not found');
    }

    await prisma.goal.delete({
      where: { id: goalId }
    });
  }

  static async getUserGoals(userId: string) {
    return await prisma.goal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }
}