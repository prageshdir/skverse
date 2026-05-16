"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Users, BookOpen, Globe } from "lucide-react";
import { COMMUNITIES } from "@/lib/communities";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { cn, formatNumber } from "@/lib/utils";

type Filter = "all" | "endangered" | "active" | "beginner";

const FILTER_CHIPS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "endangered", label: "Endangered" },
  { id: "active", label: "Active" },
  { id: "beginner", label: "Beginner Friendly" },
];

export default function CommunitiesPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(() => {
    return COMMUNITIES.filter((c) => {
      const matchesSearch =
        !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.nativeName.toLowerCase().includes(search.toLowerCase()) ||
        c.region.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        filter === "all" ||
        (filter === "endangered" && c.preservation < 50) ||
        (filter === "active" && c.preservation >= 50) ||
        (filter === "beginner" && c.preservation >= 55);

      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

  const totalLearners = COMMUNITIES.reduce(
    (sum, c) => sum + Math.round(c.speakers * 0.18),
    0
  );
  const totalLessons = COMMUNITIES.length * 48;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero */}
      <div className="gradient-sikkim relative overflow-hidden px-4 py-20 text-center">
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="ghost" className="mb-4 text-white/80 border-white/20">
              <Globe className="h-3 w-3" />
              Himalayan Language Ecosystem
            </Badge>
            <h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
              Explore Communities
            </h1>
            <p className="mt-4 text-lg text-white/80">
              Ten living cultures of Sikkim
            </p>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10">
        {/* Search + Filters */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search communities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={cn(
                "w-full rounded-xl border border-[var(--border)] bg-[var(--surface)]",
                "py-2.5 pl-9 pr-4 text-sm text-[var(--text-primary)]",
                "placeholder:text-[var(--text-muted)] focus:outline-none",
                "focus:ring-2 focus:ring-[var(--brand-primary)]/40"
              )}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {FILTER_CHIPS.map((chip) => (
              <button
                key={chip.id}
                onClick={() => setFilter(chip.id)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-medium transition-all",
                  filter === chip.id
                    ? "bg-[var(--brand-primary)] text-white shadow-md"
                    : "border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:border-[var(--brand-primary)]/50"
                )}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stats bar */}
        <div className="mb-10 grid grid-cols-3 gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <div className="text-center">
            <p className="text-2xl font-bold text-[var(--text-primary)]">
              {formatNumber(totalLearners)}
            </p>
            <p className="text-xs text-[var(--text-muted)]">Total Learners</p>
          </div>
          <div className="text-center border-x border-[var(--border)]">
            <p className="text-2xl font-bold text-[var(--text-primary)]">
              {formatNumber(totalLessons)}
            </p>
            <p className="text-xs text-[var(--text-muted)]">Total Lessons</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[var(--text-primary)]">10</p>
            <p className="text-xs text-[var(--text-muted)]">Communities</p>
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="py-20 text-center text-[var(--text-muted)]">
            No communities found. Try adjusting your search or filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {filtered.map((community, i) => {
              const learners = Math.round(community.speakers * 0.18);
              const lessons = 48;
              return (
                <motion.div
                  key={community.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  className="overflow-hidden rounded-2xl border border-white/10 shadow-xl"
                  style={{ backgroundColor: community.colors.bg }}
                >
                  {/* Gradient banner */}
                  <div
                    className="relative flex items-center gap-4 px-5 py-6"
                    style={{ background: community.gradient }}
                  >
                    <span className="text-5xl">{community.emoji}</span>
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        {community.name}
                      </h2>
                      <p
                        className="text-sm font-medium"
                        style={{ color: community.colors.accent }}
                      >
                        {community.nativeName}
                      </p>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5">
                    {/* Description */}
                    <p
                      className="mb-4 text-sm leading-relaxed"
                      style={{ color: community.colors.text + "cc" }}
                    >
                      {`${community.script} · ${community.colorDescription}`.slice(
                        0,
                        100
                      )}
                    </p>

                    {/* Tags */}
                    <div className="mb-4 flex flex-wrap gap-1.5">
                      {community.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full px-2.5 py-0.5 text-xs font-medium capitalize"
                          style={{
                            backgroundColor: community.colors.primary + "30",
                            color: community.colors.secondary,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Stats row */}
                    <div className="mb-5 grid grid-cols-3 gap-2 text-center">
                      <div>
                        <div className="flex items-center justify-center gap-1">
                          <Users className="h-3 w-3" style={{ color: community.colors.accent }} />
                          <span
                            className="text-sm font-semibold"
                            style={{ color: community.colors.text }}
                          >
                            {formatNumber(community.speakers)}
                          </span>
                        </div>
                        <p className="text-xs" style={{ color: community.colors.text + "80" }}>
                          Speakers
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center justify-center gap-1">
                          <Users className="h-3 w-3" style={{ color: community.colors.accent }} />
                          <span
                            className="text-sm font-semibold"
                            style={{ color: community.colors.text }}
                          >
                            {formatNumber(learners)}
                          </span>
                        </div>
                        <p className="text-xs" style={{ color: community.colors.text + "80" }}>
                          Learners
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center justify-center gap-1">
                          <BookOpen className="h-3 w-3" style={{ color: community.colors.accent }} />
                          <span
                            className="text-sm font-semibold"
                            style={{ color: community.colors.text }}
                          >
                            {lessons}
                          </span>
                        </div>
                        <p className="text-xs" style={{ color: community.colors.text + "80" }}>
                          Lessons
                        </p>
                      </div>
                    </div>

                    {/* Preservation */}
                    <div className="mb-5">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-xs" style={{ color: community.colors.text + "99" }}>
                          Preservation
                        </span>
                        <span
                          className="text-xs font-semibold"
                          style={{ color: community.colors.secondary }}
                        >
                          {community.preservation}%
                        </span>
                      </div>
                      <div
                        className="h-1.5 w-full overflow-hidden rounded-full"
                        style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
                      >
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${community.preservation}%`,
                            backgroundColor: "rgba(255,255,255,0.6)",
                          }}
                        />
                      </div>
                    </div>

                    {/* CTA */}
                    <Link href={`/communities/${community.id}`}>
                      <button
                        className="w-full rounded-xl py-2.5 text-sm font-semibold transition-all hover:brightness-110 active:scale-[0.98]"
                        style={{
                          background: community.gradient,
                          color: community.colors.text,
                          border: `1px solid ${community.colors.primary}40`,
                        }}
                      >
                        Explore {community.name}
                      </button>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
