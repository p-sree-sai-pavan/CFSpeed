import { prisma } from '@/lib/db';

// Get solved problems from DB cache (instant, <10ms)
export async function getSolvedFromCache(userId: string): Promise<Set<string>> {
    const solved = await prisma.solvedProblem.findMany({
        where: { userId },
        select: { problemId: true }
    });
    return new Set(solved.map((s: { problemId: string }) => s.problemId));
}

// Legacy: Fetch from CF API (slow, 500-3000ms) - use for background sync only
export async function fetchUserSolvedWithStatus(handle: string): Promise<{ solved: Set<string>, attempted: Set<string> }> {
    const solved = new Set<string>();
    const attempted = new Set<string>();

    try {
        const res = await fetch(`https://codeforces.com/api/user.status?handle=${handle}&count=1000`);
        const data = await res.json();

        if (data.status === 'OK') {
            for (const sub of data.result) {
                const pid = `${sub.problem.contestId}${sub.problem.index}`;
                if (sub.verdict === 'OK') {
                    solved.add(pid);
                } else {
                    attempted.add(pid);
                }
            }
        }
    } catch (error) {
        console.error('Error fetching CF status:', error);
    }

    return { solved, attempted };
}
