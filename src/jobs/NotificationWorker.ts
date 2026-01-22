import { rabbitMQ } from "../lib/rabbitmq.js";
import { prisma } from "../lib/db.js";
import { ChannelService } from "../services/ChannelService.js";

const channelService = new ChannelService();

export const startWorker = async () => {
  const channel = rabbitMQ.getChannel();
  if (!channel) return;

  console.log("🚀 Worker started: Listening for notification events...");

  channel.consume("notification_queue", async (msg) => {
    if (!msg) return;

    const { notificationId } = JSON.parse(msg.content.toString());

    try {
      // Fetch notification details from DB
      const notification = await prisma.notification.findUnique({
        where: { id: notificationId },
      });

      if (notification && notification.status === "PENDING") {
        // Requirement 4.5.2: Use ChannelService (Strategy Pattern)
        const strategy = channelService.getStrategy(notification.channel);

        // Requirement 4.6.11: Exponential Backoff (Simplified for now)
        const success = await strategy.send(notification);

        if (success) {
          // Requirement 4.4.2: Mark as sent
          await prisma.notification.update({
            where: { id: notificationId },
            data: {
              status: "SENT",
              sentAt: new Date(),
            },
          });
        }
      }

      // Acknowledge that the message has been processed
      channel.ack(msg);
    } catch (error) {
      console.error(`Error processing notification ${notificationId}:`, error);

      // If failed, re-queue the message for retry (Requirement 4.6.11)
      // In a production app, we would increment retry_count here
      channel.nack(msg, false, true);
    }
  });
};
