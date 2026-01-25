import fs from 'fs/promises';
import path from 'path';

let categoriesCache: any = null;

export async function getCategories() {
    if (categoriesCache) return categoriesCache;

    const filePath = path.join(process.cwd(), 'public', 'categories.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    categoriesCache = JSON.parse(fileContent);
    return categoriesCache;
}

export async function getRandomProblem(stage: string, level: string, tier: string, excludeSet?: Set<string>) {
    const data = await getCategories();
    console.log('[getRandomProblem] Stages available:', Object.keys(data));

    const stageData = data[stage];
    if (!stageData) {
        console.log('[getRandomProblem] Stage not found:', stage);
        return null;
    }
    console.log('[getRandomProblem] Stage found, tiers:', Object.keys(stageData.tiers || {}));

    const tierData = stageData.tiers[tier];
    if (!tierData || !tierData.problems || tierData.problems.length === 0) {
        console.log('[getRandomProblem] Tier not found or empty:', tier, tierData);
        return null;
    }
    console.log('[getRandomProblem] Tier found, problems count:', tierData.problems.length);

    // Filter out excluded problems
    let candidates = tierData.problems;
    if (excludeSet && excludeSet.size > 0) {
        candidates = candidates.filter((p: any) => !excludeSet.has(`${p.contest_id}${p.index}`));
    }

    if (candidates.length === 0) return null;

    // Simple random selection
    const randomIndex = Math.floor(Math.random() * candidates.length);
    const problem = candidates[randomIndex];

    return {
        ...problem,
        targetTime: problem.times[stageData.percentile_target]
    };
}
