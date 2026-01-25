import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { LEVEL_MAPPING } from '@/lib/constants';
import { fetchUserSolvedWithStatus } from '@/lib/codeforces';

// Define the shape of a problem
interface Problem {
    contest_id: number;
    index: string;
    name: string;
    rating?: number;
    tags: string[];
    stage: string;
    level: string;
    status: string; // 'solved' | 'wrong' | 'unsolved'
}

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';
    const levelFilter = searchParams.get('level') || '';
    const stageFilter = searchParams.get('stage') || '';
    const sortBy = searchParams.get('sortBy') || 'rating';
    const sortOrder = searchParams.get('sortOrder') || 'asc';
    const modifier = sortOrder === 'asc' ? 1 : -1;

    try {
        // 1. Fetch User Submissions if handle exists
        let solvedSet = new Set<string>();
        let attemptedSet = new Set<string>();

        if (session?.user?.cfHandle) {
            const status = await fetchUserSolvedWithStatus(session.user.cfHandle);
            solvedSet = status.solved;
            attemptedSet = status.attempted;
        }

        // 2. Read Static Data
        const filePath = path.join(process.cwd(), 'public', 'categories.json');
        const fileContents = await fs.readFile(filePath, 'utf8');
        const categoriesData = JSON.parse(fileContents);

        const problemMap = new Map<string, Problem>();

        // 3. Flatten data
        const tierToLevel: Record<string, string> = {};
        Object.entries(LEVEL_MAPPING).forEach(([lvl, info]) => {
            tierToLevel[info.tier] = lvl;
        });

        for (const [stageKey, stageData] of Object.entries(categoriesData) as [string, any][]) {
            if (!stageData.tiers) continue;

            for (const [tierKey, tierData] of Object.entries(stageData.tiers) as [string, any][]) {
                if (!tierData.problems) continue;

                const levelKey = tierToLevel[tierKey] || tierKey;

                for (const p of tierData.problems) {
                    const pid = `${p.contest_id}${p.index}`;

                    // Skip if already added
                    if (problemMap.has(pid)) continue;

                    let status = 'unsolved';
                    // If solved, it overrides 'wrong'
                    if (solvedSet.has(pid)) status = 'solved';
                    else if (attemptedSet.has(pid)) status = 'wrong';

                    problemMap.set(pid, {
                        contest_id: p.contest_id,
                        index: p.index,
                        name: p.name,
                        rating: p.rating,
                        tags: p.tags,
                        stage: stageKey,
                        level: levelKey,
                        status
                    });
                }
            }
        }

        let allProblems = Array.from(problemMap.values());

        // 4. Filter
        if (search) {
            const lowerSearch = search.toLowerCase();
            allProblems = allProblems.filter(p =>
                p.name.toLowerCase().includes(lowerSearch) ||
                p.tags.some(t => t.toLowerCase().includes(lowerSearch))
            );
        }
        if (levelFilter) {
            allProblems = allProblems.filter(p => p.level === levelFilter);
        }
        if (stageFilter) {
            allProblems = allProblems.filter(p => p.stage === stageFilter);
        }

        // 5. Sort
        allProblems.sort((a: any, b: any) => {
            if (sortBy === 'status') {
                // Order: Unsolved (0) < Wrong (1) < Solved (2)
                // User wants to see Unsolved first?
                // Usually default sort is ASC.
                // If ASC: Unsolved -> Wrong -> Solved.
                const weight = { 'unsolved': 0, 'wrong': 1, 'solved': 2 };
                const wa = weight[a.status as keyof typeof weight];
                const wb = weight[b.status as keyof typeof weight];
                if (wa < wb) return -1 * modifier;
                if (wa > wb) return 1 * modifier;
                return 0;
            }

            if (a[sortBy] < b[sortBy]) return -1 * modifier;
            if (a[sortBy] > b[sortBy]) return 1 * modifier;
            return 0;
        });

        // 6. Pagination
        const total = allProblems.length;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedProblems = allProblems.slice(startIndex, endIndex);

        return NextResponse.json({
            problems: paginatedProblems,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            cwd: process.cwd(), // Debug info
            user: session?.user?.cfHandle || null
        });

    } catch (error: any) {
        console.error('Error fetching problems:', error);
        return NextResponse.json({ error: 'Failed to fetch problems', details: error.message }, { status: 500 });
    }
}
