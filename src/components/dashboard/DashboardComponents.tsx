import { ArrowRight, ChevronDown, CheckCircle2, TrendingUp, AlertCircle, Play } from 'lucide-react';
import Link from 'next/link';

// --- Components ---

interface ProgressHeroProps {
    level: string;
    rating: number;
}

export function ProgressHero({ level, rating }: ProgressHeroProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* LEFT: Primary Metrics */}
            <div className="flex flex-col justify-center p-8 rounded-lg border border-[var(--border)] bg-[var(--surface)]">
                <div className="grid grid-cols-2 gap-8">
                    <div>
                        <div className="text-[var(--text-secondary)] text-sm font-medium mb-2">Speed Rating</div>
                        <div className="text-5xl font-bold text-[var(--text-primary)] tracking-tight tabular-nums mb-2">
                            {rating}
                        </div>
                        <div className="text-sm font-medium text-[var(--success)] flex items-center gap-1">
                            ↑ +42 <span className="text-[var(--text-secondary)]">this week</span>
                        </div>
                    </div>
                    <div>
                        <div className="text-[var(--text-secondary)] text-sm font-medium mb-2">Avg Solve Time</div>
                        <div className="text-5xl font-bold text-[var(--text-primary)] tracking-tight tabular-nums mb-2">
                            3m 42s
                        </div>
                        <div className="text-sm font-medium text-[var(--success)] flex items-center gap-1">
                            ↓ 38s <span className="text-[var(--text-secondary)]">improvement</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT: Action Card (Resume) */}
            <div className="flex flex-col p-8 rounded-lg border border-[var(--accent)] bg-[var(--surface)] relative group">
                <div className="flex items-center justify-between mb-6">
                    <div className="text-[var(--accent)] font-bold text-sm uppercase tracking-wider">Resume Training</div>
                    <div className="text-[var(--text-secondary)] text-sm">Level {level} · Arrays</div>
                </div>

                <div className="flex-1 mb-8">
                    <div className="flex items-baseline justify-between mb-2">
                        <span className="text-[var(--text-secondary)] text-sm">Last solve</span>
                        <span className="text-[var(--text-primary)] font-mono font-medium">3m 42s</span>
                    </div>
                    <div className="flex items-baseline justify-between border-t border-[var(--border)] pt-2">
                        <span className="text-[var(--text-secondary)] text-sm">Target</span>
                        <span className="text-[var(--text-primary)] font-mono font-bold">3m 00s</span>
                    </div>
                </div>

                <button className="w-full flex items-center justify-center gap-2 bg-[var(--text-primary)] text-[var(--bg)] py-3 rounded font-bold hover:bg-zinc-200 transition-colors">
                    Resume <ArrowRight className="h-4 w-4" />
                </button>

                {/* Invisible full-card clickable area */}
                <Link href="/levels" className="absolute inset-0 z-10" aria-label="Resume Training"></Link>
            </div>
        </div>
    );
}

export function MomentumStrip() {
    return (
        <div className="flex items-center gap-8 py-4 mb-12 text-sm border-y border-[var(--border)]">
            <div className="flex items-center gap-2 text-[var(--text-primary)]">
                <span className="font-bold">Streak:</span>
                <span className="tabular-nums">7 days</span>
            </div>
            <div className="w-px h-4 bg-[var(--border)]"></div>
            <div className="flex items-center gap-2 text-[var(--text-primary)]">
                <span className="font-bold">Accuracy:</span>
                <span className="tabular-nums">86%</span>
            </div>
            <div className="w-px h-4 bg-[var(--border)]"></div>
            <div className="flex items-center gap-2 text-[var(--text-primary)]">
                <span className="font-bold">Rank Trend:</span>
                <span className="text-[var(--success)]">↑</span>
            </div>
        </div>
    )
}

export function ContinueSection() {
    return (
        <div className="mb-12">
            <h2 className="text-[var(--text-primary)] text-lg font-bold mb-6">Continue</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Last Problem */}
                <div className="p-6 rounded-lg border border-[var(--border)] bg-[var(--surface)] relative hover:border-[var(--border)] hover:bg-[var(--surface)] transition-none cursor-default group">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <div className="text-[var(--text-secondary)] text-xs uppercase font-bold mb-1">Last Problem</div>
                            <h3 className="text-lg font-bold text-[var(--text-primary)]">Prefix XOR</h3>
                            <div className="text-[var(--text-secondary)] text-sm">Medium · Arrays</div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                        <div className="text-sm">
                            <span className="text-[var(--text-secondary)]">Best: </span>
                            <span className="text-[var(--success)] font-mono">3m 18s</span>
                        </div>
                        <button className="text-sm font-bold text-[var(--accent)] flex items-center gap-1 group-hover:underline">
                            Retry <ArrowRight className="h-4 w-4" />
                        </button>
                    </div>
                    <Link href="/problems/1" className="absolute inset-0 z-10 block" aria-label="Retry Problem"></Link>
                    <div className="relative z-20"> {/* Button isolation if needed, but strict spec says card is clickable or one CTA */}</div>
                </div>

                {/* Last Contest */}
                <div className="p-6 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border)] transition-none cursor-default relative">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <div className="text-[var(--text-secondary)] text-xs uppercase font-bold mb-1">Virtual Contest</div>
                            <h3 className="text-lg font-bold text-[var(--text-primary)]">Round #928 (Div. 2)</h3>
                            <div className="text-[var(--text-secondary)] text-sm">Rank: 312 / 1,400</div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                        <div className="text-sm">
                            <span className="text-[var(--text-secondary)]">Solved: </span>
                            <span className="text-[var(--text-primary)] font-mono">4/5</span>
                        </div>
                        <button className="text-sm font-bold text-[var(--accent)] flex items-center gap-1 hover:underline">
                            Resume <ArrowRight className="h-4 w-4" />
                        </button>
                    </div>
                    <Link href="/contest/1" className="absolute inset-0 z-10" aria-label="Resume Contest"></Link>
                </div>
            </div>
        </div>
    )
}

export function PerformanceInsights() {
    return (
        <div className="mb-20">
            <h2 className="text-[var(--text-primary)] text-lg font-bold mb-6">Performance Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Weak Areas */}
                <div className="p-6 rounded-lg border border-[var(--border)] bg-[var(--surface)]">
                    <div className="flex items-center gap-2 mb-4">
                        <AlertCircle className="h-4 w-4 text-[var(--warning)]" />
                        <span className="font-bold text-[var(--text-primary)]">Weak Topics</span>
                    </div>
                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-sm">
                            <span className="text-[var(--text-primary)]">DP</span>
                            <span className="text-[var(--warning)] font-mono">41%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-[var(--text-primary)]">Graphs</span>
                            <span className="text-[var(--warning)] font-mono">55%</span>
                        </div>
                    </div>
                    <button className="text-sm font-bold text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors flex items-center gap-1">
                        Train Weak Areas <ArrowRight className="h-4 w-4" />
                    </button>
                </div>

                {/* Placeholder for future insight - strict spec only mentioned Weak Areas explicitely as detailed example, relying on "Strict analytics tone" */}
                {/* We won't add decorative cards here. Data or nothing. */}
            </div>
        </div>
    )
}
