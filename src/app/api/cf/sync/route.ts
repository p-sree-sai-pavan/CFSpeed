import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/ratelimit";
import { validateCSRF } from "@/lib/csrf";
import { getProblemId } from "@/lib/utils";

// Force dynamic to prevent static generation of API route
export const dynamic = 'force-dynamic';

// [WORKAROUND] Define strictly typed interfaces matching schema.prisma
// The generated Prisma Client types are stale in the current environment.
// These interfaces enforce type safety against the verified schema.
interface UserSyncState {
    id: string;
    cfHandle: string | null;
    lastSyncedSubmissionId: number | null;
    solvedProblemIds: string[];
}

// Type definition for Codeforces Submission specific to our needs
interface CFSubmission {
    id: number;
    verdict?: string;
    problem?: {
        contestId?: number;
        index?: string;
    };
}

export async function POST(request: Request) {
    // 1. Security & Rate Limiting
    if (!validateCSRF(request)) {
        return NextResponse.json({ error: 'Invalid Origin' }, { status: 403 });
    }

    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    // Strict limit: 5 syncs per 60s per IP
    const limitParams = await rateLimit(ip, { limit: 5, windowMs: 60 * 1000 });
    if (!limitParams.success) {
        return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    // 2. Auth Check (Stateless JWT)
    const session = await getServerSession(authOptions);
    if (!session || (!session.user?.email && !session.user?.id)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // 3. Helper: Dynamic import for robust fetcher
        const { fetchWithRetry } = await import('@/lib/api-utils');

        // 4. Load User State
        // Prioritize ID lookup, fallback to email. Essential for strict type safety.
        const whereClause = session.user.id
            ? { id: session.user.id }
            : { email: session.user.email! };

        // Cast query to bypass stale generated definition
        const user = await prisma.user.findUnique({
            where: whereClause,
            select: {
                id: true,
                cfHandle: true,
                lastSyncedSubmissionId: true,
                solvedProblemIds: true
            } as any
        }) as unknown as UserSyncState | null;

        if (!user || !user.cfHandle) {
            return NextResponse.json({ error: 'No CF handle linked' }, { status: 400 });
        }

        const handle = user.cfHandle;
        const lastKnownId = user.lastSyncedSubmissionId || 0;

        // 5. Fetch Logic (Codeforces API)
        const BATCH_SIZE = 100;
        const MAX_PAGES = 50; // Max 5000 submissions per sync

        let from = 1;
        let foundExisting = false;
        const newSolvedIds = new Set<string>();
        let maxId = lastKnownId;
        let pagesFetched = 0;

        for (let i = 0; i < MAX_PAGES; i++) {
            pagesFetched++;
            const url = `https://codeforces.com/api/user.status?handle=${handle}&from=${from}&count=${BATCH_SIZE}`;

            const res = await fetchWithRetry(url);
            const data = await res.json();

            if (data.status !== 'OK') break;

            const pageSubmissions: CFSubmission[] = data.result;
            if (!pageSubmissions || pageSubmissions.length === 0) break;

            for (const sub of pageSubmissions) {
                // Stop if we reach already-synced history
                if (sub.id <= lastKnownId) {
                    foundExisting = true;
                    continue;
                }

                if (sub.verdict === 'OK' && sub.problem?.contestId && sub.problem?.index) {
                    if (sub.id > maxId) maxId = sub.id;
                    // Use standardized ID generation
                    const pid = getProblemId(sub.problem.contestId, sub.problem.index);
                    newSolvedIds.add(pid);
                }
            }

            if (foundExisting) break;
            from += BATCH_SIZE;
        }

        if (newSolvedIds.size === 0) {
            return NextResponse.json({ success: true, syncedCount: 0, message: 'Up to date' });
        }

        // 6. Optimistic Concurrency Control (OCC)
        const MAX_RETRIES = 3;

        for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
            // A. Read Fresh State
            const freshUser = await prisma.user.findUnique({
                where: { id: user.id },
                select: { solvedProblemIds: true, lastSyncedSubmissionId: true } as any
            }) as unknown as UserSyncState | null;

            if (!freshUser) throw new Error('User record disappeared during sync');

            // B. Merge Data
            const currentSolved = new Set(freshUser.solvedProblemIds);
            const originalSize = currentSolved.size;

            for (const id of newSolvedIds) {
                currentSolved.add(id);
            }

            // check if anything actually needs updating based on the *fresh* state
            if (currentSolved.size === originalSize && maxId <= (freshUser.lastSyncedSubmissionId || 0)) {
                return NextResponse.json({ success: true, syncedCount: 0, message: 'merged with concurrent update' });
            }

            // C. Atomic Write Attempt
            try {
                // We use the lastSyncedSubmissionId from fresh read to ensure we don't regress
                const newLastId = Math.max(maxId, freshUser.lastSyncedSubmissionId || 0);

                await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        solvedProblemIds: Array.from(currentSolved),
                        lastSyncedSubmissionId: newLastId,
                        lastCfSync: new Date()
                    } as any
                });

                // Success
                return NextResponse.json({
                    success: true,
                    syncedCount: newSolvedIds.size,
                    pagesFetched,
                    totalSolved: currentSolved.size
                });

            } catch (err) {
                // If update fails (e.g. DB lock), we retry loop
                console.warn(`[Sync] Retry attempt ${attempt + 1} for user ${user.id}`);
                if (attempt < MAX_RETRIES - 1) {
                    await new Promise(r => setTimeout(r, 50 * Math.pow(2, attempt))); // Exponential backoff
                }
            }
        }

        throw new Error('Failed to update due to high concurrency');

    } catch (error: any) {
        console.error(`[Sync] Critical failure for user ${session.user.email}:`, error);
        return NextResponse.json({
            error: 'Sync failed',
            // Don't leak stack trace details to client in production
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        }, { status: 500 });
    }
}
