'use client';

import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ReactNode } from 'react';

interface MainWrapperProps {
    children: ReactNode;
}

export default function MainWrapper({ children }: MainWrapperProps) {
    const pathname = usePathname();
    const { data: session, status } = useSession();

    // No padding for unauthenticated users on landing page (no navbar)
    // Don't apply padding during loading to prevent layout shifts
    const isLandingPage = pathname === '/';
    const showNavbar = !isLandingPage || (status !== 'loading' && !!session);

    return (
        <main className={showNavbar ? 'pt-16' : ''}>
            {children}
        </main>
    );
}
