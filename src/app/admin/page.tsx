"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  IndianRupee,
  Clock,
  Brain,
  CheckCircle2,
  XCircle,
  BarChart3,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import { cn, formatNumber } from "@/lib/utils";
import { COMMUNITIES } from "@/lib/communities";
import {
  getAdminKPIs,
  getAdminLearningSeries,
  approveContribution,
  rejectContribution,
  getPendingContributions,
  type Contribution,
} from "@/lib/api";
import { supabase } from "@/lib/supabase";

// ─── Static fallback data ─────────────────────────────────────────────────────

const FALLBACK_KPIS = {
  total_learners: 52480,
  pending_contributions: 4,
  revenue_this_month: 61000,
  ai_sessions_today: 120,
  total_users: 52480,
  active_users: 18340,
  total_contributions: 3847,
  total_xp_awarded: 2840000,
  languages_active: 10,
};

const FALLBACK_SERIES = [
  { date: "Dec", learners: 32000, completions: 1200 },
  { date: "Jan", learners: 38000, completions: 1800 },
  { date: "Feb", learners: 41000, completions: 2100 },
  { date: "Mar", learners: 45500, completions: 2600 },
  { date: "Apr", learners: 49000, completions: 3100 },
  { date: "May", learners: 52480, completions: 3847 },
];

const PENDING_ITEMS = [
  { id: "c1", title: "Lepcha Morning Prayers (Audio)", type: "audio", contributor: "Rinzing L.", date: "May 15" },
  { id: "c2", title: "Bhutia Folk Song Transcription", type: "story", contributor: "Pema D.", date: "May 15" },
  { id: "c3", title: "Limbu Script Sample Set", type: "script", contributor: "Kumar R.", date: "May 14" },
  { id: "c4", title: "Sherpa Navigation Vocabulary", type: "audio", contributor: "Dawa S.", date: "May 14" },
];

// ─── KPI Card ─────────────────────────────────────────────────────────────────

interface KPICardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  bg: string;
  sub?: string;
}

function KPICard({ label, value, icon: Icon, color, bg, sub }: KPICardProps) {
  return (
    <Card className="p-5">
      <div className={cn("inline-flex p-2.5 rounded-xl mb-3", bg)}>
        <Icon className={cn("w-5 h-5", color)} />
      </div>
      <p className="text-2xl font-bold text-[var(--text-primary)]">{value}</p>
      <p className="text-xs text-[var(--text-muted)] mt-0.5">{label}</p>
      {sub && <p className="text-xs text-emerald-400 mt-1">{sub}</p>}
    </Card>
  );
}

// ─── Tab bar ──────────────────────────────────────────────────────────────────

type TabId = "overview" | "communities" | "contributions" | "users";

