'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ChevronLeft, ChevronRight, ExternalLink, CheckCircle, XCircle, Filter } from 'lucide-react';
import { STAGES } from '@/lib/constants';

interface Problem {
    contest_id: number;
    index: string;
    name: string;
    rating?: number;
    tags: string[];
    stage: string;
    level: string;
    status?: string;
}

export default function ProblemsListPage() {
    const router = useRouter();
    const [problems, setProblems] = useState<Problem[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [selectedStage, setSelectedStage] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({ key: 'rating', direction: 'asc' });

    // Debounce search
    const [debouncedSearch, setDebouncedSearch] = useState('');
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 500);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        const controller = new AbortController();
        fetchProblems(controller.signal);
        return () => controller.abort();
    }, [page, debouncedSearch, selectedStage, sortConfig]);

    const fetchProblems = async (signal?: AbortSignal) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '20',
                search: debouncedSearch,
                stage: selectedStage,
                sortBy: sortConfig.key,
                sortOrder: sortConfig.direction
            });
            const res = await fetch(`/api/problems/list?${params}`, { signal });
            const data = await res.json();
            if (res.ok && Array.isArray(data.problems)) {
                setProblems(data.problems);
                setTotal(data.total);
            } else {
                setProblems([]);
                console.error('API Error:', data.error);
            }
        } catch (error) {
            if (error instanceof Error && error.name === 'AbortError') return;
            console.error('Error:', error);
            setProblems([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    return (
        <div className="min-h-screen bg-zinc-950 px-4 py-20 text-white relative overflow-hidden">
            {/* Background Blob */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-900/20 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />

            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Problem <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Library</span></h1>
                        <p className="text-zinc-400">Browse all {total > 0 ? total.toLocaleString() : '...'} available problems.</p>
                    </div>

                    <div className="flex gap-4">
                        {/* Stage Filter */}
                        <select
                            value={selectedStage}
                            onChange={(e) => { setSelectedStage(e.target.value); setPage(1); }}
                            className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
                            style={{ backgroundImage: 'none' }} // Custom styling usually hides arrow
                        >
                            <option value="">All Stages</option>
                            {STAGES.map(s => <option key={s.id} value={s.id}>{s.name} ({s.id})</option>)}
                        </select>

                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                            <input
                                type="text"
                                placeholder="Search problems or tags..."
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                className="bg-zinc-900 border border-white/10 rounded-xl pl-10 pr-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all focus:w-80"
                            />
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-white/5 overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 text-zinc-400 text-sm uppercase tracking-wider">
                                    <th className="p-4 font-medium cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('status')}>
                                        Status {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th className="p-4 font-medium cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('rating')}>
                                        Rating {sortConfig.key === 'rating' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th className="p-4 font-medium cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('name')}>
                                        Problem {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th className="p-4 font-medium cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('stage')}>
                                        Stage / Level {sortConfig.key === 'stage' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th className="p-4 font-medium">Tags</th>
                                    <th className="p-4 font-medium text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {loading ? (
                                    [...Array(10)].map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td className="p-4"><div className="h-4 bg-white/5 rounded w-8"></div></td>
                                            <td className="p-4"><div className="h-4 bg-white/5 rounded w-8"></div></td>
                                            <td className="p-4"><div className="h-4 bg-white/5 rounded w-48"></div></td>
                                            <td className="p-4"><div className="h-4 bg-white/5 rounded w-24"></div></td>
                                            <td className="p-4"><div className="h-4 bg-white/5 rounded w-32"></div></td>
                                            <td className="p-4"></td>
                                        </tr>
                                    ))
                                ) : problems.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="p-12 text-center text-zinc-500">
                                            No problems found.
                                        </td>
                                    </tr>
                                ) : (
                                    problems.map((problem) => (
                                        <tr key={`${problem.contest_id}-${problem.index}`} className="hover:bg-white/5 transition-colors group">
                                            <td className="p-4">
                                                {problem.status === 'solved' && <CheckCircle className="h-5 w-5 text-green-500" />}
                                                {problem.status === 'wrong' && <XCircle className="h-5 w-5 text-red-500" />}
                                                {problem.status === 'unsolved' && <div className="h-5 w-5 rounded-full border border-zinc-700" />}
                                            </td>
                                            <td className="p-4 font-mono text-indigo-400 font-bold">{problem.rating}</td>
                                            <td className="p-4">
                                                <div className="font-bold text-white">{problem.name}</div>
                                                <div className="text-zinc-500 text-xs">{problem.contest_id}{problem.index}</div>
                                            </td>
                                            <td className="p-4">
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-medium border border-indigo-500/20 uppercase">
                                                    {problem.stage} • {problem.level}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {(() => {
                                                        const uniqueTags = Array.from(new Set(problem.tags));
                                                        const displayTags = uniqueTags.slice(0, 3);
                                                        const remaining = uniqueTags.length - 3;
                                                        return (
                                                            <>
                                                                {displayTags.map((tag, i) => (
                                                                    <span key={`${tag}-${i}`} className="text-xs text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded">
                                                                        {tag}
                                                                    </span>
                                                                ))}
                                                                {remaining > 0 && <span className="text-xs text-zinc-600">+{remaining}</span>}
                                                            </>
                                                        );
                                                    })()}
                                                </div>
                                            </td>
                                            <td className="p-4 text-right">
                                                <a
                                                    href={`https://codeforces.com/contest/${problem.contest_id}/problem/${problem.index}`}
                                                    target="_blank"
                                                    className="inline-flex items-center gap-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                                >
                                                    Solve <ExternalLink className="h-3 w-3" />
                                                </a>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="p-4 border-t border-white/5 flex items-center justify-between">
                        <div className="text-sm text-zinc-500">
                            Showing {(page - 1) * 20 + 1} to {Math.min(page * 20, total)} of {total}
                        </div>
                        <div className="flex gap-2">
                            <button
                                disabled={page === 1 || loading}
                                onClick={() => setPage(p => p - 1)}
                                className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-white transition-colors"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            <button
                                disabled={page * 20 >= total || loading}
                                onClick={() => setPage(p => p + 1)}
                                className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-white transition-colors"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
