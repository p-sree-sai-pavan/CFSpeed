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

// Type assertion for imported JSON
const summary = levelsSummary as LevelsSummary;

interface PageProps {
    searchParams: Promise<{ stage?: string }>;
}

export default async function LevelsPage({ searchParams }: PageProps) {
    // Read stage from URL query param, default to 'elite'
    const params = await searchParams;
    const selectedStage = params.stage || 'elite';
    const currentStageData = summary[selectedStage];
    const currentStageInfo = STAGES.find(s => s.id === selectedStage)!;

    // Fallback if invalid stage
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
        <div className="min-h-screen bg-zinc-950 px-4 py-20 md:px-8 relative overflow-hidden">
            {/* Background Blobs */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-purple-500/10 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px] -z-10 -translate-x-1/2 translate-y-1/2" />

            <div className="mx-auto max-w-7xl relative z-10">
                {/* Header */}
                <div className="mb-12 text-center md:text-left">
                    <h1 className="mb-3 text-4xl font-black tracking-tight text-white md:text-6xl">
                        Select Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Level</span>
                    </h1>
                    <p className="text-xl text-zinc-400 max-w-2xl">
                        Choose a difficulty level to start your speed training session. Each tier is calibrated to challenge your speed.
                    </p>
                </div>

                {/* Stage Selector */}
                <div className="mb-12 overflow-x-auto pb-4 scrollbar-hide">
                    <div className="flex min-w-max gap-2 p-1.5 rounded-2xl bg-zinc-900/50 backdrop-blur-xl ring-1 ring-white/10 md:inline-flex">
                        {STAGES.map((stage) => (
                            <a
                                key={stage.id}
                                href={`/levels?stage=${stage.id}`}
                                className={`relative px-6 py-3 text-sm font-bold transition-all rounded-xl ${selectedStage === stage.id
                                    ? 'text-white shadow-lg ring-1 ring-white/20 scale-[1.02]'
                                    : 'text-zinc-500 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {selectedStage === stage.id && (
                                    <div className={`absolute inset-0 -z-10 rounded-xl bg-gradient-to-r ${stage.color} opacity-20`} />
                                )}
                                <span className="relative z-10">{stage.name}</span>
                            </a>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