const TABS: { id: TabId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "communities", label: "Communities" },
  { id: "contributions", label: "Contributions" },
  { id: "users", label: "Users" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [tab, setTab] = useState<TabId>("overview");
  const [kpis, setKpis] = useState(FALLBACK_KPIS);
  const [series, setSeries] = useState(FALLBACK_SERIES);
  const [pendingItems, setPendingItems] = useState<Contribution[]>([]);
  const [pendingLoaded, setPendingLoaded] = useState(false);
  const [approving, setApproving] = useState<string | null>(null);
  const [rejecting, setRejecting] = useState<string | null>(null);

  useEffect(() => {
    getAdminKPIs()
      .then((data) => setKpis({ ...FALLBACK_KPIS, ...data }))
      .catch(() => {});
    getAdminLearningSeries()
      .then((data) => {
        if (data?.length) setSeries(data.map((d, i) => ({ ...FALLBACK_SERIES[i] ?? {}, ...d })));
      })
      .catch(() => {});
    getPendingContributions()
      .then((data) => {
        setPendingItems(data);
        setPendingLoaded(true);
      })
      .catch(() => {
        setPendingLoaded(true);
      });

    // Real-time: show new contributions instantly, remove approved/rejected
    const channel = supabase
      .channel("realtime:contributions")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "contributions", filter: "status=eq.pending" },
        (payload) => {
          const c = payload.new as Contribution;
          setPendingItems((prev) => [c, ...prev]);
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "contributions" },
        (payload) => {
          const c = payload.new as Contribution;
          if (c.status !== "pending") {
            setPendingItems((prev) => prev.filter((p) => p.id !== c.id));
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleApprove = async (id: string) => {
    setApproving(id);
    try {
      await approveContribution(id);
      setPendingItems((prev) => prev.filter((p) => p.id !== id));
      // Refresh KPIs after action
      getAdminKPIs().then((data) => setKpis((k) => ({ ...k, ...data }))).catch(() => {});
    } catch {
      /* ignore */
    } finally {
      setApproving(null);
    }
  };

  const handleReject = async (id: string) => {
    setRejecting(id);
    try {
      await rejectContribution(id, "Does not meet quality standards");
      setPendingItems((prev) => prev.filter((p) => p.id !== id));
      getAdminKPIs().then((data) => setKpis((k) => ({ ...k, ...data }))).catch(() => {});
    } catch {
      /* ignore */
    } finally {
      setRejecting(null);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)]">
      {/* Header */}
      <div className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Admin Dashboard</h1>
          <p className="text-sm text-[var(--text-muted)] mt-0.5">Platform management & analytics</p>
        </div>
        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-0 border-b border-[var(--border)]">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "px-5 py-3 text-sm font-medium border-b-2 transition-colors",
                  tab === t.id
                    ? "border-[var(--brand-primary)] text-[var(--brand-primary)]"
                    : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* ── Overview tab ── */}
        {tab === "overview" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* KPI cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <KPICard
                label="Total Users"
                value={formatNumber(kpis.total_learners)}
                icon={Users}
                color="text-blue-400"
                bg="bg-blue-500/10"
                sub="+12% this month"
              />
              <KPICard
                label="MRR (₹)"
                value={`₹${formatNumber(kpis.revenue_this_month)}`}
                icon={IndianRupee}
                color="text-emerald-400"
                bg="bg-emerald-500/10"
                sub="+8% vs last month"
              />
              <KPICard
                label="Pending Contributions"
                value={kpis.pending_contributions}
                icon={Clock}
                color="text-amber-400"
                bg="bg-amber-500/10"
              />
              <KPICard
                label="AI Sessions Today"
                value={kpis.ai_sessions_today}
                icon={Brain}
                color="text-violet-400"
                bg="bg-violet-500/10"
              />
            </div>

            {/* Learner growth chart */}
            <Card>
              <CardHeader>
                <h2 className="font-semibold text-[var(--text-primary)]">Learner Growth</h2>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={series} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#c4401a" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#c4401a" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: "#7a6858", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "#7a6858", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => formatNumber(v)}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "var(--surface)",
                        border: "1px solid var(--border)",
                        borderRadius: 8,
                        color: "var(--text-primary)",
                        fontSize: 12,
                      }}
                      formatter={(v) => [typeof v === "number" ? formatNumber(v) : String(v), "Learners"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="learners"
                      stroke="#c4401a"
                      strokeWidth={2}
                      fill="url(#areaGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Two columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Community health */}
              <Card>
                <CardHeader>
                  <h2 className="font-semibold text-[var(--text-primary)]">Community Health</h2>
                </CardHeader>
                <CardContent className="space-y-3">
                  {COMMUNITIES.map((c) => (
                    <div key={c.id} className="flex items-center gap-3">
                      <span className="text-base w-6 text-center">{c.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between mb-1">
                          <span className="text-xs font-medium text-[var(--text-primary)]">{c.name}</span>
                          <span className="text-xs text-[var(--text-muted)]">{c.preservation}%</span>
                        </div>
                        <Progress value={c.preservation} size="sm" color={c.preservation >= 55 ? "success" : "brand"} />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Pending review */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-[var(--text-primary)]">Pending Review</h2>
                    <Badge variant="warning">{pendingItems.length} items</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {pendingLoaded && pendingItems.length === 0 && (
                    <p className="text-sm text-[var(--text-muted)] text-center py-4">No pending contributions.</p>
                  )}
                  {!pendingLoaded && (
                    <div className="space-y-2">
                      {[1, 2].map((i) => (
                        <div key={i} className="h-16 rounded-xl bg-[var(--surface-raised)] animate-pulse" />
                      ))}
                    </div>
                  )}
                  {pendingItems.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-4"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <p className="text-sm font-medium text-[var(--text-primary)]">{item.title}</p>
                          <p className="text-xs text-[var(--text-muted)]">
                            {item.community_slug} · {new Date(item.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="ghost" size="sm">{item.type}</Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          loading={approving === item.id}
                          onClick={() => handleApprove(item.id)}
                          className="gap-1.5 flex-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          loading={rejecting === item.id}
                          onClick={() => handleReject(item.id)}
                          className="gap-1.5 flex-1"
                        >
                          <XCircle className="w-3.5 h-3.5 text-red-400" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        {/* ── Communities tab ── */}
        {tab === "communities" && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[var(--border)]">
                        {["Community", "Speakers", "Learners", "Preservation", "Lessons", "Actions"].map((h) => (
                          <th key={h} className="text-left px-5 py-3 text-[var(--text-muted)] font-medium whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {COMMUNITIES.map((c) => (
                        <tr key={c.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface-raised)] transition-colors">
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2">
                              <span>{c.emoji}</span>
                              <div>
                                <p className="font-medium text-[var(--text-primary)]">{c.name}</p>
                                <p className="text-xs text-[var(--text-muted)]">{c.region}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-[var(--text-secondary)]">{formatNumber(c.speakers)}</td>
                          <td className="px-5 py-3.5 text-[var(--text-secondary)]">{formatNumber(Math.floor(c.speakers * 0.03))}</td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2 w-28">
                              <Progress value={c.preservation} size="sm" color={c.preservation >= 55 ? "success" : "brand"} />
                              <span className="text-xs text-[var(--text-muted)] shrink-0">{c.preservation}%</span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-[var(--text-secondary)]">{Math.floor(Math.random() * 30 + 10)}</td>
                          <td className="px-5 py-3.5">
                            <Button size="sm" variant="ghost">View</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ── Contributions tab ── */}
        {tab === "contributions" && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              {["All", "Audio", "Story", "Script", "Image"].map((f) => (
                <Button key={f} variant="secondary" size="sm">{f}</Button>
              ))}
            </div>
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[var(--border)]">
                        {["Title", "Type", "Contributor", "Community", "Status", "Date", "Actions"].map((h) => (
                          <th key={h} className="text-left px-5 py-3 text-[var(--text-muted)] font-medium whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {pendingItems.length === 0 && pendingLoaded ? (
                        <tr>
                          <td colSpan={7} className="px-5 py-8 text-center text-sm text-[var(--text-muted)]">
                            No pending contributions.
                          </td>
                        </tr>
                      ) : null}
                      {pendingItems.map((item) => (
                        <tr key={item.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface-raised)] transition-colors">
                          <td className="px-5 py-3.5 font-medium text-[var(--text-primary)] max-w-[180px] truncate">{item.title}</td>
                          <td className="px-5 py-3.5"><Badge variant="ghost" size="sm">{item.type}</Badge></td>
                          <td className="px-5 py-3.5 text-[var(--text-secondary)]">{item.contributor_id}</td>
                          <td className="px-5 py-3.5 text-[var(--text-secondary)]">{item.community_slug}</td>
                          <td className="px-5 py-3.5">
                            {item.status === "approved"
                              ? <Badge variant="success">Approved</Badge>
                              : item.status === "rejected"
                              ? <Badge variant="error">Rejected</Badge>
                              : <Badge variant="warning">Pending</Badge>}
                          </td>
                          <td className="px-5 py-3.5 text-[var(--text-muted)]">{new Date(item.created_at).toLocaleDateString()}</td>
                          <td className="px-5 py-3.5">
                            {item.status === "pending" && (
                              <div className="flex gap-1">
                                <Button size="sm" variant="secondary" onClick={() => handleApprove(item.id)} loading={approving === item.id} className="gap-1">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> OK
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => handleReject(item.id)} loading={rejecting === item.id}>
                                  <XCircle className="w-3 h-3 text-red-400" />
                                </Button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ── Users tab ── */}
        {tab === "users" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 gap-4"
          >
            <Users className="w-12 h-12 text-[var(--text-muted)]" />
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">User management coming soon</h2>
            <p className="text-[var(--text-muted)] text-sm">Advanced user tools are under development.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
