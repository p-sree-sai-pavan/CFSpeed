// Codeforces API helper functions

const CF_API_BASE = 'https://codeforces.com/api';

export interface CFSubmission {
    id: number;
    contestId: number;
    problem: {
        contestId: number;
        index: string;
        name: string;
        rating?: number;
    };
    verdict: string;
    creationTimeSeconds: number;
}

export interface CFUser {
    handle: string;
    rating?: number;
    maxRating?: number;
    rank?: string;
}

// Verify if a Codeforces handle exists
export async function verifyCFHandle(handle: string): Promise<CFUser | null> {
    try {
        const res = await fetch(`${CF_API_BASE}/user.info?handles=${handle}`);
        const data = await res.json();

        if (data.status === 'OK' && data.result.length > 0) {
            return data.result[0];
        }
        return null;
    } catch (error) {
        console.error('Error verifying CF handle:', error);
        return null;
    }
}

// Get recent submissions for a user
export async function getRecentSubmissions(
    handle: string,
    count: number = 10
): Promise<CFSubmission[]> {
    try {
        const res = await fetch(
            `${CF_API_BASE}/user.status?handle=${handle}&from=1&count=${count}`
        );
        const data = await res.json();

        if (data.status === 'OK') {
            return data.result;
        }
        return [];
    } catch (error) {
        console.error('Error fetching submissions:', error);
        return [];
    }
}

// Check if a specific problem was solved
export async function checkProblemSolved(
    handle: string,
    problemId: string // e.g., "1234A"
): Promise<{ solved: boolean; verdict?: string; time?: number }> {
    const submissions = await getRecentSubmissions(handle, 20);

    for (const sub of submissions) {
        const subProblemId = `${sub.contestId}${sub.problem.index}`;
        if (subProblemId === problemId) {
            return {
                solved: sub.verdict === 'OK',
                verdict: sub.verdict,
                time: sub.creationTimeSeconds
            };
        }
    }

    return { solved: false };
}

// Get problem URL on Codeforces
export function getProblemUrl(problemId: string): string {
    // problemId format: "1234A" -> contestId=1234, index=A
    const match = problemId.match(/^(\d+)([A-Z]\d?)$/);
    if (match) {
        const [, contestId, index] = match;
        return `https://codeforces.com/contest/${contestId}/problem/${index}`;
    }
    return `https://codeforces.com/problemset/problem/${problemId.slice(0, -1)}/${problemId.slice(-1)}`;
}
