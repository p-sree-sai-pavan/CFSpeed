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

    // Responsive size: smaller on mobile
    const size = { mobile: 160, desktop: 208 };
    const strokeWidth = 6;
    const radius = { mobile: 72, desktop: 96 };

    return (
        <div className="flex flex-col items-center">
            {/* Timer Ring - Responsive */}
            <div className="relative mb-4 md:mb-6 flex h-40 w-40 md:h-52 md:w-52 items-center justify-center">
                {/* Glow effect - reduced on mobile */}
                <div className={`absolute inset-0 rounded-full blur-xl md:blur-2xl transition-all duration-500 ${isCritical ? 'bg-red-500/20' : isUrgent ? 'bg-orange-500/15' : 'bg-rose-500/10'
                    }`} />

                {/* Background ring */}
                <div className="absolute inset-0 rounded-full bg-[#0d0d0f] border border-white/[0.06]" />

                {/* SVG Progress - Mobile */}
                <svg className="absolute inset-0 h-full w-full -rotate-90 transform md:hidden">
                    <circle cx="80" cy="80" r={radius.mobile} fill="none" className="stroke-white/[0.04]" strokeWidth={strokeWidth} />
                    <circle
                        cx="80" cy="80" r={radius.mobile} fill="none"
                        className={`transition-all duration-1000 ease-linear ${isCritical ? 'stroke-red-500' : isUrgent ? 'stroke-orange-500' : 'stroke-rose-500'
                            }`}
                        strokeWidth={strokeWidth}
                        strokeDasharray={2 * Math.PI * radius.mobile}
                        strokeDashoffset={2 * Math.PI * radius.mobile * (1 - progress / 100)}
                        strokeLinecap="round"
                    />
                </svg>

                {/* SVG Progress - Desktop */}
                <svg className="absolute inset-0 h-full w-full -rotate-90 transform hidden md:block">
                    <circle cx="104" cy="104" r={radius.desktop} fill="none" className="stroke-white/[0.04]" strokeWidth={strokeWidth + 2} />
                    <circle
                        cx="104" cy="104" r={radius.desktop} fill="none"
                        className={`transition-all duration-1000 ease-linear ${isCritical ? 'stroke-red-500' : isUrgent ? 'stroke-orange-500' : 'stroke-rose-500'
                            }`}
                        strokeWidth={strokeWidth + 2}
                        strokeDasharray={2 * Math.PI * radius.desktop}
                        strokeDashoffset={2 * Math.PI * radius.desktop * (1 - progress / 100)}
                        strokeLinecap="round"
                    />
                </svg>

                {/* Time Display */}
                <div className="relative flex flex-col items-center z-10">
                    <span className={`font-mono text-4xl md:text-5xl font-semibold tracking-tight transition-colors ${isCritical ? 'text-red-500' : isUrgent ? 'text-orange-400' : 'text-white'
                        }`}>
                        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
                    </span>
                    <span className="text-[10px] md:text-xs font-medium text-zinc-600 uppercase tracking-wider mt-0.5 md:mt-1">
                        remaining
                    </span>
                </div>
            </div>
        </div>
    );
}
