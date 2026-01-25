'use client';

import { useMemo } from 'react';

interface RatingGraphProps {
    history: {
        contestId: number;
        contestName: string;
        rank: number;
        ratingUpdateTimeSeconds: number;
        oldRating: number;
        newRating: number;
    }[];
}

const COLORS = [
    { limit: 1200, color: '#cccccc' }, // Newbie
    { limit: 1400, color: '#77ff77' }, // Pupil
    { limit: 1600, color: '#77ddbb' }, // Specialist
    { limit: 1900, color: '#aaaaaa' }, // Expert (Violet usually but CF uses blueish) -> wait, standard colors:
    // Gray <1200, Green <1400, Cyan <1600, Blue <1900, Violet <2100, Orange <2300, Orange <2400, Red >2400
];
// Simplified CF Colors for background bands
const BANDS = [
    { min: 0, max: 1199, color: 'rgba(200,200,200,0.1)' },
    { min: 1200, max: 1399, color: 'rgba(0,255,0,0.1)' },
    { min: 1400, max: 1599, color: 'rgba(3,168,158,0.1)' },
    { min: 1600, max: 1899, color: 'rgba(0,0,255,0.1)' },
    { min: 1900, max: 2099, color: 'rgba(170,0,170,0.1)' },
    { min: 2100, max: 2399, color: 'rgba(255,140,0,0.1)' },
    { min: 2400, max: 4000, color: 'rgba(255,0,0,0.1)' },
];

export default function RatingGraph({ history }: RatingGraphProps) {
    const { points, width, height, minX, maxX, minY, maxY } = useMemo(() => {
        if (!history || history.length === 0) return { points: [], width: 800, height: 300, minX: 0, maxX: 0, minY: 0, maxY: 0 };

        const width = 800;
        const height = 300;
        const padding = 20;

        const sorted = [...history].sort((a, b) => a.ratingUpdateTimeSeconds - b.ratingUpdateTimeSeconds);

        let minX = sorted[0].ratingUpdateTimeSeconds;
        let maxX = sorted[sorted.length - 1].ratingUpdateTimeSeconds;
        // Add some padding to X
        const xRange = maxX - minX || 1;

        // Ratings
        const ratings = sorted.map(h => h.newRating);
        let minY = Math.min(...ratings, 1000); // Floor at 1000 usually
        let maxY = Math.max(...ratings, 1400); // Ceiling at 1400 usually
        const yRange = maxY - minY || 1;

        const points = sorted.map(h => {
            const x = padding + ((h.ratingUpdateTimeSeconds - minX) / xRange) * (width - 2 * padding);
            const y = height - (padding + ((h.newRating - minY) / yRange) * (height - 2 * padding));
            return { x, y, data: h };
        });

        return { points, width, height, minX, maxX, minY, maxY };
    }, [history]);

    if (history.length === 0) {
        return <div className="p-8 text-center text-zinc-500 bg-zinc-900/50 rounded-lg">No contest history derived</div>;
    }

    // Generate Path
    const pathD = points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ');

    return (
        <div className="w-full overflow-hidden bg-white/5 rounded-xl border border-white/10 p-4">
            <h3 className="text-lg font-bold text-zinc-300 mb-4">Rating History</h3>
            <div className="relative w-full aspect-[21/9]">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
                    {/* Background Bands */}
                    {BANDS.map((band, i) => {
                        // Convert ratings to Y coords
                        // Higher rating = Lower Y (closer to 0)
                        // minRating corresponds to height-padding
                        const yBottomRating = Math.max(band.min, minY);
                        const yTopRating = Math.min(band.max, maxY);

                        if (yBottomRating > yTopRating) return null;

                        const yBottom = height - (20 + ((yBottomRating - minY) / (maxY - minY)) * (height - 40));
                        const yTop = height - (20 + ((yTopRating - minY) / (maxY - minY)) * (height - 40));

                        return (
                            <rect
                                key={i}
                                x={0}
                                y={yTop}
                                width={width}
                                height={yBottom - yTop}
                                fill={band.color}
                            />
                        );
                    })}

                    {/* Grid Lines */}
                    {/* Path */}
                    <path d={pathD} fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

                    {/* Points */}
                    {points.map((p, i) => (
                        <circle
                            key={i}
                            cx={p.x}
                            cy={p.y}
                            r="3"
                            className="fill-zinc-900 stroke-amber-400 stroke-2 hover:r-5 transition-all cursor-pointer"
                        >
                            <title>{`${p.data.contestName}: ${p.data.newRating}`}</title>
                        </circle>
                    ))}
                </svg>
            </div>
        </div>
    );
}
