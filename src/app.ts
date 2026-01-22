import express from "express";
import cors from "cors";
import templateRoutes from "./api/routes/templateRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// API Versioning as per assignment
app.use("/api/v1/notifications/templates", templateRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Notification Service running on port ${PORT}`);
});

export default app;
