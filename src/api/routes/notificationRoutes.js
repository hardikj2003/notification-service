import { Router } from "express";
import { sendNotification, sendBulkNotification, getNotifications, getNotificationById, markAsRead, markAllAsRead, deleteNotification, } from "../controllers/NotificationController.js";
const router = Router();
// POST /api/v1/notifications/send & send-bulk
router.post("/send", sendNotification);
router.post("/send-bulk", sendBulkNotification);
// GET /api/v1/notifications (with query params: page, size, status, etc.)
router.get("/", getNotifications);
router.get("/:id", getNotificationById);
// PATCH mark as read
router.patch("/read-all", markAllAsRead);
router.patch("/:id/read", markAsRead);
// DELETE notification
router.delete("/:id", deleteNotification);
export default router;
//# sourceMappingURL=notificationRoutes.js.map