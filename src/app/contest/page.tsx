'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Trophy, Clock, Target, ChevronRight } from 'lucide-react';
import { STAGES } from '@/lib/constants';
import AuthGuard from '@/components/AuthGuard';

export default function ContestPage() {
    const [selectedStage, setSelectedStage] = useState('elite');

    return (
        <AuthGuard>
            <div className="min-h-screen bg-[#09090b] pt-4 md:pt-20 pb-24 md:pb-16 px-4">
                <div className="mx-auto max-w-3xl">
                    {/* Header */}
                    <div className="text-center mb-8 md:mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 mb-4 md:mb-6">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                            <span className="text-orange-400 text-[10px] md:text-xs font-semibold uppercase tracking-wide">Contest Mode</span>
                        </div>

                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-white mb-3 md:mb-4">
                            Virtual Contest
                        </h1>
                        <p className="text-zinc-500 text-sm md:text-base max-w-md mx-auto">
                            5 problems, timed, no breaks
                        </p>
                    </div>

                    {/* Info Cards */}
                    <div className="grid grid-cols-3 gap-2 md:gap-4 mb-8 md:mb-10">
                        <div className="p-3 md:p-5 rounded-xl bg-[#0d0d0f] border border-white/[0.06] text-center">
                            <Target className="h-5 w-5 md:h-6 md:w-6 text-orange-400 mx-auto mb-2" />
                            <div className="text-lg md:text-2xl font-semibold text-white">5</div>
                            <div className="text-[10px] md:text-xs text-zinc-600 uppercase tracking-wide">Problems</div>
                        </div>
                        <div className="p-3 md:p-5 rounded-xl bg-[#0d0d0f] border border-white/[0.06] text-center">
                            <Clock className="h-5 w-5 md:h-6 md:w-6 text-orange-400 mx-auto mb-2" />
                            <div className="text-lg md:text-2xl font-semibold text-white">Timed</div>
                            <div className="text-[10px] md:text-xs text-zinc-600 uppercase tracking-wide">Per Problem</div>
                        </div>
                        <div className="p-3 md:p-5 rounded-xl bg-[#0d0d0f] border border-white/[0.06] text-center">
                            <Trophy className="h-5 w-5 md:h-6 md:w-6 text-orange-400 mx-auto mb-2" />
                            <div className="text-lg md:text-2xl font-semibold text-white">Rank</div>
                            <div className="text-[10px] md:text-xs text-zinc-600 uppercase tracking-wide">Your Result</div>
                        </div>
                    </div>

                    {/* Stage Selection */}
                    <div className="mb-8">
                        <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3 md:mb-4">Select Difficulty</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {STAGES.map((stage) => (
                                <button
                                    key={stage.id}
                                    onClick={() => setSelectedStage(stage.id)}
                                    className={`p-3 md:p-4 rounded-xl text-left transition-all ${selectedStage === stage.id
                                            ? 'bg-orange-500/10 border-2 border-orange-500/50'
                                            : 'bg-[#0d0d0f] border border-white/[0.06] hover:border-white/[0.1]'
                                        }`}
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${stage.color}`} />
                                        <span className={`text-sm font-medium ${selectedStage === stage.id ? 'text-orange-400' : 'text-white'}`}>
                                            {stage.name}
                                        </span>
                                    </div>
                                    <span className="text-[10px] md:text-xs text-zinc-600">Top {stage.percentile.replace('p', '')}%</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Start Button */}
                    <Link
                        href={`/problems?stage=${selectedStage}&level=random&contest=true`}
                        className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-orange-500 hover:bg-orange-400 text-white text-base md:text-lg font-semibold transition-all active:scale-[0.98]"
                    >
                        Start Contest
                        <ChevronRight className="h-5 w-5" />
                    </Link>
                </div>
            </div>
        </AuthGuard>
    );
}
