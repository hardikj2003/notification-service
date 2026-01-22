import { SocketService } from '../SocketService.js';
export class InAppStrategy {
    channelName = 'IN_APP';
    async send(notification) {
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
//# sourceMappingURL=InAppStrategy.js.map