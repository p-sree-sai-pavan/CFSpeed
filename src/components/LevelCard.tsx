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
            {/* Hover glow - hidden on mobile for performance */}
            <div className={`absolute -inset-px rounded-xl bg-gradient-to-b ${color} opacity-0 group-hover:opacity-10 blur transition-all duration-300 hidden md:block`} />

            {/* Card */}
            <div className="relative h-full rounded-xl bg-[#0d0d0f] border border-white/[0.06] p-4 md:p-6 transition-all duration-200 group-hover:border-white/[0.1] group-active:scale-[0.98]">
                {/* Header */}
                <div className="flex items-start justify-between mb-3 md:mb-5">
                    {/* Level Badge */}
                    <div className="flex items-center justify-center w-9 h-9 md:w-11 md:h-11 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                        <span className="text-lg md:text-xl font-bold text-white">{level}</span>
                    </div>

                    {/* Tier Tag */}
                    <span className="px-2 py-0.5 text-[9px] md:text-[10px] font-semibold uppercase tracking-wider rounded-md bg-white/[0.04] text-zinc-500 border border-white/[0.06]">
                        {tier.replace('tier', 'T').replace('s_tier', 'S')}
                    </span>
                </div>

                {/* Title */}
                <h3 className="text-base md:text-lg font-semibold text-white mb-1.5 truncate">
                    {description}
                </h3>

                {/* Stats */}
                <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 text-xs md:text-sm">
                    <div className="flex items-center gap-1.5 text-zinc-500">
                        <span>{timeRange}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-zinc-500">
                        <span>{count.toLocaleString()} problems</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
