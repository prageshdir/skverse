"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  BookOpen,
  Heart,
  Star,
  Lock,
  Globe,
  Pen,
  Mic,
  Bot,
  ChevronRight,
} from "lucide-react";
import { getCommunity, COMMUNITIES } from "@/lib/communities";
import { getCommunityOverview } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { cn, formatNumber } from "@/lib/utils";

type Tab = "overview" | "learn" | "archive" | "about";

const LEARNING_PATHS = [
  { id: "basics", title: "Language Basics", icon: BookOpen, locked: false, lessons: 12 },
  { id: "script", title: "Script Writing", icon: Pen, locked: false, lessons: 8 },
  { id: "pronunciation", title: "Pronunciation", icon: Mic, locked: true, lessons: 10 },
  { id: "ai", title: "AI Tutor", icon: Bot, locked: true, lessons: 6 },
];

const UNIT_CARDS = [
  { unit: 1, title: "Getting Started", subtitle: "Basics & Greetings", locked: false, progress: 100 },
  { unit: 2, title: "Greetings", subtitle: "Everyday expressions", locked: false, progress: 40 },
  { unit: 3, title: "Family & People", subtitle: "Relationships & kinship", locked: true, progress: 0 },
  { unit: 4, title: "Nature & Environment", subtitle: "Flora, fauna & land", locked: true, progress: 0 },
];

