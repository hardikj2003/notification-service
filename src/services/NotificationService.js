import { prisma } from "../lib/db.js";
import { rabbitMQ } from "../lib/rabbitmq.js";
import { TemplateService } from "./TemplateService.js";
import { RateLimitService } from "./RateLimitService.js";
import { PreferenceService } from "./PreferenceService.js";
export class NotificationService {
    /**
     * Main entry point for sending a single notification.
     * Handles validation, preferences, rate limiting, and queuing.
     */
    static async sendNotification(payload) {
        const { userId, templateId, channel, variables, priority = "MEDIUM", } = payload;
        // 1. Fetch the template
        const template = await TemplateService.getTemplate(templateId);
        if (!template) {
            throw new Error(`Template with ID ${templateId} not found or inactive.`);
        }
        // 2. Check Rate Limiting (Requirement 4.6.9)
        const isLimited = await RateLimitService.isRateLimited(userId);
        if (isLimited) {
            throw new Error("Action blocked: User has reached the daily notification limit.");
        }
        // 3. Check User Preferences & Quiet Hours (Requirement 4.6.10)
        const inQuietHours = await PreferenceService.isInQuietHours(userId, template.category);
        if (inQuietHours) {
            console.log(`[NotificationService] User ${userId} is in quiet hours. Task deferred.`);
            return { status: "DEFERRED_QUIET_HOURS" };
        }
        // 4. Perform Variable Substitution (Requirement 4.2.2)
        let rawContent = "";
        switch (channel) {
            case "EMAIL":
                rawContent = template.emailBodyHtml || "";
                break;
            case "SMS":
                rawContent = template.smsContent || "";
                break;
            case "IN_APP":
                rawContent = template.inAppBody || "";
                break;
            case "PUSH":
                rawContent = template.pushBody || "";
                break;
            default:
                rawContent = template.emailBodyText || "";
        }
        const processedContent = TemplateService.substitute(rawContent, variables);
        // FIX: Prisma optional fields usually expect 'null' for empty values, not 'undefined'
        const processedSubject = template.emailSubject
            ? TemplateService.substitute(template.emailSubject, variables)
            : null;
        // 5. Create the Notification record (Requirement 4.3)
        const notification = await prisma.notification.create({
            data: {
                userId,
                template: { connect: { id: templateId } }, // Cleaner way to handle the relation
                category: template.category,
                channel,
                priority: priority,
                subject: processedSubject,
                content: processedContent,
                status: "PENDING",
                metadata: variables,
            },
        });
        // 6. Push to RabbitMQ (Requirement 4.6.1)
        await rabbitMQ.sendToQueue({
            notificationId: notification.id,
        });
        return notification;
    }
    /**
     * Bulk Notification Logic (Requirement 4.4.2)
     */
    static async sendBulkNotifications(payload) {
        const batch = await Promise.all(payload.userIds.map((id) => this.sendNotification({
            userId: id,
            templateId: payload.templateId,
            variables: payload.variables,
            channel: payload.channel,
        }).catch((err) => ({ userId: id, error: err.message }))));
        return batch;
    }
}
//# sourceMappingURL=NotificationService.js.map