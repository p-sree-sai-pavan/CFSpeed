export async function fetchUserSolvedWithStatus(handle: string): Promise<{ solved: Set<string>, attempted: Set<string> }> {
    const solved = new Set<string>();
    const attempted = new Set<string>();

    try {
        const res = await fetch(`https://codeforces.com/api/user.status?handle=${handle}`);
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
