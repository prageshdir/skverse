"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { COMMUNITIES } from "@/lib/communities";
import { formatNumber } from "@/lib/utils";
import {
  Users, BookOpen, Mic, TrendingUp, ArrowUp, PenTool,
  Upload, Star, ChevronRight, Globe, Heart
} from "lucide-react";

// Community dashboard — for a community leader / contributor view
const CONTRIBUTIONS = [
  { title: "Morning Greeting", type: "audio", status: "approved", date: "2 days ago", xp: 80 },
  { title: "Forest Folk Tale", type: "story", status: "pending", date: "4 days ago", xp: 0 },
  { title: "Script Character Set", type: "script", status: "approved", date: "1 week ago", xp: 60 },
  { title: "Village Song", type: "audio", status: "reviewing", date: "1 week ago", xp: 0 },
];

const STATUS_STYLES: Record<string, string> = {
  approved: "bg-green-500/10 text-green-500 border-green-500/20",
  pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  reviewing: "bg-blue-500/10 text-blue-500 border-blue-500/20",
};

export default function CommunityDashboardPage() {
  const community = COMMUNITIES[1]; // Lepcha as demo

  return (
    <div className="min-h-screen pb-24" style={{ background: community.colors.bg }}>
      {/* Header */}
      <div className="relative pt-16">
        <div className="absolute inset-0 opacity-50" style={{ background: community.gradient }} />
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full">
            <path d="M0,60 C360,0 1080,60 1440,0 L1440,60 Z" fill={community.colors.bg} />
          </svg>
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 pt-8 pb-16">
          <div className="flex items-center gap-4">
            <span className="text-5xl">{community.emoji}</span>
            <div>
              <h1 className="text-3xl font-bold text-white">{community.name} Dashboard</h1>
              <p className="text-white/60">{community.language} · Community Leader View</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Users, label: "Active Learners", value: formatNumber(community.learners), change: "+12%", color: "text-blue-400", bg: "bg-blue-500/10" },
            { icon: BookOpen, label: "Total Lessons", value: community.lessons.toString(), change: "+2 new", color: "text-emerald-400", bg: "bg-emerald-500/10" },
            { icon: Mic, label: "Contributions", value: community.contributors.toString(), change: "+8 pending", color: "text-violet-400", bg: "bg-violet-500/10" },
            { icon: TrendingUp, label: "Preservation", value: `${community.preservationLevel}%`, change: "+3% this month", color: "text-amber-400", bg: "bg-amber-500/10" },
          ].map(({ icon: Icon, label, value, change, color, bg }) => (
            <div key={label}
              className="p-4 rounded-2xl border"
              style={{ background: community.colors.surface, borderColor: `${community.colors.accent}25` }}
            >
              <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                <Icon size={18} className={color} />
              </div>
              <div className="text-2xl font-bold text-white">{value}</div>
              <div className="text-xs text-white/40 mt-0.5">{label}</div>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUp size={10} className="text-green-400" />
                <span className="text-xs text-green-400">{change}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Preservation Progress */}
        <div
          className="p-5 rounded-3xl border"
          style={{ background: community.colors.surface, borderColor: `${community.colors.accent}25` }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-white">Language Preservation Progress</h2>
            <span className="text-lg font-bold" style={{ color: community.colors.accent }}>
              {community.preservationLevel}%
            </span>
          </div>
          <Progress
            value={community.preservationLevel}
            size="lg"
            barClassName="bg-gradient-to-r from-white/40 to-white/80"
            trackClassName="bg-white/10"
          />
          <div className="grid grid-cols-3 gap-4 mt-4 text-center">
            {[
              { label: "Words Documented", value: "3,240" },
              { label: "Audio Hours", value: "48h" },
              { label: "Stories Archived", value: "124" },
            ].map(({ label, value }) => (
              <div key={label}>
                <div className="font-bold text-white text-lg">{value}</div>
                <div className="text-white/40 text-xs">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* My Contributions */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-white">My Contributions</h2>
            <Link href="/contribute">
              <Button variant="glass" size="sm">
                <Upload size={14} /> Add New
              </Button>
            </Link>
          </div>
          <div
            className="rounded-2xl border overflow-hidden"
            style={{ borderColor: `${community.colors.accent}20` }}
          >
            {CONTRIBUTIONS.map((c, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 border-b last:border-0 hover:bg-white/5 transition-colors"
                style={{ borderColor: `${community.colors.accent}15` }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${community.colors.accent}20` }}
                >
                  {c.type === "audio" && <Mic size={16} style={{ color: community.colors.accent }} />}
                  {c.type === "story" && <BookOpen size={16} style={{ color: community.colors.accent }} />}
                  {c.type === "script" && <PenTool size={16} style={{ color: community.colors.accent }} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-white text-sm">{c.title}</div>
                  <div className="text-white/40 text-xs capitalize">{c.type} · {c.date}</div>
                </div>
                <div className="flex items-center gap-2">
                  {c.xp > 0 && (
                    <span className="text-xs text-amber-400 font-bold">+{c.xp} XP</span>
                  )}
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_STYLES[c.status]}`}>
                    {c.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Earnings / Impact */}
        <div
          className="p-5 rounded-3xl border"
          style={{ background: community.colors.surface, borderColor: `${community.colors.accent}25` }}
        >
          <h2 className="font-bold text-white mb-4 flex items-center gap-2">
            <Heart size={16} style={{ color: community.colors.accent }} />
            Your Impact
          </h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { label: "Learners Helped", value: "142" },
              { label: "Archive Items", value: "12" },
              { label: "XP Earned", value: "1,240" },
            ].map(({ label, value }) => (
              <div key={label}>
                <div className="font-bold text-2xl text-white">{value}</div>
                <div className="text-white/40 text-xs mt-0.5">{label}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 rounded-xl text-center"
            style={{ background: `${community.colors.accent}15` }}
          >
            <Star size={16} className="mx-auto mb-1" style={{ color: community.colors.accent }} />
            <p className="text-sm text-white/70">
              You&apos;re one of the <strong className="text-white">top 10 contributors</strong> in the {community.name} community this month.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
