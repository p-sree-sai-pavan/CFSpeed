'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Timer, BookOpen, Trophy, ArrowRight } from 'lucide-react';
import { STAGES } from '@/lib/constants';
import AuthGuard from '@/components/AuthGuard';

export default function ContestPage() {
    const [selectedStage, setSelectedStage] = useState('elite');

    return (
        <AuthGuard>
            <div className="min-h-screen bg-[#09090b] pt-20 pb-16 px-4 md:px-6">
                <div className="mx-auto max-w-3xl">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 mb-6">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                            <span className="text-orange-400 text-xs font-semibold uppercase tracking-wide">Contest Mode</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-white mb-4">
                            Virtual Contest
                        </h1>
                        <p className="text-zinc-500 text-lg max-w-lg mx-auto">
                            5 problems. Timed. Back-to-back. Test your speed under real contest pressure.
                        </p>
                    </div>

                    {/* Info Cards */}
                    <div className="grid md:grid-cols-3 gap-3 mb-12">
                        {[
                            {
                                icon: Timer,
                                title: "Time Pressure",
                                desc: "Strict per-problem limits"
                            },
                            {
                                icon: BookOpen,
                                title: "5 Problems",
                                desc: "Level A through E"
                            },
                            {
                                icon: Trophy,
                                title: "Performance",
                                desc: "Get rated after"
                            }
                        ].map((f, i) => (
                            <div
                                key={i}
                                className="p-5 rounded-xl bg-[#0d0d0f] border border-white/[0.06] text-center"
                            >
                                <f.icon className="h-6 w-6 text-orange-500 mx-auto mb-3" />
                                <h3 className="text-sm font-semibold text-white mb-1">{f.title}</h3>
                                <p className="text-xs text-zinc-500">{f.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Start Card */}
                    <div className="rounded-2xl bg-[#0d0d0f] border border-white/[0.06] p-8 md:p-10">
                        <h2 className="text-lg font-semibold text-white mb-6 text-center">
                            Select Difficulty
                        </h2>

                        {/* Stage Buttons */}
                        <div className="flex flex-wrap justify-center gap-2 mb-10">
                            {STAGES.map((stage) => (
                                <button
                                    key={stage.id}
                                    onClick={() => setSelectedStage(stage.id)}
                                    className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${selectedStage === stage.id
                                            ? 'bg-white text-black shadow-lg shadow-white/10'
                                            : 'bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
                                        }`}
                                >
                                    {stage.name}
                                </button>
                            ))}
                        </div>

                        {/* Start Button */}
                        <div className="text-center">
                            <Link
                                href={`/problems?stage=${selectedStage}&level=A&mode=contest`}
                                className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white text-base font-semibold px-10 py-4 rounded-xl transition-all hover:scale-[1.02] shadow-lg shadow-orange-500/20"
                            >
                                Start Contest
                                <ArrowRight className="h-5 w-5" />
                            </Link>
                            <p className="mt-4 text-xs text-zinc-600">
                                Timer starts immediately on first problem
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthGuard>
    );
}
