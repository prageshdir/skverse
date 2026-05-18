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
  Clock,
  XCircle,
  Plus,
  Users,
  FileText,
  LayoutDashboard,
  ShieldCheck,
  Activity,
  Settings,
  UserCog,
  BarChart3,
  Send,
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

// Mock contributor submissions
const MY_CONTRIBUTIONS = [
  { id: "c1", title: "Audio clip: Lepcha greetings", community: "Lepcha", status: "approved", time: new Date(Date.now() - 2 * 3600000).toISOString() },
  { id: "c2", title: "Story: The bamboo grove", community: "Lepcha", status: "pending", time: new Date(Date.now() - 26 * 3600000).toISOString() },
  { id: "c3", title: "Vocabulary set: Animals", community: "Bhutia", status: "rejected", time: new Date(Date.now() - 3 * 86400000).toISOString() },
];

// Mock saved stories
const SAVED_STORIES = [
  { id: "s1", title: "The Bamboo Grove", community: "Lepcha", emoji: "🌿" },
  { id: "s2", title: "Mountain Spirit Tales", community: "Sherpa", emoji: "🏔️" },
];

// Mock quick-practice tiles
const QUICK_PRACTICE = [
  { label: "Writing", href: "/practice/writing", icon: PenLine, color: "text-blue-400", bg: "bg-blue-500/10" },
  { label: "Speaking", href: "/practice/speaking", icon: Send, color: "text-green-400", bg: "bg-green-500/10" },
  { label: "Listening", href: "/practice/listening", icon: BookOpen, color: "text-purple-400", bg: "bg-purple-500/10" },
];

// Mock platform KPIs for superadmin
const PLATFORM_KPIS = [
  { label: "Total Learners", value: "12,840", icon: Users, color: "text-blue-400" },
  { label: "Active Communities", value: "10", icon: Globe, color: "text-green-400" },
  { label: "Pending Applications", value: "34", icon: Clock, color: "text-amber-400" },
  { label: "Total Contributions", value: "4,291", icon: FileText, color: "text-violet-400" },
];

const SUPERADMIN_QUICK_LINKS = [
  { label: "Platform Admin", href: "/admin", icon: ShieldCheck },
  { label: "Operations Dashboard", href: "/dashboard", icon: BarChart3 },
  { label: "All Communities", href: "/communities", icon: Globe },
  { label: "Manage Users", href: "/admin/users", icon: UserCog },
];

// ── Helper: contribution status badge ────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  if (status === "approved") return <Badge variant="success" size="sm">Approved</Badge>;
  if (status === "rejected") return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-500/15 text-red-400 border border-red-500/20">
      <XCircle className="h-3 w-3" /> Rejected
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/15 text-amber-400 border border-amber-500/20">
      <Clock className="h-3 w-3" /> Pending
    </span>
  );
}

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

// ── Role Section ──────────────────────────────────────────────────────────────

