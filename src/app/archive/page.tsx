"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Mic, BookOpen, PenTool, Image, Play, Archive } from "lucide-react";
import { getArchive } from "@/lib/api";
import type { ArchiveItem } from "@/lib/api";
import { COMMUNITIES } from "@/lib/communities";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

// ─── Static fallback ──────────────────────────────────────────────────────────

const STATIC_ITEMS: ArchiveItem[] = [
  {
    id: "a1",
    title: "Forest Song of the Lepcha Elders",
    description: "A traditional chant recorded in North Sikkim forest groves.",
    type: "audio",
    community_slug: "lepcha",
    contributor: "Tenzin Rongpo",
    contributor_name: "Tenzin Rongpo",
    is_featured: false,
    view_count: 0,
    created_at: "2024-03-12T00:00:00Z",
    tags: ["song", "nature", "traditional"],
  },
  {
    id: "a2",
    title: "The Origin Story of Kangchenjunga",
    description: "An ancient oral story narrated by the Bhutia community.",
    type: "oral_history",
    community_slug: "bhutia",
    contributor: "Karma Dorje",
    contributor_name: "Karma Dorje",
    is_featured: false,
    view_count: 0,
    created_at: "2024-04-01T00:00:00Z",
    tags: ["myth", "mountain", "origin"],
  },
  {
    id: "a3",
    title: "Sirijonga Script Manuscript",
    description: "Digitized pages from a 19th-century Limbu scriptural text.",
    type: "script",
    community_slug: "limbu",
    contributor: "Indra Hang Subba",
    contributor_name: "Indra Hang Subba",
    is_featured: false,
    view_count: 0,
    created_at: "2024-01-20T00:00:00Z",
    tags: ["script", "manuscript", "historical"],
  },
  {
    id: "a4",
    title: "Damphu Drum Ceremony",
    description: "Audio from a Tamang festival ceremony featuring live drumming.",
    type: "audio",
    community_slug: "tamang",
    contributor: "Sanjay Tamang",
    contributor_name: "Sanjay Tamang",
    is_featured: false,
    view_count: 0,
    created_at: "2024-02-14T00:00:00Z",
    tags: ["drum", "ceremony", "festival"],
  },
  {
    id: "a5",
    title: "Lepcha Woven Textile Patterns",
    description: "High-resolution images of traditional Lepcha woven patterns.",
    type: "image",
    community_slug: "lepcha",
    contributor: "Mayel Lyang Foundation",
    contributor_name: "Mayel Lyang Foundation",
    is_featured: false,
    view_count: 0,
    created_at: "2024-05-07T00:00:00Z",
    tags: ["textile", "art", "craft"],
  },
  {
    id: "a6",
    title: "Bhutia Prayer Wheel Inscriptions",
    description: "Script images from the Pemayangtse monastery prayer wheels.",
    type: "image",
    community_slug: "bhutia",
    contributor: "Dorje Wangchuk",
    contributor_name: "Dorje Wangchuk",
    is_featured: false,
    view_count: 0,
    created_at: "2024-06-18T00:00:00Z",
    tags: ["buddhist", "script", "monastery"],
  },
  {
    id: "a7",
    title: "Limbu Folk Tales Collection",
    description: "Seven short folk stories from the Kirat oral tradition.",
    type: "story",
    community_slug: "limbu",
    contributor: "Mina Hang Limbu",
    contributor_name: "Mina Hang Limbu",
    is_featured: false,
    view_count: 0,
    created_at: "2024-07-03T00:00:00Z",
    tags: ["folk", "oral", "kirat"],
  },
  {
    id: "a8",
    title: "Tamang Jenticha Script Primer",
    description: "A beginner's guide to reading Tamang script characters.",
    type: "script",
    community_slug: "tamang",
    contributor: "Pasang Tamang",
    contributor_name: "Pasang Tamang",
    is_featured: false,
    view_count: 0,
    created_at: "2024-08-11T00:00:00Z",
    tags: ["script", "education", "primer"],
  },
];

// ─── Type config ──────────────────────────────────────────────────────────────

type ItemType = "all" | "audio" | "story" | "script" | "image";

const TYPE_CHIPS: { id: ItemType; label: string }[] = [
  { id: "all", label: "All" },
  { id: "audio", label: "Audio" },
  { id: "story", label: "Stories" },
  { id: "script", label: "Scripts" },
  { id: "image", label: "Images" },
];

interface TypeConfig {
  icon: typeof Mic;
  color: string;
  bg: string;
  label: string;
}

const TYPE_CONFIG: Record<string, TypeConfig> = {
  audio: { icon: Mic, color: "text-emerald-400", bg: "bg-emerald-500/15", label: "Audio" },
  story: { icon: BookOpen, color: "text-sky-400", bg: "bg-sky-500/15", label: "Story" },
  script: { icon: PenTool, color: "text-violet-400", bg: "bg-violet-500/15", label: "Script" },
  image: { icon: Image, color: "text-amber-400", bg: "bg-amber-500/15", label: "Image" },
};

