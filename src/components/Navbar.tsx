'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { User, LogOut, Bell, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';

const LINKS = [
    { href: '/', label: 'Home' },
    { href: '/levels', label: 'Levels' },
    { href: '/problems/all', label: 'Problems' },
    { href: '/contest', label: 'Contest' },
    { href: '/progress', label: 'Progress', icon: TrendingUp },
];

export default function Navbar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-none border-b ${scrolled
                ? 'bg-[var(--bg)]/95 border-[var(--border)] backdrop-blur-sm'
                : 'bg-[var(--bg)] border-[var(--border)]'
                }`}
        >
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-8">
                {/* Left: Logo (Primary Navigation) */}
                <Link href="/" className="flex items-center gap-3 group">
                    <Image
                        src="/logo.svg"
                        alt="CFSpeed"
                        width={32}
                        height={32}
                        className="h-8 w-8 rounded-lg"
                    />
                    <span className="text-lg font-bold tracking-tight text-[var(--text-primary)]">
                        CFSpeed
                    </span>
                </Link>

                {/* Center: Navigation Links (Secondary) */}
                <div className="hidden md:flex items-center gap-1">
                    {LINKS.map((link) => {
                        const isActive = pathname === link.href ||
                            (link.href !== '/' && pathname.startsWith(link.href));

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`px-4 py-2 text-sm font-medium rounded transition-colors ${isActive
                                    ? 'text-[var(--text-primary)] bg-[var(--surface)]'
                                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface)]'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </div>

                {/* Right: User Actions (Tertiary) */}
                <div className="flex items-center gap-6">
                    {/* Notifications */}
                    <button className="relative text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                        <Bell className="h-5 w-5" />
                        <span className="absolute -top-1 -right-1 h-2 w-2 bg-[var(--accent)] rounded-full border-2 border-[var(--bg)]"></span>
                    </button>

                    {/* Profile */}
                    <div className="pl-6 border-l border-[var(--border)]">
                        {session ? (
                            <div className="flex items-center gap-3 cursor-pointer group">
                                <div className="text-right hidden sm:block leading-tight">
                                    <div className="text-sm font-bold text-[var(--text-primary)]">
                                        {session.user?.cfRating || 0}
                                    </div>
                                    <div className="text-xs text-[var(--text-secondary)]">Rating</div>
                                </div>
                                {session.user?.image ? (
                                    <Image
                                        src={session.user.image}
                                        alt=""
                                        width={32}
                                        height={32}
                                        className="h-8 w-8 rounded bg-[var(--surface)] ring-1 ring-[var(--border)]"
                                    />
                                ) : (
                                    <div className="h-8 w-8 rounded bg-[var(--surface)] flex items-center justify-center ring-1 ring-[var(--border)]">
                                        <User className="h-4 w-4 text-[var(--text-secondary)]" />
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                href="/api/auth/signin"
                                className="text-sm font-bold text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
