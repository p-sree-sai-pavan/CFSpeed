import { Calendar, Clock, ExternalLink } from 'lucide-react';
import { Contest } from '@/lib/cf';

interface UpcomingContestsProps {
    contests: Contest[];
}

export default function UpcomingContests({ contests }: UpcomingContestsProps) {
    if (contests.length === 0) return null;

    return (
        <div className="w-full">
            <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-4 w-4 text-indigo-400" />
                <span className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Upcoming Contests</span>
            </div>

            <div className="space-y-2">
                {contests.map((contest) => {
                    const startDate = new Date(contest.startTimeSeconds * 1000);
                    const isWithin24h = (contest.startTimeSeconds * 1000 - Date.now()) < 24 * 60 * 60 * 1000;

                    return (
                        <div
                            key={contest.id}
                            className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#0d0d0f] border border-white/[0.06] hover:border-white/[0.1] transition-all"
                        >
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    {isWithin24h && (
                                        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/20">
                                            SOON
                                        </span>
                                    )}
                                    <h3 className="font-medium text-white text-sm truncate">
                                        {contest.name}
                                    </h3>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-zinc-600">
                                    <span>
                                        {startDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} at {startDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {(contest.durationSeconds / 3600).toFixed(1)}h
                                    </span>
                                </div>
                            </div>

                            <a
                                href="https://codeforces.com/contests"
                                target="_blank"
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-500 hover:text-white hover:bg-white/[0.06] transition-all"
                            >
                                Register <ExternalLink className="h-3 w-3" />
                            </a>
                        </div>
                    );
                })}
            </div>

            <div className="mt-3 text-center">
                <a
                    href="https://codeforces.com/contests"
                    target="_blank"
                    className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
                >
                    View all on Codeforces →
                </a>
            </div>
        </div>
    );
}
