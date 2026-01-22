import express from "express";
import cors from "cors";
import { rabbitMQ } from "./lib/rabbitmq.js";
import { startWorker } from "./jobs/NotificationWorker.js";
import templateRoutes from "./api/routes/templateRoutes.js";
import notificationRoutes from "./api/routes/notificationRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

// API Endpoints (Requirement 4.4)
app.use("/api/v1/notifications/templates", templateRoutes);
app.use("/api/v1/notifications", notificationRoutes);

const bootstrap = async () => {
  try {
    // Connect to Broker
    await rabbitMQ.connect();

    // Start Worker to handle Section 4.6 (Technical Requirements)
    await startWorker();

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start the application:", error);
    process.exit(1);
  }
};

bootstrap();

export default app;
