'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ExternalLink, RefreshCw, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import Timer from '@/components/Timer';
import Link from 'next/link';

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

    // Sync Token State
    const [syncToken, setSyncToken] = useState<string>('');

    // Fetch next problem
    const fetchNextProblem = async (targetLevel?: string) => {
        setLoading(true);
        setIsSolving(false);
        setIsTimeout(false);
        // Generate new token for this problem attempt
        setSyncToken(Math.random().toString(36).substring(2, 15));
        try {
            const currentLevel = targetLevel || level;
            const res = await fetch(`/api/problems/next?stage=${stage}&level=${currentLevel}`);
            const data = await res.json();

            // Check if API returned an error
            if (data.error || !res.ok) {
                console.error('API Error:', data.error);
                setProblem(null);
            } else {
                setProblem(data);
            }
        } catch (error) {
            console.error('Error:', error);
            setProblem(null);
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
                    // Maybe show a "Wrong Answer" toast?
                    alert("Wrong Answer detected!");
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
        // TODO: Record timeout in DB
    };

    const handleResult = (result: 'solved' | 'wrong') => {
        // TODO: Record result

        // Stop the solving state immediately
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
                alert("Contest Complete! Great job.");
                router.push('/contest');
            }
        } else {
            fetchNextProblem();
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-indigo-500/5 blur-[100px]" />
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent z-10" />
            </div>
        );
    }

    if (!problem) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-white gap-6 relative overflow-hidden">
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
        <div className="min-h-screen bg-zinc-950 px-4 py-20 text-white relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 center w-full h-[500px] bg-indigo-500/10 rounded-full blur-[120px] -z-10" />

            <div className="mx-auto max-w-4xl text-center relative z-10">

                {/* Back Link */}
                <div className="absolute top-0 left-0 hidden md:block">
                    <Link href="/levels" className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors">
                        <ArrowLeft className="h-4 w-4" /> Back
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
                    {isSolving && (
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
        <Suspense fallback={<div className="bg-zinc-950 py-20 text-center text-white">Loading...</div>}>
            <ProblemView />
        </Suspense>
    );
}
