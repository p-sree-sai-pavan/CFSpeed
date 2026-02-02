'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';

interface ScrollFadeProps {
    children: ReactNode;
    className?: string;
    delay?: number;
}

export function ScrollFade({ children, className = '', delay = 0 }: ScrollFadeProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        // Check for reduced motion preference
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);

        if (mediaQuery.matches) {
            setIsVisible(true);
            return;
        }

        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(() => setIsVisible(true), delay);
                    observer.unobserve(el);
                }
            },
            { threshold: 0.1, rootMargin: '0px 0px -10% 0px' }
        );

        observer.observe(el);

        // Failsafe: Force visibility after a short delay if observer fails
        const failsafeTimeout = setTimeout(() => {
            setIsVisible(true);
        }, 500);

        return () => {
            observer.disconnect();
            clearTimeout(failsafeTimeout);
        };
    }, [delay]);

    return (
        <div
            ref={ref}
            className={className}
            style={prefersReducedMotion ? {} : {
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)`,
                willChange: 'opacity, transform',
            }}
        >
            {children}
        </div>
    );
}

export function ScrollScale({ children, className = '', delay = 0 }: ScrollFadeProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        // Check for reduced motion preference
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);

        if (mediaQuery.matches) {
            setIsVisible(true);
            return;
        }

        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(() => setIsVisible(true), delay);
                    observer.unobserve(el);
                }
            },
            { threshold: 0.1 }
        );

        observer.observe(el);

        // Failsafe: Force visibility after a short delay if observer fails
        const failsafeTimeout = setTimeout(() => {
            setIsVisible(true);
        }, 500);

        return () => {
            observer.disconnect();
            clearTimeout(failsafeTimeout);
        };
    }, [delay]);

    return (
        <div
            ref={ref}
            className={className}
            style={prefersReducedMotion ? {} : {
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'scale(1)' : 'scale(0.98)',
                transition: `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)`,
                willChange: 'opacity, transform',
            }}
        >
            {children}
        </div>
    );
}
