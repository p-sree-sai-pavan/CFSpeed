export const STAGES = [
    { id: 'elite', name: 'Elite', percentile: 'p5', color: 'from-purple-600 to-indigo-600' },
    { id: 'excellent', name: 'Excellent', percentile: 'p20', color: 'from-blue-600 to-cyan-600' },
    { id: 'standard', name: 'Standard', percentile: 'p40', color: 'from-teal-600 to-emerald-600' },
    { id: 'learning', name: 'Learning', percentile: 'p55', color: 'from-green-600 to-lime-600' },
    { id: 'basic', name: 'Basic', percentile: 'p75', color: 'from-yellow-600 to-orange-600' },
    { id: 'beginner', name: 'Beginner', percentile: 'p95', color: 'from-orange-600 to-red-600' },
];

export const LEVEL_MAPPING: Record<string, { tier: string, name: string }> = {
    'A': { tier: 'tier1', name: 'Quick Solves' },
    'B': { tier: 'tier2', name: 'Easy' },
    'C': { tier: 'tier3', name: 'Medium' },
    'D': { tier: 'tier4', name: 'Intermediate' },
    'E': { tier: 'tier5', name: 'Advanced' },
    'F': { tier: 'tier6', name: 'Expert' },
    'G': { tier: 'tier7', name: 'Master' },
    'H': { tier: 's_tier', name: 'God Tier' },
};
