"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { COMMUNITIES } from "@/lib/communities";
import { Search, Mic, BookOpen, Image, PenTool, Play, Filter } from "lucide-react";

const ARCHIVE_ITEMS = [
  { id: 1, type: "audio", title: "Morning Blessing Song", community: "bhutia", contributor: "Dawa B.", duration: "2:34", featured: true },
  { id: 2, type: "story", title: "The Legend of Kanchenjunga", community: "bhutia", contributor: "Tenzin D.", words: 1240, featured: true },
  { id: 3, type: "audio", title: "Forest Prayer Chant", community: "lepcha", contributor: "Sonam R.", duration: "1:18", featured: false },
  { id: 4, type: "script", title: "Lepcha Character Set A", community: "lepcha", contributor: "Karma L.", pages: 4, featured: false },
  { id: 5, type: "story", title: "Warrior's Tale of the Subba", community: "limbu", contributor: "Rohan S.", words: 840, featured: true },
  { id: 6, type: "audio", title: "Damphu Drum Meditation", community: "tamang", contributor: "Maya T.", duration: "4:12", featured: false },
  { id: 7, type: "image", title: "Traditional Weaving Patterns", community: "limbu", contributor: "Puja L.", images: 12, featured: false },
  { id: 8, type: "audio", title: "Harvest Festival Chant", community: "tamang", contributor: "Bikash G.", duration: "3:05", featured: true },
];

const TYPE_ICONS: Record<string, React.ElementType> = {
  audio: Mic, story: BookOpen, script: PenTool, image: Image,
};
const TYPE_COLORS: Record<string, string> = {
  audio: "text-emerald-500 bg-emerald-500/10",
  story: "text-blue-500 bg-blue-500/10",
  script: "text-violet-500 bg-violet-500/10",
  image: "text-amber-500 bg-amber-500/10",
};

export default function ArchivePage() {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedCommunity, setSelectedCommunity] = useState("All");

  const TYPES = ["All", "Audio", "Stories", "Scripts", "Images"];

  const filtered = ARCHIVE_ITEMS.filter((item) => {
    const matchSearch = item.title.toLowerCase().includes(search.toLowerCase());
    const matchType = selectedType === "All" || item.type === selectedType.toLowerCase().replace(/s$/, "");
    const matchCommunity = selectedCommunity === "All" || item.community === selectedCommunity;
    return matchSearch && matchType && matchCommunity;
  });

  return (
    <div className="min-h-screen pt-16 pb-24 bg-[var(--background)]">
      {/* Hero */}
      <div className="relative py-14 px-4 overflow-hidden text-center">
        <div className="absolute inset-0 gradient-sikkim opacity-75" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-bold text-white mb-3">Cultural Archive</h1>
            <p className="text-white/70 text-lg">
              A living library of audio, stories, scripts, and images preserved by the community.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Search & filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search archive..."
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--brand-primary)] transition-colors"
            />
          </div>
          <select
            value={selectedCommunity}
            onChange={(e) => setSelectedCommunity(e.target.value)}
            className="h-11 px-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-primary)] transition-colors"
          >
            <option value="All">All Communities</option>
            {COMMUNITIES.map((c) => (
              <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>
            ))}
          </select>
        </div>

        {/* Type filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedType === t
                  ? "bg-[var(--brand-primary)] text-white"
                  : "bg-[var(--surface)] border border-[var(--border)] text-[var(--text-secondary)]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item, i) => {
            const community = COMMUNITIES.find((c) => c.id === item.community);
            const Icon = TYPE_ICONS[item.type] || BookOpen;
            const colorClass = TYPE_COLORS[item.type] || "text-gray-500 bg-gray-500/10";
            const [textColor, bgColor] = colorClass.split(" ");
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] overflow-hidden hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group">
                  {/* Banner */}
                  <div
                    className="h-24 relative flex items-center justify-center"
                    style={{ background: community?.colors.bg || "#0d0b09" }}
                  >
                    <div
                      className="absolute inset-0 opacity-50"
                      style={{ background: community?.gradient }}
                    />
                    <div className={`relative w-12 h-12 rounded-2xl ${bgColor} flex items-center justify-center`}>
                      <Icon size={22} className={textColor} />
                    </div>
                    {item.featured && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-[var(--brand-accent)]/90 text-[#1a1410] border-transparent text-[10px]">
                          Featured
                        </Badge>
                      </div>
                    )}
                    {item.type === "audio" && (
                      <button className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <Play size={16} className="text-white ml-0.5" />
                        </div>
                      </button>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-1 leading-tight">{item.title}</h3>
                    <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                      <span>{community?.emoji} {community?.name}</span>
                      <span>
                        {"duration" in item ? (item as any).duration :
                         "words" in item ? `${(item as any).words} words` :
                         "pages" in item ? `${(item as any).pages} pages` :
                         `${(item as any).images} photos`}
                      </span>
                    </div>
                    <div className="mt-2 text-[10px] text-[var(--text-muted)]">by {item.contributor}</div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-[var(--text-muted)]">
            <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
            <p>No items match your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
