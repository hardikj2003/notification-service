import amqp from "amqplib";
import type { Connection, Channel } from "amqplib";

class RabbitMQ {
  // Store connection and channel with specific types
  private connection: Connection | null = null;
  private channel: Channel | null = null;
  private readonly QUEUE_NAME = "notification_queue";

  async connect(): Promise<void> {
    try {
      // 1. Establish Connection
      const conn = await amqp.connect(
        process.env.RABBITMQ_URL || "amqp://localhost",
      );
      this.connection = conn as unknown as Connection;

      // 2. Create Channel and cast to the Channel interface
      // Using 'as any' then 'as Channel' is a common safe-guard for amqplib type mismatches
      const ch = await conn.createChannel();
      this.channel = ch as Channel;

      // 3. Ensure the queue is durable (Requirement 4.6.1)
      await this.channel.assertQueue(this.QUEUE_NAME, { durable: true });

      console.log("✅ Connected to RabbitMQ");
    } catch (error) {
      console.error("❌ RabbitMQ connection error:", error);
      throw error;
    }
  }

  async sendToQueue(data: { notificationId: string }): Promise<void> {
    if (!this.channel) {
      throw new Error(
        "RabbitMQ channel not initialized. Call connect() first.",
      );
    }

    // Requirement 4.6.1: Use RabbitMQ for notification queue
    this.channel.sendToQueue(
      this.QUEUE_NAME,
      Buffer.from(JSON.stringify(data)),
      { persistent: true }, // Saves message to disk
    );
  }

  getChannel(): Channel | null {
    return this.channel;
  }

  // Good practice: requirement 4.6 suggests reliability, so handle closing
  async close(): Promise<void> {
    await this.channel?.close();
    await (this.connection as any)?.close();
  }
}

export const rabbitMQ = new RabbitMQ();