function RoleSection({ role, communities }: { role: string; communities: string[] }) {
  const communitySlug = communities?.[0] ?? "";
  const community = COMMUNITIES.find((c) => c.id === communitySlug);
  const communityName = community?.name ?? communitySlug ?? "your community";

  // ── Learner extras ────────────────────────────────────────────────────────

  const LearnerExtras = () => (
    <>
      {/* Quick Practice */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        aria-labelledby="practice-heading"
      >
        <h2 id="practice-heading" className="text-base font-bold text-[var(--text-primary)] mb-3">
          Quick Practice
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {QUICK_PRACTICE.map(({ label, href, icon: Icon, color, bg }) => (
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
              <span className={cn("h-10 w-10 rounded-xl flex items-center justify-center", bg)}>
                <Icon className={cn("h-5 w-5", color)} />
              </span>
              <span className="text-xs font-medium text-[var(--text-secondary)]">{label}</span>
            </Link>
          ))}
        </div>
      </motion.section>

      {/* Tutor Pick */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.56 }}
        aria-labelledby="tutor-pick-heading"
      >
        <h2 id="tutor-pick-heading" className="text-base font-bold text-[var(--text-primary)] mb-3">
          Tutor Pick
        </h2>
        <Card className="p-4">
          <div className="flex items-start gap-3">
            <span className="h-10 w-10 rounded-xl bg-[var(--surface-raised)] flex items-center justify-center flex-shrink-0">
              <Bot className="h-5 w-5 text-[var(--brand-primary)]" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[var(--text-primary)]">Try a Speaking Exercise</p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Your AI tutor recommends practicing Lepcha greetings today.
              </p>
            </div>
          </div>
          <Link href="/tutor" className="block mt-3">
            <Button variant="secondary" size="sm" className="w-full">
              Open Tutor <ChevronRight className="h-4 w-4 ml-auto" />
            </Button>
          </Link>
        </Card>
      </motion.section>

      {/* Saved Stories */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.62 }}
        aria-labelledby="saved-stories-heading"
      >
        <h2 id="saved-stories-heading" className="text-base font-bold text-[var(--text-primary)] mb-3">
          Saved Stories
        </h2>
        <Card>
          <CardContent className="pt-4 space-y-0">
            {SAVED_STORIES.map((story, i) => (
              <div
                key={story.id}
                className={cn(
                  "flex items-center gap-3 py-3",
                  i < SAVED_STORIES.length - 1 && "border-b border-[rgba(255,255,255,0.04)]"
                )}
              >
                <div className="h-9 w-9 rounded-full bg-[var(--surface-raised)] border border-[var(--border)] flex items-center justify-center text-base flex-shrink-0">
                  {story.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--text-primary)] truncate">{story.title}</p>
                  <p className="text-xs text-[var(--text-muted)]">{story.community}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-[var(--text-muted)] flex-shrink-0" />
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.section>

      {/* Badges */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.68 }}
        aria-labelledby="badges-heading"
      >
        <h2 id="badges-heading" className="text-base font-bold text-[var(--text-primary)] mb-3">
          Badges
        </h2>
        <div className="grid grid-cols-4 gap-3">
          {[
            { emoji: "🔥", label: "Streak", earned: true },
            { emoji: "⚡", label: "100 XP", earned: true },
            { emoji: "📚", label: "Lesson Master", earned: true },
            { emoji: "🎯", label: "Sharpshooter", earned: false },
            { emoji: "🌍", label: "Explorer", earned: false },
            { emoji: "🤝", label: "Contributor", earned: false },
            { emoji: "🏆", label: "Champion", earned: false },
            { emoji: "✨", label: "Star", earned: false },
          ].map((badge) => (
            <div
              key={badge.label}
              className={cn(
                "flex flex-col items-center gap-1.5 py-3 rounded-2xl border",
                badge.earned
                  ? "bg-[var(--surface)] border-[var(--border)]"
                  : "bg-[var(--surface)] border-[var(--border)] opacity-40 grayscale"
              )}
            >
              <span className="text-2xl" aria-hidden="true">{badge.emoji}</span>
              <span className="text-[10px] font-medium text-[var(--text-secondary)] text-center leading-tight px-1">
                {badge.label}
              </span>
            </div>
          ))}
        </div>
      </motion.section>
    </>
  );

  // ── Contributor section ───────────────────────────────────────────────────

  const ContributorSection = () => (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
      aria-labelledby="contributions-heading"
    >
      <div className="flex items-center justify-between mb-3">
        <h2 id="contributions-heading" className="text-base font-bold text-[var(--text-primary)]">
          My Contributions
        </h2>
        <Link href="/contribute">
          <Button size="sm" className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Submit New
          </Button>
        </Link>
      </div>
      <Card>
        <CardContent className="pt-4 space-y-0">
          {MY_CONTRIBUTIONS.map((item, i) => (
            <div
              key={item.id}
              className={cn(
                "flex items-start gap-3 py-3",
                i < MY_CONTRIBUTIONS.length - 1 && "border-b border-[rgba(255,255,255,0.04)]"
              )}
            >
              <div className="h-9 w-9 rounded-full bg-[var(--surface-raised)] border border-[var(--border)] flex items-center justify-center flex-shrink-0">
                <FileText className="h-4 w-4 text-[var(--text-muted)]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--text-primary)] truncate">{item.title}</p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  {item.community} · {timeAgo(item.time)}
                </p>
              </div>
              <StatusBadge status={item.status} />
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.section>
  );

  // ── Community Manager panel ───────────────────────────────────────────────

  const CommunityManagerPanel = ({ showTeamAndStats }: { showTeamAndStats?: boolean }) => (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
      aria-labelledby="community-mgmt-heading"
    >
      <h2 id="community-mgmt-heading" className="text-base font-bold text-[var(--text-primary)] mb-3">
        Community Management
      </h2>
      <Card className="p-4 space-y-4">
        {/* Community header */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] flex items-center justify-center text-lg flex-shrink-0">
            {community?.emoji ?? "🌐"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[var(--text-primary)]">{communityName}</p>
            <p className="text-xs text-[var(--text-muted)]">Your managed community</p>
          </div>
          {/* Pending approvals badge */}
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/25">
            <Clock className="h-3 w-3" />
            7 pending
          </span>
        </div>

        {/* Community stats for admin */}
        {showTeamAndStats && (
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] p-3 text-center">
              <p className="text-xl font-bold text-[var(--text-primary)]">284</p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">Members</p>
            </div>
            <div className="rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] p-3 text-center">
              <p className="text-xl font-bold text-[var(--text-primary)]">142</p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">Content pieces</p>
            </div>
          </div>
        )}

        {/* Action links */}
        <div className="space-y-2">
          <Link
            href={communitySlug ? `/admin/community/${communitySlug}?tab=approvals` : "/admin"}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl",
              "bg-[var(--surface-raised)] border border-[var(--border)]",
              "hover:border-[var(--brand-secondary)] transition-all duration-200"
            )}
          >
            <CheckCircle2 className="h-4 w-4 text-[var(--brand-primary)] flex-shrink-0" />
            <span className="text-sm font-medium text-[var(--text-primary)]">Review Submissions</span>
            <ChevronRight className="h-4 w-4 text-[var(--text-muted)] ml-auto" />
          </Link>
          <Link
            href={communitySlug ? `/admin/community/${communitySlug}` : "/admin"}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl",
              "bg-[var(--surface-raised)] border border-[var(--border)]",
              "hover:border-[var(--brand-secondary)] transition-all duration-200"
            )}
          >
            <Settings className="h-4 w-4 text-[var(--brand-primary)] flex-shrink-0" />
            <span className="text-sm font-medium text-[var(--text-primary)]">Manage Content</span>
            <ChevronRight className="h-4 w-4 text-[var(--text-muted)] ml-auto" />
          </Link>
          {showTeamAndStats && (
            <Link
              href={communitySlug ? `/admin/community/${communitySlug}?tab=team` : "/admin"}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl",
                "bg-[var(--surface-raised)] border border-[var(--border)]",
                "hover:border-[var(--brand-secondary)] transition-all duration-200"
              )}
            >
              <Users className="h-4 w-4 text-[var(--brand-primary)] flex-shrink-0" />
              <span className="text-sm font-medium text-[var(--text-primary)]">Team Management</span>
              <ChevronRight className="h-4 w-4 text-[var(--text-muted)] ml-auto" />
            </Link>
          )}
        </div>
      </Card>
    </motion.section>
  );

  // ── Render by role ────────────────────────────────────────────────────────

  if (role === "contributor") {
    return (
      <>
        <ContributorSection />
        <LearnerExtras />
      </>
    );
  }

  if (role === "community_manager") {
    return (
      <>
        <CommunityManagerPanel />
        <LearnerExtras />
      </>
    );
  }

  if (role === "community_admin") {
    return (
      <>
        <CommunityManagerPanel showTeamAndStats />
        <LearnerExtras />
      </>
    );
  }

  // Default: learner
  return <LearnerExtras />;
}

