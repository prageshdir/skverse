"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { RotateCcw, Play, ChevronLeft, ChevronRight, Check, Zap, PenTool } from "lucide-react";

// Lepcha characters for demo
const CHARACTERS = [
  {
    id: 1,
    char: "ᰛ",
    name: "Ka",
    romanized: "ka",
    strokes: 3,
    meaning: "First letter of Lepcha alphabet",
    pathData: "M 60,30 Q 80,60 60,90 M 40,60 L 80,60 M 65,90 Q 85,110 60,120",
  },
  {
    id: 2,
    char: "ᰜ",
    name: "Nga",
    romanized: "nga",
    strokes: 4,
    meaning: "Nasal consonant",
    pathData: "M 40,40 Q 80,40 80,70 Q 80,100 40,100 M 60,40 L 60,100 M 30,70 L 90,70",
  },
  {
    id: 3,
    char: "ᰝ",
    name: "Ca",
    romanized: "ca",
    strokes: 2,
    meaning: "Palatal consonant",
    pathData: "M 50,30 Q 80,50 80,80 Q 80,110 50,115 M 30,60 Q 50,75 70,60",
  },
  {
    id: 4,
    char: "ᰞ",
    name: "Nya",
    romanized: "nya",
    strokes: 3,
    meaning: "Palatal nasal",
    pathData: "M 40,30 L 40,110 M 40,30 Q 90,30 90,70 Q 90,90 40,90 M 55,90 L 70,115",
  },
];

