'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, ExternalLink } from 'lucide-react';
import { ContestsSkeleton } from './Skeletons';

interface Contest {
    id: number;
    name: string;
    startTimeSeconds: number;
    durationSeconds: number;
}

export default function UpcomingContests() {
    const [contests, setContests] = useState<Contest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchContests = async () => {
        setLoading(true);
        setError(false);
        try {
            const res = await fetch('/api/contests', {
                next: { revalidate: 300 }
            } as RequestInit);
            if (res.ok) {
                const data = await res.json();
                setContests(data);
            } else {
                setError(true);
            }
        } catch (err) {
            console.error('Failed to fetch contests:', err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContests();
    }, []);

    if (loading) {
        return <ContestsSkeleton />;
    }

    if (error) {
        return (
            <div className="w-full p-4 rounded-xl bg-[#0d0d0f] border border-white/[0.06] text-center">
                <p className="text-zinc-500 text-xs mb-2">Failed to load contests</p>
                <button
                    onClick={fetchContests}
                    className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                    Try again
                </button>
            </div>
        );
    }

    if (contests.length === 0) return null;

    return (
        <div className="w-full">
            <div className="flex items-center gap-2 mb-3 md:mb-4">
                <Calendar className="h-4 w-4 text-indigo-400" />
                <span className="text-xs md:text-sm font-medium text-zinc-400 uppercase tracking-wider">Upcoming</span>
            </div>

            <div className="space-y-2">
                {contests.slice(0, 3).map((contest) => {
                    const startDate = new Date(contest.startTimeSeconds * 1000);
                    const isWithin24h = (contest.startTimeSeconds * 1000 - Date.now()) < 24 * 60 * 60 * 1000;

                    return (
                        <div
                            key={contest.id}
                            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 p-3 md:p-4 rounded-xl bg-[#0d0d0f] border border-white/[0.06]"
                        >
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    {isWithin24h && (
                                        <span className="px-1.5 py-0.5 rounded text-[9px] md:text-[10px] font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/20">
                                            SOON
                                        </span>
                                    )}
                                    <h3 className="font-medium text-white text-xs md:text-sm truncate">
                                        {contest.name}
                                    </h3>
                                </div>
                                <div className="flex items-center gap-2 md:gap-3 text-[10px] md:text-xs text-zinc-600">
                                    <span>
                                        {startDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="h-2.5 w-2.5 md:h-3 md:w-3" />
                                        {(contest.durationSeconds / 3600).toFixed(1)}h
                                    </span>
                                </div>
                            </div>

                            <a
                                href={`https://codeforces.com/contest/${contest.id}`}
                                target="_blank"
                                className="flex items-center gap-1.5 px-2.5 md:px-3 py-1.5 rounded-lg text-[10px] md:text-xs font-medium text-zinc-500 hover:text-white hover:bg-white/[0.06] transition-all whitespace-nowrap"
                            >
                                Open <ExternalLink className="h-2.5 w-2.5 md:h-3 md:w-3" />
                            </a>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
