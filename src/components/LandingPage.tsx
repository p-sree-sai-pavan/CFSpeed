'use client';

import { signIn } from 'next-auth/react';
import Image from 'next/image';
import { Github, Linkedin, Mail, Phone, ArrowRight, Zap, Target, Trophy, BarChart3 } from 'lucide-react';
import { ScrollFade, ScrollScale } from './ScrollAnimations';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0b] text-white antialiased overflow-x-hidden">
            {/* Noise overlay for texture */}
            <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-50 pointer-events-none z-0" />

            {/* Hero Section */}
            <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20">
                {/* Ambient glow - very subtle */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-rose-600/8 via-transparent to-transparent blur-3xl pointer-events-none" />
                <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

                <div className="relative z-10 max-w-5xl mx-auto text-center">
                    {/* Badge */}
                    <ScrollFade>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-neutral-400 text-sm font-medium">Speed Training for Competitive Programmers</span>
                        </div>
                    </ScrollFade>

                    {/* Main Headline */}
                    <ScrollFade delay={50}>
                        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-semibold tracking-[-0.02em] leading-[1.05] mb-6">
                            <span className="text-white">Build competitive</span>
                            <br />
                            <span className="text-white">programming </span>
                            <span className="bg-gradient-to-r from-rose-400 via-red-400 to-rose-500 bg-clip-text text-transparent">speed</span>
                        </h1>
                    </ScrollFade>

                    {/* Subheadline */}
                    <ScrollFade delay={100}>
                        <p className="text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
                            Train with adaptive timers calibrated to the 95th percentile of real contest data.
                            11,000+ problems. 8 difficulty levels. Track your progress.
                        </p>
                    </ScrollFade>

                    {/* CTAs */}
                    <ScrollFade delay={150}>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                onClick={() => signIn('google', { callbackUrl: '/' })}
                                className="group inline-flex items-center justify-center gap-2 bg-white text-black px-6 py-3.5 rounded-xl font-semibold text-sm hover:bg-neutral-100 transition-all shadow-lg shadow-white/10"
                            >
                                Start training free
                                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                            <a href="#features" className="text-neutral-400 hover:text-white text-sm font-medium transition-colors">
                                Learn more →
                            </a>
                        </div>
                    </ScrollFade>
                </div>

                {/* Hero Product Image - Tilted Perspective */}
                <ScrollScale delay={200}>
                    <div className="relative mt-20 w-full max-w-6xl mx-auto px-4">
                        {/* Glow effect behind */}
                        <div className="absolute inset-0 bg-gradient-to-t from-rose-600/20 via-rose-600/10 to-transparent blur-3xl scale-90 -translate-y-10" />

                        {/* Main mockup container with perspective */}
                        <div className="relative" style={{ perspective: '2000px' }}>
                            <div
                                className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50 bg-[#0d0d0e]"
                                style={{
                                    transform: 'rotateX(8deg) rotateY(0deg)',
                                    transformOrigin: 'center bottom'
                                }}
                            >
                                {/* Browser chrome */}
                                <div className="flex items-center gap-2 px-4 py-3 bg-[#141415] border-b border-white/5">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                                        <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                                        <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                                    </div>
                                    <div className="flex-1 flex justify-center">
                                        <div className="px-4 py-1 rounded-md bg-white/5 text-neutral-500 text-xs font-mono">
                                            cfspeed.vercel.app
                                        </div>
                                    </div>
                                </div>
                                <img
                                    src="/levels.png"
                                    alt="CFSpeed - Select Your Level"
                                    className="w-full h-auto"
                                />
                            </div>
                        </div>

                        {/* Floating secondary mockup - left */}
                        <div
                            className="absolute -left-8 md:left-4 top-1/3 w-48 md:w-64 rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-[#0d0d0e] hidden md:block"
                            style={{
                                transform: 'rotateY(15deg) rotateX(5deg) translateZ(50px)',
                                transformOrigin: 'right center'
                            }}
                        >
                            <img
                                src="/timer.png"
                                alt="Timer"
                                className="w-full h-auto"
                            />
                            {/* Glassmorphism overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        </div>

                        {/* Floating secondary mockup - right */}
                        <div
                            className="absolute -right-8 md:right-4 top-1/4 w-48 md:w-64 rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-[#0d0d0e] hidden md:block"
                            style={{
                                transform: 'rotateY(-15deg) rotateX(5deg) translateZ(50px)',
                                transformOrigin: 'left center'
                            }}
                        >
                            <img
                                src="/contest.png"
                                alt="Contest Mode"
                                className="w-full h-auto"
                            />
                            {/* Glassmorphism overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        </div>
                    </div>
                </ScrollScale>
            </section>

            {/* Stats Section - Minimal */}
            <section className="relative py-24 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                        {[
                            { value: '11,000+', label: 'Problems' },
                            { value: '8', label: 'Difficulty Levels' },
                            { value: '6', label: 'Skill Stages' },
                            { value: '95th', label: 'Percentile Target' },
                        ].map((stat, i) => (
                            <ScrollFade key={stat.label} delay={i * 50}>
                                <div className="text-center">
                                    <div className="text-4xl md:text-5xl font-semibold text-white tracking-tight mb-2">
                                        {stat.value}
                                    </div>
                                    <div className="text-sm text-neutral-500 font-medium">{stat.label}</div>
                                </div>
                            </ScrollFade>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="relative py-32 px-6">
                {/* Subtle background */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-rose-950/5 to-transparent" />

                <div className="relative z-10 max-w-6xl mx-auto">
                    <ScrollFade>
                        <div className="text-center mb-20">
                            <p className="text-rose-400 text-sm font-semibold tracking-wide uppercase mb-4">
                                Why CFSpeed
                            </p>
                            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">
                                Everything you need to get faster
                            </h2>
                            <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
                                Purpose-built for competitive programmers who want to improve their solving speed systematically.
                            </p>
                        </div>
                    </ScrollFade>

                    <div className="grid md:grid-cols-2 gap-6">
                        {[
                            {
                                icon: Zap,
                                title: 'Adaptive Time Limits',
                                description: 'Every problem comes with a target time based on real Codeforces contest data. Beat the 95th percentile.',
                                color: 'from-amber-500 to-orange-500'
                            },
                            {
                                icon: Target,
                                title: '8 Difficulty Levels',
                                description: 'From Div2A warmups to Div1E challenges. Find your perfect training zone and level up systematically.',
                                color: 'from-rose-500 to-red-500'
                            },
                            {
                                icon: Trophy,
                                title: 'Contest Simulation',
                                description: 'Simulate real contests with 5 problems back-to-back. Build stamina and perform under pressure.',
                                color: 'from-emerald-500 to-teal-500'
                            },
                            {
                                icon: BarChart3,
                                title: 'Speed Analytics',
                                description: 'Track your solving speed over time. Identify patterns, measure progress, and focus on what matters.',
                                color: 'from-blue-500 to-cyan-500'
                            },
                        ].map((feature, i) => (
                            <ScrollFade key={feature.title} delay={i * 75}>
                                <div className="group relative p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all duration-300">
                                    {/* Icon */}
                                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} mb-6`}>
                                        <feature.icon className="w-6 h-6 text-white" />
                                    </div>

                                    <h3 className="text-xl font-semibold text-white mb-3">
                                        {feature.title}
                                    </h3>
                                    <p className="text-neutral-400 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            </ScrollFade>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="relative py-32 px-6">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-600/5 rounded-full blur-[150px] pointer-events-none" />

                <div className="relative z-10 max-w-6xl mx-auto">
                    <ScrollFade>
                        <div className="text-center mb-20">
                            <p className="text-emerald-400 text-sm font-semibold tracking-wide uppercase mb-4">
                                How It Works
                            </p>
                            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">
                                Systematic speed training
                            </h2>
                            <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
                                A data-driven approach built on real Codeforces submissions.
                            </p>
                        </div>
                    </ScrollFade>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Step 1 */}
                        <ScrollScale delay={0}>
                            <div className="relative group">
                                <div className="absolute -inset-px bg-gradient-to-b from-rose-500/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="relative h-full p-8 rounded-2xl bg-[#0d0d0e] border border-white/5">
                                    <div className="text-6xl font-bold text-white/10 mb-6">01</div>
                                    <h3 className="text-xl font-semibold text-white mb-4">Choose Your Level</h3>
                                    <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                                        8 difficulty levels from A (Div2A) to H (Div1E+). Each mapped to real Codeforces contest difficulty.
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map((level) => (
                                            <span key={level} className="px-3 py-1.5 text-xs font-bold rounded-lg bg-white/5 text-white/70 border border-white/5">
                                                {level}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </ScrollScale>

                        {/* Step 2 */}
                        <ScrollScale delay={100}>
                            <div className="relative group">
                                <div className="absolute -inset-px bg-gradient-to-b from-emerald-500/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="relative h-full p-8 rounded-2xl bg-[#0d0d0e] border border-white/5">
                                    <div className="text-6xl font-bold text-white/10 mb-6">02</div>
                                    <h3 className="text-xl font-semibold text-white mb-4">Select Your Stage</h3>
                                    <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                                        6 skill stages from Elite (top 5%) to Beginner (top 95%). Each with different time targets.
                                    </p>
                                    <div className="space-y-2">
                                        {[
                                            { name: 'Elite', pct: '5%' },
                                            { name: 'Excellent', pct: '20%' },
                                            { name: 'Standard', pct: '40%' },
                                        ].map((stage) => (
                                            <div key={stage.name} className="flex justify-between text-xs">
                                                <span className="text-white/70 font-medium">{stage.name}</span>
                                                <span className="text-neutral-500">Top {stage.pct}</span>
                                            </div>
                                        ))}
                                        <div className="text-neutral-600 text-xs text-center pt-1">+ 3 more stages</div>
                                    </div>
                                </div>
                            </div>
                        </ScrollScale>

                        {/* Step 3 */}
                        <ScrollScale delay={200}>
                            <div className="relative group">
                                <div className="absolute -inset-px bg-gradient-to-b from-cyan-500/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="relative h-full p-8 rounded-2xl bg-[#0d0d0e] border border-white/5">
                                    <div className="text-6xl font-bold text-white/10 mb-6">03</div>
                                    <h3 className="text-xl font-semibold text-white mb-4">Beat the Clock</h3>
                                    <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                                        Adaptive timers based on 95th percentile of real submissions. Train to compete.
                                    </p>
                                    <div className="relative h-16 bg-black/50 rounded-xl overflow-hidden border border-white/5">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-3xl font-mono font-bold text-white">09:34</span>
                                        </div>
                                        <div className="absolute bottom-0 left-0 h-1 w-2/3 bg-gradient-to-r from-emerald-500 to-teal-500" />
                                    </div>
                                </div>
                            </div>
                        </ScrollScale>
                    </div>
                </div>
            </section>

            {/* Product Showcase Grid */}
            <section className="relative py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <ScrollFade>
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
                                See it in action
                            </h2>
                            <p className="text-neutral-500">
                                A clean, focused interface designed for speed.
                            </p>
                        </div>
                    </ScrollFade>

                    {/* Bento Grid */}
                    <div className="grid md:grid-cols-3 gap-4">
                        {/* Large - Problems Library */}
                        <ScrollScale delay={0}>
                            <div className="md:col-span-2 relative group rounded-2xl overflow-hidden bg-[#0d0d0e] border border-white/5">
                                <div className="absolute inset-0 bg-gradient-to-br from-rose-600/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <img src="/problems.png" alt="Problem Library" className="w-full h-auto" />
                                <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
                                    <h3 className="text-lg font-semibold text-white">Problem Library</h3>
                                    <p className="text-neutral-400 text-sm">Browse 11,000+ curated problems</p>
                                </div>
                            </div>
                        </ScrollScale>

                        {/* Small - Profile */}
                        <ScrollScale delay={100}>
                            <div className="relative group rounded-2xl overflow-hidden bg-[#0d0d0e] border border-white/5">
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <img src="/profile.png" alt="Profile" className="w-full h-auto" />
                                <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
                                    <h3 className="text-lg font-semibold text-white">Your Profile</h3>
                                    <p className="text-neutral-400 text-sm">Track your progress</p>
                                </div>
                            </div>
                        </ScrollScale>

                        {/* Small - Timer */}
                        <ScrollScale delay={150}>
                            <div className="relative group rounded-2xl overflow-hidden bg-[#0d0d0e] border border-white/5">
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <img src="/timer.png" alt="Timer" className="w-full h-auto" />
                                <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
                                    <h3 className="text-lg font-semibold text-white">Adaptive Timer</h3>
                                    <p className="text-neutral-400 text-sm">Real-time countdown</p>
                                </div>
                            </div>
                        </ScrollScale>

                        {/* Large - Contest */}
                        <ScrollScale delay={200}>
                            <div className="md:col-span-2 relative group rounded-2xl overflow-hidden bg-[#0d0d0e] border border-white/5">
                                <div className="absolute inset-0 bg-gradient-to-br from-orange-600/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <img src="/contest.png" alt="Contest Mode" className="w-full h-auto" />
                                <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
                                    <h3 className="text-lg font-semibold text-white">Contest Mode</h3>
                                    <p className="text-neutral-400 text-sm">Simulate 5-problem virtual contests</p>
                                </div>
                            </div>
                        </ScrollScale>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative py-32 px-6">
                <div className="absolute inset-0 bg-gradient-to-t from-rose-950/10 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-rose-600/10 rounded-full blur-[150px] pointer-events-none" />

                <ScrollScale>
                    <div className="relative z-10 max-w-3xl mx-auto text-center">
                        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">
                            Ready to get faster?
                        </h2>
                        <p className="text-neutral-400 text-lg mb-10">
                            Join competitive programmers who are training smarter. It's free to start.
                        </p>
                        <button
                            onClick={() => signIn('google', { callbackUrl: '/' })}
                            className="group inline-flex items-center justify-center gap-2 bg-white text-black px-8 py-4 rounded-xl font-semibold hover:bg-neutral-100 transition-all shadow-lg shadow-white/10"
                        >
                            Start training now
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </div>
                </ScrollScale>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/5 py-12 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="text-center md:text-left">
                            <p className="text-neutral-600 text-sm mb-1">Built by</p>
                            <p className="text-white font-medium">Pittala Sree Sai Pavan</p>
                        </div>

                        <div className="flex items-center gap-6">
                            <a
                                href="https://github.com/pavan90507"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-neutral-600 hover:text-white transition-colors"
                                aria-label="GitHub"
                            >
                                <Github className="h-5 w-5" />
                            </a>
                            <a
                                href="https://linkedin.com/in/pavan90507"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-neutral-600 hover:text-white transition-colors"
                                aria-label="LinkedIn"
                            >
                                <Linkedin className="h-5 w-5" />
                            </a>
                            <a
                                href="mailto:pavan90507@gmail.com"
                                className="text-neutral-600 hover:text-white transition-colors"
                                aria-label="Email"
                            >
                                <Mail className="h-5 w-5" />
                            </a>
                            <a
                                href="tel:+919090507XXX"
                                className="text-neutral-600 hover:text-white transition-colors"
                                aria-label="Phone"
                            >
                                <Phone className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-white/5 text-center">
                        <p className="text-neutral-700 text-sm">
                            © {new Date().getFullYear()} CFSpeed
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