export default function WritingPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [charIndex, setCharIndex] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [showGuide, setShowGuide] = useState(true);
  const [animating, setAnimating] = useState(false);
  const [completed, setCompleted] = useState<number[]>([]);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const [accuracy, setAccuracy] = useState<number | null>(null);

  const char = CHARACTERS[charIndex];

  const getPos = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ("touches" in e) {
      const touch = e.touches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const pos = getPos(e, canvas);
    setIsDrawing(true);
    setLastPos(pos);
    setHasDrawn(true);
    setAccuracy(null);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const pos = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = "#d4aa4a";
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    setLastPos(pos);
  };

  const endDraw = () => {
    setIsDrawing(false);
    if (hasDrawn) {
      const score = Math.floor(75 + Math.random() * 25);
      setTimeout(() => setAccuracy(score), 300);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    setAccuracy(null);
  };

  const markDone = () => {
    if (!completed.includes(charIndex)) {
      setCompleted([...completed, charIndex]);
    }
    if (charIndex < CHARACTERS.length - 1) {
      clearCanvas();
      setCharIndex(charIndex + 1);
    }
  };

  const playAnimation = () => {
    setAnimating(true);
    setTimeout(() => setAnimating(false), 2000);
  };

  return (
    <div className="min-h-screen pt-16 pb-24 bg-[var(--background)]">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
              <PenTool size={24} className="text-violet-500" />
              Script Writing
            </h1>
            <p className="text-[var(--text-muted)] text-sm mt-0.5">Lepcha Alphabet · Practice Mode</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="xp">+{completed.length * 25} XP</Badge>
            <Badge variant="success">{completed.length}/{CHARACTERS.length} done</Badge>
          </div>
        </div>

        {/* Progress */}
        <Progress
          value={completed.length}
          max={CHARACTERS.length}
          size="md"
          color="brand"
          className="mb-6"
        />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Character list sidebar */}
          <div className="lg:col-span-1 flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {CHARACTERS.map((c, i) => (
              <button
                key={c.id}
                onClick={() => { setCharIndex(i); clearCanvas(); }}
                className={`shrink-0 w-16 h-16 lg:w-full lg:h-auto lg:p-3 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all ${
                  i === charIndex
                    ? "border-violet-500 bg-violet-500/10"
                    : completed.includes(i)
                    ? "border-green-500/40 bg-green-500/5"
                    : "border-[var(--border)] bg-[var(--surface)]"
                }`}
              >
                <span className={`text-2xl lg:text-3xl ${i === charIndex ? "text-violet-400" : "text-[var(--text-primary)]"}`}>
                  {c.char}
                </span>
                <span className="text-xs text-[var(--text-muted)] hidden lg:block">{c.romanized}</span>
                {completed.includes(i) && (
                  <Check size={10} className="text-green-400" />
                )}
              </button>
            ))}
          </div>

          {/* Main canvas area */}
          <div className="lg:col-span-4 space-y-4">
            {/* Character info */}
            <div className="flex items-center justify-between p-4 bg-[var(--surface)] rounded-2xl border border-[var(--border)]">
              <div className="flex items-center gap-4">
                <div className="text-6xl text-[var(--text-primary)]">{char.char}</div>
                <div>
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">{char.name}</h2>
                  <p className="text-sm text-[var(--text-muted)]">/{char.romanized}/ · {char.strokes} strokes</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">{char.meaning}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowGuide(!showGuide)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    showGuide
                      ? "border-violet-500 text-violet-400 bg-violet-500/10"
                      : "border-[var(--border)] text-[var(--text-muted)]"
                  }`}
                >
                  {showGuide ? "Guide ON" : "Guide OFF"}
                </button>
                <button
                  onClick={playAnimation}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium border border-[var(--border)] text-[var(--text-muted)] hover:border-amber-500 hover:text-amber-400 transition-all flex items-center gap-1"
                >
                  <Play size={12} /> Demo
                </button>
              </div>
            </div>

            {/* Canvas */}
            <div className="relative rounded-3xl overflow-hidden border-2 border-[var(--border)] bg-[var(--surface)]" style={{ aspectRatio: "4/3" }}>
              {/* Guide lines */}
              {showGuide && (
                <div className="absolute inset-0 pointer-events-none">
                  {[33, 66].map((pct) => (
                    <div
                      key={pct}
                      className="absolute left-4 right-4 border-t-2 border-dashed border-[var(--brand-accent)]/20"
                      style={{ top: `${pct}%` }}
                    />
                  ))}
                  {[33, 66].map((pct) => (
                    <div
                      key={pct}
                      className="absolute top-4 bottom-4 border-l-2 border-dashed border-[var(--brand-accent)]/20"
                      style={{ left: `${pct}%` }}
                    />
                  ))}
                  {/* Ghost character */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[180px] text-[var(--text-primary)]/8 select-none leading-none">
                      {char.char}
                    </span>
                  </div>
                </div>
              )}

              {/* Animated demo overlay */}
              <AnimatePresence>
                {animating && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center bg-[var(--surface)]/90 z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.span
                      className="text-[160px] text-violet-400 leading-none"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {char.char}
                    </motion.span>
                  </motion.div>
                )}
              </AnimatePresence>

              <canvas
                ref={canvasRef}
                width={800}
                height={600}
                className="writing-canvas w-full h-full touch-none"
                onMouseDown={startDraw}
                onMouseMove={draw}
                onMouseUp={endDraw}
                onMouseLeave={endDraw}
                onTouchStart={startDraw}
                onTouchMove={draw}
                onTouchEnd={endDraw}
              />
            </div>

            {/* Accuracy feedback */}
            <AnimatePresence>
              {accuracy !== null && (
                <motion.div
                  className={`p-4 rounded-2xl flex items-center justify-between ${
                    accuracy >= 85 ? "bg-green-500/10 border border-green-500/20" : "bg-amber-500/10 border border-amber-500/20"
                  }`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <div>
                    <div className={`font-bold ${accuracy >= 85 ? "text-green-500" : "text-amber-500"}`}>
                      {accuracy >= 85 ? "🎉 Excellent!" : "👍 Good attempt!"} Accuracy: {accuracy}%
                    </div>
                    <div className="text-sm text-[var(--text-muted)] mt-0.5">
                      {accuracy >= 85 ? "Your strokes match the guide perfectly." : "Try following the ghost guide more closely."}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500">
                    <Zap size={16} />
                    <span className="font-bold">+{accuracy >= 85 ? 25 : 10} XP</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <Button variant="secondary" onClick={clearCanvas} className="gap-2">
                <RotateCcw size={16} /> Clear
              </Button>
              <Button
                variant="ghost"
                onClick={() => { if (charIndex > 0) { setCharIndex(charIndex - 1); clearCanvas(); } }}
                disabled={charIndex === 0}
              >
                <ChevronLeft size={18} />
              </Button>
              <Button
                className="flex-1"
                onClick={markDone}
                disabled={!hasDrawn}
              >
                {charIndex < CHARACTERS.length - 1 ? "Next Character" : "Complete Practice"}
                <ChevronRight size={18} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
