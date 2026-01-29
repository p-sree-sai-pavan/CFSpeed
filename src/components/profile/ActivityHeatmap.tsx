'use client';

import { useMemo } from 'react';

interface ActivityHeatmapProps {
    submissions: {
        creationTimeSeconds: number;
        verdict: string;
    }[];
}

export default function ActivityHeatmap({ submissions }: ActivityHeatmapProps) {
    const { weeks, maxCount } = useMemo(() => {
        if (!submissions || submissions.length === 0) return { weeks: [], maxCount: 0 };
        
        const submissionsLength = submissions.length;

        // 1. Group by Day
        const dailyCounts = new Map<string, number>();
        submissions.forEach(sub => {
            const date = new Date(sub.creationTimeSeconds * 1000).toISOString().split('T')[0];
            dailyCounts.set(date, (dailyCounts.get(date) || 0) + 1);
        });

        // 2. Generate Grid (Last 365 Days)
        // End date = Today
        const endDate = new Date();
        // Start date = 365 days ago
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 364);

        // Adjust startDate to be a Sunday to align grid properly?
        // CF style columns are weeks (Sun-Sat or Mon-Sun).
        // Let's iterate day by day.

        const yearDays: { date: string; count: number }[] = [];
        let max = 0;

        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            const dateStr = d.toISOString().split('T')[0];
            const count = dailyCounts.get(dateStr) || 0;
            if (count > max) max = count;
            yearDays.push({ date: dateStr, count });
        }

        // Group into weeks
        const weeksArr = [];
        let currentWeek = [];
        for (let i = 0; i < yearDays.length; i++) {
            currentWeek.push(yearDays[i]);
            if (currentWeek.length === 7 || i === yearDays.length - 1) {
                weeksArr.push(currentWeek);
                currentWeek = [];
            }
        }

        // Actually, typical Heatmap is Column=Week, Row=Day (0-6).
        // So we need to ensure the FIRST day starts at the correct DayOfWeek offset.
        // But for simplicity, we can just render a flex grid of weeks.

        return { weeks: weeksArr, maxCount: max };
    }, [submissions?.length, submissions?.[0]?.creationTimeSeconds, submissions?.[submissions.length - 1]?.creationTimeSeconds]);

    // Color Scale
    const getColor = (count: number) => {
        if (count === 0) return 'bg-zinc-800/50';
        if (count === 1) return 'bg-green-900';
        if (count < 3) return 'bg-green-700';
        if (count < 5) return 'bg-green-500';
        return 'bg-green-400';
    };

    return (
        <div className="w-full bg-white/5 rounded-xl border border-white/10 p-4 mt-6">
            <h3 className="text-lg font-bold text-zinc-300 mb-4">Activity Year</h3>
            <div className="flex gap-1 overflow-x-auto pb-2">
                {weeks.map((week, wIndex) => (
                    <div key={wIndex} className="flex flex-col gap-1">
                        {week.map((day, dIndex) => (
                            <div
                                key={day.date}
                                className={`w-3 h-3 rounded-sm ${getColor(day.count)}`}
                                title={`${day.date}: ${day.count} submissions`}
                            />
                        ))}
                    </div>
                ))}
            </div>
            <div className="flex justify-end items-center gap-2 mt-2 text-xs text-zinc-500">
                <span>Less</span>
                <div className="w-3 h-3 bg-zinc-800/50 rounded-sm" />
                <div className="w-3 h-3 bg-green-900 rounded-sm" />
                <div className="w-3 h-3 bg-green-700 rounded-sm" />
                <div className="w-3 h-3 bg-green-500 rounded-sm" />
                <div className="w-3 h-3 bg-green-400 rounded-sm" />
                <span>More</span>
            </div>
        </div>
    );
}
