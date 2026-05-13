"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { COMMUNITIES } from "@/lib/communities";
import {
  Upload, Mic, BookOpen, PenTool, Image, CheckCircle2,
  CloudUpload, X, Plus, ChevronDown, Info
} from "lucide-react";

const CONTRIBUTION_TYPES = [
  {
    id: "audio",
    icon: Mic,
    title: "Audio Recording",
    desc: "Record words, phrases, songs, or stories",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    xp: 50,
    accepts: ".mp3, .wav, .m4a",
  },
  {
    id: "story",
    icon: BookOpen,
    title: "Written Story",
    desc: "Folk tales, proverbs, poetry, or text",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    xp: 80,
    accepts: ".txt, .pdf, .docx",
  },
  {
    id: "image",
    icon: Image,
    title: "Cultural Image",
    desc: "Photos of scripts, art, or traditions",
    color: "text-violet-500",
    bg: "bg-violet-500/10",
    border: "border-violet-500/30",
    xp: 30,
    accepts: ".jpg, .png, .webp",
  },
  {
    id: "script",
    icon: PenTool,
    title: "Script Samples",
    desc: "Handwritten script examples or characters",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    xp: 60,
    accepts: ".jpg, .png, .pdf",
  },
];

const GUIDELINES = [
  "Ensure content is culturally respectful and authentic",
  "Only upload content you own or have rights to share",
  "Audio must be clear with minimal background noise",
  "Written content should be in the original language",
  "Label content accurately for easier archiving",
];

export default function ContributePage() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedCommunity, setSelectedCommunity] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const typeInfo = CONTRIBUTION_TYPES.find((t) => t.id === selectedType);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-16 pb-24 bg-[var(--background)] flex items-center justify-center">
        <motion.div
          className="text-center max-w-md px-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <div className="text-6xl mb-4">🙏</div>
          <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-3">Thank You!</h2>
          <p className="text-[var(--text-muted)] mb-2">
            Your contribution to the <strong className="text-[var(--text-primary)]">{selectedCommunity || "community"}</strong> archive has been submitted for review.
          </p>
          <p className="text-[var(--text-muted)] text-sm mb-8">
            Our cultural committee will review it within 48 hours. You'll earn <strong className="text-amber-500">{typeInfo?.xp} XP</strong> once approved.
          </p>
          <div className="flex flex-col gap-3 max-w-xs mx-auto">
            <Button onClick={() => { setSubmitted(false); setFile(null); setSelectedType(null); setTitle(""); setDescription(""); }}>
              Contribute More
            </Button>
            <Button variant="secondary">View My Contributions</Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 pb-24 bg-[var(--background)]">
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Contribute</h1>
          <p className="text-[var(--text-muted)] leading-relaxed">
            Help preserve indigenous culture. Every audio recording, story, and script you share becomes part of a living digital archive for future generations.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Type */}
          <div>
            <h2 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-widest mb-3">
              1. What are you contributing?
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {CONTRIBUTION_TYPES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedType(t.id)}
                  className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all duration-200 text-center ${
                    selectedType === t.id
                      ? `${t.border} ${t.bg}`
                      : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--text-muted)]"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl ${t.bg} flex items-center justify-center mb-2`}>
                    <t.icon size={20} className={t.color} />
                  </div>
                  <div className="font-semibold text-xs text-[var(--text-primary)]">{t.title}</div>
                  <div className="text-[10px] text-[var(--text-muted)] mt-1">+{t.xp} XP</div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Community */}
          <div>
            <h2 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-widest mb-3">
              2. Which community?
            </h2>
            <div className="relative">
              <select
                value={selectedCommunity}
                onChange={(e) => setSelectedCommunity(e.target.value)}
                className="w-full h-12 pl-4 pr-10 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] text-sm appearance-none focus:outline-none focus:border-[var(--brand-primary)] transition-colors"
              >
                <option value="">Select a community...</option>
                {COMMUNITIES.map((c) => (
                  <option key={c.id} value={c.name}>{c.emoji} {c.name} — {c.language}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
            </div>
          </div>

          {/* Step 3: Details */}
          <div>
            <h2 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-widest mb-3">
              3. Add details
            </h2>
            <div className="space-y-3">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title (e.g., 'Mountain Blessing Song')"
                className="w-full h-12 px-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--brand-primary)] transition-colors"
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the content — context, dialect, occasion, age of the material..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--brand-primary)] transition-colors resize-none"
              />
            </div>
          </div>

          {/* Step 4: Upload */}
          <div>
            <h2 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-widest mb-3">
              4. Upload file
            </h2>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 ${
                dragging
                  ? "border-[var(--brand-primary)] bg-[var(--brand-primary)]/5"
                  : file
                  ? "border-green-500/50 bg-green-500/5"
                  : "border-[var(--border)] hover:border-[var(--text-muted)]"
              }`}
            >
              {file ? (
                <div className="flex items-center gap-4 p-5">
                  <div className="w-12 h-12 rounded-xl bg-green-500/15 flex items-center justify-center">
                    <CheckCircle2 size={24} className="text-green-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-[var(--text-primary)] truncate">{file.name}</div>
                    <div className="text-xs text-[var(--text-muted)]">{(file.size / 1024).toFixed(1)} KB</div>
                  </div>
                  <button type="button" onClick={() => setFile(null)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center py-12 cursor-pointer">
                  <CloudUpload size={32} className="text-[var(--text-muted)] mb-3" />
                  <div className="font-semibold text-[var(--text-primary)] mb-1">Drop your file here</div>
                  <div className="text-sm text-[var(--text-muted)] mb-3">or click to browse</div>
                  {typeInfo && (
                    <Badge variant="default" size="sm">Accepts: {typeInfo.accepts}</Badge>
                  )}
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    accept={typeInfo?.accepts.replace(/\s/g, "")}
                  />
                </label>
              )}
            </div>
          </div>

          {/* Guidelines */}
          <div className="p-4 bg-[var(--surface-raised)] rounded-2xl border border-[var(--border)]">
            <div className="flex items-center gap-2 mb-3">
              <Info size={14} className="text-[var(--brand-primary)]" />
              <span className="text-sm font-semibold text-[var(--text-primary)]">Contribution Guidelines</span>
            </div>
            <ul className="space-y-1.5">
              {GUIDELINES.map((g, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-[var(--text-muted)]">
                  <span className="text-[var(--brand-accent)] mt-0.5">•</span>
                  {g}
                </li>
              ))}
            </ul>
          </div>

          <Button
            type="submit"
            size="xl"
            className="w-full"
            loading={loading}
            disabled={!selectedType || !selectedCommunity || !title || !file}
          >
            {!loading && <Upload size={20} />}
            Submit Contribution
          </Button>
        </form>
      </div>
    </div>
  );
}
