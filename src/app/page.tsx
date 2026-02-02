import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import LandingPage from '@/components/LandingPage';
import {
  ProgressHero,
  MomentumStrip,
  ContinueSection,
  PerformanceInsights
} from '@/components/dashboard/DashboardComponents';

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <LandingPage />;
  }

  // Safe defaults if data is missing
  const rating = session.user?.cfRating || 0;
  // TODO: Fetch real level from DB once `Level` is effectively integrated into User/Session
  const level = "4";

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-primary)] pt-24 pb-20 px-8">
      <div className="max-w-7xl mx-auto">

        {/* 2. Hero Section: "Progress Hero" */}
        <ProgressHero
          level={level}
          rating={rating}
        />

        {/* 3. Momentum Strip */}
        <MomentumStrip />

        {/* 4. Continue Section */}
        <ContinueSection />

        {/* 5. Performance Insights */}
        <PerformanceInsights />

        {/* Footer Minimal */}
        <footer className="mt-20 border-t border-[var(--border)] pt-8 flex justify-between text-sm text-[var(--text-secondary)]">
          <div className="flex gap-8">
            <a href="#" className="hover:text-[var(--text-primary)] transition-colors">About</a>
            <a href="#" className="hover:text-[var(--text-primary)] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[var(--text-primary)] transition-colors">Contact</a>
          </div>
          <div>
            © CFSpeed
          </div>
        </footer>

      </div>
    </div>
  );
}
