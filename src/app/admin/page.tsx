"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { COMMUNITIES } from "@/lib/communities";
import { formatNumber as fmt } from "@/lib/utils";
import {
  Users, BookOpen, Mic, TrendingUp, DollarSign, Shield,
  CheckCircle2, Clock, XCircle, Globe, BarChart2, Settings,
  ChevronRight, AlertCircle, Search
} from "lucide-react";

const TABS = ["Overview", "Communities", "Subscriptions", "Contributions", "Users"];

const PENDING_ITEMS = [
  { title: "Morning Greeting Audio", community: "Lepcha", contributor: "Karma D.", type: "audio", time: "2h ago" },
  { title: "Forest Folk Tale Vol. 2", community: "Lepcha", contributor: "Tenzin B.", type: "story", time: "5h ago" },
  { title: "Limbu Script Characters", community: "Limbu", contributor: "Rohan S.", type: "script", time: "1d ago" },
  { title: "Tamang Village Song", community: "Tamang", contributor: "Maya T.", type: "audio", time: "1d ago" },
];

const REVENUE_MONTHS = [
  { month: "Jan", revenue: 28000 },
  { month: "Feb", revenue: 34000 },
  { month: "Mar", revenue: 42000 },
  { month: "Apr", revenue: 38000 },
  { month: "May", revenue: 52000 },
  { month: "Jun", revenue: 61000 },
];
const MAX_REV = Math.max(...REVENUE_MONTHS.map((r) => r.revenue));

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen pt-16 pb-24 bg-[var(--background)]">
      {/* Header */}
      <div className="border-b border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-xl px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Shield size={20} className="text-[var(--brand-primary)]" />
              Admin Dashboard
            </h1>
            <p className="text-sm text-[var(--text-muted)]">SikkimVerse Platform Management</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="error" size="md">4 Pending</Badge>
            <Button variant="secondary" size="sm">
              <Settings size={14} /> Settings
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-1 bg-[var(--surface-raised)] p-1 rounded-2xl mb-6 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab
                  ? "bg-[var(--surface)] text-[var(--text-primary)] shadow-sm"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "Overview" && (
          <div className="space-y-6">
            {/* KPI cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Users, label: "Total Users", value: "52,480", change: "+18%", color: "text-blue-500", bg: "bg-blue-500/10" },
                { icon: DollarSign, label: "MRR", value: "₹61K", change: "+12%", color: "text-green-500", bg: "bg-green-500/10" },
                { icon: BookOpen, label: "Active Lessons", value: "270", change: "+6 new", color: "text-violet-500", bg: "bg-violet-500/10" },
                { icon: Mic, label: "Archive Items", value: "1,248", change: "+42 this week", color: "text-amber-500", bg: "bg-amber-500/10" },
              ].map(({ icon: Icon, label, value, change, color, bg }) => (
                <motion.div
                  key={label}
                  className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-4"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center`}>
                      <Icon size={18} className={color} />
                    </div>
                    <span className="text-xs text-green-500 font-medium">{change} ↑</span>
                  </div>
                  <div className="text-2xl font-bold text-[var(--text-primary)]">{value}</div>
                  <div className="text-xs text-[var(--text-muted)] mt-0.5">{label}</div>
                </motion.div>
              ))}
            </div>

            {/* Revenue chart */}
            <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-[var(--text-primary)]">Monthly Revenue</h2>
                <Badge variant="success">+12% MoM</Badge>
              </div>
              <div className="flex items-end gap-3 h-32">
                {REVENUE_MONTHS.map((m) => (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[10px] text-[var(--text-muted)]">
                      {m.month === "Jun" ? <strong className="text-[var(--brand-primary)]">₹{(m.revenue/1000).toFixed(0)}K</strong> : ""}
                    </span>
                    <motion.div
                      className="w-full rounded-t-lg"
                      style={{ background: m.month === "Jun" ? "var(--brand-primary)" : "var(--brand-primary)" }}
                      initial={{ height: 0 }}
                      animate={{ height: `${(m.revenue / MAX_REV) * 96}px` }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                    />
                    <span className="text-[10px] text-[var(--text-muted)]">{m.month}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between text-sm">
                <span className="text-[var(--text-muted)]">Total this period</span>
                <span className="font-bold text-[var(--text-primary)]">₹2,55,000</span>
              </div>
            </div>

            {/* Two column: communities + pending */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Community health */}
              <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-5">
                <h2 className="font-bold text-[var(--text-primary)] mb-4">Community Health</h2>
                <div className="space-y-4">
                  {COMMUNITIES.map((c) => (
                    <div key={c.id}>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span>{c.emoji}</span>
                        <span className="text-sm font-medium text-[var(--text-primary)] flex-1">{c.name}</span>
                        <span className="text-xs text-[var(--text-muted)]">{c.preservationLevel}%</span>
                      </div>
                      <Progress value={c.preservationLevel} size="sm" color="brand" animated={false} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Pending review */}
              <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-[var(--text-primary)]">Pending Review</h2>
                  <Badge variant="warning">{PENDING_ITEMS.length} items</Badge>
                </div>
                <div className="space-y-3">
                  {PENDING_ITEMS.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-[var(--surface-raised)] rounded-xl">
                      <Clock size={14} className="text-amber-500 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-[var(--text-primary)] truncate">{item.title}</div>
                        <div className="text-xs text-[var(--text-muted)]">{item.community} · {item.contributor} · {item.time}</div>
                      </div>
                      <div className="flex gap-1">
                        <button className="w-7 h-7 rounded-lg bg-green-500/15 flex items-center justify-center hover:bg-green-500/25 transition-colors">
                          <CheckCircle2 size={14} className="text-green-500" />
                        </button>
                        <button className="w-7 h-7 rounded-lg bg-red-500/15 flex items-center justify-center hover:bg-red-500/25 transition-colors">
                          <XCircle size={14} className="text-red-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Communities" && (
          <div className="space-y-4">
            {COMMUNITIES.map((c, i) => (
              <motion.div
                key={c.id}
                className="flex items-center gap-4 p-4 bg-[var(--surface)] rounded-2xl border border-[var(--border)]"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                  style={{ background: c.colors.surface }}
                >
                  {c.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-[var(--text-primary)]">{c.name}</span>
                    <Badge size="sm">{c.script}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
                    <span>{fmt(c.learners)} learners</span>
                    <span>{c.lessons} lessons</span>
                    <span>{c.contributors} contributors</span>
                  </div>
                </div>
                <div className="hidden md:flex flex-col items-end gap-1 w-32">
                  <span className="text-xs text-[var(--text-muted)]">Preservation</span>
                  <Progress value={c.preservationLevel} size="sm" animated={false} className="w-full" />
                  <span className="text-xs text-[var(--text-primary)]">{c.preservationLevel}%</span>
                </div>
                <Button variant="secondary" size="sm">
                  Manage <ChevronRight size={14} />
                </Button>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === "Subscriptions" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: "Active Subscribers", value: "3,240", badge: "+128 this week", color: "bg-green-500/10 text-green-500" },
                { label: "Trial Users", value: "840", badge: "7-day trial", color: "bg-amber-500/10 text-amber-500" },
                { label: "Churned (30d)", value: "62", badge: "-1.9% churn", color: "bg-red-500/10 text-red-500" },
              ].map(({ label, value, badge, color }) => (
                <div key={label} className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-5">
                  <div className="text-3xl font-bold text-[var(--text-primary)] mb-1">{value}</div>
                  <div className="text-sm text-[var(--text-muted)]">{label}</div>
                  <div className={`mt-2 text-xs px-2 py-1 rounded-full inline-block ${color}`}>{badge}</div>
                </div>
              ))}
            </div>
            <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-5">
              <h2 className="font-bold text-[var(--text-primary)] mb-4">Revenue Breakdown</h2>
              <div className="space-y-3">
                {[
                  { label: "Monthly subscriptions (₹199/mo)", amount: "₹6,44,760", pct: 95 },
                  { label: "Annual plan upgrades", amount: "₹18,000", pct: 5 },
                ].map(({ label, amount, pct }) => (
                  <div key={label}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-[var(--text-secondary)]">{label}</span>
                      <span className="font-bold text-[var(--text-primary)]">{amount}</span>
                    </div>
                    <Progress value={pct} size="sm" animated={false} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {(activeTab === "Contributions" || activeTab === "Users") && (
          <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-8 text-center">
            <BarChart2 size={40} className="mx-auto mb-3 text-[var(--text-muted)] opacity-40" />
            <p className="text-[var(--text-muted)]">{activeTab} management panel</p>
            <p className="text-sm text-[var(--text-muted)] mt-1">Full analytics and management tools available in production</p>
          </div>
        )}
      </div>
    </div>
  );
}
