"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  BookOpen,
  Mic,
  PenTool,
  Sparkles,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import { COMMUNITIES } from "@/lib/communities";
import { formatNumber } from "@/lib/utils";
import { Progress } from "@/components/ui/Progress";

/* ─────────────────────────── helpers ─────────────────────────── */

const STATS = [
  { value: "230,000+", label: "Total Speakers" },
  { value: "21,000+", label: "Active Learners" },
  { value: "10", label: "Communities" },
  { value: "280+", label: "Lessons" },
];

const FEATURES = [
  {
    icon: BookOpen,
    title: "Structured Learning",
    description:
      "Curriculum designed by native speakers. Bite-sized lessons from alphabets to full sentences, built around daily life and cultural context.",
    accent: "#c4401a",
  },
  {
    icon: Mic,
    title: "Live Pronunciation",
    description:
      "Real-time phoneme analysis with feedback tuned for tonal and aspirated Himalayan sounds that standard speech engines miss.",
    accent: "#d4aa4a",
  },
  {
    icon: PenTool,
    title: "Script Writing",
    description:
      "Interactive stroke-by-stroke guides for Lepcha Róng, Sirijonga, Ranjana, Jenticha, and other beautiful indigenous scripts.",
    accent: "#22c55e",
  },
  {
    icon: Sparkles,
    title: "AI Cultural Tutor",
    description:
      "An AI companion that understands cultural nuance, proverbs, and oral traditions — not just vocabulary and grammar.",
    accent: "#8b5cf6",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "My grandmother cried when she heard me greet her in Lepcha for the first time. SikkimVerse gave me back a part of myself I didn't know I'd lost.",
    name: "Tenzin Rongong",
    role: "Software engineer, Gangtok",
    emoji: "🌿",
  },
  {
    quote:
      "The Sirijonga script module is extraordinary. I've tried other apps, but nothing comes close to how this captures the musicality of Limbu.",
    name: "Pema Yangchen",
    role: "Teacher, East Sikkim",
    emoji: "🦅",
  },
  {
    quote:
      "As a linguist documenting endangered languages, I recommend SikkimVerse to every community member. The cultural context embedded in each lesson is remarkable.",
    name: "Dr. Asha Gurung",
    role: "Linguist, Tribhuvan University",
    emoji: "🌸",
  },
];

/* ─────────────────────── Mountain SVG ─────────────────────────── */

function MountainSilhouette() {
  return (
    <svg
      viewBox="0 0 1440 280"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute bottom-0 left-0 w-full"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {/* Far mountains */}
      <path
        d="M0,280 L0,180 L120,80 L240,160 L360,60 L480,140 L600,40 L720,120 L840,50 L960,130 L1080,45 L1200,125 L1320,70 L1440,140 L1440,280 Z"
        fill="rgba(255,255,255,0.04)"
      />
      {/* Mid mountains */}
      <path
        d="M0,280 L0,220 L80,140 L200,200 L320,110 L440,180 L560,90 L680,170 L800,100 L920,165 L1040,85 L1160,160 L1280,95 L1380,155 L1440,120 L1440,280 Z"
        fill="rgba(255,255,255,0.06)"
      />
      {/* Foreground silhouette */}
      <path
        d="M0,280 L0,240 L60,180 L160,240 L260,160 L380,230 L500,150 L620,210 L740,140 L860,205 L980,145 L1100,215 L1220,155 L1340,225 L1440,180 L1440,280 Z"
        fill="rgba(0,0,0,0.35)"
      />
    </svg>
  );
}

/* ─────────────────────── Floating emoji card ──────────────────── */

