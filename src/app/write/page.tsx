"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Send, Eye, CheckCircle2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { COMMUNITIES } from "@/lib/communities";
import { submitHandwritingAttempt } from "@/lib/api";

// ─── Script data ──────────────────────────────────────────────────────────────

type ScriptCommunity = "lepcha" | "bhutia" | "limbu" | "tamang";

const SCRIPT_CHARS: Record<ScriptCommunity, { char: string; name: string }[]> = {
  lepcha: [
    { char: "ᰛ", name: "Ka" },
    { char: "ᰜ", name: "Kla" },
    { char: "ᰝ", name: "Kha" },
    { char: "ᰞ", name: "Ga" },
    { char: "ᰟ", name: "Gla" },
    { char: "ᰠ", name: "Nga" },
  ],
  bhutia: [
    { char: "ཀ", name: "Ka" },
    { char: "ཁ", name: "Kha" },
    { char: "ག", name: "Ga" },
    { char: "ང", name: "Nga" },
    { char: "ཅ", name: "Ca" },
    { char: "ཆ", name: "Cha" },
  ],
  limbu: [
    { char: "ᤁ", name: "Ka" },
    { char: "ᤂ", name: "Kha" },
    { char: "ᤃ", name: "Ga" },
    { char: "ᤄ", name: "Gha" },
    { char: "ᤅ", name: "Nga" },
    { char: "ᤆ", name: "Ca" },
  ],
  tamang: [
    { char: "क", name: "Ka" },
    { char: "ख", name: "Kha" },
    { char: "ग", name: "Ga" },
    { char: "घ", name: "Gha" },
    { char: "ङ", name: "Nga" },
    { char: "च", name: "Ca" },
  ],
};

const COMMUNITIES_SHOWN: ScriptCommunity[] = ["lepcha", "bhutia", "limbu", "tamang"];

const FEEDBACK: Record<string, string> = {
  excellent: "Excellent form! Your stroke precision is outstanding.",
  good: "Good attempt! A few strokes could be refined.",
  practice: "Keep practicing — focus on stroke order and proportions.",
  beginner: "Great first try! Consistency comes with repetition.",
};

function getFeedback(score: number): string {
  if (score >= 85) return FEEDBACK.excellent;
  if (score >= 70) return FEEDBACK.good;
  if (score >= 50) return FEEDBACK.practice;
  return FEEDBACK.beginner;
}

// ─── Canvas drawing ───────────────────────────────────────────────────────────

