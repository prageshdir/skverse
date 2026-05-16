"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Flame,
  Zap,
  Trophy,
  CheckCircle2,
  Circle,
  Globe,
  Archive,
  Bot,
  PenLine,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import { useAuth } from "@/lib/store";
import { getMyStreak, type StreakData } from "@/lib/api";
import { COMMUNITIES } from "@/lib/communities";
import { cn, formatNumber, timeAgo } from "@/lib/utils";

// ── Constants / mock data ─────────────────────────────────────────────────────

const TODAY_XP = 35;
const DAILY_GOAL_XP = 50;

const DAILY_TASKS = [
  { label: "Complete 1 lesson", done: true },
  { label: "Practice writing", done: true },
  { label: "Listen to a story", done: false },
  { label: "Review flashcards", done: false },
];

const ACHIEVEMENTS = [
  { emoji: "🔥", label: "7-Day Streak", desc: "Keep the fire going!", color: "text-orange-500" },
  { emoji: "⚡", label: "100 XP", desc: "Lightning learner", color: "text-amber-500" },
  { emoji: "📚", label: "Lesson Master", desc: "Completed 10 lessons", color: "text-violet-500" },
];

const QUICK_LINKS = [
  { label: "Communities", href: "/communities", icon: Globe },
  { label: "Archive", href: "/archive", icon: Archive },
  { label: "AI Tutor", href: "/tutor", icon: Bot },
  { label: "Contribute", href: "/contribute", icon: PenLine },
];

const ACTIVITY_FEED = [
  {
    id: "1",
    user: "Karma D.",
    action: "contributed audio to",
    target: "Lepcha",
    emoji: "🌿",
    time: new Date(Date.now() - 8 * 60000).toISOString(),
  },
  {
    id: "2",
    user: "Tashi N.",
    action: "completed a lesson in",
    target: "Bhutia",
    emoji: "🏯",
    time: new Date(Date.now() - 34 * 60000).toISOString(),
  },
  {
    id: "3",
    user: "Dichen L.",
    action: "uploaded a story to",
    target: "Sherpa",
    emoji: "🏔️",
    time: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: "4",
    user: "Meena R.",
    action: "earned 100 XP in",
    target: "Limbu",
    emoji: "🦅",
    time: new Date(Date.now() - 5 * 3600000).toISOString(),
  },
];

