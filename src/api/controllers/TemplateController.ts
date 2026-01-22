import type { Request, Response } from "express";
import { prisma } from "../../lib/db.js";

export const createTemplate = async (req: Request, res: Response) => {
  try {
    const template = await prisma.notificationTemplate.create({
      data: req.body,
    });
    res.status(201).json(template);
  } catch (error) {
    res.status(400).json({ error: "Failed to create template" });
  }
};

export const listTemplates = async (req: Request, res: Response) => {
  const { category, event_type } = req.query;
  try {
    const templates = await prisma.notificationTemplate.findMany({
      where: {
        ...(category && { category: String(category) }),
        ...(event_type && { eventType: String(event_type) }),
        isActive: true,
      },
    });
    res.json(templates);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch templates" });
  }
};
