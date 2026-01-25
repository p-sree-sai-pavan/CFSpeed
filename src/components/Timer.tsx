'use client';

import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
    initialSeconds: number;
    onComplete: () => void;
    isActive: boolean;
}

export default function Timer({ initialSeconds, onComplete, isActive }: TimerProps) {
    const [timeLeft, setTimeLeft] = useState(initialSeconds);

    useEffect(() => {
        setTimeLeft(initialSeconds);
    }, [initialSeconds]);

    useEffect(() => {
        if (timeLeft === 0 && isActive) {
            onComplete();
        }
    }, [timeLeft, isActive, onComplete]);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const progress = (timeLeft / initialSeconds) * 100;

    return (
        <div className="flex flex-col items-center">
            <div className="relative mb-4 flex h-48 w-48 items-center justify-center rounded-full bg-zinc-900 shadow-[0_0_40px_-5px_theme(colors.indigo.500/0.3)] ring-1 ring-white/10">
                <svg className="absolute inset-0 h-full w-full -rotate-90 transform">
                    <circle
                        cx="96"
                        cy="96"
                        r="88"
                        fill="none"
                        className="stroke-zinc-800"
                        strokeWidth="12"
                    />
                    <circle
                        cx="96"
                        cy="96"
                        r="88"
                        fill="none"
                        className={`transition-all duration-1000 ease-linear ${timeLeft < 60 ? 'stroke-red-500' : 'stroke-indigo-500'
                            }`}
                        strokeWidth="12"
                        strokeDasharray={2 * Math.PI * 88}
                        strokeDashoffset={2 * Math.PI * 88 * (1 - progress / 100)}
                        strokeLinecap="round"
                    />
                </svg>

                <div className="flex flex-col items-center">
                    <span className="font-mono text-5xl font-bold text-white">
                        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
                    </span>
                    <span className="text-sm font-medium text-zinc-500">REMAINING</span>
                </div>
            </div>
        </div>
    );
}
