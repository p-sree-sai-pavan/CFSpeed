'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Trophy, Clock, Target, ChevronRight, Zap, Swords } from 'lucide-react';
import { STAGES } from '@/lib/constants';
import AuthGuard from '@/components/AuthGuard';

export default function ContestPage() {
    const [selectedStage, setSelectedStage] = useState('elite');

    const selectedStageData = STAGES.find(s => s.id === selectedStage);

    return (
        <AuthGuard>
            <div className="min-h-screen bg-[#09090b] pt-4 md:pt-20 pb-24 md:pb-16 px-4">
                <div className="mx-auto max-w-3xl">
                    {/* Hero Header */}
                    <div className="relative text-center mb-10 md:mb-14">
                        {/* Subtle glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-rose-500/5 rounded-full blur-[100px] pointer-events-none" />

                        {/* Icon */}
                        <div className="relative inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-rose-500/20 to-orange-500/10 border border-rose-500/20 mb-6">
                            <Swords className="h-8 w-8 md:h-10 md:w-10 text-rose-400" />
                        </div>

                        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-white mb-3">
                            Virtual Contest
                        </h1>
                        <p className="text-zinc-500 text-sm md:text-lg max-w-md mx-auto">
                            Test your skills under real contest conditions
                        </p>
                    </div>

                    {/* Contest Format Card */}
                    <div className="relative mb-8 md:mb-10 p-6 md:p-8 rounded-2xl bg-gradient-to-br from-[#0d0d0f] to-[#0f0f11] border border-white/[0.06]">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-[80px] pointer-events-none" />

                        <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-5">Contest Format</h2>

                        <div className="grid grid-cols-3 gap-4 md:gap-6">
                            <div className="text-center">
                                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-rose-500/10 flex items-center justify-center mx-auto mb-3">
                                    <Target className="h-6 w-6 md:h-7 md:w-7 text-rose-400" />
                                </div>
                                <div className="text-2xl md:text-3xl font-bold text-white mb-1">5</div>
                                <div className="text-[10px] md:text-xs text-zinc-600 uppercase tracking-wider">Problems</div>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-orange-500/10 flex items-center justify-center mx-auto mb-3">
                                    <Clock className="h-6 w-6 md:h-7 md:w-7 text-orange-400" />
                                </div>
                                <div className="text-2xl md:text-3xl font-bold text-white mb-1">Timed</div>
                                <div className="text-[10px] md:text-xs text-zinc-600 uppercase tracking-wider">Per Problem</div>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-amber-500/10 flex items-center justify-center mx-auto mb-3">
                                    <Trophy className="h-6 w-6 md:h-7 md:w-7 text-amber-400" />
                                </div>
                                <div className="text-2xl md:text-3xl font-bold text-white mb-1">Score</div>
                                <div className="text-[10px] md:text-xs text-zinc-600 uppercase tracking-wider">Track Record</div>
                            </div>
                        </div>
                    </div>

                    {/* Difficulty Selection */}
                    <div className="mb-8">
                        <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-4">Choose Difficulty</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {STAGES.map((stage) => (
                                <button
                                    key={stage.id}
                                    onClick={() => setSelectedStage(stage.id)}
                                    className={`group relative p-4 rounded-xl text-left transition-all duration-200 ${selectedStage === stage.id
                                        ? 'bg-rose-500/10 border-2 border-rose-500/50 shadow-lg shadow-rose-500/10'
                                        : 'bg-[#0d0d0f] border border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.02]'
                                        }`}
                                >
                                    {/* Selection indicator */}
                                    {selectedStage === stage.id && (
                                        <div className="absolute top-3 right-3">
                                            <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2.5 mb-2">
                                        <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${stage.color}`} />
                                        <span className={`text-sm font-semibold ${selectedStage === stage.id ? 'text-rose-400' : 'text-white'
                                            }`}>
                                            {stage.name}
                                        </span>
                                    </div>
                                    <span className="text-xs text-zinc-500">Top {stage.percentile.replace('p', '')}%</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Selected Stage Summary */}
                    {selectedStageData && (
                        <div className="mb-8 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                            <div className="flex items-center gap-3">
                                <Zap className="h-5 w-5 text-rose-400" />
                                <div>
                                    <div className="text-sm font-medium text-white">
                                        {selectedStageData.name} Difficulty
                                    </div>
                                    <div className="text-xs text-zinc-500">
                                        Problems from A to H levels • Target: Top {selectedStageData.percentile.replace('p', '')}% solving speed
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Start Button */}
                    <Link
                        href={`/problems?stage=${selectedStage}&level=A&mode=contest`}
                        className="group relative w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white text-base md:text-lg font-semibold transition-all active:scale-[0.98] shadow-lg shadow-rose-500/20"
                    >
                        <span>Start Contest</span>
                        <ChevronRight className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>

                    {/* Tips */}
                    <div className="mt-8 text-center">
                        <p className="text-xs text-zinc-600">
                            • Each problem has a time limit based on your selected difficulty
                        </p>
                        <p className="text-xs text-zinc-600 mt-1">
                            • Complete all 5 problems consecutively for best results
                        </p>
                    </div>
                </div>
            </div>
        </AuthGuard>
    );
}
