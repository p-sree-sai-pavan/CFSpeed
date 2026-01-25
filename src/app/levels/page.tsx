'use client';

import { useState, useEffect } from 'react';
import LevelCard from '@/components/LevelCard';
import { STAGES, LEVEL_MAPPING } from '@/lib/constants';

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

export default function LevelsPage() {
    const [selectedStage, setSelectedStage] = useState('elite');
    const [summary, setSummary] = useState<LevelsSummary | null>(null);

    useEffect(() => {
        fetch('/levels-summary.json')
            .then((res) => res.json())
            .then((data) => setSummary(data));
    }, []);

    if (!summary) {
        return (
            <div className="flex h-screen items-center justify-center bg-zinc-950 text-white">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
            </div>
        );
    }

    const currentStageData = summary[selectedStage];
    const currentStageInfo = STAGES.find(s => s.id === selectedStage)!;

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
                            <button
                                key={stage.id}
                                onClick={() => setSelectedStage(stage.id)}
                                className={`relative px-6 py-3 text-sm font-bold transition-all rounded-xl ${selectedStage === stage.id
                                    ? 'text-white shadow-lg ring-1 ring-white/20 scale-[1.02]'
                                    : 'text-zinc-500 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {selectedStage === stage.id && (
                                    <div className={`absolute inset-0 -z-10 rounded-xl bg-gradient-to-r ${stage.color} opacity-20`} />
                                )}
                                <span className="relative z-10">{stage.name}</span>
                            </button>
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
