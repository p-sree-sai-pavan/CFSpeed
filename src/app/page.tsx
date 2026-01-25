import Link from 'next/link';
import UpcomingContests from '@/components/UpcomingContests';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4 text-center text-white py-20">
      <div className="relative mb-8">
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-75 blur-xl"></div>
        <h1 className="relative text-6xl font-black tracking-tighter md:text-8xl">
          CF<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Speed</span>
        </h1>
      </div>

      <p className="mb-12 max-w-2xl text-lg text-zinc-400 md:text-xl">
        Train your competitive programming speed with adaptive timers based on real contest data.
        Beat the 95th percentile.
      </p>

      <div className="flex flex-col gap-4 sm:flex-row">
        <Link
          href="/levels"
          className="group relative overflow-hidden rounded-full bg-white px-8 py-4 text-lg font-bold text-black transition-transform hover:scale-105"
        >
          <span className="relative z-10">Start Training</span>
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-cyan-400 opacity-0 transition-opacity group-hover:opacity-100" />
        </Link>

        <Link
          href="/contest"
          className="rounded-full bg-zinc-900 px-8 py-4 text-lg font-bold text-white ring-1 ring-white/10 transition-all hover:bg-zinc-800"
        >
          Contest Mode
        </Link>
      </div>

      <div className="mt-20 grid grid-cols-2 gap-8 md:grid-cols-4 w-full max-w-4xl">
        {[
          { label: 'Problems', value: '11,000+' },
          { label: 'Levels', value: '8' },
          { label: 'Skill Stages', value: '6' },
          { label: 'Speed', value: 'Elite' },
        ].map((stat) => (
          <div key={stat.label} className="flex flex-col items-center">
            <span className="text-3xl font-bold text-white">{stat.value}</span>
            <span className="text-sm text-zinc-500 uppercase tracking-widest">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Live News Section */}
      <UpcomingContests />
    </div>
  );
}
