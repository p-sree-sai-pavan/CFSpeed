
import { headers } from 'next/headers';

const MAX_RETRIES = 3;
const INITIAL_BACKOFF = 1000; // 1 second

interface FetchOptions extends RequestInit {
    timeout?: number;
}

export class APIError extends Error {
    constructor(public message: string, public status: number, public url: string) {
        super(message);
        this.name = 'APIError';
    }
}

/**
 * Robust fetch wrapper with exponential backoff and timeout
 */
export async function fetchWithRetry(url: string, options: FetchOptions = {}, retries = MAX_RETRIES): Promise<Response> {
    const { timeout = 10000, ...fetchOptions } = options;

    try {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
            ...fetchOptions,
            signal: controller.signal
        });

        clearTimeout(id);

        // 429 Too Many Requests - always retry after backoff
        if (response.status === 429) {
            if (retries <= 0) throw new APIError('Rate limit exceeded', 429, url);
            const retryAfter = response.headers.get('Retry-After');
            const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : INITIAL_BACKOFF * Math.pow(2, MAX_RETRIES - retries);
            console.warn(`[API] 429 on ${url}. Retrying in ${waitTime}ms...`);
            await new Promise(r => setTimeout(r, waitTime));
            return fetchWithRetry(url, options, retries - 1);
        }

        // 5xx Server Errors - retry
        if (response.status >= 500 && response.status < 600) {
            if (retries <= 0) throw new APIError(`Server error ${response.status}`, response.status, url);
            const waitTime = INITIAL_BACKOFF * Math.pow(2, MAX_RETRIES - retries);
            console.warn(`[API] ${response.status} on ${url}. Retrying in ${waitTime}ms...`);
            await new Promise(r => setTimeout(r, waitTime));
            return fetchWithRetry(url, options, retries - 1);
        }

        if (!response.ok) {
            throw new APIError(`HTTP ${response.status}`, response.status, url);
        }

        return response;
    } catch (error: any) {
        if (retries <= 0) throw error;

        // Don't retry if it's a client error (except 429) or if aborted manually (unless it was our timeout)
        if (error instanceof APIError && error.status < 500 && error.status !== 429) throw error;
        if (error.name === 'AbortError' && options.signal?.aborted) throw error; // User aborted

        const waitTime = INITIAL_BACKOFF * Math.pow(2, MAX_RETRIES - retries);
        console.warn(`[API] Error on ${url}: ${error.message}. Retrying in ${waitTime}ms...`);
        await new Promise(r => setTimeout(r, waitTime));
        return fetchWithRetry(url, options, retries - 1);
    }
}

/**
 * Validates a Codeforces handle using the API
 */
export async function validateCFHandle(handle: string): Promise<boolean> {
    try {
        const res = await fetchWithRetry(`https://codeforces.com/api/user.info?handles=${handle}`, {
            next: { revalidate: 3600 }
        });
        const data = await res.json();
        return data.status === 'OK';
    } catch (error) {
        console.error(`[ValidateCF] Failed to validate ${handle}`, error);
        return false;
    }
}
