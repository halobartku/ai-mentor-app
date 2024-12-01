import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';

export class SocketService {
  private io: Server;

  constructor(server: HttpServer) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        methods: ['GET', 'POST']
      }
    });

    this.setupMiddleware();
    this.setupEventHandlers();
  }

  private setupMiddleware(): void {
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        if (!token) {
          throw new Error('Authentication token required');
        }

        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET || 'your-secret-key'
        ) as { userId: string };

        const user = await prisma.user.findUnique({
          where: { id: decoded.userId }
        });

        if (!user) {
          throw new Error('User not found');
        }

        socket.data.userId = user.id;
        next();
      } catch (error) {
        next(error as Error);
      }
    });
  }

  private setupEventHandlers(): void {
    this.io.on('connection', (socket) => {
      console.log(`User connected: ${socket.data.userId}`);
      
      // Join user's personal room
      socket.join(`user:${socket.data.userId}`);

      socket.on('join_chat', (chatId: string) => {
        socket.join(`chat:${chatId}`);
      });

      socket.on('leave_chat', (chatId: string) => {
        socket.leave(`chat:${chatId}`);
      });

      socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.data.userId}`);
      });
    });
  }

  emitToUser(userId: string, event: string, data: any): void {
    this.io.to(`user:${userId}`).emit(event, data);
  }

  emitToChat(chatId: string, event: string, data: any): void {
    this.io.to(`chat:${chatId}`).emit(event, data);
  }

  broadcastToAll(event: string, data: any): void {
    this.io.emit(event, data);
  }
}

let instance: SocketService | null = null;

export const initializeSocket = (server: HttpServer): SocketService => {
  if (!instance) {
    instance = new SocketService(server);
  }
  return instance;
};

export const getSocketService = (): SocketService => {
  if (!instance) {
    throw new Error('Socket service not initialized');
  }
  return instance;
};