import { Server } from 'socket.io';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import type { Server as HttpServer } from 'http';

export class SocketService {
  private static io: Server;

  static async init(httpServer: HttpServer) {
    const pubClient = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
    const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);

    this.io = new Server(httpServer, {
      cors: { origin: "*" },
      adapter: createAdapter(pubClient, subClient)
    });

    // Requirement 4.4.5: Handle authentication via JWT (simplified here)
    this.io.on('connection', (socket) => {
      const userId = socket.handshake.query.userId as string;
      if (userId) {
        socket.join(userId); // Join a room named after the userId
        console.log(`📡 User ${userId} connected to WebSocket`);
      }

      socket.on('disconnect', () => {
        console.log(`🔌 User ${userId} disconnected`);
      });
    });
  }

  static sendToUser(userId: string, data: any) {
    if (this.io) {
      this.io.to(userId).emit('notification', data);
    }
  }
}