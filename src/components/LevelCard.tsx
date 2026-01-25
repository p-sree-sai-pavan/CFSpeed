import { ArrowRight, Clock, Hash } from 'lucide-react';
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

export default function LevelCard({ level, tier, timeRange, count, description, stage, color }: LevelCardProps) {
    return (
        <Link href={`/problems?stage=${stage}&level=${level}`} className="group relative block h-full">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

            <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-white/5 bg-zinc-900 p-6 transition-all group-hover:-translate-y-1 group-hover:border-white/10 group-hover:shadow-xl">

                {/* Top Accent Line */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${color}`} />

                {/* Content */}
                <div>
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800 font-black text-2xl text-white group-hover:scale-110 transition-transform">
                            {level}
                        </div>
                        <div className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider bg-zinc-800 bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
                            {tier}
                        </div>
                    </div>

                    <h3 className="mb-2 text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
                        {description}
                    </h3>

                    <div className="space-y-2 text-sm text-zinc-400">
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{timeRange}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Hash className="h-4 w-4" />
                            <span>{count} Problems</span>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex items-center gap-2 text-sm font-bold text-white opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1">
                    Start Solving <ArrowRight className="h-4 w-4" />
                </div>
            </div>
        </Link>
    );
}
