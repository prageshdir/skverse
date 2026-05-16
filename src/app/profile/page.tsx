"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { COMMUNITIES } from "@/lib/communities";
import { useAuth } from "@/lib/store";
import { useRouter } from "next/navigation";
import { signout } from "@/lib/api";
import {
  Settings, Edit, Flame, Zap, Trophy, BookOpen, Mic, PenTool,
  Globe, Star, Award, ChevronRight, LogOut
} from "lucide-react";

const ACHIEVEMENTS = [
  { icon: "🔥", title: "7-Day Streak", desc: "Learned 7 days in a row", earned: true },
  { icon: "📚", title: "Lesson Master", desc: "Completed 10 lessons", earned: true },
  { icon: "🎙️", title: "Voice Learner", desc: "Recorded 5 pronunciations", earned: true },
  { icon: "✍️", title: "Script Writer", desc: "Practiced writing 20 characters", earned: false },
  { icon: "🌍", title: "Explorer", desc: "Visited all 6 communities", earned: false },
  { icon: "👑", title: "Cultural Ambassador", desc: "Contributed 10 items", earned: false },
];

const ACTIVITY = [
  { day: "Mon", xp: 45 },
  { day: "Tue", xp: 20 },
  { day: "Wed", xp: 60 },
  { day: "Thu", xp: 35 },
  { day: "Fri", xp: 50 },
  { day: "Sat", xp: 80 },
  { day: "Sun", xp: 25 },
];
const MAX_XP = Math.max(...ACTIVITY.map((a) => a.xp));

const LEARNING_LANGUAGES = [
  { community: COMMUNITIES[0], progress: 65, lessons: 8 },
  { community: COMMUNITIES[1], progress: 30, lessons: 3 },
];

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try { await signout(); } catch {}
    logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen pt-16 pb-24 bg-[var(--background)]">
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Profile card */}
        <motion.div
          className="relative rounded-3xl overflow-hidden"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute inset-0 gradient-brand opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
          <div className="relative p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-18 h-18 w-[72px] h-[72px] rounded-2xl gradient-bhutia flex items-center justify-center text-3xl shadow-lg">
                    🙏
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-500 border-2 border-white flex items-center justify-center text-[10px] font-bold text-white">
                    12
                  </div>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Priya Chettri</h1>
                  <p className="text-white/70 text-sm">@priya.learns</p>
                  <Badge className="mt-1 bg-white/15 text-white border-white/25 text-xs">
                    Cultural Explorer
                  </Badge>
                </div>
              </div>
              <button className="w-9 h-9 rounded-xl glass flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                <Edit size={16} />
              </button>
            </div>
            <p className="text-white/70 text-sm">
              Passionate about preserving the languages of Sikkim. Learning Bhutia and Lepcha. 🏔️
            </p>
          </div>
        </motion.div>

        {/* Stats grid */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {[
            { icon: Flame, label: "Day Streak", value: "7", color: "text-orange-500", bg: "bg-orange-500/10" },
            { icon: Zap, label: "Total XP", value: "2,480", color: "text-amber-500", bg: "bg-amber-500/10" },
            { icon: BookOpen, label: "Lessons", value: "24", color: "text-blue-500", bg: "bg-blue-500/10" },
            { icon: Trophy, label: "Achievements", value: "3/6", color: "text-violet-500", bg: "bg-violet-500/10" },
          ].map(({ icon: Icon, label, value, color, bg }) => (
            <div key={label} className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-4 text-center">
              <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mx-auto mb-2`}>
                <Icon size={18} className={color} />
              </div>
              <div className="font-bold text-[var(--text-primary)]">{value}</div>
              <div className="text-xs text-[var(--text-muted)] mt-0.5">{label}</div>
            </div>
          ))}
        </motion.div>

        {/* Weekly Activity */}
        <motion.div
          className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-5"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <h2 className="font-bold text-[var(--text-primary)] mb-4">Weekly Activity</h2>
          <div className="flex items-end gap-2 h-20">
            {ACTIVITY.map((a) => (
              <div key={a.day} className="flex-1 flex flex-col items-center gap-1">
                <motion.div
                  className="w-full rounded-t-lg bg-[var(--brand-primary)]/80 min-h-[4px]"
                  initial={{ height: 0 }}
                  animate={{ height: `${(a.xp / MAX_XP) * 72}px` }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                />
                <span className="text-[10px] text-[var(--text-muted)]">{a.day}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 text-xs text-[var(--text-muted)]">
            Total this week: <strong className="text-[var(--text-primary)]">315 XP</strong>
          </div>
        </motion.div>

        {/* Languages Learning */}
        <motion.div
          className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-5"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-[var(--text-primary)]">Languages Learning</h2>
            <Link href="/communities">
              <Button variant="ghost" size="sm">Add <ChevronRight size={14} /></Button>
            </Link>
          </div>
          <div className="space-y-4">
            {LEARNING_LANGUAGES.map(({ community: c, progress, lessons }) => (
              <div key={c.id}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{c.emoji}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm text-[var(--text-primary)]">{c.name}</span>
                      <span className="text-xs text-[var(--text-muted)]">{lessons} lessons done</span>
                    </div>
                  </div>
                </div>
                <Progress value={progress} size="sm" color="brand" showValue label={`${progress}%`} />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div
          className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-5"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          <h2 className="font-bold text-[var(--text-primary)] mb-4">Achievements</h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {ACHIEVEMENTS.map((a) => (
              <div
                key={a.title}
                className={`flex flex-col items-center p-3 rounded-2xl border text-center ${
                  a.earned
                    ? "bg-amber-500/10 border-amber-500/30"
                    : "bg-[var(--surface-raised)] border-[var(--border)] opacity-50"
                }`}
                title={a.desc}
              >
                <span className="text-2xl mb-1">{a.icon}</span>
                <span className="text-[10px] font-medium text-[var(--text-primary)] leading-tight">{a.title}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Settings menu */}
        <motion.div
          className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] overflow-hidden"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {[
            { icon: Settings, label: "Account Settings", href: "#" },
            { icon: Globe, label: "Language Preferences", href: "#" },
            { icon: Star, label: "Subscription & Billing", href: "/subscription" },
            { icon: Award, label: "My Contributions", href: "/contribute" },
          ].map(({ icon: Icon, label, href }, i) => (
            <Link key={label} href={href}>
              <div className="flex items-center gap-3 px-5 py-4 hover:bg-[var(--surface-raised)] transition-colors border-b border-[var(--border)] last:border-0">
                <Icon size={18} className="text-[var(--text-muted)]" />
                <span className="flex-1 text-sm text-[var(--text-primary)]">{label}</span>
                <ChevronRight size={16} className="text-[var(--text-muted)]" />
              </div>
            </Link>
          ))}
          <button className="w-full flex items-center gap-3 px-5 py-4 hover:bg-red-500/5 transition-colors text-red-500">
            <LogOut size={18} />
            <span className="text-sm">Sign Out</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
}
