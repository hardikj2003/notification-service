import type { Request, Response } from 'express';
import { NotificationService } from '../../services/NotificationService.js';

export const sendNotification = async (req: Request, res: Response) => {
  try {
    const notification = await NotificationService.sendNotification(req.body);
    
    // Response (202): Notification queued (Requirement 4.4.2)
    res.status(202).json({
      message: 'Notification queued',
      notificationId: notification.id
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};