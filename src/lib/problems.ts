import fs from 'fs/promises';
import path from 'path';
import { getProblemId } from './utils';

import { unstable_cache } from 'next/cache';

const getStageData = unstable_cache(
    async (stage: string) => {
        let filePath = path.join(process.cwd(), 'public', 'categories', `${stage}.json`);
        try {
            const fileContent = await fs.readFile(filePath, 'utf-8');
            return JSON.parse(fileContent);
        } catch {
            // Fallback for Vercel file system weirdness if needed
            filePath = path.join(process.cwd(), 'cfspeed', 'public', 'categories', `${stage}.json`);
            try {
                const fileContent = await fs.readFile(filePath, 'utf-8');
                return JSON.parse(fileContent);
            } catch (error) {
                console.error(`[getStageData] Error loading ${stage}:`, error);
                return null;
            }
        }
    },
    ['stage-data'], // Key parts
    { revalidate: 3600, tags: ['stages'] } // Cache for 1 hour
);

export async function getRandomProblem(stage: string, level: string, tier: string, excludeSet?: Set<string>) {
    console.log(`[getRandomProblem] Request: ${stage} / ${level} / ${tier}`);

    const stageData = await getStageData(stage);

    if (!stageData) {
        console.log('[getRandomProblem] Stage data not found:', stage);
        return null;
    }

    // stageData is now the object for that specific stage, so we access tiers directly
    const tierData = stageData.tiers?.[tier];

    if (!tierData || !tierData.problems || tierData.problems.length === 0) {
        console.log('[getRandomProblem] Tier not found or empty:', tier);
        return null;
    }

    // Filter out excluded problems
    let candidates = tierData.problems;
    if (excludeSet && excludeSet.size > 0) {
        candidates = candidates.filter((p: any) => !excludeSet.has(getProblemId(p.contest_id, p.index)));
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
