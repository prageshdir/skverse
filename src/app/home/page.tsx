"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { Card, CardContent } from "@/components/ui/Card";
import { COMMUNITIES } from "@/lib/communities";
import { useAuth } from "@/lib/store";
import { getMyStreak } from "@/lib/api";
import { useEffect, useState } from "react";
import { Flame, Zap, BookOpen, ArrowRight, Play, Star, Trophy, Target, Calendar } from "lucide-react";

const CONTINUE_LESSON = {
  community: COMMUNITIES[0],
  title: "Greetings & Introductions",
  unit: "Unit 2 · Lesson 4",
  progress: 65,
  xpReward: 20,
};

const RECENT_ACHIEVEMENTS = [
  { icon: "🔥", title: "7-Day Streak!", desc: "Incredible dedication" },
  { icon: "⚡", title: "100 XP Today", desc: "Daily goal crushed" },
  { icon: "📚", title: "Lesson Master", desc: "Completed 10 lessons" },
];

const DAILY_TASKS = [
  { title: "Complete 1 lesson", xp: 20, done: true },
  { title: "Practice writing 3 characters", xp: 15, done: true },
  { title: "Listen to audio story", xp: 10, done: false },
  { title: "Review 5 flashcards", xp: 5, done: false },
];

export default function HomePage() {
  const { user } = useAuth();
  const [streak, setStreak] = useState(7);
  const todayXP = user?.xp ? Math.min(user.xp % 100, 50) : 35;
  const dailyGoal = 50;

  useEffect(() => {
    getMyStreak()
      .then((s) => setStreak(s.current))
      .catch(() => {});
  }, []);

  return (
    <div className="pt-16 pb-24 min-h-screen bg-[var(--background)]">
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Greeting */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Namaste{user ? `, ${user.name.split(" ")[0]}` : ""} 👋
          </h1>
          <p className="text-[var(--text-muted)] text-sm mt-1">
            You&apos;re on a {streak}-day streak! Keep it going.
          </p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          className="grid grid-cols-3 gap-3 mb-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {[
            { icon: Flame, label: "Streak", value: `${streak} days`, color: "text-orange-500", bg: "bg-orange-500/10" },
            { icon: Zap, label: "Today XP", value: `${todayXP}/${dailyGoal}`, color: "text-amber-500", bg: "bg-amber-500/10" },
            { icon: Trophy, label: "Total XP", value: "2,480", color: "text-violet-500", bg: "bg-violet-500/10" },
          ].map(({ icon: Icon, label, value, color, bg }) => (
            <Card key={label} className="text-center p-4">
              <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mx-auto mb-2`}>
                <Icon size={18} className={color} />
              </div>
              <div className="font-bold text-sm text-[var(--text-primary)]">{value}</div>
              <div className="text-xs text-[var(--text-muted)] mt-0.5">{label}</div>
            </Card>
          ))}
        </motion.div>

        {/* Daily XP Progress */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-[var(--text-primary)]">Daily Goal</span>
            <Badge variant="xp">{todayXP} / {dailyGoal} XP</Badge>
          </div>
          <Progress value={todayXP} max={dailyGoal} color="xp" size="lg" />
        </motion.div>

        {/* Continue Learning */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-base font-bold text-[var(--text-primary)] mb-3">Continue Learning</h2>
          <div
            className="relative rounded-3xl overflow-hidden p-5 cursor-pointer group"
            style={{ background: CONTINUE_LESSON.community.colors.bg }}
          >
            <div
              className="absolute inset-0 opacity-50"
              style={{ background: CONTINUE_LESSON.community.gradient }}
            />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-4xl">{CONTINUE_LESSON.community.emoji}</div>
                <div>
                  <div className="text-white/60 text-xs font-medium">{CONTINUE_LESSON.unit}</div>
                  <div className="text-white font-bold text-lg mt-0.5">{CONTINUE_LESSON.title}</div>
                  <div className="mt-2 w-32">
                    <Progress value={CONTINUE_LESSON.progress} color="brand" size="sm" animated={false} barClassName="bg-white/80" trackClassName="bg-white/20" />
                  </div>
                </div>
              </div>
              <Link href={`/learn/${CONTINUE_LESSON.community.id}`}>
                <Button variant="accent" size="lg" className="shrink-0">
                  <Play size={16} />
                  Continue
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Daily Tasks */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-[var(--text-primary)]">Today&apos;s Tasks</h2>
            <div className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
              <Calendar size={12} />
              <span>{DAILY_TASKS.filter(t => t.done).length}/{DAILY_TASKS.length} done</span>
            </div>
          </div>
          <div className="space-y-2">
            {DAILY_TASKS.map((task, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                  task.done
                    ? "bg-green-500/5 border-green-500/20"
                    : "bg-[var(--surface)] border-[var(--border)]"
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  task.done ? "bg-green-500 border-green-500" : "border-[var(--border)]"
                }`}>
                  {task.done && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
                <span className={`flex-1 text-sm ${task.done ? "line-through text-[var(--text-muted)]" : "text-[var(--text-primary)]"}`}>
                  {task.title}
                </span>
                <Badge variant="xp">+{task.xp} XP</Badge>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Achievements */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-base font-bold text-[var(--text-primary)] mb-3">Recent Achievements</h2>
          <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
            {RECENT_ACHIEVEMENTS.map((a, i) => (
              <div key={i} className="flex-shrink-0 flex flex-col items-center p-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl w-28 text-center">
                <div className="text-3xl mb-2">{a.icon}</div>
                <div className="text-xs font-bold text-[var(--text-primary)] leading-tight">{a.title}</div>
                <div className="text-[10px] text-[var(--text-muted)] mt-1">{a.desc}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Explore more */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-[var(--text-primary)]">Explore More</h2>
            <Link href="/communities">
              <Button variant="ghost" size="sm">View all <ArrowRight size={14} /></Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {COMMUNITIES.slice(1, 5).map((c) => (
              <Link key={c.id} href={`/communities/${c.id}`}>
                <div
                  className="relative rounded-2xl overflow-hidden p-4 min-h-[100px] cursor-pointer group"
                  style={{ background: c.colors.bg }}
                >
                  <div className="absolute inset-0 opacity-50" style={{ background: c.gradient }} />
                  <div className="relative">
                    <div className="text-2xl mb-1">{c.emoji}</div>
                    <div className="text-white font-bold text-sm">{c.name}</div>
                    <div className="text-white/60 text-xs mt-1">{c.lessons} lessons</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
