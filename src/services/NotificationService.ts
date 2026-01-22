import { prisma } from "../lib/db.js";
import { rabbitMQ } from "../lib/rabbitmq.js";
import { TemplateService } from "./TemplateService.js";

export class NotificationService {
  static async sendNotification(payload: {
    userId: string;
    templateId: string;
    variables: Record<string, any>;
    channel: string;
    priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  }) {
    // 1. Fetch Template
    const template = await TemplateService.getTemplate(payload.templateId);
    if (!template) throw new Error("Template not found");

    // 2. Variable Substitution (Requirement 4.2.2)
    // We determine which content to use based on the channel
    const content = TemplateService.substitute(
      template.emailBodyHtml || template.smsContent || template.inAppBody || "",
      payload.variables,
    );

    // 3. Create Notification Record (Status: PENDING)
    const notification = await prisma.notification.create({
      data: {
        userId: payload.userId,
        templateId: payload.templateId,
        category: template.category,
        channel: payload.channel,
        priority: payload.priority || "MEDIUM",
        content: content,
        status: "PENDING",
      },
    });

    // 4. Push to RabbitMQ (Requirement 4.6.1)
    await rabbitMQ.sendToQueue({ notificationId: notification.id });

    return notification;
  }
}
