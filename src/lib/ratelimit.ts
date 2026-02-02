import { NextResponse } from 'next/server';

interface RateLimitConfig {
    limit: number;
    windowMs: number;
}

// Simple in-memory store for rate limiting
// Note: In a multi-instance production environment (e.g., specific Vercel configs or Kubernetes),
// this should be replaced with Redis (Upstash/KV).
// For single-instance or sticky sessions, this works.
const store = new Map<string, { count: number; resetTime: number }>();

// Cleanup stale entries every minute
setInterval(() => {
    const now = Date.now();
    for (const [key, value] of store.entries()) {
        if (now > value.resetTime) {
            store.delete(key);
        }
    }
}, 60000);

export async function rateLimit(identifier: string, config: RateLimitConfig = { limit: 60, windowMs: 60 * 1000 }) {
    const now = Date.now();
    const key = identifier;
    const record = store.get(key);

    if (!record || now > record.resetTime) {
        store.set(key, {
            count: 1,
            resetTime: now + config.windowMs
        });
        return { success: true };
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

export function withRateLimit(handler: Function, limit = 10, windowMs = 60000) {
    return async (request: Request, context?: any) => {
        // Use IP or User ID as identifier
        // In Next.js App Router, request.ip might be empty in dev, fallback to header
        const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';

        const result = await rateLimit(ip, { limit, windowMs });

        if (!result.success) {
            return NextResponse.json(
                { error: 'Too many requests', retryAfter: Math.ceil((result.reset! - Date.now()) / 1000) },
                { status: 429, headers: { 'Retry-After': String(Math.ceil((result.reset! - Date.now()) / 1000)) } }
            );
        }

        return handler(request, context);
    };
}
