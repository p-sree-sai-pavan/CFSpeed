'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { User, Menu } from 'lucide-react';
import { useState } from 'react';

const LINKS = [
    { href: '/', label: 'Home' },
    { href: '/levels', label: 'Levels' },
    { href: '/problems/all', label: 'Problems' },
    { href: '/contest', label: 'Contest' },
];

export default function Navbar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-zinc-950/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-xl font-bold text-white">
                        CF<span className="text-indigo-400">Speed</span>
                    </span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8">
                    {LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`text-sm font-medium transition-colors ${pathname === link.href ? 'text-white' : 'text-zinc-400 hover:text-white'
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Profile / Sign In */}
                <div className="hidden md:flex items-center gap-4">
                    <Link
                        href="/profile"
                        className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${pathname === '/profile'
                            ? 'bg-white text-black'
                            : 'bg-zinc-900 text-white hover:bg-zinc-800'
                            }`}
                    >
                        {session?.user?.image ? (
                            <img src={session.user.image} alt="Avatar" className="h-5 w-5 rounded-full" />
                        ) : (
                            <User className="h-4 w-4" />
                        )}
                        <span>{session ? 'Profile' : 'Sign In'}</span>
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden text-white"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <Menu className="h-6 w-6" />
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-white/5 bg-zinc-950 px-4 py-4">
                    <div className="flex flex-col gap-4">
                        {LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-sm font-medium text-zinc-400 hover:text-white"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Link
                            href="/profile"
                            className="text-sm font-medium text-indigo-400"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {session ? 'My Profile' : 'Sign In'}
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
