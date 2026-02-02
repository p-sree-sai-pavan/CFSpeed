'use client';

import Link from 'next/link';

interface LevelCardProps {
    level: string;
    tier: string;
    timeRange: string;
    count: number;
    description: string;
    stage: string;
    color: string;
}

export default function LevelCard({
    level,
    tier,
    timeRange,
    count,
    description,
    stage,
    color
}: LevelCardProps) {
    return (
        <Link
            href={`/problems?stage=${stage}&level=${level}`}
            className="group relative block"
        >
            {/* Hover glow effect */}
            <div className={`absolute -inset-px rounded-xl bg-gradient-to-b ${color} opacity-0 group-hover:opacity-10 blur transition-all duration-300`} />

            {/* Card */}
            <div className="relative h-full rounded-xl bg-[#0d0d0f] border border-white/[0.06] p-6 transition-all duration-200 group-hover:border-white/[0.1] group-hover:translate-y-[-2px]">
                {/* Header */}
                <div className="flex items-start justify-between mb-5">
                    {/* Level Badge */}
                    <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                        <span className="text-xl font-bold text-white">{level}</span>
                    </div>

                    {/* Tier Tag */}
                    <span className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-md bg-white/[0.04] text-zinc-500 border border-white/[0.06]">
                        {tier.replace('tier', 'T').replace('s_tier', 'S')}
                    </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-white mb-1.5 group-hover:text-white/90 transition-colors">
                    {description}
                </h3>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-zinc-500">{timeRange}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <span className="text-zinc-500">{count.toLocaleString()} problems</span>
                    </div>
                </div>

                {/* Bottom accent line on hover */}
                <div className={`absolute bottom-0 left-4 right-4 h-[2px] rounded-full bg-gradient-to-r ${color} opacity-0 group-hover:opacity-40 transition-opacity duration-300`} />
            </div>
        </Link>
    );
}
