import type { ChannelStrategy } from './ChannelStrategy.js';
import type { Notification } from '@prisma/client';

export class EmailStrategy implements ChannelStrategy {
  readonly channelName = 'EMAIL';

  async send(notification: Notification): Promise<boolean> {
    console.log(`[EmailStrategy] Sending email to user ${notification.userId}`);
    // Here you would integrate SendGrid or AWS SES as per requirement 4.6.3
    // For now, we simulate a successful send
    return true;
  }
}