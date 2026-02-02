'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ExternalLink, RefreshCw, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import Timer from '@/components/Timer';
import Link from 'next/link';
import AuthGuard from '@/components/AuthGuard';
import toast from 'react-hot-toast';

function ProblemView() {
    const searchParams = useSearchParams();
    const stage = searchParams.get('stage');
    const level = searchParams.get('level');
    const router = useRouter();

    const mode = searchParams.get('mode');

    const [problem, setProblem] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isSolving, setIsSolving] = useState(false);
    const [isTimeout, setIsTimeout] = useState(false);

    // Error state with type differentiation
    const [error, setError] = useState<{ type: 'network' | 'server' | 'not_found' | null; message: string }>({ type: null, message: '' });
    const [retryCount, setRetryCount] = useState(0);
    const [lastRetryTime, setLastRetryTime] = useState(0);
    const RETRY_COOLDOWN = 2000; // 2 second cooldown between retries

    // Sync Token State
    const [syncToken, setSyncToken] = useState<string>('');

    // Fetch next problem with proper error handling and abort cleanup
    const fetchNextProblem = async (targetLevel?: string) => {
        // Rate limit retries
        const now = Date.now();
        if (now - lastRetryTime < RETRY_COOLDOWN && retryCount > 0) {
            return; // Prevent spam clicks
        }
        setLastRetryTime(now);

        setLoading(true);
        setIsSolving(false);
        setIsTimeout(false);
        setError({ type: null, message: '' });
        setSyncToken(crypto.randomUUID());

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

        try {
            const currentLevel = targetLevel || level;
            const res = await fetch(`/api/problems/next?stage=${stage}&level=${currentLevel}`, {
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (!res.ok) {
                if (res.status === 404) {
                    setError({ type: 'not_found', message: 'No problems found for this level. Try a different stage or level.' });
                } else if (res.status >= 500) {
                    setError({ type: 'server', message: 'Server error. Please try again in a moment.' });
                } else {
                    const data = await res.json().catch(() => ({}));
                    setError({ type: 'server', message: data.error || 'Failed to load problem.' });
                }
                setProblem(null);
                setRetryCount(prev => prev + 1);
                return;
            }

            const data = await res.json();
            setProblem(data);
            setRetryCount(0); // Reset on success
        } catch (err) {
            clearTimeout(timeoutId);
            if (err instanceof Error && err.name === 'AbortError') {
                setError({ type: 'network', message: 'Request timed out. Check your connection and try again.' });
            } else {
                setError({ type: 'network', message: 'Network error. Please check your connection.' });
            }
            setProblem(null);
            setRetryCount(prev => prev + 1);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (stage && level) {
            fetchNextProblem();
        }
    }, [stage, level]);

    // Message Listener for Extension
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            // Validate origin if needed (in production)

            if (event.data?.type === 'CFSPEED_RESULT') {
                console.log("Received result from extension:", event.data);

                const { verdict, token } = event.data;

                // Verify token matches current session
                if (token !== syncToken) {
                    console.warn("Token mismatch, ignoring result.");
                    return;
                }

                // If window.postMessage works, it's instant!
                if (verdict === 'OK') {
                    handleResult('solved');
                } else if (verdict === 'TIMEOUT') {
                    handleTimeout();
                } else if (verdict === 'WRONG') {
                    // Just show notification, don't stop the timer or change state
                    // User can keep trying
                    console.log("Wrong Answer - user can try again");
                }
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [syncToken]); // Re-bind if token changes

    const handleStart = () => {
        setIsSolving(true);
        // Open Codeforces in new tab with timer param AND sync token
        if (problem) {
            const baseUrl = window.location.origin; // e.g., http://localhost:3000
            const url = `https://codeforces.com/contest/${problem.contest_id}/problem/${problem.index}?cfspeed_time=${problem.targetTime}&cfspeed_token=${syncToken}&cfspeed_url=${encodeURIComponent(baseUrl)}`;
            window.open(url, '_blank');
        }
    };

    const handleTimeout = () => {
        setIsSolving(false);
        setIsTimeout(true);
    };

    const handleResult = (result: 'solved' | 'wrong') => {
        setIsSolving(false);

        if (mode === 'contest') {
            // Logic to progress to next level (A -> B -> C -> D -> E)
            const levels = ['A', 'B', 'C', 'D', 'E'];
            const currentIdx = levels.indexOf(level as string);
            const nextLevel = levels[currentIdx + 1];

            if (nextLevel) {
                // Clean redirect to next level
                router.push(`/problems?stage=${stage}&level=${nextLevel}&mode=contest`);
            } else {
                // Contest Finished
                toast.success('Contest Complete! Great job.');
                router.push('/contest');
            }
        } else {
            fetchNextProblem();
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-black text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-indigo-500/5 blur-[100px]" />
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent z-10" />
            </div>
        );
    }

    // Error state with retry
    if (error.type) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white gap-6 relative overflow-hidden px-4">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/10 rounded-full blur-[100px] -z-10" />

                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-2">
                    <XCircle className="h-8 w-8 text-red-400" />
                </div>

                <p className="text-xl font-bold text-center">
                    {error.type === 'network' ? 'Connection Error' :
                        error.type === 'not_found' ? 'No Problems Found' : 'Something Went Wrong'}
                </p>
                <p className="text-zinc-400 text-center max-w-md">{error.message}</p>

                <div className="flex gap-3 mt-2">
                    <button
                        onClick={() => fetchNextProblem()}
                        disabled={Date.now() - lastRetryTime < RETRY_COOLDOWN}
                        className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 font-bold transition-all"
                    >
                        <RefreshCw className="h-5 w-5" /> Try Again
                    </button>
                    <button
                        onClick={() => router.push(`/levels?stage=${stage}`)}
                        className="flex items-center gap-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 px-6 py-3 font-bold transition-all"
                    >
                        <ArrowLeft className="h-5 w-5" /> Back to Levels
                    </button>
                </div>

                {retryCount >= 3 && (
                    <p className="text-xs text-zinc-600 mt-4">Tried {retryCount} times. The server might be experiencing issues.</p>
                )}
            </div>
        );
    }

    if (!problem) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white gap-6 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/10 rounded-full blur-[100px] -z-10" />

                <p className="text-2xl font-bold">No problem found.</p>
                <p className="text-zinc-400">Try selecting a different level or stage.</p>

                <button
                    onClick={() => router.push('/levels')}
                    className="flex items-center gap-2 rounded-xl bg-white text-black px-6 py-3 font-bold hover:scale-105 transition-transform"
                >
                    <ArrowLeft className="h-5 w-5" /> Back to Levels
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black px-4 py-20 text-white relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 center w-full h-[500px] bg-indigo-500/10 rounded-full blur-[120px] -z-10" />

            <div className="mx-auto max-w-4xl text-center relative z-10">

                {/* Back Link */}
                <div className="mb-6 md:mb-0 md:absolute md:top-0 md:left-0">
                    <Link href={`/levels?stage=${stage}`} className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm">
                        <ArrowLeft className="h-4 w-4" /> Back to Levels
                    </Link>
                </div>

                {/* Header Card */}
                <div className="mb-12 bg-zinc-900/40 backdrop-blur-xl rounded-3xl p-8 border border-white/5 shadow-2xl">
                    <div className="mb-4 flex flex-wrap items-center justify-center gap-3">
                        <span className="rounded-full bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 text-sm font-bold text-indigo-300 tracking-wide uppercase">
                            {stage?.toUpperCase()} • LEVEL {level}
                        </span>
                        <span className="rounded-full bg-zinc-800/50 border border-white/5 px-4 py-1.5 text-sm text-zinc-400">
                            Rating: {problem.rating}
                        </span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-2">
                        {problem.name}
                    </h1>
                    <p className="text-xl text-zinc-500 font-mono">{problem.contest_id}{problem.index}</p>
                </div>

                {/* Timer Section */}
                <div className="mb-16 scale-110">
                    <Timer
                        initialSeconds={problem.targetTime}
                        isActive={isSolving}
                        onComplete={handleTimeout}
                    />
                </div>

                {/* Action Area */}
                <div className="flex flex-col items-center gap-8">
                    {!isSolving && !isTimeout && (
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.back()}
                                className="rounded-full px-8 py-4 text-lg font-bold text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleStart}
                                className="group relative flex items-center gap-3 rounded-full bg-white px-10 py-5 text-xl font-bold text-black transition-all hover:scale-105 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-10px_rgba(255,255,255,0.5)]"
                            >
                                <span>Start Solving</span>
                                <ExternalLink className="h-6 w-6 transition-transform group-hover:translate-x-1" />
                            </button>
                        </div>
                    )}

                    {isSolving && (
                        <div className="flex flex-col items-center gap-3 animate-pulse">
                            <span className="text-2xl font-bold text-indigo-400">Solving in progress...</span>
                            <span className="text-sm text-zinc-500">Good luck! Focus on speed.</span>
                        </div>
                    )}

                    {isTimeout && (
                        <div className="rounded-2xl bg-red-500/10 p-8 ring-1 ring-red-500/20 max-w-lg w-full backdrop-blur-sm">
                            <h3 className="mb-3 text-2xl font-bold text-red-400">Time's Up!</h3>
                            <p className="mb-6 text-zinc-300">Don't worry, speed comes with practice. Review the solution to improve.</p>
                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <button
                                    onClick={() => handleResult('wrong')}
                                    className="flex items-center justify-center gap-2 rounded-xl bg-zinc-800 px-6 py-3 hover:bg-zinc-700 font-medium transition-colors"
                                >
                                    Skip to Next <RefreshCw className="h-4 w-4" />
                                </button>
                                <a
                                    href={`https://codeforces.com/contest/${problem.contest_id}/problem/${problem.index}`}
                                    target="_blank"
                                    className="flex items-center justify-center gap-2 rounded-xl bg-red-500/20 px-6 py-3 text-red-300 hover:bg-red-500/30 font-medium transition-colors"
                                >
                                    View Editorial <ExternalLink className="h-4 w-4" />
                                </a>
                            </div>
                        </div>
                    )}

                    {/* Dev Tools (for testing without extension) */}
                    {process.env.NODE_ENV === 'development' && isSolving && (
                        <div className="mt-12 flex gap-4 opacity-30 hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => handleResult('solved')}
                                className="flex items-center gap-2 rounded-lg bg-green-500/10 border border-green-500/20 px-4 py-2 text-green-400 text-sm"
                            >
                                <CheckCircle className="h-4 w-4" /> Mark Solved
                            </button>
                            <button
                                onClick={() => handleResult('wrong')}
                                className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-2 text-red-400 text-sm"
                            >
                                <XCircle className="h-4 w-4" /> Mark Wrong
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ProblemsPage() {
    return (
        <AuthGuard>
            <Suspense fallback={<div className="bg-zinc-950 py-20 text-center text-white">Loading...</div>}>
                <ProblemView />
            </Suspense>
        </AuthGuard>
    );
}
