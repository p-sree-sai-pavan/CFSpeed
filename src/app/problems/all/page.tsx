'use client';

import { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, ExternalLink, Check, X } from 'lucide-react';
import { STAGES } from '@/lib/constants';
import AuthGuard from '@/components/AuthGuard';

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
    const [problems, setProblems] = useState<Problem[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [selectedStage, setSelectedStage] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({ key: 'rating', direction: 'asc' });

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
            }
        } catch (error) {
            if (error instanceof Error && error.name === 'AbortError') return;
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

    const SortIcon = ({ column }: { column: string }) => {
        if (sortConfig.key !== column) return null;
        return <span className="ml-1 text-indigo-400">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>;
    };

    return (
        <AuthGuard>
            <div className="min-h-screen bg-[#09090b] pt-20 pb-16 px-4 md:px-6">
                <div className="mx-auto max-w-6xl">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-white mb-1">
                            Problem Library
                        </h1>
                        <p className="text-zinc-500 text-sm">
                            {total > 0 ? `${total.toLocaleString()} problems available` : 'Loading...'}
                        </p>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-6">
                        <select
                            value={selectedStage}
                            onChange={(e) => { setSelectedStage(e.target.value); setPage(1); }}
                            className="px-4 py-2.5 rounded-lg bg-[#0d0d0f] border border-white/[0.06] text-sm text-zinc-300 focus:outline-none focus:border-white/[0.15] transition-colors"
                        >
                            <option value="">All Stages</option>
                            {STAGES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>

                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                            <input
                                type="text"
                                placeholder="Search problems..."
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#0d0d0f] border border-white/[0.06] text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white/[0.15] transition-colors"
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="rounded-xl bg-[#0d0d0f] border border-white/[0.06] overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/[0.06]">
                                        <th
                                            className="px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider cursor-pointer hover:text-zinc-300 transition-colors w-16"
                                            onClick={() => handleSort('status')}
                                        >
                                            <SortIcon column="status" />
                                        </th>
                                        <th
                                            className="px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider cursor-pointer hover:text-zinc-300 transition-colors"
                                            onClick={() => handleSort('rating')}
                                        >
                                            Rating<SortIcon column="rating" />
                                        </th>
                                        <th
                                            className="px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider cursor-pointer hover:text-zinc-300 transition-colors"
                                            onClick={() => handleSort('name')}
                                        >
                                            Problem<SortIcon column="name" />
                                        </th>
                                        <th
                                            className="px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider cursor-pointer hover:text-zinc-300 transition-colors"
                                            onClick={() => handleSort('stage')}
                                        >
                                            Stage<SortIcon column="stage" />
                                        </th>
                                        <th className="px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                                            Tags
                                        </th>
                                        <th className="px-4 py-3 w-24"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/[0.03]">
                                    {loading ? (
                                        [...Array(10)].map((_, i) => (
                                            <tr key={i}>
                                                <td className="px-4 py-3.5"><div className="h-4 w-4 rounded bg-white/[0.04] skeleton" /></td>
                                                <td className="px-4 py-3.5"><div className="h-4 w-10 rounded bg-white/[0.04] skeleton" /></td>
                                                <td className="px-4 py-3.5"><div className="h-4 w-48 rounded bg-white/[0.04] skeleton" /></td>
                                                <td className="px-4 py-3.5"><div className="h-4 w-20 rounded bg-white/[0.04] skeleton" /></td>
                                                <td className="px-4 py-3.5"><div className="h-4 w-32 rounded bg-white/[0.04] skeleton" /></td>
                                                <td className="px-4 py-3.5"></td>
                                            </tr>
                                        ))
                                    ) : problems.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-16 text-center text-zinc-600">
                                                No problems found
                                            </td>
                                        </tr>
                                    ) : (
                                        problems.map((problem) => (
                                            <tr
                                                key={`${problem.contest_id}-${problem.index}`}
                                                className="group hover:bg-white/[0.02] transition-colors"
                                            >
                                                <td className="px-4 py-3.5">
                                                    {problem.status === 'solved' && (
                                                        <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                                            <Check className="h-3 w-3 text-emerald-500" />
                                                        </div>
                                                    )}
                                                    {problem.status === 'wrong' && (
                                                        <div className="w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center">
                                                            <X className="h-3 w-3 text-red-500" />
                                                        </div>
                                                    )}
                                                    {problem.status === 'unsolved' && (
                                                        <div className="w-5 h-5 rounded-full border border-zinc-800" />
                                                    )}
                                                </td>
                                                <td className="px-4 py-3.5">
                                                    <span className="font-mono text-sm font-medium text-indigo-400">
                                                        {problem.rating || '—'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3.5">
                                                    <div className="font-medium text-white text-sm">{problem.name}</div>
                                                    <div className="text-zinc-600 text-xs mt-0.5">{problem.contest_id}{problem.index}</div>
                                                </td>
                                                <td className="px-4 py-3.5">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-white/[0.04] text-zinc-400 border border-white/[0.06]">
                                                        {problem.stage.toUpperCase()} • {problem.level}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3.5">
                                                    <div className="flex flex-wrap gap-1">
                                                        {Array.from(new Set(problem.tags)).slice(0, 2).map((tag, i) => (
                                                            <span key={`${tag}-${i}`} className="text-[11px] text-zinc-600 bg-white/[0.03] px-1.5 py-0.5 rounded">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                        {problem.tags.length > 2 && (
                                                            <span className="text-[11px] text-zinc-700">+{problem.tags.length - 2}</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3.5">
                                                    <a
                                                        href={`https://codeforces.com/contest/${problem.contest_id}/problem/${problem.index}`}
                                                        target="_blank"
                                                        className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
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
                        <div className="px-4 py-3 border-t border-white/[0.06] flex items-center justify-between">
                            <span className="text-xs text-zinc-600">
                                {(page - 1) * 20 + 1}–{Math.min(page * 20, total)} of {total.toLocaleString()}
                            </span>
                            <div className="flex gap-1">
                                <button
                                    disabled={page === 1 || loading}
                                    onClick={() => setPage(p => p - 1)}
                                    className="p-1.5 rounded-md bg-white/[0.04] hover:bg-white/[0.08] disabled:opacity-30 disabled:cursor-not-allowed text-zinc-400 hover:text-white transition-all"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                                <button
                                    disabled={page * 20 >= total || loading}
                                    onClick={() => setPage(p => p + 1)}
                                    className="p-1.5 rounded-md bg-white/[0.04] hover:bg-white/[0.08] disabled:opacity-30 disabled:cursor-not-allowed text-zinc-400 hover:text-white transition-all"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthGuard>
    );
}
