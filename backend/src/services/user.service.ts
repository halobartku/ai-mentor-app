import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import bcrypt from 'bcrypt';

export class UserService {
  static async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscription: true,
        goals: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  static async updateProfile(userId: string, data: {
    name?: string;
    email?: string;
    currentPassword?: string;
    newPassword?: string;
  }) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    if (data.newPassword) {
      if (!data.currentPassword) {
        throw new AppError(400, 'Current password is required');
      }

      const isValidPassword = await bcrypt.compare(data.currentPassword, user.password);
      if (!isValidPassword) {
        throw new AppError(401, 'Current password is incorrect');
      }

      data.newPassword = await bcrypt.hash(data.newPassword, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        email: data.email,
        password: data.newPassword || undefined
      }
    });

    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  static async deleteAccount(userId: string) {
    await prisma.user.delete({
      where: { id: userId }
    });
  }
}