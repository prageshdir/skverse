"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { COMMUNITIES } from "@/lib/communities";
import { Search, BookOpen, Mic, PenTool, Users, Globe, X, Clock, TrendingUp } from "lucide-react";

const ALL_RESULTS = [
  { type: "word", title: "Tashi Delek", subtitle: "Bhutia · Greeting", badge: "Word", href: "/audio" },
  { type: "lesson", title: "Greetings & Introductions", subtitle: "Bhutia · Unit 2 · Lesson 4", badge: "Lesson", href: "/learn/bhutia" },
  { type: "word", title: "Nong-rong", subtitle: "Lepcha · Sacred forest", badge: "Word", href: "/audio" },
  { type: "story", title: "The Legend of Kanchenjunga", subtitle: "Bhutia · Folk tale", badge: "Story", href: "/archive" },
  { type: "lesson", title: "Forest Words", subtitle: "Lepcha · Unit 1 · Lesson 3", badge: "Lesson", href: "/learn/lepcha" },
  { type: "community", title: "Limbu Community", subtitle: "Sirijonga Script · 52 lessons", badge: "Community", href: "/communities/limbu" },
  { type: "word", title: "Kang-chen", subtitle: "Bhutia · Great snow mountain", badge: "Word", href: "/audio" },
  { type: "lesson", title: "Counting & Numbers", subtitle: "Tamang · Unit 1 · Lesson 2", badge: "Lesson", href: "/learn/tamang" },
];

const TRENDING = [
  "Tashi Delek", "Lepcha script", "Bhutia greetings", "Limbu alphabet", "Mountain vocabulary"
];

const RECENT = [
  "greetings", "Bhutia script", "pronunciation"
];

const TYPE_ICONS: Record<string, React.ElementType> = {
  word: Mic,
  lesson: BookOpen,
  story: Globe,
  community: Users,
};

const TYPE_COLORS: Record<string, string> = {
  word: "text-emerald-500 bg-emerald-500/10",
  lesson: "text-blue-500 bg-blue-500/10",
  story: "text-violet-500 bg-violet-500/10",
  community: "text-amber-500 bg-amber-500/10",
};

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const FILTERS = ["All", "Lessons", "Words", "Stories", "Communities"];

  const results = query
    ? ALL_RESULTS.filter(
        (r) =>
          (r.title.toLowerCase().includes(query.toLowerCase()) ||
            r.subtitle.toLowerCase().includes(query.toLowerCase())) &&
          (activeFilter === "All" ||
            r.badge.toLowerCase() === activeFilter.toLowerCase().replace(/s$/, ""))
      )
    : [];

  return (
    <div className="min-h-screen pt-16 pb-24 bg-[var(--background)]">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Search bar */}
        <motion.div
          className="relative mb-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search words, lessons, stories, communities..."
            className="w-full h-13 h-[52px] pl-12 pr-12 rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-base focus:outline-none focus:border-[var(--brand-primary)] transition-colors shadow-sm"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </motion.div>

        {/* Filters */}
        {query && (
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeFilter === f
                    ? "bg-[var(--brand-primary)] text-white"
                    : "bg-[var(--surface)] border border-[var(--border)] text-[var(--text-secondary)]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {!query ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Recent searches */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Clock size={14} className="text-[var(--text-muted)]" />
                  <h2 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider">Recent</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {RECENT.map((r) => (
                    <button
                      key={r}
                      onClick={() => setQuery(r)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--text-secondary)] hover:border-[var(--text-muted)] transition-colors"
                    >
                      <Clock size={12} className="text-[var(--text-muted)]" />
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trending */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp size={14} className="text-[var(--brand-primary)]" />
                  <h2 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider">Trending</h2>
                </div>
                <div className="space-y-2">
                  {TRENDING.map((t, i) => (
                    <button
                      key={t}
                      onClick={() => setQuery(t)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--surface)] transition-colors group"
                    >
                      <span className="text-sm font-bold text-[var(--text-muted)] w-5">{i + 1}</span>
                      <TrendingUp size={14} className="text-[var(--brand-primary)]" />
                      <span className="flex-1 text-sm text-[var(--text-primary)] text-left">{t}</span>
                      <Search size={14} className="text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Communities quick access */}
              <div>
                <h2 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">Communities</h2>
                <div className="grid grid-cols-3 gap-2">
                  {COMMUNITIES.slice(0, 6).map((c) => (
                    <Link key={c.id} href={`/communities/${c.id}`}>
                      <div
                        className="relative rounded-2xl overflow-hidden p-3 text-center cursor-pointer"
                        style={{ background: c.colors.bg }}
                      >
                        <div className="absolute inset-0 opacity-40" style={{ background: c.gradient }} />
                        <div className="relative">
                          <div className="text-2xl mb-1">{c.emoji}</div>
                          <div className="text-white text-xs font-semibold">{c.name}</div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : results.length > 0 ? (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              <p className="text-sm text-[var(--text-muted)] mb-3">
                {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
              </p>
              {results.map((r, i) => {
                const Icon = TYPE_ICONS[r.type] || Search;
                const colorClass = TYPE_COLORS[r.type] || "text-gray-500 bg-gray-500/10";
                const [textColor, bgColor] = colorClass.split(" ");
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link href={r.href}>
                      <div className="flex items-center gap-3 p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--text-muted)] transition-all">
                        <div className={`w-10 h-10 rounded-xl ${bgColor} flex items-center justify-center shrink-0`}>
                          <Icon size={18} className={textColor} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-[var(--text-primary)]">{r.title}</div>
                          <div className="text-xs text-[var(--text-muted)] truncate">{r.subtitle}</div>
                        </div>
                        <Badge size="sm">{r.badge}</Badge>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="no-results"
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Search size={40} className="mx-auto mb-3 text-[var(--text-muted)] opacity-40" />
              <p className="text-[var(--text-muted)]">No results for &ldquo;{query}&rdquo;</p>
              <p className="text-sm text-[var(--text-muted)] mt-1">Try a different word or browse communities</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
