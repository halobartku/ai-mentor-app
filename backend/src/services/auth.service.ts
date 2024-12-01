import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';

export interface UserCredentials {
  email: string;
  password: string;
}

export class AuthService {
  private static generateToken(userId: string): string {
    return jwt.sign(
      { userId },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
  }

  static async signup(credentials: UserCredentials & { name?: string }) {
    const existingUser = await prisma.user.findUnique({
      where: { email: credentials.email }
    });

    if (existingUser) {
      throw new AppError(400, 'Email already registered');
    }

    const hashedPassword = await bcrypt.hash(credentials.password, 10);

    const user = await prisma.user.create({
      data: {
        email: credentials.email,
        password: hashedPassword,
        name: credentials.name
      }
    });

    const token = this.generateToken(user.id);

    return { user, token };
  }

  static async login({ email, password }: UserCredentials) {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new AppError(401, 'Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new AppError(401, 'Invalid credentials');
    }

    const token = this.generateToken(user.id);

    return { user, token };
  }
}