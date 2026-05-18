"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Edit2,
  Zap,
  Flame,
  BookOpen,
  Upload,
  Lock,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import { cn, formatNumber } from "@/lib/utils";
import { useAuth } from "@/lib/store";
import {
  signout,
  getMyActivity,
  getMyBadges,
  getMyProgress,
  type ActivityItem,
  type Badge as BadgeType,
  type ProgressData,
} from "@/lib/api";
import { COMMUNITIES } from "@/lib/communities";

// ─── Static demo data ─────────────────────────────────────────────────────────

const WEEKLY_XP = [
  { day: "Mon", xp: 120 },
  { day: "Tue", xp: 80 },
  { day: "Wed", xp: 200 },
  { day: "Thu", xp: 60 },
  { day: "Fri", xp: 150 },
  { day: "Sat", xp: 90 },
  { day: "Sun", xp: 175 },
];

const MAX_WEEKLY_XP = Math.max(...WEEKLY_XP.map((d) => d.xp));

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { user } = useAuth();
  const { logout } = useAuth();
  const router = useRouter();

  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [badges, setBadges] = useState<BadgeType[]>([]);
  const [progress, setProgress] = useState<ProgressData[]>([]);

  useEffect(() => {
    getMyActivity().then(setActivity).catch(() => {});
    getMyBadges().then(setBadges).catch(() => {});
    getMyProgress().then(setProgress).catch(() => {});
  }, []);

  // Demo values – use real user data when available
  const name = user?.name ?? "Sonam Wangdi";
  const email = user?.email ?? "sonam@example.com";
  const role = user?.role ?? "learner";
  const xp = user?.xp ?? 2840;
  const streak = user?.streak ?? 7;

  const userCommunities = user?.communities ?? [];

  const handleLogout = async () => {
    try {
      await signout();
    } catch {
      /* best-effort */
    }
    logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)]">
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">

        {/* Profile header card */}
        <Card className="overflow-hidden">
          {/* Banner */}
          <div className="h-28 gradient-brand" />
          <CardContent className="relative pt-0 pb-6">
            {/* Avatar */}
            <div className="flex items-end justify-between -mt-10 mb-4">
              <div className="w-20 h-20 rounded-2xl gradient-brand flex items-center justify-center text-white text-3xl font-bold border-4 border-[var(--surface)] shadow-lg">
                {name.charAt(0)}
              </div>
              <Button variant="secondary" size="sm" className="gap-1.5 mt-2">
                <Edit2 className="w-3.5 h-3.5" /> Edit Profile
              </Button>
            </div>
            <h1 className="text-xl font-bold text-[var(--text-primary)]">{name}</h1>
            <p className="text-sm text-[var(--text-muted)]">{email}</p>
            <div className="mt-2">
              <Badge variant="default">{role}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total XP", value: formatNumber(xp), icon: Zap, color: "text-amber-400", bg: "bg-amber-500/10" },
            { label: "Current Streak", value: `${streak} days`, icon: Flame, color: "text-orange-400", bg: "bg-orange-500/10" },
            { label: "Lessons Done", value: "34", icon: BookOpen, color: "text-blue-400", bg: "bg-blue-500/10" },
            { label: "Contributions", value: "8", icon: Upload, color: "text-violet-400", bg: "bg-violet-500/10" },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <Card key={s.label} className="p-5">
                <div className={cn("inline-flex p-2 rounded-xl mb-2", s.bg)}>
                  <Icon className={cn("w-4 h-4", s.color)} />
                </div>
                <p className="text-xl font-bold text-[var(--text-primary)]">{s.value}</p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">{s.label}</p>
              </Card>
            );
          })}
        </div>

        {/* Weekly activity chart */}
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-[var(--text-primary)]">Weekly Activity</h2>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 h-28">
              {WEEKLY_XP.map((d) => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 0.5, delay: 0.05 }}
                    className="w-full rounded-t-lg gradient-brand origin-bottom"
                    style={{ height: `${(d.xp / MAX_WEEKLY_XP) * 96}px` }}
                  />
                  <span className="text-[10px] text-[var(--text-muted)]">{d.day}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity feed */}
        {activity.length > 0 && (
          <Card>
            <CardHeader>
              <h2 className="font-semibold text-[var(--text-primary)]">Recent Activity</h2>
            </CardHeader>
            <CardContent className="space-y-3">
              {activity.slice(0, 5).map((a) => (
                <div key={a.id} className="flex items-center justify-between gap-3 py-1">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[var(--text-primary)] truncate">{a.description}</p>
                    <p className="text-xs text-[var(--text-muted)]">{new Date(a.created_at).toLocaleDateString()}</p>
                  </div>
                  {a.xp_earned > 0 && (
                    <span className="text-xs font-semibold text-amber-400 flex items-center gap-1 shrink-0">
                      <Zap className="w-3 h-3" />+{a.xp_earned}
                    </span>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Achievements / Badges grid */}
        <div>
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Achievements</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {badges.length > 0
              ? badges.map((b, i) => (
                  <motion.div
                    key={b.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card className="p-5">
                      <div className="text-3xl mb-2">{b.icon}</div>
                      <h3 className="font-semibold text-[var(--text-primary)] text-sm mb-0.5">{b.name}</h3>
                      <p className="text-xs text-[var(--text-muted)]">{b.description}</p>
                      {b.earned_at && (
                        <p className="text-xs text-emerald-400 mt-2">
                          Earned {new Date(b.earned_at).toLocaleDateString()}
                        </p>
                      )}
                    </Card>
                  </motion.div>
                ))
              : [
                  { emoji: "🔥", title: "7-Day Streak", desc: "Learned 7 days in a row", earned: "May 10, 2026", locked: false },
                  { emoji: "📚", title: "First Lesson", desc: "Completed your first lesson", earned: "Apr 28, 2026", locked: false },
                  { emoji: "⭐", title: "1000 XP", desc: "Earned 1,000 XP total", earned: "May 5, 2026", locked: false },
                  { emoji: "🎙️", title: "Voice Master", desc: "Record 10 pronunciation attempts", earned: null, locked: true },
                  { emoji: "🌐", title: "Polyglot", desc: "Learn from 3 communities", earned: null, locked: true },
                  { emoji: "🏆", title: "Top Contributor", desc: "Submit 25 contributions", earned: null, locked: true },
                ].map((a, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card className={cn("p-5", a.locked && "opacity-50")}>
                      <div className="text-3xl mb-2">{a.locked ? "🔒" : a.emoji}</div>
                      <h3 className="font-semibold text-[var(--text-primary)] text-sm mb-0.5">{a.title}</h3>
                      <p className="text-xs text-[var(--text-muted)]">{a.desc}</p>
                      {!a.locked && a.earned && (
                        <p className="text-xs text-emerald-400 mt-2">Earned {a.earned}</p>
                      )}
                      {a.locked && (
                        <div className="flex items-center gap-1 mt-2">
                          <Lock className="w-3 h-3 text-[var(--text-muted)]" />
                          <span className="text-xs text-[var(--text-muted)]">Locked</span>
                        </div>
                      )}
                    </Card>
                  </motion.div>
                ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* My communities */}
          <Card>
            <CardHeader>
              <h2 className="font-semibold text-[var(--text-primary)]">My Communities</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              {userCommunities.length === 0 ? (
                <p className="text-sm text-[var(--text-muted)] text-center py-4">
                  You haven&apos;t joined any communities yet.
                </p>
              ) : (
                userCommunities.map((id) => {
                  const c = COMMUNITIES.find((x) => x.id === id);
                  if (!c) return null;
                  const prog = progress.find((p) => p.community_slug === id);
                  const progressPct = prog
                    ? Math.round((prog.completed_units / Math.max(prog.total_units, 1)) * 100)
                    : 0;
                  return (
                    <div
                      key={id}
                      className="rounded-xl overflow-hidden border border-[var(--border)]"
                    >
                      <div className="h-16 flex items-center gap-3 px-4" style={{ background: c.gradient }}>
                        <span className="text-2xl">{c.emoji}</span>
                        <p className="font-semibold text-white">{c.name}</p>
                      </div>
                      <div className="px-4 py-3 bg-[var(--surface-raised)]">
                        <div className="flex justify-between text-xs text-[var(--text-muted)] mb-1.5">
                          <span>Progress</span>
                          <span>{progressPct}%</span>
                        </div>
                        <Progress value={progressPct} size="sm" color="brand" />
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          {/* Learning progress */}
          <Card>
            <CardHeader>
              <h2 className="font-semibold text-[var(--text-primary)]">Learning Progress</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              {userCommunities.length === 0 ? (
                <p className="text-sm text-[var(--text-muted)] text-center py-4">No progress yet.</p>
              ) : (
                userCommunities.map((id) => {
                  const c = COMMUNITIES.find((x) => x.id === id);
                  if (!c) return null;
                  const prog = progress.find((p) => p.community_slug === id);
                  const progressPct = prog
                    ? Math.round((prog.completed_units / Math.max(prog.total_units, 1)) * 100)
                    : 0;
                  return (
                    <div key={id}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span>{c.emoji}</span>
                          <span className="text-sm font-medium text-[var(--text-primary)]">{c.name}</span>
                        </div>
                        <span className="text-xs text-[var(--text-muted)]">{progressPct}% complete</span>
                      </div>
                      <Progress value={progressPct} size="sm" color="brand" />
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>

        {/* Logout */}
        <div className="flex justify-center pb-4">
          <Button variant="danger" onClick={handleLogout} className="gap-2">
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
