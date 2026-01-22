import { Router } from "express";
import {
  subscribe,
  unsubscribe,
} from "../controllers/SubscriptionController.js";

const router = Router();

// POST & DELETE /api/v1/notifications/push/subscribe & unsubscribe
router.post("/subscribe", subscribe);
router.delete("/unsubscribe", unsubscribe);

export default router;
