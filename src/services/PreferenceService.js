import { DateTime } from 'luxon';
import { prisma } from '../lib/db.js';
export class PreferenceService {
    static async isInQuietHours(userId, category) {
        const pref = await prisma.userNotificationPreference.findUnique({
            where: { userId_category: { userId, category } }
        });
        if (!pref || !pref.quietHoursStart || !pref.quietHoursEnd)
            return false;
        // Get current time in user's timezone
        const now = DateTime.now().setZone(pref.timezone);
        // Parse start and end times (Format: "HH:mm")
        const start = DateTime.fromFormat(pref.quietHoursStart, 'HH:mm', { zone: pref.timezone });
        const end = DateTime.fromFormat(pref.quietHoursEnd, 'HH:mm', { zone: pref.timezone });
        if (start < end) {
            return now >= start && now <= end;
        }
        else {
            // Handles overnight quiet hours (e.g., 22:00 to 07:00)
            return now >= start || now <= end;
        }
    }
}
//# sourceMappingURL=PreferenceService.js.map