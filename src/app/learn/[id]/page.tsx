"use client";

import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Mic,
  PenTool,
  Bot,
  Lock,
  CheckCircle,
  Circle,
  ChevronRight,
  X,
  Heart,
  Star,
  Zap,
  Trophy,
} from "lucide-react";
import { getCommunity } from "@/lib/communities";
import { completeUnit, getCommunityCourses, type Course } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { cn, formatNumber } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type LessonType = "lesson" | "audio" | "writing" | "ai";
type LessonState = "done" | "active" | "locked";
type UnitState = "completed" | "in-progress" | "locked";

interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  xp: number;
  state: LessonState;
}

interface Unit {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  state: UnitState;
  lessons: Lesson[];
}

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
}

// ─── Static data ──────────────────────────────────────────────────────────────

const UNITS: Unit[] = [
  {
    id: "unit-1",
    number: 1,
    title: "Getting Started",
    subtitle: "Foundations of the language",
    state: "completed",
    lessons: [
      { id: "l1-1", title: "Introduction", type: "lesson", xp: 10, state: "done" },
      { id: "l1-2", title: "Basic Sounds", type: "audio", xp: 15, state: "done" },
      { id: "l1-3", title: "First Words", type: "lesson", xp: 10, state: "done" },
      { id: "l1-4", title: "Writing Practice", type: "writing", xp: 20, state: "done" },
    ],
  },
  {
    id: "unit-2",
    number: 2,
    title: "Greetings",
    subtitle: "Everyday expressions",
    state: "in-progress",
    lessons: [
      { id: "l2-1", title: "Hello & Goodbye", type: "lesson", xp: 10, state: "done" },
      { id: "l2-2", title: "Pronunciation", type: "audio", xp: 15, state: "active" },
      { id: "l2-3", title: "Formal Greetings", type: "lesson", xp: 10, state: "locked" },
      { id: "l2-4", title: "AI Conversation", type: "ai", xp: 25, state: "locked" },
    ],
  },
  {
    id: "unit-3",
    number: 3,
    title: "Family & People",
    subtitle: "Relationships & kinship terms",
    state: "locked",
    lessons: [
      { id: "l3-1", title: "Family Members", type: "lesson", xp: 10, state: "locked" },
      { id: "l3-2", title: "Kinship Audio", type: "audio", xp: 15, state: "locked" },
      { id: "l3-3", title: "Script Writing", type: "writing", xp: 20, state: "locked" },
    ],
  },
  {
    id: "unit-4",
    number: 4,
    title: "Nature & Environment",
    subtitle: "Flora, fauna & landscape",
    state: "locked",
    lessons: [
      { id: "l4-1", title: "Plants & Trees", type: "lesson", xp: 10, state: "locked" },
      { id: "l4-2", title: "Animals", type: "lesson", xp: 10, state: "locked" },
      { id: "l4-3", title: "Weather Sounds", type: "audio", xp: 15, state: "locked" },
      { id: "l4-4", title: "Nature AI Chat", type: "ai", xp: 25, state: "locked" },
    ],
  },
];

// ─── Lesson type icons ────────────────────────────────────────────────────────

function LessonIcon({ type, className, style }: { type: LessonType; className?: string; style?: React.CSSProperties }) {
  switch (type) {
    case "lesson":
      return <BookOpen className={className} style={style} />;
    case "audio":
      return <Mic className={className} style={style} />;
    case "writing":
      return <PenTool className={className} style={style} />;
    case "ai":
      return <Bot className={className} style={style} />;
  }
}

// ─── Quiz questions ───────────────────────────────────────────────────────────

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    question: "Which symbol represents the greeting 'Tashi Delek'?",
    options: ["🙏 Prayer gesture", "🏔️ Mountain peak", "🌿 Green leaf", "🥁 Drum beat"],
    correct: 0,
  },
  {
    question: "What does the term 'Chhu' mean in Bhutia?",
    options: ["Fire", "Water", "Earth", "Wind"],
    correct: 1,
  },
  {
    question: "Which script is traditionally used by the Lepcha community?",
    options: ["Tibetan Uchen", "Sirijonga", "Róng Script", "Devanagari"],
    correct: 2,
  },
];

