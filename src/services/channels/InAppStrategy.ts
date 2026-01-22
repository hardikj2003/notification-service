import type { ChannelStrategy } from './ChannelStrategy.js';
import type { Notification } from '@prisma/client';
import { SocketService } from '../SocketService.js';

export class InAppStrategy implements ChannelStrategy {
  readonly channelName = 'IN_APP';

  async send(notification: Notification): Promise<boolean> {
    console.log(`[InAppStrategy] Pushing real-time alert to user ${notification.userId}`);
    
    SocketService.sendToUser(notification.userId, {
      id: notification.id,
      title: notification.subject,
      body: notification.content,
      metadata: notification.metadata,
      createdAt: notification.createdAt
    });

    return true; // Socket emission is fire-and-forget in this context
  }
}