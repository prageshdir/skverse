"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { getCommunity } from "@/lib/communities";
import { formatNumber } from "@/lib/utils";
import {
  CheckCircle2, X, Heart, Zap, ChevronRight, Lock,
  BookOpen, PenTool, Mic, Bot, Volume2, Star
} from "lucide-react";

const UNITS = [
  {
    id: 1,
    title: "Getting Started",
    subtitle: "Alphabet & Basic Sounds",
    locked: false,
    completed: true,
    lessons: [
      { id: 1, title: "The Alphabet", type: "lesson", xp: 20, done: true },
      { id: 2, title: "Vowel Sounds", type: "audio", xp: 15, done: true },
      { id: 3, title: "First Words", type: "lesson", xp: 20, done: true },
    ],
  },
  {
    id: 2,
    title: "Greetings",
    subtitle: "Meeting & Farewell",
    locked: false,
    completed: false,
    lessons: [
      { id: 4, title: "Hello & Goodbye", type: "lesson", xp: 20, done: true },
      { id: 5, title: "Formal Greetings", type: "lesson", xp: 20, done: false, active: true },
      { id: 6, title: "Pronunciation Practice", type: "audio", xp: 15, done: false },
      { id: 7, title: "Writing Greetings", type: "writing", xp: 25, done: false },
    ],
  },
  {
    id: 3,
    title: "Family & People",
    subtitle: "Relationships & Community",
    locked: true,
    completed: false,
    lessons: [
      { id: 8, title: "Family Members", type: "lesson", xp: 20, done: false },
      { id: 9, title: "Describing People", type: "lesson", xp: 20, done: false },
      { id: 10, title: "Community Words", type: "lesson", xp: 20, done: false },
    ],
  },
  {
    id: 4,
    title: "Nature & Environment",
    subtitle: "Mountains, Forests, Rivers",
    locked: true,
    completed: false,
    lessons: [
      { id: 11, title: "Landscape Words", type: "lesson", xp: 20, done: false },
      { id: 12, title: "Animals & Plants", type: "lesson", xp: 20, done: false },
      { id: 13, title: "Seasons & Weather", type: "lesson", xp: 20, done: false },
      { id: 14, title: "Audio Story: The Forest", type: "audio", xp: 30, done: false },
    ],
  },
];

const TYPE_ICONS: Record<string, React.ElementType> = {
  lesson: BookOpen,
  audio: Mic,
  writing: PenTool,
  ai: Bot,
};

const TYPE_COLORS: Record<string, string> = {
  lesson: "text-blue-400",
  audio: "text-emerald-400",
  writing: "text-violet-400",
  ai: "text-amber-400",
};

// ── Mini Lesson Modal ──────────────────────────────────────────
const QUIZ_QUESTIONS = [
  {
    q: "What is the correct greeting?",
    options: ["Tashi Delek", "Namaste Ji", "Khamsa Mani", "Dhanyabad"],
    correct: 0,
    hint: "Used in Bhutia culture to express good wishes",
  },
  {
    q: "Translate: 'Thank you'",
    options: ["Tuji Che", "La So", "Kho Du", "Drin Che"],
    correct: 3,
    hint: "'Drin Che' expresses deep gratitude",
  },
  {
    q: "Which word means 'Mountain'?",
    options: ["Gang", "Chu", "Ri", "Nang"],
    correct: 2,
    hint: "'Ri' refers to a mountain peak",
  },
];

