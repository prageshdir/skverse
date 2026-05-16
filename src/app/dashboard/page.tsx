"use client";

import { motion } from "framer-motion";
import {
  Users,
  BookOpen,
  Upload,
  Shield,
  Plus,
  Archive,
  Settings,
  Mic,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import { cn, formatNumber } from "@/lib/utils";
import { COMMUNITIES } from "@/lib/communities";

// ─── Demo data ────────────────────────────────────────────────────────────────

const DEMO_COMMUNITY = COMMUNITIES[0]; // Lepcha

const STAT_CARDS = [
  { label: "Active Learners", value: 1284, icon: Users, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { label: "Total Lessons", value: 47, icon: BookOpen, color: "text-blue-400", bg: "bg-blue-500/10" },
  { label: "Contributions", value: 312, icon: Upload, color: "text-violet-400", bg: "bg-violet-500/10" },
  { label: "Preservation %", value: `${DEMO_COMMUNITY.preservation}%`, icon: Shield, color: "text-amber-400", bg: "bg-amber-500/10" },
];

const CONTRIBUTIONS = [
  { title: "Morning Greeting Phrases", type: "audio", status: "approved", date: "May 12, 2026", xp: 50 },
  { title: "The Legend of Tendong Lho Rum Faat", type: "story", status: "pending", date: "May 14, 2026", xp: 80 },
  { title: "Traditional Lepcha Script Samples", type: "script", status: "reviewing", date: "May 15, 2026", xp: 60 },
  { title: "Harvest Festival Songs", type: "audio", status: "approved", date: "May 10, 2026", xp: 50 },
];

const TOP_CONTRIBUTORS = [
  { name: "Tashi Wangchuk", count: 24, xp: 1840 },
  { name: "Pema Choki", count: 18, xp: 1320 },
  { name: "Rinzing Lepcha", count: 15, xp: 1100 },
  { name: "Sonam Diki", count: 11, xp: 820 },
  { name: "Dawa Sherpa", count: 9, xp: 630 },
];

const QUICK_ACTIONS = [
  { label: "Add Audio", icon: Mic, href: "/contribute" },
  { label: "Add Story", icon: BookOpen, href: "/contribute" },
  { label: "View Archive", icon: Archive, href: "/archive" },
  { label: "Manage Lessons", icon: Settings, href: "/lessons" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function statusBadge(status: string) {
  if (status === "approved") return <Badge variant="success">Approved</Badge>;
  if (status === "pending") return <Badge variant="warning">Pending</Badge>;
  if (status === "reviewing") return <Badge variant="info">Reviewing</Badge>;
  return <Badge variant="ghost">{status}</Badge>;
}

function typeBadge(type: string) {
  if (type === "audio") return <Badge variant="default" size="sm">🎙 Audio</Badge>;
  if (type === "story") return <Badge variant="info" size="sm">📖 Story</Badge>;
  if (type === "script") return <Badge variant="ghost" size="sm">✍ Script</Badge>;
  return <Badge variant="ghost" size="sm">{type}</Badge>;
}

// ─── Preservation ring ────────────────────────────────────────────────────────

function PreservationRing({ value }: { value: number }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - value / 100);
  return (
    <svg viewBox="0 0 128 128" className="w-36 h-36">
      <circle cx="64" cy="64" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" />
      <circle
        cx="64" cy="64" r={r}
        fill="none"
        stroke="url(#ring-grad)"
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        transform="rotate(-90 64 64)"
      />
      <defs>
        <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#86efac" />
        </linearGradient>
      </defs>
      <text x="64" y="60" textAnchor="middle" className="fill-[var(--text-primary)]" fontSize="22" fontWeight="700">
        {value}%
      </text>
      <text x="64" y="80" textAnchor="middle" fill="#9e8a78" fontSize="10">
        preserved
      </text>
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)]">
      {/* Hero header */}
      <div
        className="relative overflow-hidden"
        style={{ background: DEMO_COMMUNITY.gradient }}
      >
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative max-w-6xl mx-auto px-4 py-14 flex items-end gap-6">
          <span className="text-6xl">{DEMO_COMMUNITY.emoji}</span>
          <div>
            <p className="text-white/60 text-sm font-medium uppercase tracking-widest mb-1">Community Dashboard</p>
            <h1 className="text-4xl font-bold text-white">{DEMO_COMMUNITY.name}</h1>
            <p className="text-white/70 mt-1">{DEMO_COMMUNITY.region} · {formatNumber(DEMO_COMMUNITY.speakers)} speakers</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STAT_CARDS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <Card className="p-5">
                  <div className={cn("inline-flex p-2.5 rounded-xl mb-3", s.bg)}>
                    <Icon className={cn("w-5 h-5", s.color)} />
                  </div>
                  <p className="text-2xl font-bold text-[var(--text-primary)]">
                    {typeof s.value === "number" ? formatNumber(s.value) : s.value}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">{s.label}</p>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Quick actions */}
        <div>
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            {QUICK_ACTIONS.map((a) => {
              const Icon = a.icon;
              return (
                <Button key={a.label} variant="secondary" size="sm" className="gap-2">
                  <Icon className="w-4 h-4" />
                  {a.label}
                </Button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contributions table */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-[var(--text-primary)]">Recent Contributions</h2>
                  <Button size="sm" className="gap-1.5">
                    <Plus className="w-3.5 h-3.5" /> Add New
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[var(--border)]">
                        <th className="text-left px-5 py-3 text-[var(--text-muted)] font-medium">Title</th>
                        <th className="text-left px-3 py-3 text-[var(--text-muted)] font-medium">Type</th>
                        <th className="text-left px-3 py-3 text-[var(--text-muted)] font-medium">Status</th>
                        <th className="text-left px-3 py-3 text-[var(--text-muted)] font-medium">Date</th>
                        <th className="text-right px-5 py-3 text-[var(--text-muted)] font-medium">XP</th>
                      </tr>
                    </thead>
                    <tbody>
                      {CONTRIBUTIONS.map((c, i) => (
                        <tr
                          key={i}
                          className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface-raised)] transition-colors"
                        >
                          <td className="px-5 py-3.5 font-medium text-[var(--text-primary)] max-w-[180px] truncate">
                            {c.title}
                          </td>
                          <td className="px-3 py-3.5">{typeBadge(c.type)}</td>
                          <td className="px-3 py-3.5">{statusBadge(c.status)}</td>
                          <td className="px-3 py-3.5 text-[var(--text-muted)]">{c.date}</td>
                          <td className="px-5 py-3.5 text-right">
                            <span className="text-amber-400 font-semibold">+{c.xp}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Preservation ring */}
            <Card>
              <CardHeader>
                <h2 className="font-semibold text-[var(--text-primary)]">Preservation Score</h2>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-3">
                <PreservationRing value={DEMO_COMMUNITY.preservation} />
                <p className="text-sm text-[var(--text-secondary)] text-center">
                  Based on active learners, contributions, and community engagement.
                </p>
                <Progress value={DEMO_COMMUNITY.preservation} color="success" size="sm" className="mt-1" />
              </CardContent>
            </Card>

            {/* Top contributors */}
            <Card>
              <CardHeader>
                <h2 className="font-semibold text-[var(--text-primary)]">Top Contributors</h2>
              </CardHeader>
              <CardContent className="space-y-3">
                {TOP_CONTRIBUTORS.map((c, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full gradient-brand flex items-center justify-center text-white text-sm font-bold shrink-0">
                      {c.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--text-primary)] truncate">{c.name}</p>
                      <p className="text-xs text-[var(--text-muted)]">{c.count} contributions</p>
                    </div>
                    <Badge variant="warning" size="sm">+{formatNumber(c.xp)}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
