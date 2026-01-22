import type { Request, Response } from "express";
import { prisma } from "../../lib/db.js";

export const getPreferences = async (req: Request, res: Response) => {
  const { userId } = req.query;
  try {
    const preferences = await prisma.userNotificationPreference.findMany({
      where: { userId: userId as string },
    });
    res.json(preferences);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch preferences" });
  }
};

export const updatePreferences = async (req: Request, res: Response) => {
  const { userId, preferences } = req.body; // Array of preferences (Requirement 4.4.3)
  
  try {
    const results = await Promise.all(
      preferences.map((pref: any) => 
        prisma.userNotificationPreference.upsert({
          where: { userId_category: { userId, category: pref.category } },
          update: { ...pref, updatedAt: new Date() },
          create: { ...pref, userId },
        })
      )
    );
    res.status(200).json(results);
  } catch (error) {
    res.status(400).json({ error: "Preference update failed" });
  }
};
