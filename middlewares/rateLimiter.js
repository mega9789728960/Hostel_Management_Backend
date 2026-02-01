import redis from '../database/redis.js';

const RATE_LIMIT_WINDOW = process.env.RATE_LIMIT_WINDOW || 60; // 60 seconds
const RATE_LIMIT_MAX_REQUESTS = process.env.RATE_LIMIT_MAX_REQUESTS || 5; // 5 requests

export const rateLimiter = async (req, res, next) => {
    try {
        // Identify user by IP address
        // Handle x-forwarded-for for proxies (like Vercel/Heroku)
        const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();

        if (!ip) {
            // Should not happen, but safe fallback
            return next();
        }

        const key = `rate_limit:${ip}`;
        const now = Date.now();
        const windowStart = now - (RATE_LIMIT_WINDOW * 1000);

        const multi = redis.multi();

        // Remove requests older than the sliding window
        multi.zremrangebyscore(key, 0, windowStart);

        // Add current request with unique member (timestamp-random)
        const uniqueMember = `${now}-${Math.random()}`;
        multi.zadd(key, { score: now, member: uniqueMember });

        // Count requests in the current window (zcard counts all in the set, which now only has valid ones)
        multi.zcard(key);

        // Expire the key to cleanup inactive users (window + buffer)
        multi.expire(key, RATE_LIMIT_WINDOW + 60);

        const results = await multi.exec();

        // results structure: [zrem_result, zadd_result, zcard_result, expire_result]
        // We care about the count (index 2)
        const requestCount = results[2];

        if (requestCount > RATE_LIMIT_MAX_REQUESTS) {
            return res.status(429).json({
                success: false,
                message: "Too many requests, please try again later."
            });
        }

        next();
    } catch (error) {
        console.error("Rate Limiter Middleware Error:", error);
        // Fail-open strategy: allow request to proceed if Redis fails
        next();
    }
};
