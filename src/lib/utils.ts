import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function getProblemId(contestId: number | string, index: string): string {
    return `${contestId}${index}`;
}

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const getRankColor = (rating: number) => {
    if (rating < 1200) return 'text-zinc-400';
    if (rating < 1400) return 'text-emerald-500';
    if (rating < 1600) return 'text-cyan-400';
    if (rating < 1900) return 'text-blue-500';
    if (rating < 2100) return 'text-violet-500';
    if (rating < 2400) return 'text-orange-400';
    if (rating < 2600) return 'text-rose-500';
    return 'text-red-500';
};

export function parseProblemId(problemId: string): { contestId: string; index: string } | null {
    const match = problemId.match(/^(\d+)([A-Z]\d?)$/);
    if (match) {
        return { contestId: match[1], index: match[2] };
    }
    return null;
}
