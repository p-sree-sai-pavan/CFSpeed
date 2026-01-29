import fs from 'fs/promises';
import path from 'path';
import { TIER_TO_LEVEL, STATUS_WEIGHT } from './constants';
import { getProblemId } from './utils';

interface Problem {
    contest_id: number;
    index: string;
    name: string;
    rating?: number;
    tags: string[];
    stage: string;
    level: string;
    status: string;
    nameLower?: string;
    tagsLower?: string[];
}

let problemsCache: Problem[] | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function loadProblemsData(): Promise<Problem[]> {
    const now = Date.now();
    
    if (problemsCache && (now - cacheTimestamp) < CACHE_DURATION) {
        return problemsCache;
    }

    let filePath = path.join(process.cwd(), 'public', 'categories.json');
    let fileContents: string;
    
    try {
        fileContents = await fs.readFile(filePath, 'utf8');
    } catch {
        filePath = path.join(process.cwd(), 'cfspeed', 'public', 'categories.json');
        fileContents = await fs.readFile(filePath, 'utf8');
    }
    const categoriesData = JSON.parse(fileContents);

    const problemMap = new Map<string, Problem>();

    for (const [stageKey, stageData] of Object.entries(categoriesData) as [string, any][]) {
        if (!stageData.tiers) continue;

        for (const [tierKey, tierData] of Object.entries(stageData.tiers) as [string, any][]) {
            if (!tierData.problems) continue;

            const levelKey = TIER_TO_LEVEL[tierKey] || tierKey;

            for (const p of tierData.problems) {
                const pid = getProblemId(p.contest_id, p.index);

                if (problemMap.has(pid)) continue;

                const problem: Problem = {
                    contest_id: p.contest_id,
                    index: p.index,
                    name: p.name,
                    rating: p.rating,
                    tags: p.tags || [],
                    stage: stageKey,
                    level: levelKey,
                    status: 'unsolved',
                    nameLower: p.name.toLowerCase(),
                    tagsLower: (p.tags || []).map((t: string) => t.toLowerCase())
                };

                problemMap.set(pid, problem);
            }
        }
    }

    problemsCache = Array.from(problemMap.values());
    cacheTimestamp = now;
    return problemsCache;
}

export async function getProblemsList(solvedSet: Set<string>): Promise<Problem[]> {
    const problems = await loadProblemsData();
    
    return problems.map(p => {
        const pid = getProblemId(p.contest_id, p.index);
        return {
            ...p,
            status: solvedSet.has(pid) ? 'solved' : 'unsolved'
        };
    });
}

export function filterAndSortProblems(
    problems: Problem[],
    search: string,
    levelFilter: string,
    stageFilter: string,
    sortBy: string,
    sortOrder: 'asc' | 'desc'
): Problem[] {
    const modifier = sortOrder === 'asc' ? 1 : -1;
    const lowerSearch = search.toLowerCase();

    const filtered = problems.filter(p => {
        if (levelFilter && p.level !== levelFilter) return false;
        if (stageFilter && p.stage !== stageFilter) return false;
        if (search) {
            const nameMatch = p.nameLower?.includes(lowerSearch);
            const tagMatch = p.tagsLower?.some(t => t.includes(lowerSearch));
            if (!nameMatch && !tagMatch) return false;
        }
        return true;
    });

    filtered.sort((a, b) => {
        if (sortBy === 'status') {
            const wa = STATUS_WEIGHT[a.status] ?? 0;
            const wb = STATUS_WEIGHT[b.status] ?? 0;
            if (wa !== wb) return (wa - wb) * modifier;
        } else {
            const aVal = a[sortBy as keyof Problem];
            const bVal = b[sortBy as keyof Problem];

            // Put undefined/null values last in ASC, first in DESC
            const aUndef = aVal === undefined || aVal === null;
            const bUndef = bVal === undefined || bVal === null;
            if (aUndef || bUndef) {
                if (aUndef && bUndef) return 0;
                return aUndef ? 1 * modifier : -1 * modifier;
            }

            if (typeof aVal === 'number' && typeof bVal === 'number') {
                if (aVal !== bVal) return (aVal - bVal) * modifier;
            } else {
                const aStr = String(aVal);
                const bStr = String(bVal);
                const cmp = aStr.localeCompare(bStr);
                if (cmp !== 0) return cmp * modifier;
            }
        }
        return 0;
    });

    return filtered;
}
