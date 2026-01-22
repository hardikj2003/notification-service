import type { Request, Response } from 'express';
import { prisma } from '../../lib/db.js';

export const subscribe = async (req: Request, res: Response) => {
  const { userId, deviceType, deviceToken, platform } = req.body;
  try {
    const subscription = await prisma.pushSubscription.create({
      data: { userId, deviceType, deviceToken, platform, isActive: true },
    });
    res.status(201).json(subscription);
  } catch (error) {
    res.status(400).json({ error: 'Subscription failed' });
  }
};

export const unsubscribe = async (req: Request, res: Response) => {
  const { deviceToken } = req.body;
  try {
    await prisma.pushSubscription.deleteMany({
      where: { deviceToken },
    });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Unsubscribe failed' });
  }
};