// ─── Lesson Modal ─────────────────────────────────────────────────────────────

interface LessonModalProps {
  lesson: Lesson | null;
  communityName: string;
  communityColors: { primary: string; bg: string; gradient: string; text: string; accent: string };
  onClose: () => void;
  onComplete: (xp: number) => void;
}

function LessonModal({
  lesson,
  communityName,
  communityColors,
  onClose,
  onComplete,
}: LessonModalProps) {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [hearts, setHearts] = useState(3);
  const [xpEarned, setXpEarned] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answered, setAnswered] = useState(false);

  if (!lesson) return null;

  const q = QUIZ_QUESTIONS[step];
  const isCorrect = selected === q?.correct;
  const lessonXp = lesson?.xp ?? 10;

  function handleSelect(idx: number) {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === q?.correct) {
      setXpEarned((xp) => xp + Math.round(lessonXp / 3));
    } else {
      setHearts((h) => Math.max(0, h - 1));
    }
  }

  function handleNext() {
    if (step < QUIZ_QUESTIONS.length - 1) {
      setStep((s) => s + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      setFinished(true);
      onComplete(xpEarned + Math.round(lessonXp / 3));
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-white/10 shadow-2xl"
          style={{ backgroundColor: communityColors.bg }}
          onClick={(e) => e.stopPropagation()}
        >
          {!finished ? (
            <>
              {/* Header */}
              <div
                className="flex items-center justify-between px-5 py-4"
                style={{ background: communityColors.gradient, opacity: 0.9 }}
              >
                <div className="flex items-center gap-1">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Heart
                      key={i}
                      className={cn(
                        "h-5 w-5",
                        i < hearts ? "fill-red-400 text-red-400" : "text-white/30"
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-white">
                  {step + 1} / {QUIZ_QUESTIONS.length}
                </span>
                <button onClick={onClose}>
                  <X className="h-5 w-5 text-white/70 hover:text-white" />
                </button>
              </div>

              {/* Progress */}
              <div className="h-1 w-full" style={{ backgroundColor: "rgba(255,255,255,0.1)" }}>
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${((step + 1) / QUIZ_QUESTIONS.length) * 100}%`,
                    backgroundColor: communityColors.accent,
                  }}
                />
              </div>

              {/* Question */}
              <div className="p-6">
                <p
                  className="mb-6 text-center text-lg font-semibold leading-snug"
                  style={{ color: communityColors.text }}
                >
                  {q.question}
                </p>

                <div className="space-y-3">
                  {q.options.map((opt, i) => {
                    const isSelected = selected === i;
                    const isRight = answered && i === q.correct;
                    const isWrong = answered && isSelected && !isRight;

                    return (
                      <button
                        key={i}
                        onClick={() => handleSelect(i)}
                        disabled={answered}
                        className={cn(
                          "w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all",
                          !answered && "hover:border-white/30 hover:bg-white/10",
                          isRight && "border-emerald-400/60 bg-emerald-500/20 text-emerald-300",
                          isWrong && "border-red-400/60 bg-red-500/20 text-red-300",
                          !isSelected && !answered && "border-white/15",
                          isSelected && !answered && "border-white/40 bg-white/10"
                        )}
                        style={{
                          color: isRight || isWrong ? undefined : communityColors.text,
                        }}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {answered && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-5"
                  >
                    <div
                      className={cn(
                        "mb-4 rounded-xl p-3 text-center text-sm font-medium",
                        isCorrect
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-red-500/20 text-red-300"
                      )}
                    >
                      {isCorrect
                        ? `Correct! +${Math.round(lesson.xp / 3)} XP`
                        : "Not quite — keep going!"}
                    </div>
                    <Button className="w-full" onClick={handleNext}>
                      {step < QUIZ_QUESTIONS.length - 1 ? "Next Question" : "Finish Lesson"}
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </motion.div>
                )}
              </div>
            </>
          ) : (
            /* Completion screen */
            <div className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="mb-4 text-6xl"
              >
                🎉
              </motion.div>
              <h3
                className="mb-2 text-2xl font-bold"
                style={{ color: communityColors.text }}
              >
                Lesson Complete!
              </h3>
              <p className="mb-6 text-sm" style={{ color: communityColors.text + "aa" }}>
                You earned{" "}
                <span
                  className="font-bold"
                  style={{ color: communityColors.accent }}
                >
                  {xpEarned} XP
                </span>{" "}
                in {communityName}
              </p>
              <div className="mb-6 flex justify-center gap-4">
                <div className="text-center">
                  <Star className="mx-auto mb-1 h-6 w-6 text-amber-400" />
                  <p className="text-xs" style={{ color: communityColors.text + "80" }}>XP Earned</p>
                  <p className="font-bold" style={{ color: communityColors.text }}>{xpEarned}</p>
                </div>
                <div className="text-center">
                  <Heart className="mx-auto mb-1 h-6 w-6 text-red-400" />
                  <p className="text-xs" style={{ color: communityColors.text + "80" }}>Hearts Left</p>
                  <p className="font-bold" style={{ color: communityColors.text }}>{hearts}</p>
                </div>
              </div>
              <Button className="w-full" onClick={onClose}>
                Continue
                <Trophy className="h-4 w-4" />
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function LearnPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const community = getCommunity(id as Parameters<typeof getCommunity>[0]);

  const [courses, setCourses] = useState<Course[]>([]);
  const [completedUnitIds, setCompletedUnitIds] = useState<string[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [totalXp, setTotalXp] = useState(55);

  useEffect(() => {
    getCommunityCourses(id)
      .then((data) => {
        setCourses(data);
        setLoadingCourses(false);
      })
      .catch(() => setLoadingCourses(false));
  }, [id]);

  const dbUnits: Unit[] = courses.flatMap((course) =>
    (course.units ?? []).map((unit, idx) => ({
      id: unit.id,
      number: idx + 1,
      title: unit.title,
      subtitle: unit.subtitle ?? "",
      state: completedUnitIds.includes(unit.id)
        ? ("completed" as const)
        : !unit.is_locked && idx === 0
        ? ("in-progress" as const)
        : unit.is_locked
        ? ("locked" as const)
        : ("in-progress" as const),
      xp_reward: unit.xp_reward,
      lessons: [],
    }))
  );

  const displayUnits = dbUnits.length > 0 ? dbUnits : UNITS;

  const completedLessons = displayUnits.flatMap((u) => u.lessons).filter((l) => l.state === "done").length;
  const totalLessons = displayUnits.flatMap((u) => u.lessons).length;
  const overallProgress = totalLessons > 0
    ? Math.round((completedLessons / totalLessons) * 100)
    : Math.round((displayUnits.filter((u) => u.state === "completed").length / Math.max(displayUnits.length, 1)) * 100);

  async function handleLessonComplete(xp: number, unitId?: string) {
    setTotalXp((prev) => prev + xp);
    setActiveLesson(null);

    if (unitId) {
      try {
        await completeUnit(unitId);
        setCompletedUnitIds((prev) => [...prev, unitId]);
      } catch {
        // ignore
      }
    } else {
      // fallback for static units
      try {
        await completeUnit("unit-2");
      } catch {
        // ignore
      }
    }
  }

  if (!community) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <p className="text-[var(--text-primary)]">Community not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <div
        className="relative overflow-hidden"
        style={{ background: community.gradient }}
      >
        <div className="mx-auto max-w-3xl px-4 py-10">
          <div className="flex items-center gap-4">
            <span className="text-5xl">{community.emoji}</span>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold text-white">{community.name}</h1>
                <Badge variant="ghost" className="border-white/20 text-white/80">
                  {community.script}
                </Badge>
                <Badge variant="ghost" className="border-white/20 text-white/80">
                  <Zap className="h-3 w-3" />
                  {totalXp} XP
                </Badge>
              </div>
              <p className="mt-1 text-sm text-white/70">{community.nativeName}</p>
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-1 flex justify-between text-xs text-white/70">
              <span>Overall Progress</span>
              <span>{overallProgress}%</span>
            </div>
            <div
              className="h-2 w-full overflow-hidden rounded-full"
              style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${overallProgress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{ backgroundColor: "rgba(255,255,255,0.7)" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Units */}
      <div className="mx-auto max-w-3xl px-4 py-8 space-y-4">
        {displayUnits.map((unit, ui) => (
          <motion.div
            key={unit.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: ui * 0.08 }}
            className={cn(
              "overflow-hidden rounded-2xl border transition-all",
              unit.state === "locked"
                ? "border-[var(--border)] bg-[var(--surface)] opacity-60"
                : "border-[var(--border)] bg-[var(--surface)] shadow-sm"
            )}
          >
            {/* Unit header */}
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold",
                    unit.state === "completed"
                      ? "text-white"
                      : unit.state === "in-progress"
                      ? "text-white"
                      : "bg-[var(--surface-raised)] text-[var(--text-muted)]"
                  )}
                  style={
                    unit.state !== "locked"
                      ? { backgroundColor: community.colors.primary }
                      : {}
                  }
                >
                  {unit.state === "completed" ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    unit.number
                  )}
                </div>
                <div>
                  <p className="font-semibold text-[var(--text-primary)]">{unit.title}</p>
                  <p className="text-xs text-[var(--text-muted)]">{unit.subtitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {unit.state === "locked" ? (
                  <Lock className="h-4 w-4 text-[var(--text-muted)]" />
                ) : unit.state === "completed" ? (
                  <Badge variant="success">Done</Badge>
                ) : (
                  <Badge variant="info">In Progress</Badge>
                )}
              </div>
            </div>

            {/* Lessons list */}
            {unit.state !== "locked" && (
              <div className="divide-y divide-[var(--border)] border-t border-[var(--border)]">
                {unit.lessons.map((lesson) => (
                  <button
                    key={lesson.id}
                    disabled={lesson.state === "locked"}
                    onClick={() => {
                      if (lesson.state !== "locked") setActiveLesson(lesson);
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 px-5 py-3 text-left transition-all",
                      lesson.state === "locked"
                        ? "opacity-50 cursor-not-allowed"
                        : lesson.state === "active"
                        ? "cursor-pointer hover:bg-[var(--surface-raised)]"
                        : "cursor-pointer hover:bg-[var(--surface-raised)]"
                    )}
                  >
                    {/* State icon */}
                    <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center">
                      {lesson.state === "done" ? (
                        <CheckCircle
                          className="h-5 w-5"
                          style={{ color: community.colors.primary }}
                        />
                      ) : lesson.state === "active" ? (
                        <div
                          className="flex h-5 w-5 items-center justify-center rounded-full border-2"
                          style={{ borderColor: community.colors.primary }}
                        >
                          <div
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: community.colors.primary }}
                          />
                        </div>
                      ) : (
                        <Lock className="h-4 w-4 text-[var(--text-muted)]" />
                      )}
                    </div>

                    {/* Lesson type icon */}
                    <div
                      className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg"
                      style={{
                        backgroundColor:
                          lesson.state === "locked"
                            ? "var(--surface-raised)"
                            : community.colors.primary + "20",
                      }}
                    >
                      <LessonIcon
                        type={lesson.type}
                        className="h-3.5 w-3.5"
                        style={{
                          color:
                            lesson.state === "locked"
                              ? "var(--text-muted)"
                              : community.colors.primary,
                        }}
                      />
                    </div>

                    {/* Title */}
                    <span
                      className={cn(
                        "flex-1 text-sm font-medium",
                        lesson.state === "active"
                          ? "text-[var(--text-primary)]"
                          : "text-[var(--text-secondary)]"
                      )}
                    >
                      {lesson.title}
                    </span>

                    {/* XP */}
                    <span className="flex items-center gap-1 text-xs font-medium text-amber-500">
                      <Zap className="h-3 w-3" />
                      {lesson.xp}
                    </span>

                    {lesson.state === "active" && (
                      <ChevronRight className="h-4 w-4 text-[var(--text-muted)]" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Lesson Modal */}
      {activeLesson && (
        <LessonModal
          lesson={activeLesson}
          communityName={community.name}
          communityColors={{ ...community.colors, gradient: community.gradient }}
          onClose={() => setActiveLesson(null)}
          onComplete={handleLessonComplete}
        />
      )}
    </div>
  );
}
