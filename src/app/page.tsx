import Link from 'next/link';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import UpcomingContests from '@/components/UpcomingContests';
import { getUpcomingContests } from '@/lib/cf';
import LandingPage from '@/components/LandingPage';
import { ArrowRight, Zap, Trophy } from 'lucide-react';

export default async function Home() {
  const session = await getServerSession(authOptions);
  const contests = await getUpcomingContests();

  if (!session) {
    return <LandingPage />;
  }

  return (
    <div className="min-h-screen bg-[#09090b] pt-4 md:pt-20 pb-24 md:pb-16 px-4">
      <div className="mx-auto max-w-5xl">

        {/* Hero */}
        <div className="text-center mb-8 md:mb-16">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-white mb-2 md:mb-4">
            Welcome back
          </h1>
          <p className="text-zinc-500 text-sm md:text-lg max-w-lg mx-auto mb-6 md:mb-8">
            Continue training your competitive programming speed.
          </p>

          <div className="flex flex-col sm:flex-row gap-2 md:gap-3 justify-center">
            <Link
              href="/levels"
              className="inline-flex items-center justify-center gap-2 bg-white text-black px-5 md:px-6 py-3 rounded-xl font-semibold text-sm hover:bg-zinc-100 transition-all active:scale-[0.98]"
            >
              Start Training
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contest"
              className="inline-flex items-center justify-center gap-2 bg-white/[0.04] text-white px-5 md:px-6 py-3 rounded-xl font-semibold text-sm border border-white/[0.06] hover:bg-white/[0.08] transition-all active:scale-[0.98]"
            >
              <Trophy className="h-4 w-4 text-orange-400" />
              Contest Mode
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-8 md:mb-16">
          {[
            { label: 'Problems', value: '11,000+' },
            { label: 'Levels', value: '8' },
            { label: 'Stages', value: '6' },
            { label: 'Target', value: 'Top 5%' },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-3 md:p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <div className="text-lg md:text-2xl font-semibold text-white mb-0.5 md:mb-1">{stat.value}</div>
              <div className="text-[10px] md:text-xs text-zinc-600 uppercase tracking-wide">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Start Cards */}
        <div className="grid md:grid-cols-2 gap-3 md:gap-4 mb-8 md:mb-12">
          <Link href="/levels" className="group">
            <div className="p-4 md:p-6 rounded-xl bg-[#0d0d0f] border border-white/[0.06] hover:border-white/[0.1] transition-all active:scale-[0.99]">
              <div className="flex items-center gap-3 mb-3 md:mb-4">
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-rose-500/10 flex items-center justify-center">
                  <Zap className="h-4 w-4 md:h-5 md:w-5 text-rose-400" />
                </div>
                <h3 className="text-base md:text-lg font-semibold text-white">Speed Training</h3>
              </div>
              <p className="text-zinc-500 text-xs md:text-sm mb-3 md:mb-4">
                Practice with adaptive time limits based on real contest data.
              </p>
              <div className="flex items-center gap-2 text-xs md:text-sm text-rose-400 font-medium group-hover:gap-3 transition-all">
                Browse Levels <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </Link>

          <Link href="/contest" className="group">
            <div className="p-4 md:p-6 rounded-xl bg-[#0d0d0f] border border-white/[0.06] hover:border-white/[0.1] transition-all active:scale-[0.99]">
              <div className="flex items-center gap-3 mb-3 md:mb-4">
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                  <Trophy className="h-4 w-4 md:h-5 md:w-5 text-orange-400" />
                </div>
                <h3 className="text-base md:text-lg font-semibold text-white">Virtual Contest</h3>
              </div>
              <p className="text-zinc-500 text-xs md:text-sm mb-3 md:mb-4">
                Simulate real contests with 5 problems under time pressure.
              </p>
              <div className="flex items-center gap-2 text-xs md:text-sm text-orange-400 font-medium group-hover:gap-3 transition-all">
                Start Contest <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </Link>
        </div>

        {/* Upcoming Contests */}
        <UpcomingContests contests={contests} />
      </div>
    </div>
  );
}
