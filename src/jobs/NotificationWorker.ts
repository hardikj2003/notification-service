import { rabbitMQ } from "../lib/rabbitmq.js";
import { prisma } from "../lib/db.js";
import { ChannelService } from "../services/ChannelService.js";
import { NotificationStatus } from "@prisma/client";

const channelService = new ChannelService();

export const startWorker = async () => {
  const channel = rabbitMQ.getChannel();
  if (!channel) return;

  channel.consume("notification_queue", async (msg) => {
    if (!msg) return;
    const { notificationId } = JSON.parse(msg.content.toString());

    try {
      const notification = await prisma.notification.findUnique({
        where: { id: notificationId },
      });

      if (!notification || notification.status === NotificationStatus.SENT) {
        return channel.ack(msg);
      }

      const strategy = channelService.getStrategy(notification.channel);
      const success = await strategy.send(notification);

      if (success) {
        await prisma.notification.update({
          where: { id: notificationId },
          data: { status: NotificationStatus.SENT, sentAt: new Date() },
        });
        channel.ack(msg);
      } else {
        throw new Error("Delivery failed");
      }
    } catch (error) {
      // Requirement 4.6.11: Implement exponential backoff for retries
      const notification = await prisma.notification.findUnique({
        where: { id: notificationId },
      });
      const retryCount = (notification?.retryCount || 0) + 1;

      if (retryCount <= (notification?.maxRetries || 3)) {
        // Calculate delay: 2^retryCount * 1000ms (1s, 2s, 4s, 8s...)
        const delay = Math.pow(2, retryCount) * 1000;

        await prisma.notification.update({
          where: { id: notificationId },
          data: { retryCount },
        });

        console.log(`Retrying notification ${notificationId} in ${delay}ms...`);

        // Re-queue with a delay (Simplified for RabbitMQ)
        setTimeout(() => {
          channel.nack(msg, false, true);
        }, delay);
      } else {
        // Mark as FAILED after max retries (Section 4.3)
        await prisma.notification.update({
          where: { id: notificationId },
          data: { status: NotificationStatus.FAILED, failedAt: new Date() },
        });
        channel.ack(msg);
      }
    }
  });
};
