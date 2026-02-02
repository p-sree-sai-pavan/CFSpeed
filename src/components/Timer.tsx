'use client';

import { useEffect, useState, useRef } from 'react';

interface TimerProps {
    initialSeconds: number;
    onComplete: () => void;
    isActive: boolean;
}

export default function Timer({ initialSeconds, onComplete, isActive }: TimerProps) {
    const [timeLeft, setTimeLeft] = useState(initialSeconds);
    const onCompleteRef = useRef(onComplete);
    const hasCompletedRef = useRef(false);

    useEffect(() => {
        onCompleteRef.current = onComplete;
    }, [onComplete]);

    useEffect(() => {
        if (!isActive) {
            setTimeLeft(initialSeconds);
            hasCompletedRef.current = false;
        }
    }, [initialSeconds, isActive]);

    useEffect(() => {
        if (!isActive) return;

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    if (!hasCompletedRef.current) {
                        hasCompletedRef.current = true;
                        onCompleteRef.current();
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isActive]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const progress = initialSeconds > 0 ? (timeLeft / initialSeconds) * 100 : 0;
    const isUrgent = timeLeft < 60;
    const isCritical = timeLeft < 30;

    return (
        <div className="flex flex-col items-center">
            {/* Timer Ring */}
            <div className="relative mb-6 flex h-52 w-52 items-center justify-center">
                {/* Glow effect */}
                <div className={`absolute inset-0 rounded-full blur-2xl transition-all duration-500 ${isCritical ? 'bg-red-500/20' : isUrgent ? 'bg-orange-500/15' : 'bg-indigo-500/10'
                    }`} />

                {/* Background ring */}
                <div className="absolute inset-0 rounded-full bg-[#0d0d0f] border border-white/[0.06]" />

                {/* SVG Progress */}
                <svg className="absolute inset-0 h-full w-full -rotate-90 transform">
                    {/* Track */}
                    <circle
                        cx="104"
                        cy="104"
                        r="96"
                        fill="none"
                        className="stroke-white/[0.04]"
                        strokeWidth="8"
                    />
                    {/* Progress */}
                    <circle
                        cx="104"
                        cy="104"
                        r="96"
                        fill="none"
                        className={`transition-all duration-1000 ease-linear ${isCritical ? 'stroke-red-500' : isUrgent ? 'stroke-orange-500' : 'stroke-indigo-500'
                            }`}
                        strokeWidth="8"
                        strokeDasharray={2 * Math.PI * 96}
                        strokeDashoffset={2 * Math.PI * 96 * (1 - progress / 100)}
                        strokeLinecap="round"
                    />
                </svg>

                {/* Time Display */}
                <div className="relative flex flex-col items-center z-10">
                    <span className={`font-mono text-5xl font-semibold tracking-tight transition-colors ${isCritical ? 'text-red-500' : isUrgent ? 'text-orange-400' : 'text-white'
                        }`}>
                        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
                    </span>
                    <span className="text-xs font-medium text-zinc-600 uppercase tracking-wider mt-1">
                        remaining
                    </span>
                </div>
            </div>
        </div>
    );
}