export default function CommunityDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const community = getCommunity(id as Parameters<typeof getCommunity>[0]);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [followed, setFollowed] = useState(false);
  const [overviewData, setOverviewData] = useState<{
    speakers?: number;
    learners?: number;
    contributors?: number;
  } | null>(null);

  useEffect(() => {
    getCommunityOverview(id)
      .then((data) => {
        setOverviewData({
          speakers: data.community.speakers,
        });
      })
      .catch(() => {
        // fallback to local data
      });
  }, [id]);

  if (!community) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <div className="text-center">
          <p className="text-2xl font-bold text-[var(--text-primary)]">Community not found</p>
          <Link href="/communities">
            <Button className="mt-4" variant="secondary">
              Back to Communities
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const speakers = overviewData?.speakers ?? community.speakers;
  const learners = Math.round(speakers * 0.18);
  const lessons = 48;
  const contributors = Math.round(speakers * 0.03);

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "learn", label: "Learn" },
    { id: "archive", label: "Archive" },
    { id: "about", label: "About" },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero */}
      <div
        className="relative overflow-hidden"
        style={{ backgroundColor: community.colors.bg }}
      >
        <div
          className="absolute inset-0"
          style={{ background: community.gradient, opacity: 0.7 }}
        />

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-5xl px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center text-center"
          >
            <span className="mb-4 text-7xl">{community.emoji}</span>
            <h1 className="text-4xl font-bold text-white sm:text-5xl">
              {community.name}
            </h1>
            <p
              className="mt-1 text-xl font-medium"
              style={{ color: community.colors.accent }}
            >
              {community.nativeName}
            </p>
            <p className="mt-3 text-base italic text-white/70">
              {community.colorDescription}
            </p>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/80">
              {community.cultural.element} · {community.script} · {community.region}
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href={`/learn/${community.id}`}>
                <Button size="lg">
                  Start Learning
                </Button>
              </Link>
              <Button
                variant="glass"
                size="lg"
                onClick={() => setFollowed((f) => !f)}
              >
                <Heart
                  className={cn("h-4 w-4", followed && "fill-current text-red-400")}
                />
                {followed ? "Following" : "Follow Community"}
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Diagonal SVG wave */}
        <svg
          className="absolute bottom-0 left-0 right-0 w-full"
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
          fill="var(--background)"
        >
          <path d="M0,60 L0,30 Q360,0 720,30 Q1080,60 1440,20 L1440,60 Z" />
        </svg>
      </div>

      <div className="mx-auto max-w-5xl px-4 pb-16 pt-8">
        {/* Stats grid */}
        <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Speakers", value: formatNumber(speakers), icon: Users },
            { label: "Learners", value: formatNumber(learners), icon: Star },
            { label: "Lessons", value: String(lessons), icon: BookOpen },
            { label: "Contributors", value: formatNumber(contributors), icon: Globe },
          ].map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 text-center shadow-sm"
            >
              <Icon className="mx-auto mb-2 h-5 w-5 text-[var(--brand-primary)]" />
              <p className="text-xl font-bold text-[var(--text-primary)]">{value}</p>
              <p className="text-xs text-[var(--text-muted)]">{label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mb-8 flex gap-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 rounded-lg py-2 text-sm font-medium transition-all",
                activeTab === tab.id
                  ? "bg-[var(--brand-primary)] text-white shadow-sm"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === "overview" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Cultural identity card */}
            <div
              className="overflow-hidden rounded-2xl border border-white/10"
              style={{ backgroundColor: community.colors.bg }}
            >
              <div
                className="px-5 py-4"
                style={{ background: community.gradient, opacity: 0.9 }}
              >
                <h3 className="font-semibold text-white">Cultural Identity</h3>
              </div>
              <div className="grid grid-cols-2 gap-4 p-5 sm:grid-cols-4">
                {[
                  { label: "Symbol", value: community.cultural.symbol },
                  { label: "Script", value: community.script },
                  { label: "Region", value: community.region },
                  { label: "Element", value: community.cultural.element },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-xs" style={{ color: community.colors.text + "80" }}>
                      {label}
                    </p>
                    <p className="mt-0.5 text-sm font-medium" style={{ color: community.colors.text }}>
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Learning path cards */}
            <div>
              <h3 className="mb-4 text-lg font-semibold text-[var(--text-primary)]">
                Learning Paths
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {LEARNING_PATHS.map((path) => {
                  const Icon = path.icon;
                  return (
                    <div
                      key={path.id}
                      className={cn(
                        "flex items-center gap-4 rounded-2xl border p-5 transition-all",
                        path.locked
                          ? "border-[var(--border)] bg-[var(--surface)] opacity-60"
                          : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--brand-primary)]/40 hover:shadow-md cursor-pointer"
                      )}
                    >
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-xl"
                        style={{ backgroundColor: community.colors.primary + "20" }}
                      >
                        <Icon
                          className="h-5 w-5"
                          style={{ color: community.colors.primary }}
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-[var(--text-primary)]">{path.title}</p>
                        <p className="text-xs text-[var(--text-muted)]">{path.lessons} lessons</p>
                      </div>
                      {path.locked ? (
                        <Lock className="h-4 w-4 text-[var(--text-muted)]" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-[var(--text-muted)]" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {community.tags.map((tag) => (
                <Badge key={tag} variant="ghost" className="capitalize">
                  {tag}
                </Badge>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "learn" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {UNIT_CARDS.map((unit) => (
              <div
                key={unit.unit}
                className={cn(
                  "rounded-2xl border p-5 transition-all",
                  unit.locked
                    ? "border-[var(--border)] bg-[var(--surface)] opacity-60"
                    : "border-[var(--border)] bg-[var(--surface)] hover:shadow-md"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white"
                      style={{ backgroundColor: community.colors.primary }}
                    >
                      {unit.unit}
                    </div>
                    <div>
                      <p className="font-semibold text-[var(--text-primary)]">{unit.title}</p>
                      <p className="text-xs text-[var(--text-muted)]">{unit.subtitle}</p>
                    </div>
                  </div>
                  {unit.locked ? (
                    <Lock className="h-4 w-4 text-[var(--text-muted)]" />
                  ) : unit.progress === 100 ? (
                    <Badge variant="success">Complete</Badge>
                  ) : (
                    <Badge variant="info">{unit.progress}%</Badge>
                  )}
                </div>
                {!unit.locked && (
                  <div className="mt-3">
                    <Progress value={unit.progress} size="sm" color="brand" />
                  </div>
                )}
              </div>
            ))}
            <Link href={`/learn/${community.id}`}>
              <Button className="mt-2 w-full" size="lg">
                Continue Learning
              </Button>
            </Link>
          </motion.div>
        )}

        {activeTab === "archive" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <span className="mb-4 text-5xl">📦</span>
            <h3 className="text-xl font-semibold text-[var(--text-primary)]">
              Archive items coming soon
            </h3>
            <p className="mt-2 max-w-sm text-sm text-[var(--text-muted)]">
              Cultural audio, stories, and scripts for the {community.name} community will be available here.
            </p>
          </motion.div>
        )}

        {activeTab === "about" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
              <h3 className="mb-3 text-lg font-semibold text-[var(--text-primary)]">
                About {community.name}
              </h3>
              <p className="leading-relaxed text-[var(--text-secondary)]">
                The {community.name} community ({community.nativeName}) is one of the ten living
                cultures of Sikkim. Their unique identity is shaped by the{" "}
                {community.cultural.element}, the {community.cultural.symbol}, and the beautiful{" "}
                {community.script}. Located in {community.region}, the community maintains deep
                cultural roots through {community.cultural.pattern} and other traditions.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
                <p className="mb-1 text-xs uppercase tracking-wider text-[var(--text-muted)]">
                  Preservation Level
                </p>
                <div className="flex items-center gap-3">
                  <Progress value={community.preservation} size="md" color="brand" className="flex-1" />
                  <span className="text-sm font-bold text-[var(--text-primary)]">
                    {community.preservation}%
                  </span>
                </div>
                <p className="mt-2 text-xs text-[var(--text-muted)]">
                  {community.preservation < 50
                    ? "Critically endangered — needs urgent preservation efforts"
                    : community.preservation < 65
                    ? "Vulnerable — active preservation programs in place"
                    : "Stable — growing community engagement"}
                </p>
              </div>

              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
                <p className="mb-1 text-xs uppercase tracking-wider text-[var(--text-muted)]">
                  Region
                </p>
                <p className="text-lg font-semibold text-[var(--text-primary)]">
                  {community.region}
                </p>
                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  Sikkim, India
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
