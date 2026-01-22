import { createClient } from 'redis';
const redis = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
redis.connect().catch(console.error);
export class RateLimitService {
    static DAILY_LIMIT = 100;
    static async isRateLimited(userId) {
        const key = `ratelimit:${userId}:${new Date().toISOString().split('T')[0]}`;
        const count = await redis.incr(key);
        if (count === 1) {
            // Set expiry to 24 hours on the first notification of the day
            await redis.expire(key, 86400);
        }
        return count > this.DAILY_LIMIT;
    }
}
//# sourceMappingURL=RateLimitService.js.map