"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { COMMUNITIES } from "@/lib/communities";
import { formatNumber } from "@/lib/utils";
import {
  Play,
  ArrowRight,
  Star,
  BookOpen,
  Globe,
  Mic,
  Award,
  ChevronRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { useRef, useState } from "react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

const STATS = [
  { label: "Languages Preserved", value: "6", suffix: "+" },
  { label: "Active Learners", value: "52K", suffix: "+" },
  { label: "Lessons Available", value: "270", suffix: "+" },
  { label: "Contributors", value: "1.2K", suffix: "+" },
];

const FEATURES = [
  {
    icon: BookOpen,
    title: "Structured Lessons",
    desc: "XP-based learning paths from alphabet to fluency, designed like Duolingo.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: Mic,
    title: "Live Pronunciation",
    desc: "Record your voice and compare it with native speaker audio in real time.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    icon: Globe,
    title: "Script Writing",
    desc: "Practice indigenous scripts with stroke-by-stroke animated guides.",
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
  {
    icon: Sparkles,
    title: "AI Cultural Tutor",
    desc: "A friendly AI trained on cultural context, folklore, and language patterns.",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
];

const TESTIMONIALS = [
  {
    quote: "My grandmother couldn't believe I was learning Lepcha. Sikkimverse made it feel natural and fun.",
    name: "Priya Chettri",
    role: "Student, Gangtok",
    avatar: "P",
  },
  {
    quote: "As a community elder, I feel our language is finally getting the platform it deserves.",
    name: "Dawa Bhutia",
    role: "Cultural Preservationist",
    avatar: "D",
  },
  {
    quote: "The writing lessons with animated strokes transformed how I learn the Limbu script.",
    name: "Rohan Subba",
    role: "Language Enthusiast",
    avatar: "R",
  },
];

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, -60]);
  const [hoveredCommunity, setHoveredCommunity] = useState<string | null>(null);

  return (
    <div className="min-h-screen">
      {/* Fixed landing header */}
      <header className="fixed top-0 left-0 right-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl gradient-brand flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">Sv</span>
            </div>
            <span className="font-bold text-lg text-white tracking-tight drop-shadow">Sikkimverse</span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/auth">
              <Button variant="glass" size="sm">Sign in</Button>
            </Link>
            <Link href="/auth?mode=signup">
              <Button variant="accent" size="sm">Get Started Free</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
        {/* Cinematic background */}
        <div className="absolute inset-0 gradient-sikkim opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />

        {/* Decorative mountains */}
        <svg
          className="absolute bottom-0 left-0 right-0 w-full opacity-30"
          viewBox="0 0 1440 200"
          preserveAspectRatio="none"
        >
          <path
            d="M0,200 L0,120 L180,40 L360,100 L540,20 L720,80 L900,10 L1080,70 L1260,30 L1440,90 L1440,200 Z"
            fill="rgba(0,0,0,0.4)"
          />
          <path
            d="M0,200 L0,150 L240,80 L480,130 L720,50 L960,110 L1200,60 L1440,120 L1440,200 Z"
            fill="rgba(0,0,0,0.3)"
          />
        </svg>

        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/40 rounded-full"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 3) * 20}%`,
            }}
            animate={{ y: [0, -20, 0], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.3 }}
          />
        ))}

        <motion.div
          className="relative z-10 max-w-7xl mx-auto px-4 pt-24 pb-20 text-center"
          style={{ opacity: heroOpacity, y: heroY }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-6 bg-white/15 text-white border-white/25 backdrop-blur-sm text-sm px-4 py-1.5">
              🌄 Preserving Living Cultures of Sikkim
            </Badge>
          </motion.div>

          <motion.h1
            className="text-display text-white mb-6 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Learn the Languages
            <br />
            <span className="text-[var(--brand-accent)]">of the Himalayas</span>
          </motion.h1>

          <motion.p
            className="text-lg text-white/80 max-w-xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            An immersive digital platform to learn, preserve, and celebrate the indigenous
            languages and cultures of Sikkim — Bhutia, Lepcha, Limbu, Tamang, and more.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <Link href="/onboarding">
              <Button size="xl" variant="accent" className="shadow-2xl gap-3">
                Start Learning Free
                <ArrowRight size={20} />
              </Button>
            </Link>
            <Link href="/communities">
              <Button size="xl" variant="glass" className="gap-3">
                <Play size={20} />
                Explore Communities
              </Button>
            </Link>
          </motion.div>

          {/* Social proof */}
          <motion.div
            className="mt-12 flex flex-wrap items-center justify-center gap-6 text-white/70 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {["A","B","C","D"].map((l) => (
                  <div key={l} className="w-7 h-7 rounded-full gradient-brand border-2 border-white/30 flex items-center justify-center text-white text-xs font-bold">{l}</div>
                ))}
              </div>
              <span>52K+ learners</span>
            </div>
            <div className="flex items-center gap-1.5">
              {[...Array(5)].map((_, i) => <Star key={i} size={14} className="text-[var(--brand-accent)] fill-current" />)}
              <span>4.9 rating</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-emerald-400" />
              <span>Government recognized</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/40 flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 bg-white/60 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* ── STATS TICKER ── */}
      <section className="bg-[var(--brand-primary)] py-5 overflow-hidden">
        <div className="flex gap-12 px-4 flex-wrap justify-center">
          {STATS.map((stat, i) => (
            <div key={i} className="flex items-center gap-3 text-white">
              <span className="text-2xl font-bold text-[var(--brand-accent)]">
                {stat.value}{stat.suffix}
              </span>
              <span className="text-white/70 text-sm">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── COMMUNITIES ── */}
      <section className="py-24 px-4 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <Badge variant="primary" size="md" className="mb-4">6 Communities</Badge>
            <h2 className="text-headline text-[var(--text-primary)] mb-4">
              Each Culture, Its Own World
            </h2>
            <p className="text-[var(--text-muted)] text-lg max-w-xl mx-auto">
              Every community in Sikkimverse has its own visual identity, learning paths, and cultural universe.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {COMMUNITIES.map((community, i) => (
              <motion.div
                key={community.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Link href={`/communities/${community.id}`}>
                  <div
                    className="relative rounded-3xl overflow-hidden cursor-pointer group"
                    style={{ background: community.colors.bg }}
                    onMouseEnter={() => setHoveredCommunity(community.id)}
                    onMouseLeave={() => setHoveredCommunity(null)}
                  >
                    {/* Gradient overlay */}
                    <div
                      className="absolute inset-0 opacity-60 group-hover:opacity-80 transition-opacity duration-500"
                      style={{ background: community.gradient }}
                    />

                    {/* Pattern overlay */}
                    <div className="absolute inset-0 opacity-5"
                      style={{
                        backgroundImage: `repeating-linear-gradient(45deg, ${community.colors.accent} 0, ${community.colors.accent} 1px, transparent 0, transparent 50%)`,
                        backgroundSize: "20px 20px",
                      }}
                    />

                    <div className="relative p-6 min-h-[220px] flex flex-col justify-between">
                      <div>
                        <div className="text-4xl mb-3">{community.emoji}</div>
                        <h3 className="text-2xl font-bold text-white mb-1">{community.name}</h3>
                        <p className="text-white/70 text-sm font-medium">{community.nativeName}</p>
                        <p className="text-white/60 text-xs mt-2">{community.tagline}</p>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex gap-3 text-white/70 text-xs">
                          <span>{community.lessons} lessons</span>
                          <span>·</span>
                          <span>{formatNumber(community.learners)} learners</span>
                        </div>
                        <motion.div
                          animate={{ x: hoveredCommunity === community.id ? 4 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronRight size={20} className="text-white/60" />
                        </motion.div>
                      </div>

                      {/* Preservation bar */}
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-[10px] text-white/50 mb-1">
                          <span>Preservation Progress</span>
                          <span>{community.preservationLevel}%</span>
                        </div>
                        <div className="h-1 bg-white/20 rounded-full">
                          <div
                            className="h-full rounded-full bg-white/60 transition-all duration-1000"
                            style={{ width: `${community.preservationLevel}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-24 px-4 bg-[var(--surface-raised)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <Badge variant="accent" size="md" className="mb-4">Why Sikkimverse</Badge>
            <h2 className="text-headline text-[var(--text-primary)] mb-4">
              Built for Deep Cultural Learning
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                className="flex gap-5 p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:shadow-[var(--shadow-md)] transition-all duration-300"
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className={`w-12 h-12 rounded-2xl ${f.bg} flex items-center justify-center shrink-0`}>
                  <f.icon size={22} className={f.color} />
                </div>
                <div>
                  <h3 className="font-bold text-[var(--text-primary)] mb-1.5">{f.title}</h3>
                  <p className="text-[var(--text-muted)] text-sm leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 px-4 bg-[var(--background)]">
        <div className="max-w-5xl mx-auto text-center">
          <Badge variant="success" size="md" className="mb-4">Simple & Powerful</Badge>
          <h2 className="text-headline text-[var(--text-primary)] mb-14">
            How SikkimVerse Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Choose Your Community", desc: "Pick a language community and cultural world you want to explore.", icon: Globe },
              { step: "02", title: "Learn Step by Step", desc: "Follow XP-based lessons — alphabet, pronunciation, phrases, and writing.", icon: BookOpen },
              { step: "03", title: "Contribute & Preserve", desc: "Upload stories, record audio, and help grow the cultural archive.", icon: Award },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
              >
                <div className="w-16 h-16 rounded-2xl gradient-brand mx-auto mb-4 flex items-center justify-center shadow-lg">
                  <item.icon size={28} className="text-white" />
                </div>
                <div className="text-xs font-bold text-[var(--brand-accent)] mb-2 tracking-widest">STEP {item.step}</div>
                <h3 className="font-bold text-[var(--text-primary)] text-lg mb-2">{item.title}</h3>
                <p className="text-[var(--text-muted)] text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 px-4 bg-[var(--surface-raised)]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <Badge size="md" className="mb-4">Voices</Badge>
            <h2 className="text-headline text-[var(--text-primary)]">
              Real Stories, Real Impact
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                className="bg-[var(--surface)] rounded-2xl p-6 border border-[var(--border)]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={14} className="text-[var(--brand-accent)] fill-current" />
                  ))}
                </div>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-4 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-brand flex items-center justify-center text-white font-bold text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-[var(--text-primary)]">{t.name}</div>
                    <div className="text-xs text-[var(--text-muted)]">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 gradient-sikkim opacity-95" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-5xl mb-4">🏔️</div>
            <h2 className="text-headline text-white mb-4">
              Your Journey Begins with a Single Word
            </h2>
            <p className="text-white/70 text-lg mb-10 leading-relaxed">
              Join 52,000+ learners preserving the living languages of the Eastern Himalayas.
              7-day free trial. ₹199/month after.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/onboarding">
                <Button size="xl" variant="accent" className="shadow-2xl">
                  Start Your Free Trial
                  <ArrowRight size={20} />
                </Button>
              </Link>
              <Link href="/subscription">
                <Button size="xl" variant="glass">
                  View Pricing
                </Button>
              </Link>
            </div>
            <p className="text-white/50 text-sm mt-6">
              No credit card required · Cancel anytime · 7-day free trial
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[var(--surface)] border-t border-[var(--border)] py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl gradient-brand flex items-center justify-center">
                <span className="text-white font-bold text-sm">Sv</span>
              </div>
              <div>
                <div className="font-bold text-[var(--text-primary)]">Sikkimverse</div>
                <div className="text-xs text-[var(--text-muted)]">Preserving Living Cultures</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-[var(--text-muted)]">
              {["Communities", "Learn", "Archive", "Contribute", "Pricing", "About"].map((l) => (
                <Link key={l} href={`/${l.toLowerCase()}`} className="hover:text-[var(--text-primary)] transition-colors">
                  {l}
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-[var(--border)] text-center text-xs text-[var(--text-muted)]">
            © 2025 Sikkimverse. Preserving the living languages of the Himalayas.
          </div>
        </div>
      </footer>
    </div>
  );
}
