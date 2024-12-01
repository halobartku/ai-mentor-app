import { Server, Socket } from 'socket.io';
import { prisma } from '../config/database';
import { logger } from '../utils/logger';

export class RealtimeService {
  private io: Server;
  private userSockets: Map<string, Set<string>> = new Map();

  constructor(io: Server) {
    this.io = io;
    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket: Socket) => {
      const userId = socket.handshake.auth.userId;
      if (!userId) {
        socket.disconnect();
        return;
      }

      this.handleUserConnection(socket, userId);
      this.setupMessageHandlers(socket, userId);
      this.setupTypingHandlers(socket);
      this.setupPresenceHandlers(socket, userId);

      socket.on('disconnect', () => {
        this.handleUserDisconnection(socket, userId);
      });
    });
  }

  private handleUserConnection(socket: Socket, userId: string) {
    // Add socket to user's socket set
    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, new Set());
    }
    this.userSockets.get(userId)?.add(socket.id);

    // Join user's personal room
    socket.join(`user:${userId}`);

    // Notify user's contacts about online status
    this.broadcastUserPresence(userId, true);

    logger.info(`User connected: ${userId}`, { socketId: socket.id });
  }

  private handleUserDisconnection(socket: Socket, userId: string) {
    // Remove socket from user's socket set
    this.userSockets.get(userId)?.delete(socket.id);
    if (this.userSockets.get(userId)?.size === 0) {
      this.userSockets.delete(userId);
      // Only broadcast offline status if user has no other active connections
      this.broadcastUserPresence(userId, false);
    }

    logger.info(`User disconnected: ${userId}`, { socketId: socket.id });
  }

  private setupMessageHandlers(socket: Socket, userId: string) {
    socket.on('message:send', async (data: {
      content: string;
      chatId?: string;
    }) => {
      try {
        // Store message
        const message = await prisma.message.create({
          data: {
            content: data.content,
            role: 'user',
            chat: data.chatId ? {
              connect: { id: data.chatId }
            } : {
              create: {
                userId
              }
            }
          },
          include: {
            chat: true
          }
        });

        // Emit message to room
        socket.to(`chat:${message.chat.id}`).emit('message:received', {
          messageId: message.id,
          content: message.content,
          senderId: userId,
          timestamp: message.createdAt
        });

      } catch (error) {
        logger.error('Error handling message', { error, userId, data });
        socket.emit('message:error', {
          error: 'Failed to send message'
        });
      }
    });
  }

  private setupTypingHandlers(socket: Socket) {
    socket.on('typing:start', (chatId: string) => {
      socket.to(`chat:${chatId}`).emit('typing:update', {
        userId: socket.handshake.auth.userId,
        isTyping: true
      });
    });

    socket.on('typing:stop', (chatId: string) => {
      socket.to(`chat:${chatId}`).emit('typing:update', {
        userId: socket.handshake.auth.userId,
        isTyping: false
      });
    });
  }

  private setupPresenceHandlers(socket: Socket, userId: string) {
    socket.on('presence:update', (status: string) => {
      this.broadcastUserPresence(userId, status !== 'away');
    });
  }

  private async broadcastUserPresence(userId: string, isOnline: boolean) {
    // Get user's contacts or group members
    const chats = await prisma.chat.findMany({
      where: {
        OR: [
          { userId },
          { messages: { some: { chat: { userId } } } }
        ]
      },
      select: {
        id: true
      }
    });

    // Broadcast presence to all relevant chat rooms
    chats.forEach(chat => {
      this.io.to(`chat:${chat.id}`).emit('presence:update', {
        userId,
        isOnline,
        timestamp: new Date()
      });
    });
  }

  // Public methods for external use
  public sendNotification(userId: string, notification: any) {
    this.io.to(`user:${userId}`).emit('notification', notification);
  }

  public broadcastToChat(chatId: string, event: string, data: any) {
    this.io.to(`chat:${chatId}`).emit(event, data);
  }

  public isUserOnline(userId: string): boolean {
    return this.userSockets.has(userId);
  }
}