function FloatingCard({
  emoji,
  name,
  delay,
  x,
  y,
  scrollY,
  parallaxFactor,
}: {
  emoji: string;
  name: string;
  delay: number;
  x: string;
  y: string;
  scrollY: ReturnType<typeof useScroll>["scrollY"];
  parallaxFactor: number;
}) {
  const translateY = useTransform(scrollY, [0, 600], [0, parallaxFactor * 60]);

  return (
    <motion.div
      className="absolute hidden lg:flex items-center gap-2 glass rounded-2xl px-3 py-2 text-sm font-medium text-white shadow-lg select-none pointer-events-none"
      style={{ left: x, top: y, translateY }}
      initial={{ opacity: 0, scale: 0.7, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="text-lg" aria-hidden="true">{emoji}</span>
      <span className="text-xs opacity-90">{name}</span>
    </motion.div>
  );
}

/* ─────────────────────── Marquee strip ────────────────────────── */

function CommunitiesMarquee() {
  const items = [...COMMUNITIES, ...COMMUNITIES]; // duplicate for seamless loop

  return (
    <section className="relative overflow-hidden py-6 bg-[var(--surface-raised)] border-y border-[var(--border)]">
      <div
        className="flex gap-8 whitespace-nowrap"
        style={{
          animation: "marquee 28s linear infinite",
        }}
      >
        {items.map((c, i) => (
          <span
            key={`${c.id}-${i}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] px-1"
          >
            <span className="text-lg" aria-hidden="true">{c.emoji}</span>
            {c.name}
            <span className="text-[var(--text-muted)] font-normal">{c.nativeName}</span>
            <span className="text-[var(--border)] mx-2">·</span>
          </span>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}

/* ─────────────────────── Community card ───────────────────────── */

function CommunityCard({ community }: { community: (typeof COMMUNITIES)[0] }) {
  const preservationColor =
    community.preservation >= 55
      ? "success"
      : community.preservation >= 40
      ? "xp"
      : "brand";

  return (
    <Link
      href={`/communities/${community.id}`}
      className="group relative overflow-hidden rounded-2xl flex flex-col min-h-[220px] transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
      style={{ background: community.gradient }}
      aria-label={`${community.name} community — ${formatNumber(community.speakers)} speakers`}
    >
      {/* Overlay shimmer on hover */}
      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.04] transition-colors duration-300 rounded-2xl" />

      <div className="relative z-10 p-5 flex flex-col h-full">
        {/* Top row */}
        <div className="flex items-start justify-between mb-auto">
          <div>
            <span className="text-3xl mb-2 block" aria-hidden="true">{community.emoji}</span>
            <h3
              className="text-base font-bold leading-tight"
              style={{ color: community.colors.text }}
            >
              {community.name}
            </h3>
            <p
              className="text-xs mt-0.5 opacity-70"
              style={{ color: community.colors.text }}
            >
              {community.nativeName}
            </p>
          </div>
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{
              background: "rgba(255,255,255,0.15)",
              color: community.colors.text,
            }}
          >
            {community.region}
          </span>
        </div>

        {/* Bottom info */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-xs" style={{ color: community.colors.text }}>
            <span className="opacity-70">Speakers</span>
            <span className="font-semibold">{formatNumber(community.speakers)}</span>
          </div>

          {/* Preservation bar */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1" style={{ color: community.colors.text }}>
              <span className="opacity-70">Preservation</span>
              <span className="font-semibold">{community.preservation}%</span>
            </div>
            <Progress
              value={community.preservation}
              size="sm"
              color={preservationColor}
              trackClassName="bg-white/10"
            />
          </div>

          <div className="flex items-center justify-between text-xs" style={{ color: community.colors.text }}>
            <span className="opacity-70">Script</span>
            <span className="font-medium opacity-80 text-right max-w-[60%] truncate">{community.script}</span>
          </div>
        </div>

        {/* Arrow indicator */}
        <div
          className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          aria-hidden="true"
        >
          <ArrowRight className="h-4 w-4" style={{ color: community.colors.text }} />
        </div>
      </div>
    </Link>
  );
}

/* ─────────────────────── Main page ────────────────────────────── */

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* ══════════════════════════════════════════════════
          1. HERO
      ══════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden gradient-sikkim pt-16"
        aria-label="Hero"
      >
        {/* Decorative radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(196,64,26,0.25) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />

        {/* Floating community cards */}
        {[
          { emoji: "🌿", name: "Lepcha",  delay: 0.2, x: "6%",  y: "20%", pf: -0.8 },
          { emoji: "🏯", name: "Bhutia",  delay: 0.4, x: "82%", y: "18%", pf: -1.2 },
          { emoji: "🦅", name: "Limbu",   delay: 0.6, x: "4%",  y: "55%", pf: -0.6 },
          { emoji: "🥁", name: "Tamang",  delay: 0.3, x: "85%", y: "50%", pf: -1.0 },
          { emoji: "🌾", name: "Rai",     delay: 0.7, x: "10%", y: "75%", pf: -0.5 },
          { emoji: "🌸", name: "Gurung",  delay: 0.5, x: "80%", y: "74%", pf: -0.9 },
          { emoji: "🏔️", name: "Sherpa",  delay: 0.8, x: "46%", y: "82%", pf: -0.4 },
          { emoji: "⚔️", name: "Mangar",  delay: 0.9, x: "2%",  y: "38%", pf: -1.1 },
          { emoji: "🏛️", name: "Newar",   delay: 1.0, x: "88%", y: "36%", pf: -0.7 },
          { emoji: "📜", name: "Sunwar",  delay: 1.1, x: "54%", y: "12%", pf: -1.3 },
        ].map((c) => (
          <FloatingCard
            key={c.name}
            emoji={c.emoji}
            name={c.name}
            delay={c.delay}
            x={c.x}
            y={c.y}
            scrollY={scrollY}
            parallaxFactor={c.pf}
          />
        ))}

        {/* Headline content */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-semibold text-white/90 tracking-wide uppercase">
              <span aria-hidden="true">🏔️</span>
              10 Indigenous Languages of Sikkim
            </span>
          </motion.div>

          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.15 } },
            }}
          >
            {["Preserve.", "Learn.", "Celebrate."].map((word) => (
              <motion.span
                key={word}
                className="block"
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
                }}
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="text-base sm:text-lg text-white/70 max-w-2xl leading-relaxed mb-10"
          >
            SikkimVerse is the living library of Himalayan voices — from Lepcha forest songs
            to Bhutia monastery chants. Learn with native speakers, master ancient scripts,
            and become a guardian of endangered languages.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <Link
              href="/auth?mode=signup"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm bg-white text-[#c4401a] hover:bg-white/90 transition-colors duration-200 shadow-lg"
            >
              Get Started — it&apos;s free
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/communities"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm glass text-white hover:bg-white/15 transition-colors duration-200"
            >
              Explore Communities
            </Link>
          </motion.div>
        </div>

        {/* Mountain silhouette */}
        <MountainSilhouette />

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/40 z-10"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          aria-hidden="true"
        >
          <ChevronDown className="h-6 w-6" />
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════
          2. STATS BAR
      ══════════════════════════════════════════════════ */}
      <section
        className="bg-[var(--surface)] border-b border-[var(--border)] py-10 px-6"
        aria-label="Key statistics"
      >
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="flex flex-col items-center text-center"
            >
              <span className="text-3xl sm:text-4xl font-black text-[var(--brand-primary)] leading-none mb-1">
                {stat.value}
              </span>
              <span className="text-sm text-[var(--text-muted)]">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          3. COMMUNITIES MARQUEE
      ══════════════════════════════════════════════════ */}
      <CommunitiesMarquee />

      {/* ══════════════════════════════════════════════════
          4. FEATURES GRID
      ══════════════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-[var(--background)]" aria-labelledby="features-heading">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-[var(--brand-primary)] mb-3">
              Platform
            </span>
            <h2
              id="features-heading"
              className="text-3xl sm:text-4xl font-black text-[var(--text-primary)] leading-tight"
            >
              Built for real language learning
            </h2>
            <p className="mt-4 text-[var(--text-secondary)] max-w-xl mx-auto">
              Every feature is designed in partnership with indigenous communities to ensure
              authentic, respectful, and effective learning.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="group relative p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--brand-primary)]/40 transition-colors duration-300 overflow-hidden"
                >
                  {/* Accent glow */}
                  <div
                    className="absolute -top-8 -right-8 h-24 w-24 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl"
                    style={{ background: f.accent }}
                    aria-hidden="true"
                  />
                  <div
                    className="inline-flex items-center justify-center h-11 w-11 rounded-xl mb-4"
                    style={{ background: `${f.accent}20` }}
                    aria-hidden="true"
                  >
                    <Icon className="h-5 w-5" style={{ color: f.accent }} />
                  </div>
                  <h3 className="text-base font-bold text-[var(--text-primary)] mb-2">
                    {f.title}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {f.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          5. COMMUNITIES GRID
      ══════════════════════════════════════════════════ */}
      <section
        className="py-24 px-6 bg-[var(--surface-raised)]"
        aria-labelledby="communities-heading"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-[var(--brand-primary)] mb-3">
              Communities
            </span>
            <h2
              id="communities-heading"
              className="text-3xl sm:text-4xl font-black text-[var(--text-primary)] leading-tight"
            >
              Ten voices. One mountain range.
            </h2>
            <p className="mt-4 text-[var(--text-secondary)] max-w-xl mx-auto">
              Each community has its own script, songs, and stories. Choose yours and begin
              your journey.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {COMMUNITIES.map((community, i) => (
              <motion.div
                key={community.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.45 }}
              >
                <CommunityCard community={community} />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-center mt-12"
          >
            <Link
              href="/communities"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--surface)] transition-colors duration-200"
            >
              View all communities
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          6. TESTIMONIALS
      ══════════════════════════════════════════════════ */}
      <section
        className="py-24 px-6 bg-[var(--background)]"
        aria-labelledby="testimonials-heading"
      >
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-[var(--brand-primary)] mb-3">
              Stories
            </span>
            <h2
              id="testimonials-heading"
              className="text-3xl sm:text-4xl font-black text-[var(--text-primary)] leading-tight"
            >
              Voices from the community
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.figure
                key={t.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className="relative flex flex-col p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)]"
              >
                {/* Decorative quote mark */}
                <span
                  className="absolute top-4 right-5 text-5xl font-black text-[var(--brand-primary)] opacity-10 leading-none select-none"
                  aria-hidden="true"
                >
                  &ldquo;
                </span>
                <blockquote className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6 flex-1">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="flex items-center gap-3">
                  <span
                    className="flex items-center justify-center h-9 w-9 rounded-full text-lg"
                    style={{ background: "var(--brand-soft)" }}
                    aria-hidden="true"
                  >
                    {t.emoji}
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-[var(--text-primary)]">
                      {t.name}
                    </div>
                    <div className="text-xs text-[var(--text-muted)]">{t.role}</div>
                  </div>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          7. CTA SECTION
      ══════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden py-28 px-6 gradient-sikkim"
        aria-labelledby="cta-heading"
      >
        {/* Radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 70% at 50% 60%, rgba(212,170,74,0.18) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2
              id="cta-heading"
              className="text-3xl sm:text-5xl font-black text-white leading-tight mb-6"
            >
              Start Your Journey Today
            </h2>
            <p className="text-white/70 text-base sm:text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              Every lesson learned is a thread rewoven into the tapestry of Sikkim&apos;s living
              heritage. Join 21,000+ learners keeping these languages alive.
            </p>
            <Link
              href="/auth?mode=signup"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-sm bg-white text-[#c4401a] hover:bg-white/90 transition-colors duration-200 shadow-xl"
            >
              Get Started — it&apos;s free
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          8. FOOTER
      ══════════════════════════════════════════════════ */}
      <footer className="bg-[var(--surface)] border-t border-[var(--border)] py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 mb-10">
            {/* Logo & tagline */}
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <span
                  className="flex items-center justify-center h-8 w-8 rounded-lg text-base font-bold gradient-brand text-white select-none"
                  aria-hidden="true"
                >
                  S
                </span>
                <span className="text-sm font-bold text-[var(--text-primary)]">
                  SikkimVerse
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] max-w-[220px] leading-relaxed">
                Preserving the indigenous languages of the Himalayas, one lesson at a time.
              </p>
            </div>

            {/* Nav links */}
            <nav aria-label="Footer navigation">
              <ul className="flex flex-wrap gap-x-8 gap-y-3">
                {[
                  { label: "Communities", href: "/communities" },
                  { label: "Learn", href: "/learn/lepcha" },
                  { label: "Archive", href: "/archive" },
                  { label: "About", href: "/about" },
                  { label: "Sign up", href: "/auth?mode=signup" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-150"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-[var(--border-subtle)]">
            <p className="text-xs text-[var(--text-muted)]">
              &copy; {new Date().getFullYear()} SikkimVerse. Made with care for the communities of Sikkim.
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              Built in the Himalayas, for the world.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
