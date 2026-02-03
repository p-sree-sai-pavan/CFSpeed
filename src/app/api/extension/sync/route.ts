import { NextResponse } from 'next/server';
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { rateLimit } from "@/lib/ratelimit";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const limitCheck = await rateLimit(ip, { limit: 120, windowMs: 60 * 1000 }); // 2 req/sec allowed for sync
    if (!limitCheck.success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        // [H-3] Removed unused token parameter
        const { verdict, problemId } = body;

        if (!verdict || !problemId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const problemMatch = problemId.match(/\/contest\/(\d+)\/problem\/([A-Z]\d?)/);
        if (!problemMatch) {
            return NextResponse.json({ error: 'Invalid problem ID format' }, { status: 400 });
        }

        const [, contestId, index] = problemMatch;
        const pid = `${contestId}${index}`;

        let status = 'WRONG';
        if (verdict === 'OK') {
            status = 'SOLVED';
        } else if (verdict === 'TIMEOUT') {
            status = 'TIMEOUT';
        }

        await prisma.progress.upsert({
            where: {
                userId_problemId: {
                    userId: user.id,
                    problemId: pid
                }
            },
            update: {
                status,
                attempts: { increment: 1 },
                updatedAt: new Date()
            },
            create: {
                userId: user.id,
                problemId: pid,
                status,
                stage: 'unknown',
                level: index,
                attempts: 1
            }
        });

        if (verdict === 'OK') {
            // Check existence to prevent duplicates in array
            // Note: Race condition possible in theory, but unlikely for single-user sync
            const currentUser = await prisma.user.findUnique({
                where: { id: user.id },
                select: { solvedProblemIds: true }
            });

            if (currentUser && !currentUser.solvedProblemIds.includes(pid)) {
                await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        solvedProblemIds: {
                            push: pid
                        }
                    }
                });
            }
        }

        return NextResponse.json({
            success: true,
            recorded: { verdict, problemId: pid, status }
        });
    } catch (error) {
        console.error('Extension Sync Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
