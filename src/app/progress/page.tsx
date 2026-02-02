import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function ProgressPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/api/auth/signin');
    }

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text-primary)] pt-24 pb-20 px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Progress</h1>
                <p className="text-[var(--text-secondary)]">Your analytics and progress tracking will appear here.</p>

                {/* Placeholder for future analytics content */}
                <div className="mt-12 p-8 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-center">
                    <p className="text-[var(--text-secondary)]">Coming Soon</p>
                </div>
            </div>
        </div>
    );
}
