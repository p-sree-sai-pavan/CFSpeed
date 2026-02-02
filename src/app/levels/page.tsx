import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import LevelCard from '@/components/LevelCard';
import { STAGES, LEVEL_MAPPING } from '@/lib/constants';
import levelsSummary from '../../../public/levels-summary.json';

interface LevelsSummary {
    [stage: string]: {
        percentile_target: string;
        levels: {
            [level: string]: {
                count: number;
                time_range: string;
            };
        };
    };
}

const summary = levelsSummary as LevelsSummary;

interface PageProps {
    searchParams: Promise<{ stage?: string }>;
}

export default async function LevelsPage({ searchParams }: PageProps) {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect('/');
    }

    const params = await searchParams;
    const selectedStage = params.stage || 'elite';
    const currentStageData = summary[selectedStage];
    const currentStageInfo = STAGES.find(s => s.id === selectedStage)!;

    if (!currentStageData) {
        const fallbackStage = 'elite';
        const fallbackData = summary[fallbackStage];
        const fallbackInfo = STAGES.find(s => s.id === fallbackStage)!;
        return renderPage(fallbackStage, fallbackData, fallbackInfo);
    }

    return renderPage(selectedStage, currentStageData, currentStageInfo);
}

function renderPage(selectedStage: string, currentStageData: LevelsSummary[string], currentStageInfo: typeof STAGES[number]) {
    return (
        <div className="min-h-screen bg-[#09090b] pt-20 pb-16 px-4 md:px-6">
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-2">
                        Select Level
                    </h1>
                    <p className="text-zinc-500 text-base max-w-xl">
                        Choose your difficulty. Each level is calibrated to real Codeforces problem tiers.
                    </p>
                </div>

                {/* Stage Selector */}
                <div className="mb-10">
                    <div className="inline-flex p-1 rounded-lg bg-[#0d0d0f] border border-white/[0.06]">
                        {STAGES.map((stage) => (
                            <a
                                key={stage.id}
                                href={`/levels?stage=${stage.id}`}
                                className={`relative px-4 py-2 text-sm font-medium rounded-md transition-all ${selectedStage === stage.id
                                        ? 'text-white bg-white/[0.08]'
                                        : 'text-zinc-500 hover:text-zinc-300'
                                    }`}
                            >
                                {stage.name}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Stage Info Bar */}
                <div className="flex items-center gap-6 mb-8 px-4 py-3 rounded-lg bg-[#0d0d0f] border border-white/[0.06]">
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${currentStageInfo.color}`} />
                        <span className="text-sm font-medium text-white">{currentStageInfo.name}</span>
                    </div>
                    <div className="h-4 w-px bg-white/10" />
                    <span className="text-sm text-zinc-500">
                        Target: Top {currentStageData.percentile_target.replace('p', '')}%
                    </span>
                    <div className="h-4 w-px bg-white/10" />
                    <span className="text-sm text-zinc-500">
                        {Object.values(currentStageData.levels).reduce((a, b) => a + b.count, 0).toLocaleString()} problems
                    </span>
                </div>

                {/* Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {Object.entries(LEVEL_MAPPING).map(([levelKey, info]) => {
                        const levelData = currentStageData.levels[levelKey];
                        if (!levelData) return null;

                        return (
                            <LevelCard
                                key={levelKey}
                                level={levelKey}
                                tier={info.tier}
                                timeRange={levelData.time_range}
                                count={levelData.count}
                                description={info.name}
                                stage={selectedStage}
                                color={currentStageInfo.color}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
