import { headers } from 'next/headers';

export function validateCSRF(request: Request) {
    if (process.env.NODE_ENV === 'development') return true;

    const origin = request.headers.get('origin');
    const referer = request.headers.get('referer');
    const host = request.headers.get('host'); // e.g., cfspeed.vercel.app

    // Strict Origin Check
    if (origin) {
        const originUrl = new URL(origin);
        if (originUrl.host !== host) {
            console.error(`[CSRF] Origin mismatch: ${origin} vs ${host}`);
            return false;
        }
        return true;
    }

    // Fallback to Referer if no Origin (some browsers on same-origin POST)
    if (referer) {
        const refererUrl = new URL(referer);
        if (refererUrl.host !== host) {
            console.error(`[CSRF] Referer mismatch: ${referer} vs ${host}`);
            return false;
        }
        return true;
    }

    // Block if neither present (unsafe for state change)
    return false;
}
