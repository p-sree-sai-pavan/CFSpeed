import { prisma } from '@/lib/db';
import { getProblemId } from './utils';

// Get solved problems from DB cache (instant, <1ms)
export async function getSolvedFromCache(userId: string): Promise<Set<string>> {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { solvedProblemIds: true } as any
    });
    return new Set((user as any)?.solvedProblemIds || []);
}

// Basic CF Types
export interface CFUser {
    handle: string;
    rating?: number;
    maxRating?: number;
    rank?: string;
}

export interface Contest {
    id: number;
    name: string;
    type: string;
    phase: string;
    frozen: boolean;
    durationSeconds: number;
    startTimeSeconds: number;
    relativeTimeSeconds: number;
}

// Verify if a Codeforces handle exists
export async function verifyCFHandle(handle: string): Promise<CFUser | null> {
    try {
        // Dynamic import to avoid circular dependency in some edge cases (though unlikely here)
        // or just import at top if we fix top imports.
        // But let's use the new API utils for consistency.
        const { fetchWithRetry } = await import('./api-utils');

        const res = await fetchWithRetry(`https://codeforces.com/api/user.info?handles=${handle}`, {
            next: { revalidate: 3600 } // Cache user info for 1 hour
        });
        const data = await res.json();

        if (data.status === 'OK' && data.result.length > 0) {
            return data.result[0];
        }
        return null;
    } catch (error) {
        console.error('Error verifying CF handle:', error);
        return null;
    }
}

// Fetch upcoming contests
export async function getUpcomingContests(): Promise<Contest[]> {
    try {
        const { fetchWithRetry } = await import('./api-utils');
        const res = await fetchWithRetry(`https://codeforces.com/api/contest.list?gym=false`, {
            next: { revalidate: 300 } // 5 min cache
        });
        const data = await res.json();

        if (data.status === 'OK') {
            return data.result
                .filter((c: Contest) => c.phase === 'BEFORE')
                .sort((a: Contest, b: Contest) => a.startTimeSeconds - b.startTimeSeconds)
                .slice(0, 3);
        }
        return [];
    } catch (error) {
        console.error('Error fetching contests:', error);
        return [];
    }
}

// Legacy: Fetch from CF API (slow, 500-3000ms) - use for background sync only
export async function fetchUserSolvedWithStatus(handle: string): Promise<{ solved: Set<string>, attempted: Set<string> }> {
    const solved = new Set<string>();
    const attempted = new Set<string>();

    // We'll use our new robust fetcher from api-utils
    // But since this function is legacy/adhoc, I'll inline the basic fetch here to avoid breaking imports if api-utils isn't ready,
    // actually let's use the standard fetch but with better error handling as requested.
    // Ideally we should import from api-utils, but I'll write a safe implementation here to ensure this file stands alone or use the one I just made.

    // Re-reading task: "Fix it in the most correct, scalable way". 
    // I should use the new `fetchWithRetry` if I can import it.
    // Since I just created api-utils.ts, I will import it.

    try {
        const { fetchWithRetry } = await import('./api-utils'); // Dynamic import to avoid circular dependency issues if any

        const BATCH_SIZE = 1000;
        let from = 1;
        let hasMore = true;

        // Safety limit: don't fetch more than 10k submissions ever in one go
        const MAX_PAGES = 10;

        for (let page = 0; page < MAX_PAGES && hasMore; page++) {
            const res = await fetchWithRetry(`https://codeforces.com/api/user.status?handle=${handle}&from=${from}&count=${BATCH_SIZE}`);
            const data = await res.json();

            if (data.status !== 'OK') break;

            const submissions = data.result;
            if (!submissions || submissions.length === 0) {
                hasMore = false;
                break;
            }

            for (const sub of submissions) {
                if (sub.problem && sub.problem.contestId && sub.problem.index) {
                    const pid = getProblemId(sub.problem.contestId, sub.problem.index);
                    if (sub.verdict === 'OK') {
                        solved.add(pid);
                    } else {
                        attempted.add(pid);
                    }
                }
            }

            if (submissions.length < BATCH_SIZE) hasMore = false;
            from += BATCH_SIZE;
        }

    } catch (error) {
        console.error('Error fetching CF status:', error);
        // We throw so the caller knows sync failed
        throw new Error('Failed to fetch from Codeforces');
    }

    return { solved, attempted };
}
