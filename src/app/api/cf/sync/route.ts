import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/ratelimit";
import { validateCSRF } from "@/lib/csrf";

export const dynamic = 'force-dynamic';

// Background sync of CF submissions to DB
export async function POST(request: Request) {
    // 1. Security Checks
    if (!validateCSRF(request)) {
        return NextResponse.json({ error: 'Invalid Origin' }, { status: 403 });
    }

    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const limitParams = await rateLimit(ip, { limit: 5, windowMs: 60 * 1000 }); // 5 syncs/min
    if (!limitParams.success) {
        return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true, cfHandle: true }
    });

    if (!user?.cfHandle) {
        return NextResponse.json({ error: 'No CF handle linked' }, { status: 400 });
    }

    try {
        // Fetch ALL solved problems from CF (this is slow, but runs in background)
        const res = await fetch(`https://codeforces.com/api/user.status?handle=${user.cfHandle}`);
        const data = await res.json();

        if (data.status !== 'OK') {
            return NextResponse.json({ error: 'CF API error' }, { status: 502 });
        }

        // Extract solved problems
        const solvedProblems: { problemId: string; solvedAt: Date }[] = [];
        const seenProblems = new Set<string>();

        for (const sub of data.result) {
            if (sub.verdict === 'OK') {
                const problemId = `${sub.problem.contestId}${sub.problem.index}`;
                if (!seenProblems.has(problemId)) {
                    seenProblems.add(problemId);
                    solvedProblems.push({
                        problemId,
                        solvedAt: new Date(sub.creationTimeSeconds * 1000)
                    });
                }
            }
        }

        // Batch insert all solved problems (O(1) transaction)
        if (solvedProblems.length > 0) {
            await prisma.solvedProblem.createMany({
                data: solvedProblems.map(sp => ({
                    userId: user.id,
                    problemId: sp.problemId,
                    solvedAt: sp.solvedAt
                })),
                skipDuplicates: true
            });
        }

        // Update lastCfSync timestamp
        await prisma.user.update({
            where: { id: user.id },
            data: { lastCfSync: new Date() }
        });

        return NextResponse.json({
            success: true,
            syncedCount: solvedProblems.length,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('CF Sync Error:', error);
        return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
    }
}
