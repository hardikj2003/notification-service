import express from "express";
import cors from "cors";
import { rabbitMQ } from "./lib/rabbitmq.js";
import { startWorker } from "./jobs/NotificationWorker.js";
import templateRoutes from "./api/routes/templateRoutes.js";
import notificationRoutes from "./api/routes/notificationRoutes.js";
import { createServer } from 'http'; // Required for Socket.io
import { SocketService } from './services/SocketService.js';

const app = express();
const httpServer = createServer(app);
app.use(cors());
app.use(express.json());

// API Endpoints (Requirement 4.4)
app.use("/api/v1/notifications/templates", templateRoutes);
app.use("/api/v1/notifications", notificationRoutes);

const bootstrap = async () => {
  try {
    await rabbitMQ.connect();
    
    // Initialize WebSockets (Requirement 4.6.6 & 4.6.12)
    await SocketService.init(httpServer);

    await startWorker();

    const PORT = process.env.PORT || 3000;
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server & WebSockets running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Initialization failed:', error);
  }
};

bootstrap();

export default app;
