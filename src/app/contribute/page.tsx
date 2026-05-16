"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  BookOpen,
  Image,
  PenTool,
  AlertCircle,
  Upload,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { COMMUNITIES } from "@/lib/communities";
import { submitContribution } from "@/lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────

type ContributionType = "audio" | "story" | "image" | "script";

interface ContribMeta {
  id: ContributionType;
  icon: React.ElementType;
  title: string;
  desc: string;
  xp: number;
  color: string;
  colorBg: string;
  accept: string;
  acceptLabel: string;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const TYPES: ContribMeta[] = [
  {
    id: "audio",
    icon: Mic,
    title: "Audio Recording",
    desc: "Record spoken words, songs, or stories in your native tongue",
    xp: 50,
    color: "text-emerald-400",
    colorBg: "bg-emerald-500/15 border-emerald-500/30",
    accept: "audio/*",
    acceptLabel: "MP3, WAV, OGG, M4A",
  },
  {
    id: "story",
    icon: BookOpen,
    title: "Written Story",
    desc: "Share a folktale, legend, or cultural narrative in your language",
    xp: 80,
    color: "text-blue-400",
    colorBg: "bg-blue-500/15 border-blue-500/30",
    accept: ".txt,.doc,.docx,.pdf",
    acceptLabel: "TXT, DOC, DOCX, PDF",
  },
  {
    id: "image",
    icon: Image,
    title: "Cultural Image",
    desc: "Photograph of traditional art, script, clothing, or ceremonies",
    xp: 30,
    color: "text-violet-400",
    colorBg: "bg-violet-500/15 border-violet-500/30",
    accept: "image/*",
    acceptLabel: "JPG, PNG, HEIC, WebP",
  },
  {
    id: "script",
    icon: PenTool,
    title: "Script Sample",
    desc: "Handwritten or typed sample of indigenous script characters",
    xp: 60,
    color: "text-amber-400",
    colorBg: "bg-amber-500/15 border-amber-500/30",
    accept: "image/*,.pdf",
    acceptLabel: "JPG, PNG, PDF",
  },
];

const GUIDELINES = [
  { icon: "🎯", text: "Be authentic — share genuine cultural content" },
  { icon: "🎙️", text: "Good audio quality — record in a quiet environment" },
  { icon: "🌐", text: "Include translations or transliterations where possible" },
  { icon: "✍️", text: "Original content only — no copyrighted material" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function ContributePage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedType, setSelectedType] = useState<ContribMeta | null>(null);
  const [community, setCommunity] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [earnedXP, setEarnedXP] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  }, []);

  const handleSubmit = async () => {
    if (!selectedType || !community || !title) return;
    setLoading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("type", selectedType.id);
      fd.append("community_slug", community);
      fd.append("title", title);
      fd.append("description", description);
      if (file) fd.append("file", file);
      await submitContribution(fd);
      setEarnedXP(selectedType.xp);
      setStep(3);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep(1);
    setSelectedType(null);
    setCommunity("");
    setTitle("");
    setDescription("");
    setFile(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)]">
      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
            Contribute to the Archive
          </h1>
          <p className="text-[var(--text-secondary)]">
            Help preserve the languages and cultures of Sikkim for future generations.
          </p>
        </div>

        {/* Step indicator */}
        {step !== 3 && (
          <div className="flex items-center gap-3 mb-8">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors",
                    step >= s
                      ? "bg-[var(--brand-primary)] text-white"
                      : "bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)]"
                  )}
                >
                  {s}
                </div>
                <span className={cn("text-sm font-medium", step >= s ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]")}>
                  {s === 1 ? "Select Type" : "Fill Details"}
                </span>
                {s < 2 && <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" />}
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* ── Step 1: Select type ── */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.25 }}
                >
                  <h2 className="text-xl font-semibold mb-4 text-[var(--text-primary)]">
                    What would you like to contribute?
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {TYPES.map((t) => {
                      const Icon = t.icon;
                      const isSelected = selectedType?.id === t.id;
                      return (
                        <motion.button
                          key={t.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedType(t)}
                          className={cn(
                            "text-left rounded-2xl border p-5 transition-all",
                            isSelected
                              ? `${t.colorBg} border-current`
                              : "bg-[var(--surface)] border-[var(--border)] hover:border-[var(--brand-primary)]/40"
                          )}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className={cn("p-2.5 rounded-xl", t.colorBg)}>
                              <Icon className={cn("w-5 h-5", t.color)} />
                            </div>
                            <Badge variant="warning" size="sm">+{t.xp} XP</Badge>
                          </div>
                          <h3 className="font-semibold text-[var(--text-primary)] mb-1">{t.title}</h3>
                          <p className="text-sm text-[var(--text-secondary)]">{t.desc}</p>
                        </motion.button>
                      );
                    })}
                  </div>
                  <div className="mt-6 flex justify-end">
                    <Button
                      onClick={() => setStep(2)}
                      disabled={!selectedType}
                      className="gap-2"
                    >
                      Continue <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* ── Step 2: Fill form ── */}
              {step === 2 && selectedType && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className={cn("p-2 rounded-xl", selectedType.colorBg)}>
                      <selectedType.icon className={cn("w-5 h-5", selectedType.color)} />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                        {selectedType.title}
                      </h2>
                      <p className="text-sm text-[var(--text-secondary)]">
                        Accepted formats: {selectedType.acceptLabel}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    {/* Community select */}
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                        Community <span className="text-red-400">*</span>
                      </label>
                      <select
                        value={community}
                        onChange={(e) => setCommunity(e.target.value)}
                        className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/50"
                      >
                        <option value="">Select a community…</option>
                        {COMMUNITIES.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.emoji} {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                        Title <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Give your contribution a descriptive title"
                        className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/50 placeholder:text-[var(--text-muted)]"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                        Description
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        placeholder="Briefly describe the content, its cultural context, or any notes for reviewers…"
                        className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/50 placeholder:text-[var(--text-muted)] resize-none"
                      />
                    </div>

                    {/* File drop zone */}
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                        Upload File
                      </label>
                      <div
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={cn(
                          "relative rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-all",
                          isDragging
                            ? "border-[var(--brand-primary)] bg-[var(--brand-soft)]"
                            : "border-[var(--border)] hover:border-[var(--brand-primary)]/50 hover:bg-[var(--surface-raised)]"
                        )}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept={selectedType.accept}
                          className="hidden"
                          onChange={(e) => { const f = e.target.files?.[0]; if (f) setFile(f); }}
                        />
                        {file ? (
                          <div className="flex flex-col items-center gap-2">
                            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                            <p className="font-medium text-[var(--text-primary)]">{file.name}</p>
                            <p className="text-xs text-[var(--text-muted)]">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                            <button
                              onClick={(e) => { e.stopPropagation(); setFile(null); }}
                              className="text-xs text-red-400 hover:underline mt-1"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-3">
                            <Upload className="w-8 h-8 text-[var(--text-muted)]" />
                            <div>
                              <p className="font-medium text-[var(--text-primary)]">
                                Drag & drop or click to upload
                              </p>
                              <p className="text-xs text-[var(--text-muted)] mt-1">
                                Accepted: {selectedType.acceptLabel} · Max 50 MB
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Error */}
                    {error && (
                      <div className="flex items-start gap-3 rounded-xl bg-red-500/10 border border-red-500/25 p-4">
                        <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                        <p className="text-sm text-red-400">{error}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2">
                      <Button variant="ghost" onClick={() => setStep(1)} className="gap-2">
                        <ChevronLeft className="w-4 h-4" /> Back
                      </Button>
                      <Button
                        onClick={handleSubmit}
                        loading={loading}
                        disabled={!community || !title}
                      >
                        Submit Contribution
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── Step 3: Success ── */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35 }}
                  className="flex flex-col items-center text-center py-12"
                >
                  <div className="text-6xl mb-4">🙏</div>
                  <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
                    Thank You!
                  </h2>
                  <p className="text-[var(--text-secondary)] mb-6 max-w-sm">
                    Your contribution has been submitted for review. It will be added to the archive once approved.
                  </p>
                  <div className="flex items-center gap-2 bg-amber-500/15 border border-amber-500/30 rounded-2xl px-6 py-4 mb-8">
                    <span className="text-2xl">⭐</span>
                    <div className="text-left">
                      <p className="text-xs text-[var(--text-muted)]">XP Earned</p>
                      <p className="text-2xl font-bold text-amber-400">+{earnedXP} XP</p>
                    </div>
                  </div>
                  <Button onClick={reset} size="lg">
                    Contribute More
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          {step !== 3 && (
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-[var(--brand-primary)]" />
                    <h3 className="font-semibold text-[var(--text-primary)]">Contribution Guidelines</h3>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {GUIDELINES.map((g, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-[var(--text-secondary)]">
                        <span className="text-lg leading-none mt-0.5">{g.icon}</span>
                        <span>{g.text}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 pt-4 border-t border-[var(--border)]">
                    <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-3">
                      XP Rewards
                    </p>
                    <ul className="space-y-2">
                      {TYPES.map((t) => {
                        const Icon = t.icon;
                        return (
                          <li key={t.id} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <Icon className={cn("w-3.5 h-3.5", t.color)} />
                              <span className="text-[var(--text-secondary)]">{t.title}</span>
                            </div>
                            <Badge variant="warning" size="sm">+{t.xp}</Badge>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
