import type { ChannelStrategy } from './ChannelStrategy.js';
import type { Notification } from '@prisma/client';
export declare class EmailStrategy implements ChannelStrategy {
    readonly channelName = "EMAIL";
    send(notification: Notification): Promise<boolean>;
}
//# sourceMappingURL=EmailStrategy.d.ts.map