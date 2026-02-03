import { NextResponse } from 'next/server';

export interface RateLimitConfig {
    limit: number;
    windowMs: number;
}

export interface RateLimiterResponse {
    success: boolean;
    limit: number;
    remaining: number;
    reset: number;
}

export interface RateLimitBackend {
    check(identifier: string, config: RateLimitConfig): Promise<RateLimiterResponse>;
}

// Memory Backend (Default)
class MemoryRateLimitBackend implements RateLimitBackend {
    private store = new Map<string, { count: number; resetTime: number }>();

    constructor() {
        // Cleanup stale entries every minute
        // Note: SetInterval in serverless might not persist, but it's fine for process lifetime
        if (typeof setInterval !== 'undefined') {
            setInterval(() => this.cleanup(), 60000);
        }
    }

    private cleanup() {
        const now = Date.now();
        for (const [key, value] of this.store.entries()) {
            if (now > value.resetTime) {
                this.store.delete(key);
            }
        }
    }

    async check(identifier: string, config: RateLimitConfig): Promise<RateLimiterResponse> {
        const now = Date.now();
        const record = this.store.get(identifier);

        if (!record || now > record.resetTime) {
            this.store.set(identifier, {
                count: 1,
                resetTime: now + config.windowMs
            });
            return { success: true, limit: config.limit, remaining: config.limit - 1, reset: now + config.windowMs };
        }

        if (record.count >= config.limit) {
            return { success: false, limit: config.limit, remaining: 0, reset: record.resetTime };
        }

        record.count++;
        return {
            success: true,
            limit: config.limit,
            remaining: config.limit - record.count,
            reset: record.resetTime
        };
    }
}

// Global instance to share state across imports in the same process
const defaultBackend = new MemoryRateLimitBackend();

export async function rateLimit(identifier: string, config: RateLimitConfig = { limit: 10, windowMs: 60 * 1000 }): Promise<RateLimiterResponse> {
    return defaultBackend.check(identifier, config);
}

export function withRateLimit(handler: Function, limit = 10, windowMs = 60000) {
    return async (request: Request, context?: any) => {
        const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
        const result = await rateLimit(ip, { limit, windowMs });

        if (!result.success) {
            return NextResponse.json(
                { error: 'Too many requests', retryAfter: Math.ceil((result.reset - Date.now()) / 1000) },
                { status: 429, headers: { 'Retry-After': String(Math.ceil((result.reset - Date.now()) / 1000)) } }
            );
        }

        return handler(request, context);
    };
}
