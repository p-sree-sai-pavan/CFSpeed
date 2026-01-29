'use client';

import { useSession, signIn } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { ExternalLink, Trophy, TrendingUp, Clock, Target, User as UserIcon } from 'lucide-react';
import ActivityHeatmap from '@/components/profile/ActivityHeatmap';

export default function ProfilePage() {
    const { data: session } = useSession();
    const [cfUser, setCfUser] = useState<any>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Fetch rich CF data with caching
    useEffect(() => {
        if (!session?.user?.cfHandle) return;

        const handle = session.user.cfHandle;
        const cacheKey = `cf_${handle}`;
        const cacheExpiry = 5 * 60 * 1000; // 5 minutes

        const cached = sessionStorage.getItem(cacheKey);
        if (cached) {
            try {
                const { data, timestamp } = JSON.parse(cached);
                if (Date.now() - timestamp < cacheExpiry) {
                    setCfUser(data.userData);
                    setHistory(data.ratingData);
                    setSubmissions(data.statusData);
                    return;
                }
            } catch (e) {
                // Invalid cache, continue to fetch
            }
        }

        setLoading(true);

        Promise.allSettled([
            fetch(`https://codeforces.com/api/user.info?handles=${handle}`).then(res => res.json()),
            fetch(`https://codeforces.com/api/user.rating?handle=${handle}`).then(res => res.json()),
            fetch(`https://codeforces.com/api/user.status?handle=${handle}`).then(res => res.json())
        ]).then(([userResult, ratingResult, statusResult]) => {
            const userData = userResult.status === 'fulfilled' ? userResult.value : null;
            const ratingData = ratingResult.status === 'fulfilled' ? ratingResult.value : null;
            const statusData = statusResult.status === 'fulfilled' ? statusResult.value : null;

            if (userData?.status === 'OK' && userData.result.length > 0) {
                setCfUser(userData.result[0]);
            }
            if (ratingData?.status === 'OK') {
                setHistory(ratingData.result);
            }
            if (statusData?.status === 'OK') {
                setSubmissions(statusData.result);
            }

            // Cache successful results
            if (userData && ratingData && statusData) {
                try {
                    sessionStorage.setItem(cacheKey, JSON.stringify({
                        data: {
                            userData: userData.status === 'OK' ? userData.result[0] : null,
                            ratingData: ratingData.status === 'OK' ? ratingData.result : [],
                            statusData: statusData.status === 'OK' ? statusData.result : []
                        },
                        timestamp: Date.now()
                    }));
                } catch (e) {
                    // Storage quota exceeded or disabled
                }
            }
        })
            .catch(err => console.error('Profile fetch error:', err))
            .finally(() => setLoading(false));
    }, [session?.user?.cfHandle]);

    const getRankColor = (rating: number) => {
        if (rating < 1200) return 'text-zinc-400'; // Newbie
        if (rating < 1400) return 'text-green-500'; // Pupil
        if (rating < 1600) return 'text-cyan-400'; // Specialist
        if (rating < 1900) return 'text-blue-500'; // Expert
        if (rating < 2100) return 'text-violet-500'; // CM
        if (rating < 2400) return 'text-orange-400'; // Master
        if (rating < 2600) return 'text-rose-500'; // GM
        return 'text-red-600'; // LGM+
    };

    if (!session) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-4">Sign in to view profile</h1>
                    <button
                        onClick={() => signIn('google')}
                        className="rounded-full bg-indigo-600 px-6 py-2 font-bold hover:bg-indigo-500"
                    >
                        Sign In with Google
                    </button>
                </div>
            </div>
        );
    }

    const rankColor = cfUser?.rating ? getRankColor(cfUser.rating) : 'text-white';

    return (
        <div className="min-h-screen bg-zinc-950 px-4 py-20 text-white relative overflow-hidden">
            {/* Background */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[100px] -z-10 translate-x-1/2 -translate-y-1/2" />

            <div className="mx-auto max-w-5xl">

                {/* 1. Codeforces Identity Card */}
                <div className="bg-white rounded-lg p-6 text-black shadow-xl mb-8 border-l-8 border-indigo-500 flex flex-col md:flex-row gap-6 relative overflow-hidden">
                    {/* Watermark Logo */}
                    <div className="absolute right-[-20px] bottom-[-20px] opacity-5 pointer-events-none">
                        <TrendingUp className="h-64 w-64 text-black" />
                    </div>

                    <div className="z-10 flex-shrink-0">
                        <div className="h-40 w-40 rounded-md overflow-hidden bg-zinc-200 border border-zinc-300 shadow-inner group">
                            {cfUser?.titlePhoto ? (
                                <img src={cfUser.titlePhoto} alt="Avatar" className="h-full w-full object-cover" />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center text-zinc-400">
                                    <UserIcon className="h-12 w-12" />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="z-10 flex-grow pt-2">
                        {loading ? (
                            <div className="animate-pulse">
                                <div className="h-6 bg-zinc-200 w-32 mb-2 rounded"></div>
                                <div className="h-8 bg-zinc-200 w-48 mb-4 rounded"></div>
                            </div>
                        ) : cfUser ? (
                            <>
                                <div className={`font-bold text-lg mb-1 capitalize ${rankColor}`}>
                                    {cfUser.rank || 'Unrated'}
                                </div>
                                <h1 className={`text-4xl font-bold mb-4 ${rankColor} drop-shadow-sm`}>
                                    <a href={`https://codeforces.com/profile/${cfUser.handle}`} target="_blank" className="hover:underline">
                                        {cfUser.handle}
                                    </a>
                                </h1>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-8 text-sm">
                                    <div>
                                        <div className="text-zinc-500 mb-1 flex items-center gap-1"><TrendingUp className="h-3 w-3" /> Rating</div>
                                        <div className={`font-bold text-xl ${rankColor}`}>{cfUser.rating}</div>
                                    </div>
                                    <div>
                                        <div className="text-zinc-500 mb-1 flex items-center gap-1"><Trophy className="h-3 w-3" /> Max Rating</div>
                                        <div className={`font-bold text-xl ${getRankColor(cfUser.maxRating)}`}>
                                            {cfUser.maxRating} <span className="text-xs font-normal text-zinc-400 capitalize">({cfUser.maxRank})</span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-zinc-500 mb-1">Contribution</div>
                                        <div className={`font-bold text-xl ${cfUser.contribution >= 0 ? 'text-green-600' : 'text-zinc-600'}`}>
                                            {cfUser.contribution > 0 ? '+' : ''}{cfUser.contribution}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-zinc-500 mb-1">Friend of</div>
                                        <div className="font-bold text-xl text-zinc-800">{cfUser.friendOfCount} users</div>
                                    </div>
                                </div>

                                <div className="mt-6 text-zinc-500 text-sm italic">
                                    Registered: {new Date(cfUser.registrationTimeSeconds * 1000).toLocaleDateString()}
                                </div>
                            </>
                        ) : (
                            <div>
                                <h2 className="text-xl font-bold mb-2">No Codeforces Account Linked</h2>
                                <p className="text-zinc-600 mb-4">Link your account to see your stats here.</p>
                                <form onSubmit={async (e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.currentTarget);
                                    const handle = formData.get('handle');
                                    setLoading(true);
                                    try {
                                        const res = await fetch('/api/cf/link', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ handle }),
                                        });
                                        const data = await res.json();
                                        if (res.ok) {
                                            window.location.reload();
                                        } else {
                                            alert('Error: ' + data.error);
                                        }
                                    } catch (err) {
                                        alert('Failed to link account');
                                    } finally {
                                        setLoading(false);
                                    }
                                }} className="flex gap-2">
                                    <input type="text" name="handle" placeholder="Enter CF Handle" className="border px-3 py-2 rounded text-black" required />
                                    <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50">
                                        {loading ? 'Linking...' : 'Link'}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. Graphs */}
                {cfUser && (
                    <div className="mb-8">
                        <ActivityHeatmap submissions={submissions} />
                    </div>
                )}

                {/* 3. CFSpeed Stats Grid */}
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Target className="h-6 w-6 text-amber-500" /> Training Stats
                </h2>

                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-2xl backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <Clock className="h-5 w-5 text-indigo-400" />
                            <span className="text-zinc-400 text-sm font-medium uppercase">Training Time</span>
                        </div>
                        <div className="text-3xl font-mono font-bold">0h 00m</div>
                        <div className="text-xs text-zinc-500 mt-1">Total time focused</div>
                    </div>

                    <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-2xl backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <Target className="h-5 w-5 text-green-400" />
                            <span className="text-zinc-400 text-sm font-medium uppercase">Problems Solved</span>
                        </div>
                        <div className="text-3xl font-mono font-bold">0</div>
                        <div className="text-xs text-zinc-500 mt-1">On CFSpeed platform</div>
                    </div>

                    <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-2xl backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <TrendingUp className="h-5 w-5 text-orange-400" />
                            <span className="text-zinc-400 text-sm font-medium uppercase">Avg Speed</span>
                        </div>
                        <div className="text-3xl font-mono font-bold">-- min</div>
                        <div className="text-xs text-zinc-500 mt-1">Per problem</div>
                    </div>
                </div>

            </div>
        </div>
    );
}