// ── Stat card ─────────────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  sub,
  iconClass,
  progress,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  iconClass?: string;
  progress?: { value: number; max: number };
}) {
  return (
    <Card className="flex flex-col gap-3 p-5">
      <div className="flex items-center justify-between">
        <span className={cn("p-2 rounded-xl bg-[var(--surface-raised)]", iconClass)}>
          {icon}
        </span>
        <span className="text-xs text-[var(--text-muted)] font-medium">{label}</span>
      </div>
      <div>
        <p className="text-2xl font-bold text-[var(--text-primary)]">{value}</p>
        {sub && (
          <p className="text-xs text-[var(--text-muted)] mt-0.5">{sub}</p>
        )}
      </div>
      {progress && (
        <Progress
          value={progress.value}
          max={progress.max}
          size="sm"
          color="xp"
        />
      )}
    </Card>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const { user } = useAuth();
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [streakLoading, setStreakLoading] = useState(true);

  const lepchaCommunity = COMMUNITIES.find((c) => c.id === "lepcha")!;
  const totalXP = user?.xp ?? 0;
  const firstName = user?.name?.split(" ")[0] ?? null;

  useEffect(() => {
    getMyStreak()
      .then(setStreak)
      .catch(() => setStreak(null))
      .finally(() => setStreakLoading(false));
  }, []);

  const currentStreak = streak?.current ?? user?.streak ?? 0;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="max-w-2xl mx-auto px-4 pt-8 pb-28 space-y-8">

        {/* ── Greeting header ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-start justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">
              Namaste{firstName ? `, ${firstName}` : ""} 👋
            </h1>
            <p className="text-[var(--text-muted)] text-sm mt-1">
              Ready to continue your journey today?
            </p>
          </div>
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="h-12 w-12 rounded-full object-cover border-2 border-[var(--border)] flex-shrink-0"
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-secondary)] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
              {firstName?.[0] ?? "S"}
            </div>
          )}
        </motion.div>

        {/* ── Stat cards row ───────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className="grid grid-cols-3 gap-3"
        >
          <StatCard
            icon={<Flame className="h-5 w-5 text-orange-500" />}
            label="Streak"
            value={streakLoading ? "—" : `${currentStreak}🔥`}
            sub={currentStreak === 1 ? "day" : "days"}
            iconClass="text-orange-500"
          />
          <StatCard
            icon={<Zap className="h-5 w-5 text-amber-500" />}
            label="Today XP"
            value={`${TODAY_XP}/${DAILY_GOAL_XP}`}
            sub="daily goal"
            progress={{ value: TODAY_XP, max: DAILY_GOAL_XP }}
          />
          <StatCard
            icon={<Trophy className="h-5 w-5 text-violet-500" />}
            label="Total XP"
            value={formatNumber(totalXP)}
            sub="all time"
          />
        </motion.div>

        {/* ── Daily goal progress bar ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.14 }}
          className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-4 space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-[var(--text-primary)]">
              Daily Goal
            </span>
            <span className="text-xs text-[var(--text-muted)]">
              {TODAY_XP} / {DAILY_GOAL_XP} XP
            </span>
          </div>
          <Progress
            value={TODAY_XP}
            max={DAILY_GOAL_XP}
            size="md"
            color="xp"
            animated={TODAY_XP < DAILY_GOAL_XP}
          />
          <p className="text-xs text-[var(--text-muted)]">
            {DAILY_GOAL_XP - TODAY_XP > 0
              ? `${DAILY_GOAL_XP - TODAY_XP} XP to reach your daily goal`
              : "Daily goal reached! 🎉"}
          </p>
        </motion.div>

        {/* ── Continue learning card ───────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div
            className="relative overflow-hidden rounded-2xl p-5 text-white"
            style={{ background: lepchaCommunity.gradient }}
          >
            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute -top-6 -right-6 text-[120px] leading-none select-none">
                {lepchaCommunity.emoji}
              </div>
            </div>

            <div className="relative z-10 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Badge
                    className="mb-2 bg-white/20 text-white border-white/30"
                    size="sm"
                  >
                    Continue Learning
                  </Badge>
                  <h3 className="text-xl font-bold leading-tight">
                    {lepchaCommunity.emoji} {lepchaCommunity.name}
                  </h3>
                  <p className="text-white/70 text-sm mt-0.5">
                    Unit 2 · Lesson 4 — Greetings & Family
                  </p>
                </div>
                <Badge
                  className="flex-shrink-0 bg-amber-400/90 text-amber-900 border-amber-300/40 font-bold"
                  size="sm"
                >
                  +20 XP
                </Badge>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-white/70">
                  <span>Progress</span>
                  <span>65%</span>
                </div>
                <div className="h-2 rounded-full bg-white/20 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-white/80 transition-all duration-700"
                    style={{ width: "65%" }}
                  />
                </div>
              </div>

              <Link href="/learn/lepcha">
                <Button
                  variant="glass"
                  size="md"
                  className="w-full mt-1 border-white/30 text-white hover:bg-white/20"
                >
                  <BookOpen className="h-4 w-4" />
                  Continue
                  <ChevronRight className="h-4 w-4 ml-auto" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* ── Daily tasks ──────────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.26 }}
          aria-labelledby="tasks-heading"
        >
          <h2
            id="tasks-heading"
            className="text-base font-bold text-[var(--text-primary)] mb-3"
          >
            Daily Tasks
          </h2>
          <Card>
            <CardContent className="space-y-1 pt-4">
              {DAILY_TASKS.map((task, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex items-center gap-3 px-1 py-2.5",
                    i < DAILY_TASKS.length - 1 &&
                      "border-b border-[rgba(255,255,255,0.04)]"
                  )}
                >
                  {task.done ? (
                    <CheckCircle2 className="h-5 w-5 text-[var(--success)] flex-shrink-0" />
                  ) : (
                    <Circle className="h-5 w-5 text-[var(--text-muted)] flex-shrink-0" />
                  )}
                  <span
                    className={cn(
                      "text-sm",
                      task.done
                        ? "line-through text-[var(--text-muted)]"
                        : "text-[var(--text-primary)]"
                    )}
                  >
                    {task.label}
                  </span>
                  {task.done && (
                    <Badge variant="success" size="sm" className="ml-auto">
                      Done
                    </Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.section>

        {/* ── Recent achievements ──────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.32 }}
          aria-labelledby="achievements-heading"
        >
          <h2
            id="achievements-heading"
            className="text-base font-bold text-[var(--text-primary)] mb-3"
          >
            Recent Achievements
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {ACHIEVEMENTS.map((a) => (
              <Card key={a.label} className="flex flex-col items-center text-center p-4 gap-2">
                <span className="text-3xl" aria-hidden="true">
                  {a.emoji}
                </span>
                <div>
                  <p className="text-xs font-semibold text-[var(--text-primary)] leading-tight">
                    {a.label}
                  </p>
                  <p className="text-[10px] text-[var(--text-muted)] mt-0.5 leading-tight">
                    {a.desc}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </motion.section>

        {/* ── Quick links ──────────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.38 }}
          aria-labelledby="quick-links-heading"
        >
          <h2
            id="quick-links-heading"
            className="text-base font-bold text-[var(--text-primary)] mb-3"
          >
            Quick Access
          </h2>
          <div className="grid grid-cols-4 gap-3">
            {QUICK_LINKS.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex flex-col items-center gap-2 py-4 rounded-2xl",
                  "bg-[var(--surface)] border border-[var(--border)]",
                  "hover:bg-[var(--surface-raised)] hover:border-[var(--brand-secondary)]",
                  "transition-all duration-200 text-center"
                )}
              >
                <span className="h-10 w-10 rounded-xl bg-[var(--surface-raised)] flex items-center justify-center">
                  <Icon className="h-5 w-5 text-[var(--brand-primary)]" />
                </span>
                <span className="text-xs font-medium text-[var(--text-secondary)]">
                  {label}
                </span>
              </Link>
            ))}
          </div>
        </motion.section>

        {/* ── Community activity feed ──────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.44 }}
          aria-labelledby="activity-heading"
        >
          <div className="flex items-center justify-between mb-3">
            <h2
              id="activity-heading"
              className="text-base font-bold text-[var(--text-primary)]"
            >
              Community Activity
            </h2>
            <Link
              href="/communities"
              className="text-xs text-[var(--brand-primary)] hover:underline font-medium"
            >
              See all
            </Link>
          </div>

          <Card>
            <CardContent className="pt-4 space-y-0">
              {ACTIVITY_FEED.map((item, i) => (
                <div
                  key={item.id}
                  className={cn(
                    "flex items-start gap-3 py-3",
                    i < ACTIVITY_FEED.length - 1 &&
                      "border-b border-[rgba(255,255,255,0.04)]"
                  )}
                >
                  {/* Avatar-emoji */}
                  <div className="h-9 w-9 rounded-full bg-[var(--surface-raised)] border border-[var(--border)] flex items-center justify-center text-base flex-shrink-0">
                    {item.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[var(--text-primary)] leading-snug">
                      <span className="font-semibold">{item.user}</span>{" "}
                      <span className="text-[var(--text-secondary)]">
                        {item.action}
                      </span>{" "}
                      <span className="font-medium text-[var(--brand-primary)]">
                        {item.target}
                      </span>
                    </p>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">
                      {timeAgo(item.time)}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.section>
      </div>
    </div>
  );
}
