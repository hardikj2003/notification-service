import type { ChannelStrategy } from './ChannelStrategy.js';
import type { Notification } from '@prisma/client';
export declare class InAppStrategy implements ChannelStrategy {
    readonly channelName = "IN_APP";
    send(notification: Notification): Promise<boolean>;
}
//# sourceMappingURL=InAppStrategy.d.ts.map