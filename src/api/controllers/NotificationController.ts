import type { Request, Response } from "express";
import { prisma } from "../../lib/db.js";
import { NotificationService } from "../../services/NotificationService.js";
import { NotificationStatus } from "@prisma/client";

// POST /api/v1/notifications/send (Requirement 4.4.2)
export const sendNotification = async (req: Request, res: Response) => {
  try {
    const result = await NotificationService.sendNotification(req.body);

    if ("status" in result && result.status === "DEFERRED_QUIET_HOURS") {
      return res.status(202).json({
        message: "Notification deferred due to user quiet hours",
        status: result.status,
      });
    }

    res.status(202).json({
      message: "Notification queued",
      notificationId: (result as any).id,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// POST /api/v1/notifications/send-bulk (Requirement 4.4.2)
export const sendBulkNotification = async (req: Request, res: Response) => {
  try {
    const batch = await NotificationService.sendBulkNotifications(req.body);
    res.status(202).json({ message: "Batch created", results: batch });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// GET /api/v1/notifications (Requirement 4.4.2)
export const getNotifications = async (req: Request, res: Response) => {
  const {
    userId,
    page = 1,
    size = 10,
    status,
    category,
    unreadOnly,
  } = req.query;
  const skip = (Number(page) - 1) * Number(size);

  try {
    const notifications = await prisma.notification.findMany({
      where: {
        userId: userId as string,
        ...(status && { status: status as NotificationStatus }),
        ...(category && { category: category as string }),
        ...(unreadOnly === "true" && { status: NotificationStatus.PENDING }),
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: Number(size),
    });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notification history" });
  }
};

// GET /api/v1/notifications/:id (Requirement 4.4.2)
export const getNotificationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const notification = await prisma.notification.update({
      where: { id: id as string },
      data: {
        status: NotificationStatus.READ,
        readAt: new Date(),
      },
    });
    res.json(notification);
  } catch (error) {
    res.status(404).json({ error: "Notification not found" });
  }
};

// PATCH /api/v1/notifications/:id/read (Requirement 4.4.2)
export const markAsRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.notification.update({
      where: { id: id as string },
      data: { status: NotificationStatus.READ, readAt: new Date() },
    });
    res.json({ message: "Success" });
  } catch (error) {
    res.status(404).json({ error: "Notification not found" });
  }
};

// PATCH /api/v1/notifications/read-all (Requirement 4.4.2)
export const markAllAsRead = async (req: Request, res: Response) => {
  const { userId } = req.body;
  try {
    const result = await prisma.notification.updateMany({
      where: {
        userId: userId as string,
        status: { not: NotificationStatus.READ },
      },
      data: { status: NotificationStatus.READ, readAt: new Date() },
    });
    res.json({ message: "Success", count: result.count });
  } catch (error) {
    res.status(500).json({ error: "Failed to update notifications" });
  }
};

// DELETE /api/v1/notifications/:id (Requirement 4.4.2)
export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.notification.delete({ where: { id: id as string } });
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: "Notification not found" });
  }
};