// ── Superadmin layout ─────────────────────────────────────────────────────────

function SuperadminDashboard({
  firstName,
  totalXP,
  currentStreak,
  streakLoading,
}: {
  firstName: string | null;
  totalXP: number;
  currentStreak: number;
  streakLoading: boolean;
}) {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="max-w-2xl mx-auto px-4 pt-8 pb-28 space-y-8">

        {/* ── Greeting + compact personal XP bar ──────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-4"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-[var(--text-primary)]">
                Namaste{firstName ? `, ${firstName}` : ""} 👋
              </h1>
              <p className="text-[var(--text-muted)] text-xs mt-0.5">Superadmin · Platform Overview</p>
            </div>
            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="text-center">
                <p className="text-sm font-bold text-[var(--text-primary)]">
                  {streakLoading ? "—" : `${currentStreak}🔥`}
                </p>
                <p className="text-[10px] text-[var(--text-muted)]">streak</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-[var(--text-primary)]">{formatNumber(totalXP)}</p>
                <p className="text-[10px] text-[var(--text-muted)]">total XP</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Platform KPI cards ───────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          aria-labelledby="platform-overview-heading"
        >
          <h2 id="platform-overview-heading" className="text-base font-bold text-[var(--text-primary)] mb-3">
            Platform Overview
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {PLATFORM_KPIS.map(({ label, value, icon: Icon, color }) => (
              <Card key={label} className="p-4 flex items-center gap-3">
                <span className="h-10 w-10 rounded-xl bg-[var(--surface-raised)] flex items-center justify-center flex-shrink-0">
                  <Icon className={cn("h-5 w-5", color)} />
                </span>
                <div>
                  <p className="text-xl font-bold text-[var(--text-primary)] leading-none">{value}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">{label}</p>
                </div>
              </Card>
            ))}
          </div>
        </motion.section>

        {/* ── Quick links grid ─────────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.16 }}
          aria-labelledby="admin-links-heading"
        >
          <h2 id="admin-links-heading" className="text-base font-bold text-[var(--text-primary)] mb-3">
            Quick Links
          </h2>
          <div className="grid grid-cols-4 gap-3">
            {SUPERADMIN_QUICK_LINKS.map(({ label, href, icon: Icon }) => (
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
                <span className="text-xs font-medium text-[var(--text-secondary)] leading-tight px-1">
                  {label}
                </span>
              </Link>
            ))}
          </div>
        </motion.section>

        {/* ── Recent platform-wide activity feed ──────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.24 }}
          aria-labelledby="platform-activity-heading"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 id="platform-activity-heading" className="text-base font-bold text-[var(--text-primary)]">
              Recent Activity
            </h2>
            <Link href="/admin" className="text-xs text-[var(--brand-primary)] hover:underline font-medium">
              Admin panel
            </Link>
          </div>
          <Card>
            <CardContent className="pt-4 space-y-0">
              {ACTIVITY_FEED.map((item, i) => (
                <div
                  key={item.id}
                  className={cn(
                    "flex items-start gap-3 py-3",
                    i < ACTIVITY_FEED.length - 1 && "border-b border-[rgba(255,255,255,0.04)]"
                  )}
                >
                  <div className="h-9 w-9 rounded-full bg-[var(--surface-raised)] border border-[var(--border)] flex items-center justify-center text-base flex-shrink-0">
                    {item.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[var(--text-primary)] leading-snug">
                      <span className="font-semibold">{item.user}</span>{" "}
                      <span className="text-[var(--text-secondary)]">{item.action}</span>{" "}
                      <span className="font-medium text-[var(--brand-primary)]">{item.target}</span>
                    </p>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">{timeAgo(item.time)}</p>
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
  const role = user?.role ?? "learner";

  // Superadmin gets a completely different layout
  if (role === "superadmin") {
    return (
      <SuperadminDashboard
        firstName={firstName}
        totalXP={totalXP}
        currentStreak={currentStreak}
        streakLoading={streakLoading}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="max-w-2xl mx-auto px-4 pt-8 pb-28 space-y-8">

        {/* ── Role badge ───────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-sm font-medium text-amber-500">
          <span>Logged in as:</span>
          <span className="font-bold uppercase tracking-wide">{role}</span>
          {user && <span className="ml-auto text-xs text-[var(--text-muted)]">{user.email}</span>}
        </div>

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
          {user?.avatar_url ? (
            <img
              src={user.avatar_url}
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

        {/* ── Role-specific section ────────────────────────────────────── */}
        <RoleSection role={role} communities={user?.communities ?? []} />

      </div>
    </div>
  );
}
