export declare class NotificationService {
    /**
     * Main entry point for sending a single notification.
     * Handles validation, preferences, rate limiting, and queuing.
     */
    static sendNotification(payload: {
        userId: string;
        templateId: string;
        variables: Record<string, any>;
        channel: string;
        priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
    }): Promise<{
        id: string;
        category: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        templateId: string;
        priority: import("@prisma/client").$Enums.Priority;
        channel: string;
        status: import("@prisma/client").$Enums.NotificationStatus;
        subject: string | null;
        content: string | null;
        contentHtml: string | null;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
        actionUrl: string | null;
        actionLabel: string | null;
        imageUrl: string | null;
        scheduledFor: Date | null;
        sentAt: Date | null;
        deliveredAt: Date | null;
        readAt: Date | null;
        failedAt: Date | null;
        failureReason: string | null;
        retryCount: number;
        maxRetries: number;
    } | {
        status: string;
    }>;
    /**
     * Bulk Notification Logic (Requirement 4.4.2)
     */
    static sendBulkNotifications(payload: {
        userIds: string[];
        templateId: string;
        variables: Record<string, any>;
        channel: string;
    }): Promise<({
        id: string;
        category: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        templateId: string;
        priority: import("@prisma/client").$Enums.Priority;
        channel: string;
        status: import("@prisma/client").$Enums.NotificationStatus;
        subject: string | null;
        content: string | null;
        contentHtml: string | null;
        metadata: import("@prisma/client/runtime/client").JsonValue | null;
        actionUrl: string | null;
        actionLabel: string | null;
        imageUrl: string | null;
        scheduledFor: Date | null;
        sentAt: Date | null;
        deliveredAt: Date | null;
        readAt: Date | null;
        failedAt: Date | null;
        failureReason: string | null;
        retryCount: number;
        maxRetries: number;
    } | {
        status: string;
    } | {
        userId: string;
        error: any;
    })[]>;
}
//# sourceMappingURL=NotificationService.d.ts.map