function getTypeConfig(type: string): TypeConfig {
  return TYPE_CONFIG[type] ?? TYPE_CONFIG.story;
}

function getCommunityData(slug: string) {
  return COMMUNITIES.find((c) => c.id === slug);
}

function getMetadata(item: ArchiveItem): string {
  if (item.type === "audio") return "~4 min";
  if (item.type === "story") return "~1200 words";
  if (item.type === "script") return "12 pages";
  return "HD image";
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function ArchiveCard({ item, index }: { item: ArchiveItem; index: number }) {
  const community = getCommunityData(item.community_slug);
  const { icon: TypeIcon, color, bg, label } = getTypeConfig(item.type);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="group overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
    >
      {/* Banner */}
      <div
        className="relative h-32 overflow-hidden"
        style={
          community
            ? { background: community.gradient }
            : { background: "linear-gradient(135deg, #1a1a2e 0%, #2d2d4e 100%)" }
        }
      >
        <div className="absolute inset-0 bg-black/20" />

        {/* Type badge */}
        <div className="absolute left-3 top-3">
          <div
            className={cn(
              "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
              bg,
              color,
              "backdrop-blur-sm border border-white/10"
            )}
          >
            <TypeIcon className="h-3 w-3" />
            {label}
          </div>
        </div>

        {/* Play overlay for audio */}
        {item.type === "audio" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border border-white/30 transition-all group-hover:bg-white/30 group-hover:scale-110">
              <Play className="h-5 w-5 fill-white text-white" />
            </div>
          </div>
        )}

        {/* Community emoji */}
        {community && (
          <div className="absolute bottom-2 right-3">
            <span className="text-2xl">{community.emoji}</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        <h3 className="mb-1 font-semibold leading-snug text-[var(--text-primary)] line-clamp-2">
          {item.title}
        </h3>

        {/* Community + contributor */}
        <div className="mb-3 flex items-center gap-2">
          {community && (
            <span className="text-xs font-medium text-[var(--text-secondary)]">
              {community.emoji} {community.name}
            </span>
          )}
          {item.contributor && (
            <>
              <span className="text-[var(--text-muted)]">·</span>
              <span className="text-xs text-[var(--text-muted)]">{item.contributor}</span>
            </>
          )}
        </div>

        {/* Metadata */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-[var(--text-muted)]">{getMetadata(item)}</span>
          <div className="flex gap-1">
            {item.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[var(--surface-raised)] px-2 py-0.5 text-[10px] text-[var(--text-muted)] capitalize"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ArchivePage() {
  const [items, setItems] = useState<ArchiveItem[]>(STATIC_ITEMS);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<ItemType>("all");
  const [communityFilter, setCommunityFilter] = useState("all");

  useEffect(() => {
    getArchive()
      .then((res) => {
        if (res.items && res.items.length > 0) {
          setItems(res.items);
        }
      })
      .catch(() => {
        // use static fallback
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        !search ||
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase()) ||
        item.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

      const matchesType = typeFilter === "all" || item.type === typeFilter;
      const matchesCommunity =
        communityFilter === "all" || item.community_slug === communityFilter;

      return matchesSearch && matchesType && matchesCommunity;
    });
  }, [items, search, typeFilter, communityFilter]);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero */}
      <div className="gradient-sikkim relative overflow-hidden px-4 py-16 text-center">
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10">
          <div className="mb-3 flex justify-center">
            <Archive className="h-8 w-8 text-white/80" />
          </div>
          <h1 className="text-4xl font-bold text-white">Cultural Archive</h1>
          <p className="mt-2 text-white/70">
            Audio, stories, scripts, and images from ten Sikkimese communities
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Filters */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search archive..."
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

          {/* Community select */}
          <select
            value={communityFilter}
            onChange={(e) => setCommunityFilter(e.target.value)}
            className={cn(
              "rounded-xl border border-[var(--border)] bg-[var(--surface)]",
              "px-3 py-2.5 text-sm text-[var(--text-primary)]",
              "focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/40"
            )}
          >
            <option value="all">All Communities</option>
            {COMMUNITIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.emoji} {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Type chips */}
        <div className="mb-8 flex flex-wrap gap-2">
          {TYPE_CHIPS.map((chip) => (
            <button
              key={chip.id}
              onClick={() => setTypeFilter(chip.id)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-all",
                typeFilter === chip.id
                  ? "bg-[var(--brand-primary)] text-white shadow-md"
                  : "border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:border-[var(--brand-primary)]/50"
              )}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="mb-6 text-sm text-[var(--text-muted)]">
          {filtered.length} item{filtered.length !== 1 ? "s" : ""} found
        </p>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-60 animate-pulse rounded-2xl border border-[var(--border)] bg-[var(--surface)]"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <Archive className="mx-auto mb-3 h-10 w-10 text-[var(--text-muted)]" />
            <p className="text-[var(--text-muted)]">No items found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item, i) => (
              <ArchiveCard key={item.id} item={item} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
