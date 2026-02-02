'use client';

export function ContestsSkeleton() {
    return (
        <div className="space-y-3">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 rounded-full bg-zinc-700 animate-pulse" />
                <div className="h-4 w-32 bg-zinc-800 rounded animate-pulse" />
            </div>
            {[1, 2, 3].map((i) => (
                <div
                    key={i}
                    className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] animate-pulse"
                >
                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                            <div className="h-4 w-48 bg-zinc-800 rounded" />
                            <div className="h-3 w-24 bg-zinc-800/50 rounded" />
                        </div>
                        <div className="h-8 w-20 bg-zinc-800 rounded-lg" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export function LevelCardSkeleton() {
    return (
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] animate-pulse">
            <div className="h-6 w-12 bg-zinc-800 rounded mb-3" />
            <div className="h-4 w-24 bg-zinc-800/50 rounded mb-2" />
            <div className="h-3 w-16 bg-zinc-800/30 rounded" />
        </div>
    );
}

export function PageSkeleton() {
    return (
        <div className="min-h-screen bg-[#09090b] pt-20 pb-16 px-4">
            <div className="mx-auto max-w-5xl">
                <div className="h-8 w-48 bg-zinc-800 rounded mb-4 animate-pulse" />
                <div className="h-4 w-64 bg-zinc-800/50 rounded mb-8 animate-pulse" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <LevelCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        </div>
    );
}
