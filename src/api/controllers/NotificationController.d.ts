import type { Request, Response } from "express";
export declare const sendNotification: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const sendBulkNotification: (req: Request, res: Response) => Promise<void>;
export declare const getNotifications: (req: Request, res: Response) => Promise<void>;
export declare const getNotificationById: (req: Request, res: Response) => Promise<void>;
export declare const markAsRead: (req: Request, res: Response) => Promise<void>;
export declare const markAllAsRead: (req: Request, res: Response) => Promise<void>;
export declare const deleteNotification: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=NotificationController.d.ts.map