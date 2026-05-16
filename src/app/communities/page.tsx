"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { COMMUNITIES } from "@/lib/communities";
import { formatNumber } from "@/lib/utils";
import { Search, Filter, Users, BookOpen, Mic } from "lucide-react";

const FILTERS = ["All", "Endangered", "Active", "Beginner Friendly", "Audio Rich"];

export default function CommunitiesPage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = COMMUNITIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.language.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pt-16 pb-24 min-h-screen bg-[var(--background)]">
      {/* Hero */}
      <div className="relative overflow-hidden py-16 px-4">
        <div className="absolute inset-0 gradient-sikkim opacity-80" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-white mb-3">Explore Communities</h1>
            <p className="text-white/70 text-lg">
              Ten living cultures. Ten worlds to discover. Each with its own language, script, and soul.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search communities or languages..."
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--brand-primary)] transition-colors"
            />
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeFilter === f
                  ? "bg-[var(--brand-primary)] text-white"
                  : "bg-[var(--surface)] border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--text-muted)]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Stats bar */}
        <div className="flex flex-wrap gap-6 mb-8 p-4 bg-[var(--surface)] rounded-2xl border border-[var(--border)]">
          {[
            { icon: Users, label: "Total Learners", value: formatNumber(COMMUNITIES.reduce((s, c) => s + c.learners, 0)) + "+" },
            { icon: BookOpen, label: "Total Lessons", value: COMMUNITIES.reduce((s, c) => s + c.lessons, 0) + "+" },
            { icon: Mic, label: "Communities", value: COMMUNITIES.length.toString() },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[var(--surface-raised)] flex items-center justify-center">
                <Icon size={16} className="text-[var(--text-secondary)]" />
              </div>
              <div>
                <div className="font-bold text-sm text-[var(--text-primary)]">{value}</div>
                <div className="text-xs text-[var(--text-muted)]">{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Community Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((community, i) => (
            <motion.div
              key={community.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <Link href={`/communities/${community.id}`}>
                <div
                  className="rounded-3xl overflow-hidden cursor-pointer group hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
                  style={{ background: community.colors.bg }}
                >
                  {/* Banner */}
                  <div className="relative h-32 overflow-hidden">
                    <div
                      className="absolute inset-0 opacity-70 group-hover:opacity-90 transition-opacity duration-500"
                      style={{ background: community.gradient }}
                    />
                    <div className="absolute inset-0 opacity-5"
                      style={{
                        backgroundImage: `repeating-linear-gradient(45deg, ${community.colors.accent} 0, ${community.colors.accent} 1px, transparent 0, transparent 50%)`,
                        backgroundSize: "16px 16px",
                      }}
                    />
                    <div className="relative p-5 h-full flex items-end">
                      <div>
                        <span className="text-4xl">{community.emoji}</span>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-2xl font-bold text-white">{community.name}</h3>
                        <p className="text-white/70 text-sm">{community.nativeName}</p>
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <p className="text-white/70 text-sm leading-relaxed mb-4">
                      {community.description.slice(0, 100)}...
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {community.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 rounded-full text-white/70 border border-white/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {[
                        { label: "Speakers", value: formatNumber(community.speakers) },
                        { label: "Learners", value: formatNumber(community.learners) },
                        { label: "Lessons", value: community.lessons.toString() },
                      ].map(({ label, value }) => (
                        <div key={label} className="text-center">
                          <div className="font-bold text-white text-sm">{value}</div>
                          <div className="text-white/50 text-xs">{label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Preservation */}
                    <div>
                      <div className="flex items-center justify-between text-xs text-white/50 mb-1.5">
                        <span>Language Preservation</span>
                        <span>{community.preservationLevel}%</span>
                      </div>
                      <Progress
                        value={community.preservationLevel}
                        animated={false}
                        size="sm"
                        barClassName="bg-white/60"
                        trackClassName="bg-white/15"
                      />
                    </div>

                    <div className="mt-4">
                      <Button variant="glass" size="sm" className="w-full">
                        Explore {community.name} →
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
