import { NextResponse } from 'next/server';
import { getRandomProblem } from '@/lib/problems';
import { LEVEL_MAPPING } from '@/lib/constants';

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { fetchUserSolvedWithStatus } from '@/lib/codeforces';

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
        let excludeSet = new Set<string>();
        if (session?.user?.cfHandle) {
            const status = await fetchUserSolvedWithStatus(session.user.cfHandle);
            excludeSet = status.solved;
        }

        console.log('[DEBUG] Stage:', stage, 'Level:', level, 'Tier:', levelInfo.tier);
        const problem = await getRandomProblem(stage, level, levelInfo.tier, excludeSet);
        console.log('[DEBUG] Problem result:', problem);

        if (!problem) {
            return NextResponse.json({ error: 'No problems found (or all solved!)' }, { status: 404 });
        }

        return NextResponse.json(problem);
    } catch (error) {
        console.error('Error fetching problem:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
