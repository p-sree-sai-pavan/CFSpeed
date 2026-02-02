'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { User, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';

const LINKS = [
    { href: '/', label: 'Home' },
    { href: '/levels', label: 'Levels' },
    { href: '/problems/all', label: 'Problems' },
    { href: '/contest', label: 'Contest' },
];

export default function Navbar() {
    const pathname = usePathname();
    const { data: session, status } = useSession();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Hide navbar for unauthenticated users on landing page
    // But during loading, show navbar skeleton on non-landing pages to prevent CLS
    if (pathname === '/') {
        // On landing page, hide during loading (will show landing hero)
        // Only show navbar if session exists
        if (status === 'loading' || !session) {
            return null;
        }
    }

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 hidden md:block transition-all duration-200 ${scrolled
                ? 'bg-[#09090b]/90 backdrop-blur-xl border-b border-white/[0.06]'
                : 'bg-transparent border-b border-transparent'
                }`}
        >
            <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 lg:px-6">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <img
                        src="/logo.svg"
                        alt="CFSpeed"
                        className="h-8 w-8 rounded-lg"
                    />
                    <span className="text-lg font-semibold tracking-tight">
                        <span className="text-white">CF</span>
                        <span className="text-rose-500 group-hover:text-rose-400 transition-colors">Speed</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="flex items-center gap-1">
                    {LINKS.map((link) => {
                        const isActive = pathname === link.href ||
                            (link.href !== '/' && pathname.startsWith(link.href));

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`relative px-3 py-1.5 text-[13px] font-medium rounded-md transition-all ${isActive
                                    ? 'text-white'
                                    : 'text-zinc-500 hover:text-zinc-300'
                                    }`}
                            >
                                {link.label}
                                {isActive && (
                                    <span className="absolute inset-0 bg-white/[0.06] rounded-md -z-10" />
                                )}
                            </Link>
                        );
                    })}
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-2">
                    <Link
                        href="/profile"
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all ${pathname === '/profile'
                            ? 'bg-rose-500 text-white'
                            : 'text-zinc-400 hover:text-white hover:bg-white/[0.06]'
                            }`}
                    >
                        {session?.user?.image ? (
                            <img
                                src={session.user.image}
                                alt=""
                                className="h-5 w-5 rounded-full ring-1 ring-white/10"
                            />
                        ) : (
                            <User className="h-4 w-4" />
                        )}
                        <span>Profile</span>
                    </Link>

                    {session && (
                        <button
                            onClick={() => signOut({ callbackUrl: '/' })}
                            className="p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-white/[0.06] transition-all"
                            title="Sign out"
                            aria-label="Sign out"
                        >
                            <LogOut className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}
