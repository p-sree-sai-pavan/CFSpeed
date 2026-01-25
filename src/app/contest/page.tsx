'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Trophy, Timer, ArrowRight, BookOpen } from 'lucide-react';
import { STAGES } from '@/lib/constants';

export default function ContestPage() {
    const [selectedStage, setSelectedStage] = useState('elite');

    return (
        <div className="min-h-screen bg-zinc-950 px-4 py-20 text-white relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[100px] -z-10 translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[100px] -z-10 -translate-x-1/2 translate-y-1/2" />

            <div className="mx-auto max-w-4xl">
                <div className="text-center mb-16">
                    <span className="inline-block px-3 py-1 mb-4 rounded-full bg-amber-500/10 text-amber-500 text-sm font-bold tracking-wide uppercase border border-amber-500/20">
                        Mode: Simulation
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black mb-6">
                        Contest <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Mode</span>
                    </h1>
                    <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                        Simulate a real speed contest. 5 problems, back-to-back.
                        Focus on speed and accuracy under pressure.
                    </p>
                </div>

                {/* Feature Cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-16">
                    {[
                        { icon: Timer, title: "Time Pressure", desc: "Strict time limits per problem based on tier." },
                        { icon: BookOpen, title: "5 Problems", desc: "A curated set from Level A to Level E." },
                        { icon: Trophy, title: "Ranked", desc: "Calculate your performance rating after finishing." }
                    ].map((f, i) => (
                        <div key={i} className="bg-zinc-900/50 backdrop-blur border border-white/5 p-6 rounded-2xl">
                            <f.icon className="h-8 w-8 text-amber-500 mb-4" />
                            <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                            <p className="text-sm text-zinc-500">{f.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Start Section */}
                <div className="bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 text-center shadow-2xl">
                    <h2 className="text-2xl font-bold mb-8">Select Difficulty</h2>

                    <div className="flex flex-wrap justify-center gap-3 mb-12">
                        {STAGES.map((stage) => (
                            <button
                                key={stage.id}
                                onClick={() => setSelectedStage(stage.id)}
                                className={`px-6 py-3 rounded-xl font-bold transition-all ${selectedStage === stage.id
                                        ? 'bg-white text-black scale-105 shadow-xl'
                                        : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
                                    }`}
                            >
                                {stage.name}
                            </button>
                        ))}
                    </div>

                    <Link
                        href={`/problems?stage=${selectedStage}&level=A&mode=contest`}
                        className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white text-xl font-bold px-12 py-6 rounded-2xl transition-all hover:scale-105 shadow-lg shadow-amber-500/25"
                    >
                        Start Contest <ArrowRight className="h-6 w-6" />
                    </Link>
                    <p className="mt-4 text-sm text-zinc-500">
                        You will be redirected to the first problem.
                    </p>
                </div>

            </div>
        </div>
    );
}
