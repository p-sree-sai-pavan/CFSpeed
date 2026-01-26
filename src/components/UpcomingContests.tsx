import { Calendar, Clock, ExternalLink } from 'lucide-react';
import { Contest } from '@/lib/cf';

interface UpcomingContestsProps {
    contests: Contest[];
}

export default function UpcomingContests({ contests }: UpcomingContestsProps) {
    if (contests.length === 0) return null;

    return (
        <div className="w-full max-w-4xl mt-20 relative z-10 px-4">
            <div className="flex items-center gap-2 mb-6 text-zinc-400 uppercase tracking-widest text-sm font-bold">
                <Calendar className="h-4 w-4 text-indigo-400" />
                Upcoming Contests
            </div>

            <div className="grid gap-4">
                {contests.map((contest) => {
                    const startDate = new Date(contest.startTimeSeconds * 1000);
                    const isWithin24h = (contest.startTimeSeconds * 1000 - Date.now()) < 24 * 60 * 60 * 1000;

                    return (
                        <div key={contest.id} className="group flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-900/50 border border-white/5 hover:bg-zinc-900 hover:border-indigo-500/30 hover:shadow-lg transition-all">
                            <div className="flex-1">
                                <h3 className="font-bold text-lg text-white mb-1 group-hover:text-indigo-300 transition-colors">
                                    {contest.name}
                                </h3>
                                <div className="flex items-center gap-4 text-sm text-zinc-400">
                                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${isWithin24h ? 'bg-red-500/20 text-red-300' : 'bg-zinc-800 text-zinc-500'}`}>
                                        {isWithin24h ? 'SOON' : 'UPCOMING'}
                                    </span>
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
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 text-white text-sm font-bold hover:bg-indigo-600 transition-colors shrink-0"
                            >
                                Register <ExternalLink className="h-3 w-3" />
                            </a>
                        </div>
                    );
                })}
            </div>

            <div className="mt-4 text-center">
                <a href="https://codeforces.com/contests" target="_blank" className="text-zinc-500 hover:text-white text-sm hover:underline">
                    View all contests on Codeforces
                </a>
            </div>
        </div>
    );
}
