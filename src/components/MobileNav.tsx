'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Home, Layers, BookOpen, Trophy, User } from 'lucide-react';

const NAV_ITEMS = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/levels', label: 'Levels', icon: Layers },
    { href: '/problems/all', label: 'Problems', icon: BookOpen },
    { href: '/contest', label: 'Contest', icon: Trophy },
    { href: '/profile', label: 'Profile', icon: User },
];

export default function MobileNav() {
    const pathname = usePathname();
    const { data: session, status } = useSession();

    // Hide for unauthenticated users on landing page
    if (status !== 'loading' && !session && pathname === '/') {
        return null;
    }

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
            {/* Glass background */}
            <div className="absolute inset-0 bg-[#09090b]/95 backdrop-blur-xl border-t border-white/[0.06]" />

            {/* Safe area padding for notched phones */}
            <div className="relative flex items-center justify-around h-16 pb-safe">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href ||
                        (item.href !== '/' && pathname.startsWith(item.href));
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center justify-center gap-0.5 px-3 py-2 min-w-[64px] transition-all ${isActive
                                    ? 'text-white'
                                    : 'text-zinc-600 active:text-zinc-400'
                                }`}
                        >
                            <div className={`relative p-1.5 rounded-xl transition-all ${isActive ? 'bg-white/[0.08]' : ''
                                }`}>
                                <Icon className={`h-5 w-5 transition-transform ${isActive ? 'scale-110' : ''
                                    }`} />
                                {isActive && (
                                    <div className="absolute inset-0 bg-indigo-500/20 rounded-xl blur-md -z-10" />
                                )}
                            </div>
                            <span className={`text-[10px] font-medium transition-all ${isActive ? 'text-white' : 'text-zinc-500'
                                }`}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
