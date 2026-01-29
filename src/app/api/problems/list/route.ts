import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSolvedFromCache } from '@/lib/codeforces';
import { prisma } from '@/lib/db';
import { getProblemsList, filterAndSortProblems } from '@/lib/problemsCache';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';
    const levelFilter = searchParams.get('level') || '';
    const stageFilter = searchParams.get('stage') || '';
    const sortBy = searchParams.get('sortBy') || 'rating';
    const sortOrder = (searchParams.get('sortOrder') || 'asc') as 'asc' | 'desc';

    try {
        let solvedSet = new Set<string>();

        if (session?.user?.email) {
            const user = await prisma.user.findUnique({
                where: { email: session.user.email },
                select: { id: true }
            });
            if (user) {
                solvedSet = await getSolvedFromCache(user.id);
            }
        }

        const allProblems = await getProblemsList(solvedSet);
        const filteredProblems = filterAndSortProblems(
            allProblems,
            search,
            levelFilter,
            stageFilter,
            sortBy,
            sortOrder
        );

        const total = filteredProblems.length;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedProblems = filteredProblems.slice(startIndex, endIndex);

        return NextResponse.json({
            problems: paginatedProblems,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            user: session?.user?.cfHandle || null
        });

    } catch (error: any) {
        console.error('Error fetching problems:', error);
        return NextResponse.json({ error: 'Failed to fetch problems', details: error.message }, { status: 500 });
    }
}