function LessonModal({ onClose, communityColors }: { onClose: () => void; communityColors: any }) {
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [hearts, setHearts] = useState(3);
  const [xp, setXp] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = QUIZ_QUESTIONS[qIndex];
  const isCorrect = selected === q.correct;
  const isAnswered = selected !== null;

  const handleNext = () => {
    if (qIndex < QUIZ_QUESTIONS.length - 1) {
      setQIndex(qIndex + 1);
      setSelected(null);
    } else {
      setFinished(true);
    }
  };

  const handleSelect = (i: number) => {
    if (isAnswered) return;
    setSelected(i);
    if (i === q.correct) {
      setXp(xp + 10);
    } else {
      setHearts(Math.max(0, hearts - 1));
    }
  };

  if (finished) {
    return (
      <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
        <motion.div
          className="w-full max-w-md bg-[var(--surface)] rounded-3xl p-8 text-center"
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Lesson Complete!</h2>
          <p className="text-[var(--text-muted)] mb-6">You earned XP and learned new words.</p>
          <div className="flex justify-center gap-6 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-500">+{xp + 20}</div>
              <div className="text-xs text-[var(--text-muted)]">XP Earned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{"❤️".repeat(hearts)}</div>
              <div className="text-xs text-[var(--text-muted)]">Hearts Left</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-500">{QUIZ_QUESTIONS.length}</div>
              <div className="text-xs text-[var(--text-muted)]">Questions</div>
            </div>
          </div>
          <Button onClick={onClose} size="lg" className="w-full">Continue</Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-md bg-[var(--surface)] rounded-3xl overflow-hidden"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
          <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
            <X size={20} />
          </button>
          <Progress value={((qIndex + 1) / QUIZ_QUESTIONS.length) * 100} size="md" className="flex-1 mx-4" color="xp" />
          <div className="flex items-center gap-1">
            {[...Array(3)].map((_, i) => (
              <Heart key={i} size={18} className={i < hearts ? "text-red-400 fill-current" : "text-[var(--border)]"} />
            ))}
          </div>
        </div>

        {/* Question */}
        <div className="p-6">
          <div className="text-xs text-[var(--text-muted)] mb-2 uppercase tracking-widest">
            Question {qIndex + 1} of {QUIZ_QUESTIONS.length}
          </div>
          <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6">{q.q}</h3>

          <div className="space-y-3 mb-6">
            {q.options.map((opt, i) => {
              const isSelected = selected === i;
              const showResult = isAnswered;
              const correct = i === q.correct;
              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  className={`w-full p-4 rounded-2xl border-2 text-left text-sm font-medium transition-all duration-200 ${
                    showResult
                      ? correct
                        ? "border-green-500 bg-green-500/10 text-green-600 dark:text-green-400"
                        : isSelected
                        ? "border-red-500 bg-red-500/10 text-red-500"
                        : "border-[var(--border)] text-[var(--text-muted)]"
                      : isSelected
                      ? "border-[var(--brand-accent)] bg-[var(--brand-accent)]/10"
                      : "border-[var(--border)] hover:border-[var(--text-muted)] text-[var(--text-primary)]"
                  }`}
                >
                  <span className="mr-3 font-bold text-[var(--text-muted)]">{String.fromCharCode(65 + i)}.</span>
                  {opt}
                  {showResult && correct && <CheckCircle2 size={16} className="inline ml-2 text-green-500" />}
                  {showResult && isSelected && !correct && <X size={16} className="inline ml-2 text-red-500" />}
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <motion.div
              className={`p-3 rounded-xl mb-4 text-sm ${isCorrect ? "bg-green-500/10 text-green-600 dark:text-green-400" : "bg-red-500/10 text-red-500"}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {isCorrect ? "✓ Correct! " : "✗ Not quite. "}{q.hint}
            </motion.div>
          )}

          {isAnswered && (
            <Button onClick={handleNext} size="lg" className="w-full">
              {qIndex < QUIZ_QUESTIONS.length - 1 ? "Next Question" : "Finish Lesson"}
              <ChevronRight size={18} />
            </Button>
          )}
        </div>

        {/* XP indicator */}
        <div className="px-6 pb-4 flex items-center gap-2">
          <Zap size={14} className="text-amber-500" />
          <span className="text-xs text-[var(--text-muted)]">+{xp} XP earned so far</span>
        </div>
      </motion.div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────
export default function LearnPage() {
  const params = useParams();
  const community = getCommunity(params.id as string);
  const [lessonOpen, setLessonOpen] = useState(false);
  const [units, setUnits] = useState(UNITS);

  const handleLessonClose = async (xpEarned: number, unitId: number) => {
    setLessonOpen(false);
    if (xpEarned > 0) {
      try {
        const { completeUnit } = await import("@/lib/api");
        await completeUnit(String(unitId));
      } catch {}
      setUnits((prev) =>
        prev.map((u) =>
          u.id === unitId
            ? { ...u, lessons: u.lessons.map((l) => l.active ? { ...l, done: true, active: false } : l) }
            : u
        )
      );
    }
  };

  if (!community) return null;

  const totalDone = units.flatMap(u => u.lessons).filter(l => l.done).length;
  const totalLessons = units.flatMap(u => u.lessons).length;

  return (
    <div className="min-h-screen pb-24" style={{ background: community.colors.bg }}>
      {/* Header */}
      <div className="relative pt-16 pb-6 px-4">
        <div className="absolute inset-0 opacity-40" style={{ background: community.gradient }} />
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{community.emoji}</span>
            <div>
              <h1 className="text-xl font-bold text-white">{community.name}</h1>
              <p className="text-white/60 text-sm">{community.language}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 mb-3">
            <Badge className="bg-white/15 text-white border-white/20">
              {totalDone}/{totalLessons} complete
            </Badge>
            <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30">
              <Zap size={12} /> 340 XP
            </Badge>
          </div>
          <Progress
            value={totalDone}
            max={totalLessons}
            size="md"
            barClassName="bg-white/70"
            trackClassName="bg-white/15"
          />
        </div>
      </div>

      {/* Units */}
      <div className="max-w-2xl mx-auto px-4 space-y-6">
        {units.map((unit, ui) => (
          <motion.div
            key={unit.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: ui * 0.08 }}
          >
            {/* Unit header */}
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold"
                style={{
                  background: unit.locked ? "rgba(255,255,255,0.05)" : `${community.colors.accent}25`,
                  color: unit.locked ? "rgba(255,255,255,0.2)" : community.colors.accent,
                }}
              >
                {unit.completed ? "✓" : unit.id}
              </div>
              <div>
                <h3 className={`font-bold text-sm ${unit.locked ? "text-white/30" : "text-white"}`}>
                  Unit {unit.id}: {unit.title}
                </h3>
                <p className="text-white/40 text-xs">{unit.subtitle}</p>
              </div>
              {unit.locked && <Lock size={14} className="ml-auto text-white/25" />}
            </div>

            {/* Lessons */}
            <div
              className="rounded-2xl overflow-hidden border divide-y"
              style={{
                background: community.colors.surface,
                borderColor: `${community.colors.accent}20`,
                // @ts-ignore
                "--tw-divide-color": `${community.colors.accent}15`,
              }}
            >
              {unit.lessons.map((lesson) => {
                const Icon = TYPE_ICONS[lesson.type] || BookOpen;
                const color = TYPE_COLORS[lesson.type] || "text-blue-400";
                return (
                  <button
                    key={lesson.id}
                    disabled={unit.locked}
                    onClick={() => !unit.locked && !lesson.done && setLessonOpen(true)}
                    className={`w-full flex items-center gap-4 p-4 text-left transition-all ${
                      unit.locked
                        ? "opacity-40 cursor-not-allowed"
                        : lesson.done
                        ? "opacity-70"
                        : (lesson as any).active
                        ? "bg-white/5 cursor-pointer hover:bg-white/10"
                        : "cursor-pointer hover:bg-white/5"
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      lesson.done ? "bg-green-500/20" : "bg-white/5"
                    }`}>
                      {lesson.done
                        ? <CheckCircle2 size={18} className="text-green-400" />
                        : <Icon size={18} className={color} />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-medium ${lesson.done ? "text-white/50 line-through" : "text-white"}`}>
                        {lesson.title}
                      </div>
                      <div className="text-xs text-white/30 mt-0.5 capitalize">{lesson.type}</div>
                    </div>
                    {(lesson as any).active && (
                      <Badge className="bg-[var(--brand-accent)]/20 text-amber-300 border-amber-500/30 shrink-0">
                        Active
                      </Badge>
                    )}
                    <div className="flex items-center gap-1 shrink-0">
                      <Zap size={11} className="text-amber-400" />
                      <span className="text-xs text-white/40">{lesson.xp}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {lessonOpen && (
        <LessonModal onClose={() => setLessonOpen(false)} communityColors={community.colors} />
      )}
    </div>
  );
}
