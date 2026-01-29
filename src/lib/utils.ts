export function getProblemId(contestId: number | string, index: string): string {
    return `${contestId}${index}`;
}

export function parseProblemId(problemId: string): { contestId: string; index: string } | null {
    const match = problemId.match(/^(\d+)([A-Z]\d?)$/);
    if (match) {
        return { contestId: match[1], index: match[2] };
    }
    return null;
}
