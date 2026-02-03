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
const CACHE_DURATION = 24 * 60 * 60 * 1000; // Cache for 24 hours (effectively static)

async function loadProblemsData(): Promise<Problem[]> {
    // [H-4] Optimization: Return cached data immediately if available.
    if (problemsCache) {
        return problemsCache;
    }

    const now = Date.now();
    const categoriesDir = path.join(process.cwd(), 'public', 'categories');

    // In Vercel, we might need to adjust path if strictly finding files
    // But since we know the categories (elite, excellent, etc.), we could hardcode them 
    // to avoid readdir overhead or permission issues.
    // However, readdir is more robust for adding new categories.

    try {
        const files = await fs.readdir(categoriesDir);
        const jsonFiles = files.filter(f => f.endsWith('.json'));

        const problemMap = new Map<string, Problem>();

        // Load all stages in parallel
        await Promise.all(jsonFiles.map(async (file) => {
            const filePath = path.join(categoriesDir, file);
            // Derive stage from filename (e.g. "elite.json" -> "elite")
            const stageKey = path.basename(file, '.json');

            try {
                const content = await fs.readFile(filePath, 'utf8');
                const stageData = JSON.parse(content);

                if (!stageData.tiers) return;

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
            } catch (err) {
                console.error(`[ProblemsCache] Failed to load ${file}:`, err);
            }
        }));

        problemsCache = Array.from(problemMap.values());
        cacheTimestamp = now;
        return problemsCache;

    } catch (err) {
        console.error('[ProblemsCache] Failed to read categories dir:', err);
        return [];
    }
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
