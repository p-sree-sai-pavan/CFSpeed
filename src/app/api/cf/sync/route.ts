import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db";

export const dynamic = 'force-dynamic';

// Background sync of CF submissions to DB
export async function POST() {
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

        // Upsert all solved problems
        for (const sp of solvedProblems) {
            await prisma.solvedProblem.upsert({
                where: {
                    userId_problemId: {
                        userId: user.id,
                        problemId: sp.problemId
                    }
                },
                update: {}, // No update needed if exists
                create: {
                    userId: user.id,
                    problemId: sp.problemId,
                    solvedAt: sp.solvedAt
                }
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
