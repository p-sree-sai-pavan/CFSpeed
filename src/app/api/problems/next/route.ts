import { NextResponse } from 'next/server';
import { getRandomProblem } from '@/lib/problems';
import { LEVEL_MAPPING } from '@/lib/constants';

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getSolvedFromCache } from '@/lib/codeforces';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const stage = searchParams.get('stage');
    const level = searchParams.get('level');

    if (!stage || !level) {
        return NextResponse.json({ error: 'Missing stage or level' }, { status: 400 });
    }

    const levelInfo = LEVEL_MAPPING[level];
    if (!levelInfo) {
        return NextResponse.json({ error: 'Invalid level' }, { status: 400 });
    }

    try {
        // Get solved problems from DB cache (instant, <10ms)
        let excludeSet = new Set<string>();
        if (session?.user?.email) {
            const user = await prisma.user.findUnique({
                where: { email: session.user.email },
                select: { id: true }
            });
            if (user) {
                excludeSet = await getSolvedFromCache(user.id);
            }
        }

        const problem = await getRandomProblem(stage, level, levelInfo.tier, excludeSet);

        if (!problem) {
            return NextResponse.json({ error: 'No problems found (or all solved!)' }, { status: 404 });
        }

        return NextResponse.json(problem);
    } catch (error) {
        console.error('Error fetching problem:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
