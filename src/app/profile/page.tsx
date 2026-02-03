import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { ExternalLink, TrendingUp, Clock, Target, User as UserIcon, Unlink } from 'lucide-react';
import ActivityHeatmap from '@/components/profile/ActivityHeatmap';
import AuthGuard from '@/components/AuthGuard';
import ConfirmModal from '@/components/ConfirmModal';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { redirect } from "next/navigation";
import UnlinkButton from "@/components/profile/UnlinkButton";
import LinkAccountForm from "@/components/profile/LinkAccountForm";
import { getRankColor } from "@/lib/utils";

// Server Action-like data fetching
async function getProfileData(handle: string) {
    try {
        // Parallel fetch for performance
        const [userRes, ratingRes, statusRes] = await Promise.allSettled([
            fetch(`https://codeforces.com/api/user.info?handles=${handle}`, { next: { revalidate: 300 } }),
            fetch(`https://codeforces.com/api/user.rating?handle=${handle}`, { next: { revalidate: 300 } }),
            fetch(`https://codeforces.com/api/user.status?handle=${handle}&count=500`, { next: { revalidate: 300 } })
        ]);

        const userData = userRes.status === 'fulfilled' && userRes.value.ok ? await userRes.value.json() : null;
        const ratingData = ratingRes.status === 'fulfilled' && ratingRes.value.ok ? await ratingRes.value.json() : null;
        const statusData = statusRes.status === 'fulfilled' && statusRes.value.ok ? await statusRes.value.json() : null;

        return {
            user: userData?.result?.[0] || null,
            history: ratingData?.result || [],
            submissions: statusData?.result || []
        };
    } catch (error) {
        console.error("Profile Fetch Error", error);
        return null;
    }
}

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);

    // AuthGuard logic on server
    if (!session) {
        // let the client AuthGuard handle redirect or do it here
        // Since AuthGuard wraps children, we can just let it render or redirect.
        // But for data fetching we need session.
        // We will assume AuthGuard is protecting the route layout or we return early.
        // However, the original code used <AuthGuard>.
        // We can keep <AuthGuard> as a client wrapper if needed, but standard nextjs is redirect.
    }

    const handle = session?.user?.cfHandle;
    let profileData = null;

    if (handle) {
        profileData = await getProfileData(handle);
    }

    // Pass data to Client Components or render directly
    const cfUser = profileData?.user;
    const history = profileData?.history || [];
    const submissions = profileData?.submissions || [];
    const rankColor = cfUser?.rating ? getRankColor(cfUser.rating) : 'text-white'; // Need to ensure getRankColor is importable or inline it

    // Helper for Rank Color if not imported
    const getRankColorHelper = (rating: number) => {
        if (rating < 1200) return 'text-zinc-400';
        if (rating < 1400) return 'text-emerald-500';
        if (rating < 1600) return 'text-cyan-400';
        if (rating < 1900) return 'text-blue-500';
        if (rating < 2100) return 'text-violet-500';
        if (rating < 2400) return 'text-orange-400';
        if (rating < 2600) return 'text-rose-500';
        return 'text-red-500';
    };

    // Override local helper if needed used in render
    const finalRankColor = cfUser?.rating ? getRankColorHelper(cfUser.rating) : 'text-white';

    // We need to extract Client interactions (Unlink, Link Form) into components.


    return (
        <AuthGuard>
            <div className="min-h-screen bg-[#09090b] pt-4 md:pt-20 pb-24 md:pb-16 px-4">
                <div className="mx-auto max-w-4xl">

                    {/* Profile Card */}
                    <div className="rounded-xl bg-[#0d0d0f] border border-white/[0.06] p-4 md:p-8 mb-4 md:mb-6">
                        {cfUser ? (
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
                                        <span className={`text-xs md:text-sm font-medium capitalize ${finalRankColor}`}>
                                            {cfUser.rank || 'Unrated'}
                                        </span>
                                    </div>

                                    <a
                                        href={`https://codeforces.com/profile/${cfUser.handle}`}
                                        target="_blank"
                                        className={`text-xl md:text-3xl font-semibold ${finalRankColor} hover:opacity-80 transition-opacity inline-flex items-center gap-2`}
                                    >
                                        {cfUser.handle}
                                        <ExternalLink className="h-3 w-3 md:h-4 md:w-4 text-zinc-600" />
                                    </a>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-4 md:mt-6">
                                        <div>
                                            <div className="text-zinc-600 text-[10px] md:text-xs uppercase tracking-wider mb-0.5">Rating</div>
                                            <div className={`text-lg md:text-xl font-semibold font-mono ${finalRankColor}`}>{cfUser.rating}</div>
                                        </div>
                                        <div>
                                            <div className="text-zinc-600 text-[10px] md:text-xs uppercase tracking-wider mb-0.5">Max</div>
                                            <div className={`text-lg md:text-xl font-semibold font-mono ${getRankColorHelper(cfUser.maxRating)}`}>{cfUser.maxRating}</div>
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
                                        <UnlinkButton />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* Link Account Form */
                            <LinkAccountForm />
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
