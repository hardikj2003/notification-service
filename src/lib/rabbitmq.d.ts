import type { Channel } from "amqplib";
declare class RabbitMQ {
    private connection;
    private channel;
    private readonly QUEUE_NAME;
    connect(): Promise<void>;
    sendToQueue(data: {
        notificationId: string;
    }): Promise<void>;
    getChannel(): Channel | null;
    close(): Promise<void>;
}
export declare const rabbitMQ: RabbitMQ;
export {};
//# sourceMappingURL=rabbitmq.d.ts.map