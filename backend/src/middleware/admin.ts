import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { AppError } from './errorHandler';

export const requireAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError(401, 'Authentication required');
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user?.isAdmin) {
      throw new AppError(403, 'Admin access required');
    }

    next();
  } catch (error) {
    next(error);
  }
};