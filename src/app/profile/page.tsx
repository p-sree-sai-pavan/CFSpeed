'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { ExternalLink, TrendingUp, Clock, Target, User as UserIcon, Unlink } from 'lucide-react';
import ActivityHeatmap from '@/components/profile/ActivityHeatmap';
import AuthGuard from '@/components/AuthGuard';
import ConfirmModal from '@/components/ConfirmModal';
import toast from 'react-hot-toast';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function ProfilePage() {
    const { data: session } = useSession();
    const [cfUser, setCfUser] = useState<any>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [showUnlinkModal, setShowUnlinkModal] = useState(false);

    // H4: Safe sessionStorage wrapper for incognito/restricted environments
    const safeStorage = {
        getItem: (key: string): string | null => {
            try {
                return sessionStorage.getItem(key);
            } catch {
                return null;
            }
        },
        setItem: (key: string, value: string): void => {
            try {
                sessionStorage.setItem(key, value);
            } catch {
                // Silently fail in incognito or quota exceeded
            }
        }
    };

    useEffect(() => {
        if (!session?.user?.cfHandle) return;

        const handle = session.user.cfHandle;
        const cacheKey = `cf_${handle}`;
        const cacheExpiry = 5 * 60 * 1000;

        // H4: Use safe storage wrapper
        const cached = safeStorage.getItem(cacheKey);
        if (cached) {
            try {
                const { data, timestamp } = JSON.parse(cached);
                if (Date.now() - timestamp < cacheExpiry) {
                    setCfUser(data.userData);
                    setHistory(data.ratingData);
                    setSubmissions(data.statusData);
                    return;
                }
            } catch { }
        }

        setLoading(true);
        setError(false);

        // H8: Proper abort controller with cleanup
        const controller = new AbortController();
        let isMounted = true;

        const fetchData = async () => {
            try {
                // H3: Limit submissions to 500 to prevent freezing
                const [userResult, ratingResult, statusResult] = await Promise.allSettled([
                    fetch(`https://codeforces.com/api/user.info?handles=${handle}`, { signal: controller.signal }).then(res => res.json()),
                    fetch(`https://codeforces.com/api/user.rating?handle=${handle}`, { signal: controller.signal }).then(res => res.json()),
                    fetch(`https://codeforces.com/api/user.status?handle=${handle}&count=500`, { signal: controller.signal }).then(res => res.json())
                ]);

                // Only update state if component is still mounted
                if (!isMounted) return;

                const userData = userResult.status === 'fulfilled' ? userResult.value : null;
                const ratingData = ratingResult.status === 'fulfilled' ? ratingResult.value : null;
                const statusData = statusResult.status === 'fulfilled' ? statusResult.value : null;

                if (userData?.status === 'OK' && userData.result.length > 0) setCfUser(userData.result[0]);
                else throw new Error('Failed to fetch user data'); // Trigger error if user fetch fails

                if (ratingData?.status === 'OK') setHistory(ratingData.result);
                if (statusData?.status === 'OK') setSubmissions(statusData.result);

                if (userData && ratingData && statusData) {
                    safeStorage.setItem(cacheKey, JSON.stringify({
                        data: {
                            userData: userData.status === 'OK' ? userData.result[0] : null,
                            ratingData: ratingData.status === 'OK' ? ratingData.result : [],
                            statusData: statusData.status === 'OK' ? statusData.result : []
                        },
                        timestamp: Date.now()
                    }));
                }
            } catch (err) {
                if (isMounted && !(err instanceof Error && err.name === 'AbortError')) {
                    console.error('Profile fetch error:', err);
                    setError(true);
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        // Set timeout for abort (10 seconds)
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        fetchData().finally(() => clearTimeout(timeoutId));

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [session?.user?.cfHandle]);

    const getRankColor = (rating: number) => {
        if (rating < 1200) return 'text-zinc-400';
        if (rating < 1400) return 'text-emerald-500';
        if (rating < 1600) return 'text-cyan-400';
        if (rating < 1900) return 'text-blue-500';
        if (rating < 2100) return 'text-violet-500';
        if (rating < 2400) return 'text-orange-400';
        if (rating < 2600) return 'text-rose-500';
        return 'text-red-500';
    };

    const rankColor = cfUser?.rating ? getRankColor(cfUser.rating) : 'text-white';

    return (
        <AuthGuard>
            <div className="min-h-screen bg-[#09090b] pt-4 md:pt-20 pb-24 md:pb-16 px-4">
                <div className="mx-auto max-w-4xl">

                    {/* Profile Card */}
                    <div className="rounded-xl bg-[#0d0d0f] border border-white/[0.06] p-4 md:p-8 mb-4 md:mb-6">
                        {loading ? (
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg bg-white/[0.04] skeleton flex-shrink-0" />
                                <div className="flex-1">
                                    <div className="h-4 w-20 rounded bg-white/[0.04] skeleton mb-2" />
                                    <div className="h-6 w-32 rounded bg-white/[0.04] skeleton" />
                                </div>
                            </div>
                        ) : cfUser ? (
                            <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
                                {/* Avatar */}
                                <div className="flex-shrink-0">
                                    <div className="w-16 h-16 md:w-24 md:h-24 rounded-xl overflow-hidden bg-white/[0.04] border border-white/[0.06]">
                                        {cfUser.titlePhoto ? (
                                            <img src={cfUser.titlePhoto} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <UserIcon className="h-6 w-6 md:h-8 md:w-8 text-zinc-600" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`text-xs md:text-sm font-medium capitalize ${rankColor}`}>
                                            {cfUser.rank || 'Unrated'}
                                        </span>
                                    </div>

                                    <a
                                        href={`https://codeforces.com/profile/${cfUser.handle}`}
                                        target="_blank"
                                        className={`text-xl md:text-3xl font-semibold ${rankColor} hover:opacity-80 transition-opacity inline-flex items-center gap-2`}
                                    >
                                        {cfUser.handle}
                                        <ExternalLink className="h-3 w-3 md:h-4 md:w-4 text-zinc-600" />
                                    </a>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-4 md:mt-6">
                                        <div>
                                            <div className="text-zinc-600 text-[10px] md:text-xs uppercase tracking-wider mb-0.5">Rating</div>
                                            <div className={`text-lg md:text-xl font-semibold font-mono ${rankColor}`}>{cfUser.rating}</div>
                                        </div>
                                        <div>
                                            <div className="text-zinc-600 text-[10px] md:text-xs uppercase tracking-wider mb-0.5">Max</div>
                                            <div className={`text-lg md:text-xl font-semibold font-mono ${getRankColor(cfUser.maxRating)}`}>{cfUser.maxRating}</div>
                                        </div>
                                        <div>
                                            <div className="text-zinc-600 text-[10px] md:text-xs uppercase tracking-wider mb-0.5">Contrib</div>
                                            <div className={`text-lg md:text-xl font-semibold font-mono ${cfUser.contribution >= 0 ? 'text-emerald-500' : 'text-zinc-500'}`}>
                                                {cfUser.contribution > 0 ? '+' : ''}{cfUser.contribution}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-zinc-600 text-[10px] md:text-xs uppercase tracking-wider mb-0.5">Friends</div>
                                            <div className="text-lg md:text-xl font-semibold font-mono text-zinc-300">{cfUser.friendOfCount}</div>
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between mt-4 md:mt-6 pt-3 md:pt-4 border-t border-white/[0.04]">
                                        <span className="text-[10px] md:text-xs text-zinc-600">
                                            Since {new Date(cfUser.registrationTimeSeconds * 1000).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                        </span>
                                        <button
                                            onClick={() => setShowUnlinkModal(true)}
                                            className="inline-flex items-center gap-1 text-[10px] md:text-xs text-zinc-600 hover:text-red-400 transition-colors p-3 -m-3 touch-target flex justify-center"
                                        >
                                            <Unlink className="h-3 w-3" />
                                            Unlink
                                        </button>

                                        <ConfirmModal
                                            isOpen={showUnlinkModal}
                                            title="Unlink Account"
                                            message="Are you sure you want to unlink your Codeforces account? Your synced data will be removed."
                                            confirmText="Unlink"
                                            variant="danger"
                                            onCancel={() => setShowUnlinkModal(false)}
                                            onConfirm={async () => {
                                                try {
                                                    const res = await fetch('/api/cf/unlink', { method: 'DELETE' });
                                                    if (res.ok) {
                                                        setShowUnlinkModal(false);
                                                        window.location.reload();
                                                    } else {
                                                        toast.error('Failed to unlink account');
                                                        setShowUnlinkModal(false);
                                                    }
                                                } catch {
                                                    toast.error('Failed to unlink account');
                                                    setShowUnlinkModal(false);
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : error ? (
                            /* Error State */
                            <div className="text-center py-6 md:py-8">
                                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-3 md:mb-4">
                                    <Unlink className="h-6 w-6 md:h-8 md:w-8 text-red-500" />
                                </div>
                                <h2 className="text-base md:text-lg font-semibold text-white mb-2">Failed to load profile</h2>
                                <p className="text-zinc-500 text-xs md:text-sm mb-4 md:mb-6 max-w-xs mx-auto">
                                    Codeforces API request failed. Please check your connection.
                                </p>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="px-4 md:px-5 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium transition-colors"
                                >
                                    Retry
                                </button>
                            </div>
                        ) : (
                            /* Link Account */
                            <div className="text-center py-6 md:py-8">
                                <UserIcon className="h-10 w-10 md:h-12 md:w-12 text-zinc-700 mx-auto mb-3 md:mb-4" />
                                <h2 className="text-base md:text-lg font-semibold text-white mb-2">Link Codeforces</h2>
                                <p className="text-zinc-500 text-xs md:text-sm mb-4 md:mb-6 max-w-xs mx-auto">
                                    Connect your handle to see your stats.
                                </p>
                                <form
                                    onSubmit={async (e) => {
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
                                            if (res.ok) window.location.reload();
                                            else { const data = await res.json(); toast.error('Error: ' + data.error); }
                                        } catch { toast.error('Failed to link account'); }
                                        finally { setLoading(false); }
                                    }}
                                    className="flex gap-2 justify-center"
                                >
                                    <label htmlFor="cf-handle" className="sr-only">Codeforces Handle</label>
                                    <input
                                        id="cf-handle"
                                        type="text"
                                        name="handle"
                                        placeholder="CF Handle"
                                        className="px-3 md:px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white text-sm placeholder-zinc-600 focus:outline-none w-32 md:w-40 touch-target"
                                        required
                                    />
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-4 md:px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium disabled:opacity-50 transition-colors touch-target flex items-center"
                                    >
                                        {loading ? '...' : 'Link'}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>

                    {/* Activity Heatmap */}
                    {cfUser && (
                        <div className="rounded-xl bg-[#0d0d0f] border border-white/[0.06] p-4 md:p-6 mb-4 md:mb-6">
                            <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-3 md:mb-4">Activity</h3>
                            <div className="overflow-x-auto -mx-4 px-4 scrollbar-hide">
                                <ErrorBoundary>
                                    <ActivityHeatmap submissions={submissions} />
                                </ErrorBoundary>
                            </div>
                        </div>
                    )}

                    {/* Training Stats */}
                    <div className="rounded-xl bg-[#0d0d0f] border border-white/[0.06] p-4 md:p-6">
                        <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-4 md:mb-6">CFSpeed Stats</h3>

                        <div className="grid grid-cols-3 gap-2 md:gap-4">
                            <div className="p-3 md:p-4 rounded-lg bg-white/[0.02] border border-white/[0.04] text-center">
                                <Clock className="h-4 w-4 md:h-5 md:w-5 text-rose-400 mx-auto mb-2" />
                                <div className="text-lg md:text-2xl font-semibold font-mono text-white">0h</div>
                                <div className="text-[10px] md:text-xs text-zinc-600">Time</div>
                            </div>
                            <div className="p-3 md:p-4 rounded-lg bg-white/[0.02] border border-white/[0.04] text-center">
                                <Target className="h-4 w-4 md:h-5 md:w-5 text-emerald-400 mx-auto mb-2" />
                                <div className="text-lg md:text-2xl font-semibold font-mono text-white">0</div>
                                <div className="text-[10px] md:text-xs text-zinc-600">Solved</div>
                            </div>
                            <div className="p-3 md:p-4 rounded-lg bg-white/[0.02] border border-white/[0.04] text-center">
                                <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-orange-400 mx-auto mb-2" />
                                <div className="text-lg md:text-2xl font-semibold font-mono text-white">—</div>
                                <div className="text-[10px] md:text-xs text-zinc-600">Avg</div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AuthGuard>
    );
}
