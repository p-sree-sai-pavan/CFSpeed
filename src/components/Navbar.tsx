'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { User, Menu, LogOut, X } from 'lucide-react';
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
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Track scroll for subtle background change
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close menu on route change
    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    // Hide navbar for unauthenticated users on landing page
    if (status !== 'loading' && !session && pathname === '/') {
        return null;
    }

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${scrolled
                        ? 'bg-[#09090b]/90 backdrop-blur-xl border-b border-white/[0.06]'
                        : 'bg-transparent border-b border-transparent'
                    }`}
            >
                <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-6">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-1.5 group">
                        <span className="text-lg font-semibold tracking-tight">
                            <span className="text-white">CF</span>
                            <span className="text-indigo-400 group-hover:text-indigo-300 transition-colors">Speed</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
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
                    <div className="hidden md:flex items-center gap-2">
                        <Link
                            href="/profile"
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all ${pathname === '/profile'
                                    ? 'bg-white text-black'
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
                            <span className="hidden sm:inline">Profile</span>
                        </Link>

                        {session && (
                            <button
                                onClick={() => signOut({ callbackUrl: '/' })}
                                className="p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-white/[0.06] transition-all"
                                title="Sign out"
                            >
                                <LogOut className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden p-2 -mr-2 text-zinc-400 hover:text-white transition-colors"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-40 md:hidden">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setIsMenuOpen(false)}
                    />

                    {/* Menu Panel */}
                    <div className="absolute top-14 left-0 right-0 bg-[#0d0d0f] border-b border-white/[0.06] p-4">
                        <div className="flex flex-col gap-1">
                            {LINKS.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${isActive
                                                ? 'bg-white/[0.06] text-white'
                                                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                                            }`}
                                    >
                                        {link.label}
                                    </Link>
                                );
                            })}

                            <div className="h-px bg-white/[0.06] my-2" />

                            <Link
                                href="/profile"
                                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-indigo-400 hover:bg-white/[0.04] transition-all"
                            >
                                {session?.user?.image ? (
                                    <img src={session.user.image} alt="" className="h-6 w-6 rounded-full" />
                                ) : (
                                    <User className="h-5 w-5" />
                                )}
                                {session ? 'My Profile' : 'Sign In'}
                            </Link>

                            {session && (
                                <button
                                    onClick={() => signOut({ callbackUrl: '/' })}
                                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-zinc-500 hover:text-red-400 hover:bg-white/[0.04] transition-all"
                                >
                                    <LogOut className="h-5 w-5" />
                                    Sign Out
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
