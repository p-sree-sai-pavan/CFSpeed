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
    <div className="min-h-screen bg-[#09090b] pt-20 pb-16 px-4 md:px-6">
      <div className="mx-auto max-w-5xl">

        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-white mb-4">
            Welcome back
          </h1>
          <p className="text-zinc-500 text-lg max-w-lg mx-auto mb-8">
            Continue training your competitive programming speed.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/levels"
              className="inline-flex items-center justify-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-semibold text-sm hover:bg-zinc-100 transition-all"
            >
              Start Training
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contest"
              className="inline-flex items-center justify-center gap-2 bg-white/[0.04] text-white px-6 py-3 rounded-xl font-semibold text-sm border border-white/[0.06] hover:bg-white/[0.08] transition-all"
            >
              <Trophy className="h-4 w-4 text-orange-400" />
              Contest Mode
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-16">
          {[
            { label: 'Problems', value: '11,000+' },
            { label: 'Levels', value: '8' },
            { label: 'Stages', value: '6' },
            { label: 'Target', value: 'Top 5%' },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <div className="text-2xl font-semibold text-white mb-1">{stat.value}</div>
              <div className="text-xs text-zinc-600 uppercase tracking-wide">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Start Cards */}
        <div className="grid md:grid-cols-2 gap-4 mb-12">
          <Link href="/levels" className="group">
            <div className="p-6 rounded-xl bg-[#0d0d0f] border border-white/[0.06] hover:border-white/[0.1] transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-indigo-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Speed Training</h3>
              </div>
              <p className="text-zinc-500 text-sm mb-4">
                Practice individual problems with adaptive time limits based on real contest data.
              </p>
              <div className="flex items-center gap-2 text-sm text-indigo-400 font-medium group-hover:gap-3 transition-all">
                Browse Levels <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </Link>

          <Link href="/contest" className="group">
            <div className="p-6 rounded-xl bg-[#0d0d0f] border border-white/[0.06] hover:border-white/[0.1] transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-orange-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Virtual Contest</h3>
              </div>
              <p className="text-zinc-500 text-sm mb-4">
                Simulate real contests with 5 problems back-to-back under time pressure.
              </p>
              <div className="flex items-center gap-2 text-sm text-orange-400 font-medium group-hover:gap-3 transition-all">
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