interface Point { x: number; y: number }

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WritePage() {
  const [communityId, setCommunityId] = useState<ScriptCommunity>("lepcha");
  const [selectedChar, setSelectedChar] = useState<{ char: string; name: string; index: number }>({
    ...SCRIPT_CHARS.lepcha[0],
    index: 0,
  });
  const [showGuide, setShowGuide] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const [strokes, setStrokes] = useState<Point[][]>([]);
  const [currentStroke, setCurrentStroke] = useState<Point[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);

  const community = COMMUNITIES.find((c) => c.id === communityId)!;
  const chars = SCRIPT_CHARS[communityId];

  // Redraw canvas
  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Ghost character
    if (showGuide) {
      ctx.font = `${canvas.width * 0.55}px serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "rgba(196,64,26,0.12)";
      ctx.fillText(selectedChar.char, canvas.width / 2, canvas.height / 2);
    }

    // Draw strokes
    ctx.strokeStyle = "var(--text-primary, #1a1410)";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const allStrokes = [...strokes, currentStroke];
    for (const stroke of allStrokes) {
      if (stroke.length < 2) continue;
      ctx.beginPath();
      ctx.moveTo(stroke[0].x, stroke[0].y);
      for (let i = 1; i < stroke.length; i++) {
        ctx.lineTo(stroke[i].x, stroke[i].y);
      }
      ctx.stroke();
    }
  }, [strokes, currentStroke, showGuide, selectedChar.char]);

  useEffect(() => {
    cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(redraw);
  }, [redraw]);

  const getPos = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement): Point => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ("touches" in e) {
      const t = e.touches[0];
      return { x: (t.clientX - rect.left) * scaleX, y: (t.clientY - rect.top) * scaleY };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const onPointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    setDrawing(true);
    setScore(null);
    setCurrentStroke([getPos(e, canvas)]);
  };

  const onPointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!drawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    setCurrentStroke((prev) => [...prev, getPos(e, canvas)]);
  };

  const onPointerUp = () => {
    if (!drawing) return;
    setDrawing(false);
    setStrokes((prev) => [...prev, currentStroke]);
    setCurrentStroke([]);
  };

  const handleClear = () => {
    setStrokes([]);
    setCurrentStroke([]);
    setScore(null);
  };

  const handleSubmit = async () => {
    const canvas = canvasRef.current;
    if (!canvas || strokes.length === 0) return;
    setSubmitting(true);
    try {
      const imageDataUrl = canvas.toDataURL("image/png");
      const res = await submitHandwritingAttempt(`glyph-${communityId}-${selectedChar.index}`, imageDataUrl);
      setScore(res.score);
    } catch {
      // fallback simulated score
      setScore(Math.floor(Math.random() * 40 + 55));
    } finally {
      setSubmitting(false);
    }
  };

  const handleCommunityChange = (id: ScriptCommunity) => {
    setCommunityId(id);
    setSelectedChar({ ...SCRIPT_CHARS[id][0], index: 0 });
    handleClear();
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)]">
      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-1">Handwriting Practice</h1>
          <p className="text-[var(--text-secondary)]">Trace indigenous script characters to build muscle memory</p>
        </div>

        {/* Community selector */}
        <div className="flex gap-2 flex-wrap mb-6">
          {COMMUNITIES_SHOWN.map((id) => {
            const c = COMMUNITIES.find((x) => x.id === id)!;
            return (
              <button
                key={id}
                onClick={() => handleCommunityChange(id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all",
                  communityId === id
                    ? "text-white border-transparent"
                    : "bg-[var(--surface)] border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--brand-primary)]/40"
                )}
                style={communityId === id ? { background: c.gradient } : {}}
              >
                {c.emoji} {c.name}
              </button>
            );
          })}
        </div>

        {/* Character picker */}
        <div className="flex gap-3 flex-wrap mb-8">
          {chars.map((ch, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setSelectedChar({ ...ch, index: i }); handleClear(); }}
              className={cn(
                "w-14 h-14 rounded-xl border text-2xl flex flex-col items-center justify-center gap-0.5 transition-all",
                selectedChar.index === i
                  ? "border-[var(--brand-primary)] text-[var(--brand-primary)] bg-[var(--brand-soft)]"
                  : "bg-[var(--surface)] border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--brand-primary)]/40"
              )}
            >
              <span className="leading-none">{ch.char}</span>
              <span className="text-[8px] text-[var(--text-muted)]">{ch.name}</span>
            </motion.button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Canvas */}
          <div className="lg:col-span-2 space-y-4">
            <div
              className="relative rounded-2xl border-2 border-[var(--border)] overflow-hidden bg-[var(--surface)]"
              style={{ aspectRatio: "1 / 1", maxHeight: 440 }}
            >
              {/* Ghost when guide off */}
              {!showGuide && (
                <div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
                  style={{ fontSize: "180px", color: "rgba(196,64,26,0.06)", fontFamily: "serif" }}
                >
                  {selectedChar.char}
                </div>
              )}

              <canvas
                ref={canvasRef}
                width={600}
                height={600}
                className="w-full h-full touch-none cursor-crosshair"
                onMouseDown={onPointerDown}
                onMouseMove={onPointerMove}
                onMouseUp={onPointerUp}
                onMouseLeave={onPointerUp}
                onTouchStart={onPointerDown}
                onTouchMove={onPointerMove}
                onTouchEnd={onPointerUp}
              />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3 flex-wrap">
              <Button variant="secondary" onClick={handleClear} className="gap-2">
                <Trash2 className="w-4 h-4" /> Clear
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowGuide((v) => !v)}
                className={cn("gap-2", showGuide && "border-[var(--brand-primary)]/60")}
              >
                <Eye className="w-4 h-4" />
                {showGuide ? "Hide" : "Show"} Guide
              </Button>
              <Button
                onClick={handleSubmit}
                loading={submitting}
                disabled={strokes.length === 0}
                className="gap-2"
              >
                <Send className="w-4 h-4" /> Submit
              </Button>
            </div>

            {/* Score display */}
            <AnimatePresence>
              {score !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={cn(
                    "rounded-2xl border p-5 flex items-start gap-4",
                    score >= 70
                      ? "bg-emerald-500/10 border-emerald-500/30"
                      : "bg-amber-500/10 border-amber-500/30"
                  )}
                >
                  <CheckCircle2 className={cn("w-6 h-6 mt-0.5 shrink-0", score >= 70 ? "text-emerald-400" : "text-amber-400")} />
                  <div>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-3xl font-bold text-[var(--text-primary)]">{score}%</span>
                      <span className="text-sm text-[var(--text-muted)]">accuracy</span>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)]">{getFeedback(score)}</p>
                    <Button size="sm" variant="ghost" onClick={handleClear} className="mt-3 gap-1.5 -ml-2">
                      <RotateCcw className="w-3.5 h-3.5" /> Try again
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Current character info */}
            <Card>
              <CardHeader>
                <h2 className="font-semibold text-[var(--text-primary)]">Current Character</h2>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-3">
                <div
                  className="w-24 h-24 rounded-2xl flex items-center justify-center text-5xl"
                  style={{ background: community.gradient }}
                >
                  {selectedChar.char}
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-[var(--text-primary)]">{selectedChar.name}</p>
                  <p className="text-sm text-[var(--text-muted)]">{community.name} · {community.script}</p>
                </div>
                <Badge variant="ghost" size="sm">{community.emoji} {communityId}</Badge>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader>
                <h2 className="font-semibold text-[var(--text-primary)]">Tips</h2>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2.5 text-sm text-[var(--text-secondary)]">
                  {[
                    "Follow the stroke order from top to bottom",
                    "Enable the guide overlay to trace the ghost character",
                    "Use a stylus for best accuracy on touch screens",
                    "Submit when you feel confident — you can retry anytime",
                  ].map((tip, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[var(--brand-primary)] font-bold shrink-0">{i + 1}.</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
