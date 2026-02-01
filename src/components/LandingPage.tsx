'use client';

import { signIn } from 'next-auth/react';
import { Github, Linkedin, Mail, Phone, ArrowRight, ChevronDown } from 'lucide-react';
import { ScrollFade, ScrollScale } from './ScrollAnimations';

const FEATURES = [
    {
        title: 'Adaptive Time Limits',
        description: 'Every problem comes with a target time based on real Codeforces contest data and 95th percentile solving times.',
    },
    {
        title: '8 Difficulty Levels',
        description: 'From Div2A warmups to Div1D challenges. Find your perfect training zone and level up systematically.',
    },
    {
        title: 'Contest Simulation',
        description: 'Simulate real contests with 5 problems back-to-back. Build stamina and perform under pressure.',
    },
    {
        title: 'Speed Analytics',
        description: 'Track your solving speed over time. Identify patterns and focus on what matters.',
    },
];

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-black text-white antialiased">
            {/* Hero Section */}
            <section className="relative min-h-screen flex flex-col items-center justify-center px-6">
                {/* Subtle gradient background */}
                <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-black to-black" />
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] sm:w-[400px] md:w-[600px] h-[300px] md:h-[400px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />

                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    <ScrollFade>
                        <p className="text-neutral-500 text-sm font-medium tracking-wide uppercase mb-6">
                            Speed Training for Competitive Programmers
                        </p>
                    </ScrollFade>

                    <ScrollFade delay={50}>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight leading-[1.1] mb-8">
                            <span className="text-white">Train faster.</span>
                            <br />
                            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
                                Beat the clock.
                            </span>
                        </h1>
                    </ScrollFade>

                    <ScrollFade delay={100}>
                        <p className="text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-12">
                            CFSpeed helps you build competitive programming speed with adaptive timers
                            calibrated to the 95th percentile. 11,000+ problems across 8 levels.
                        </p>
                    </ScrollFade>

                    <ScrollFade delay={150}>
                        <button
                            onClick={() => signIn('google', { callbackUrl: '/' })}
                            className="group inline-flex items-center justify-center gap-2 bg-white text-black px-6 py-3 rounded-lg font-medium text-sm hover:bg-neutral-200 transition-colors mx-auto"
                        >
                            Get started
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </ScrollFade>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-neutral-600 animate-bounce">
                    <ChevronDown className="h-5 w-5" />
                </div>
            </section>

            {/* Stats Bar */}
            <section className="border-y border-neutral-900 bg-neutral-950/50">
                <div className="max-w-6xl mx-auto px-6 py-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { value: '11,000+', label: 'Problems' },
                            { value: '8', label: 'Levels' },
                            { value: '6', label: 'Skill Stages' },
                            { value: '95th', label: 'Percentile' },
                        ].map((stat, i) => (
                            <ScrollScale key={stat.label} delay={i * 50}>
                                <div className="text-center">
                                    <div className="text-3xl md:text-4xl font-semibold text-white mb-1">
                                        {stat.value}
                                    </div>
                                    <div className="text-sm text-neutral-500">{stat.label}</div>
                                </div>
                            </ScrollScale>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 md:py-32 px-6">
                <div className="max-w-5xl mx-auto">
                    <ScrollFade>
                        <div className="text-center mb-16 md:mb-20">
                            <h2 className="text-3xl md:text-4xl font-medium tracking-tight mb-4">
                                Everything you need to get faster
                            </h2>
                            <p className="text-neutral-500 max-w-xl mx-auto">
                                Purpose-built for competitive programmers who want to improve their solving speed.
                            </p>
                        </div>
                    </ScrollFade>

                    <div className="grid md:grid-cols-2 gap-4">
                        {FEATURES.map((feature, i) => (
                            <ScrollFade key={feature.title} delay={i * 75}>
                                <div className="group p-6 rounded-xl border border-neutral-900 bg-neutral-950/50 hover:bg-neutral-900/50 hover:border-neutral-800 transition-all duration-300">
                                    <h3 className="text-lg font-medium text-white mb-2 group-hover:text-violet-400 transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-neutral-500 text-sm leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            </ScrollFade>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-black to-black" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] sm:w-[400px] md:w-[500px] h-[200px] md:h-[300px] bg-violet-600/5 rounded-full blur-[100px] pointer-events-none" />

                <ScrollScale>
                    <div className="relative z-10 max-w-2xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-medium tracking-tight mb-4">
                            Ready to train?
                        </h2>
                        <p className="text-neutral-500 mb-8">
                            Start improving your speed today. It&apos;s free.
                        </p>
                        <button
                            onClick={() => signIn('google', { callbackUrl: '/' })}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white px-8 py-4 rounded-lg font-medium transition-all"
                        >
                            Get started for free
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    </div>
                </ScrollScale>
            </section>

            {/* Footer */}
            <footer className="border-t border-neutral-900 py-12 px-6">
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

                    <div className="mt-8 pt-8 border-t border-neutral-900 text-center">
                        <p className="text-neutral-700 text-sm">
                            © {new Date().getFullYear()} CFSpeed
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
