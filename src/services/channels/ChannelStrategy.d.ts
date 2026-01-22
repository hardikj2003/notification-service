import type { Notification } from '@prisma/client';
export interface ChannelStrategy {
    channelName: string;
    send(notification: Notification): Promise<boolean>;
}
//# sourceMappingURL=ChannelStrategy.d.ts.map