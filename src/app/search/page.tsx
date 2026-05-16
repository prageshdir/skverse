"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Mic, BookOpen, Image, FileText, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { cn, formatNumber } from "@/lib/utils";
import { COMMUNITIES } from "@/lib/communities";
import { getArchive } from "@/lib/api";
import type { ArchiveItem } from "@/lib/api";

// ─── Filter types ─────────────────────────────────────────────────────────────

type FilterType = "all" | "audio" | "story" | "image" | "script";

const FILTERS: { id: FilterType; label: string; icon: React.ElementType }[] = [
  { id: "all", label: "All", icon: Search },
  { id: "audio", label: "Audio", icon: Mic },
  { id: "story", label: "Stories", icon: BookOpen },
  { id: "image", label: "Images", icon: Image },
  { id: "script", label: "Script", icon: FileText },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [results, setResults] = useState<ArchiveItem[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-focus
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const doSearch = useCallback(async (q: string, f: FilterType) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await getArchive({
        query: q,
        type: f === "all" ? undefined : f,
        limit: 12,
      });
      setResults(res.items);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(query, filter), 350);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, filter, doSearch]);

  const hasQuery = query.trim().length > 0;

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)]">
      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* Search bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search languages, stories, audio, scripts…"
            className="w-full h-14 pl-12 pr-12 rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] text-base focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/50 placeholder:text-[var(--text-muted)]"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap mb-8">
          {FILTERS.map((f) => {
            const Icon = f.icon;
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border transition-all",
                  filter === f.id
                    ? "bg-[var(--brand-primary)] text-white border-[var(--brand-primary)]"
                    : "bg-[var(--surface)] border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--brand-primary)]/40"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-[var(--brand-primary)]" />
          </div>
        )}

        {/* Results */}
        {!loading && hasQuery && (
          <AnimatePresence mode="wait">
            {results.length > 0 ? (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <p className="text-sm text-[var(--text-muted)] mb-4">
                  {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
                </p>
                <div className="space-y-3">
                  {results.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className="p-4 hover:border-[var(--brand-primary)]/30 transition-all cursor-pointer">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="ghost" size="sm">{item.type}</Badge>
                              <span className="text-xs text-[var(--text-muted)]">{item.community_slug}</span>
                            </div>
                            <h3 className="font-semibold text-[var(--text-primary)] mb-1 truncate">{item.title}</h3>
                            <p className="text-sm text-[var(--text-secondary)] line-clamp-2">{item.description}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {item.tags.slice(0, 3).map((tag) => (
                                <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--surface-raised)] text-[var(--text-muted)]">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          {item.thumbnail_url && (
                            <div className="w-16 h-16 rounded-xl bg-[var(--surface-raised)] shrink-0 overflow-hidden">
                              <img src={item.thumbnail_url} alt={item.title} className="w-full h-full object-cover" />
                            </div>
                          )}
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center py-16 gap-3"
              >
                <Search className="w-10 h-10 text-[var(--text-muted)]" />
                <p className="text-[var(--text-primary)] font-medium">No results found</p>
                <p className="text-sm text-[var(--text-muted)]">
                  Try a different search term or filter
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Empty query — trending communities */}
        {!hasQuery && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Explore Communities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {COMMUNITIES.map((c) => (
                <Link key={c.id} href={`/community/${c.id}`}>
                  <motion.div
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="rounded-2xl overflow-hidden border border-[var(--border)] cursor-pointer"
                  >
                    <div
                      className="h-20 flex items-center justify-center text-4xl"
                      style={{ background: c.gradient }}
                    >
                      {c.emoji}
                    </div>
                    <div className="bg-[var(--surface)] px-3 py-2">
                      <p className="text-xs font-semibold text-[var(--text-primary)] truncate">{c.name}</p>
                      <p className="text-[10px] text-[var(--text-muted)]">{formatNumber(c.speakers)} speakers</p>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>

            <h2 className="text-lg font-semibold text-[var(--text-primary)] mt-8 mb-4">Browse by Type</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {FILTERS.filter((f) => f.id !== "all").map((f) => {
                const Icon = f.icon;
                return (
                  <button
                    key={f.id}
                    onClick={() => { setFilter(f.id); inputRef.current?.focus(); }}
                    className="flex items-center gap-3 p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--brand-primary)]/40 hover:bg-[var(--surface-raised)] transition-all text-left"
                  >
                    <Icon className="w-5 h-5 text-[var(--brand-primary)]" />
                    <span className="font-medium text-[var(--text-primary)] text-sm">{f.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
