'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Layers, FileText, Trophy, User } from 'lucide-react';

const TABS = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/levels', icon: Layers, label: 'Levels' },
    { href: '/problems/all', icon: FileText, label: 'Problems' },
    { href: '/contest', icon: Trophy, label: 'Contest' },
    { href: '/profile', icon: User, label: 'Profile' },
];

export default function MobileNav() {
    const pathname = usePathname();

    // Hide on landing page for unauthenticated users (handled by checking if on unauthenticated landing)
    if (pathname === '/') {
        return null; // Will be conditionally shown based on session in a wrapper if needed
    }

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
            {/* Background with blur */}
            <div className="absolute inset-0 bg-[#09090b]/95 backdrop-blur-xl border-t border-white/[0.06]" />

            {/* Tabs */}
            <div className="relative flex items-center justify-around px-2 h-16 pb-safe">
                {TABS.map((tab) => {
                    const isActive = pathname === tab.href ||
                        (tab.href !== '/' && pathname.startsWith(tab.href));
                    const Icon = tab.icon;

                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            className={`flex flex-col items-center justify-center gap-0.5 min-w-[56px] py-2 rounded-xl transition-all ${isActive
                                    ? 'text-rose-500'
                                    : 'text-zinc-600 active:text-zinc-400'
                                }`}
                        >
                            <div className={`relative p-1.5 rounded-lg transition-all ${isActive ? 'bg-rose-500/10' : ''
                                }`}>
                                <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
                                {isActive && (
                                    <div className="absolute inset-0 rounded-lg bg-rose-500/20 blur-md -z-10" />
                                )}
                            </div>
                            <span className={`text-[10px] font-medium ${isActive ? 'text-rose-500' : ''}`}>
                                {tab.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
