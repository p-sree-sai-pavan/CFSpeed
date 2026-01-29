import { NextResponse } from 'next/server';
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { token, verdict, problemId } = body;

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
            await prisma.solvedProblem.upsert({
                where: {
                    userId_problemId: {
                        userId: user.id,
                        problemId: pid
                    }
                },
                update: {},
                create: {
                    userId: user.id,
                    problemId: pid,
                    solvedAt: new Date()
                }
            });
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
