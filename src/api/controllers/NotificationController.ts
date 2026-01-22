import type { Request, Response } from "express";
import { NotificationService } from "../../services/NotificationService.js";

export const sendNotification = async (req: Request, res: Response) => {
  try {
    const result = await NotificationService.sendNotification(req.body);

    // Check if the notification was deferred due to Quiet Hours
    if ("status" in result && result.status === "DEFERRED_QUIET_HOURS") {
      return res.status(202).json({
        message: "Notification deferred due to user quiet hours",
        status: result.status,
      });
    }

    // Otherwise, it's a standard queued notification (Requirement 4.4.2)
    // We cast to 'any' or check for 'id' to satisfy the compiler
    res.status(202).json({
      message: "Notification queued",
      notificationId: (result as any).id,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
