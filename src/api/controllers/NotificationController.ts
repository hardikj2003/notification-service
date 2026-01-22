import type { Request, Response } from "express";
import { prisma } from "../../lib/db.js";
import { NotificationService } from "../../services/NotificationService.js";
import { NotificationStatus } from "@prisma/client";

export const sendBulkNotification = async (req: Request, res: Response) => {
  try {
    const batch = await NotificationService.sendBulkNotifications(req.body);
    // Response (202): Batch created (Requirement 4.4.2)
    res.status(202).json({ message: "Batch created", results: batch });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

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
        ...(unreadOnly === "true" && { status: "PENDING" }),
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

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Section 4.4.2: Mark specific notification as read
    await prisma.notification.update({
      where: { id: id as string }, // Explicit cast to string
      data: {
        status: NotificationStatus.READ,
        readAt: new Date(),
      },
    });

    res.json({ message: "Success" });
  } catch (error) {
    res.status(404).json({ error: "Notification not found" });
  }
};

export const markAllAsRead = async (req: Request, res: Response) => {
  const { userId } = req.body;
  try {
    const result = await prisma.notification.updateMany({
      where: { userId, status: { not: "READ" } },
      data: { status: "READ", readAt: new Date() },
    });
    res.json({ message: "Success", count: result.count });
  } catch (error) {
    res.status(500).json({ error: "Failed to update notifications" });
  }
};

export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.notification.delete({ 
      where: { 
        id: id as string // Explicitly cast to satisfy exactOptionalPropertyTypes
      } 
    });

    // Response (204): No content (Requirement 4.4.2)
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: "Notification not found" });
  }
};