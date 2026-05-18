"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Flame, Zap, Trophy, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { COMMUNITIES, type CommunityId } from "@/lib/communities";
import { updateMyCommunities } from "@/lib/api";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

type GoalId = "casual" | "regular" | "dedicated" | "intensive";

interface Goal {
  id: GoalId;
  label: string;
  minutes: number;
  xp: number;
  icon: React.ReactNode;
  description: string;
}

const GOALS: Goal[] = [
  {
    id: "casual",
    label: "Casual",
    minutes: 5,
    xp: 20,
    icon: <Leaf className="h-6 w-6" />,
    description: "Light daily practice, perfect for busy schedules.",
  },
  {
    id: "regular",
    label: "Regular",
    minutes: 10,
    xp: 40,
    icon: <Flame className="h-6 w-6" />,
    description: "Steady progress — the most popular choice.",
  },
  {
    id: "dedicated",
    label: "Dedicated",
    minutes: 15,
    xp: 65,
    icon: <Zap className="h-6 w-6" />,
    description: "Accelerate your learning with focused sessions.",
  },
  {
    id: "intensive",
    label: "Intensive",
    minutes: 20,
    xp: 90,
    icon: <Trophy className="h-6 w-6" />,
    description: "Deep immersion for the most committed learners.",
  },
];

// ── Slide animation variants ──────────────────────────────────────────────────

const variants = {
  enter: (dir: 1 | -1) => ({
    x: dir * 60,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (dir: 1 | -1) => ({
    x: dir * -60,
    opacity: 0,
  }),
};

// ── Step 1: Welcome ───────────────────────────────────────────────────────────

function StepWelcome({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col items-center text-center gap-6 px-4">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
        className="text-8xl"
        aria-hidden="true"
      >
        🙏
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="space-y-3 max-w-sm"
      >
        <h2 className="text-3xl font-bold text-[var(--text-primary)]">
          Welcome to Sikkimverse
        </h2>
        <p className="text-[var(--text-secondary)] text-base leading-relaxed">
          Sikkimverse is a living platform dedicated to preserving the languages,
          stories, and culture of Sikkim's indigenous communities. Together we
          learn, record, and celebrate what makes each community unique.
        </p>
        <p className="text-[var(--text-muted)] text-sm">
          Let's personalise your experience in just a few steps.
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Button size="lg" onClick={onNext} className="px-10">
          Get Started
        </Button>
      </motion.div>
    </div>
  );
}

// ── Step 2: Choose communities ────────────────────────────────────────────────

function StepCommunities({
  selected,
  onToggle,
  onNext,
  onBack,
}: {
  selected: CommunityId[];
  onToggle: (id: CommunityId) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto px-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">
          Select communities to follow
        </h2>
        <p className="text-[var(--text-secondary)] text-sm mt-1">
          Choose the languages you're curious about. You can always change this
          later.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {COMMUNITIES.map((c) => {
          const isSelected = selected.includes(c.id);
          return (
            <button
              key={c.id}
              onClick={() => onToggle(c.id)}
              className={cn(
                "relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]",
                isSelected
                  ? "border-[var(--brand-primary)] bg-[var(--brand-primary)]/8 shadow-md"
                  : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--brand-secondary)] hover:bg-[var(--surface-raised)]"
              )}
              aria-pressed={isSelected}
            >
              {isSelected && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 h-5 w-5 rounded-full bg-[var(--brand-primary)] flex items-center justify-center"
                >
                  <Check className="h-3 w-3 text-white" />
                </motion.span>
              )}
              <span className="text-3xl" aria-hidden="true">
                {c.emoji}
              </span>
              <span
                className={cn(
                  "text-xs font-semibold text-center leading-tight",
                  isSelected
                    ? "text-[var(--brand-primary)]"
                    : "text-[var(--text-secondary)]"
                )}
              >
                {c.name}
              </span>
              <span className="text-[10px] text-[var(--text-muted)] text-center leading-tight">
                {c.region}
              </span>
            </button>
          );
        })}
      </div>

      {selected.length > 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-sm text-[var(--text-muted)]"
        >
          {selected.length} communit{selected.length === 1 ? "y" : "ies"} selected
        </motion.p>
      )}

      <div className="flex gap-3 justify-center">
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext} disabled={selected.length === 0} className="px-8">
          Continue
        </Button>
      </div>
    </div>
  );
}

// ── Step 3: Choose goal ───────────────────────────────────────────────────────

function StepGoal({
  selected,
  onSelect,
  onNext,
  onBack,
}: {
  selected: GoalId | null;
  onSelect: (id: GoalId) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const goalColors: Record<GoalId, string> = {
    casual: "text-emerald-500",
    regular: "text-orange-500",
    dedicated: "text-amber-500",
    intensive: "text-violet-500",
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-xl mx-auto px-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">
          Set your daily goal
        </h2>
        <p className="text-[var(--text-secondary)] text-sm mt-1">
          How much time can you commit each day?
        </p>
      </div>

      <div className="space-y-3">
        {GOALS.map((g) => {
          const isSelected = selected === g.id;
          return (
            <button
              key={g.id}
              onClick={() => onSelect(g.id)}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-200",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]",
                isSelected
                  ? "border-[var(--brand-primary)] bg-[var(--brand-primary)]/8 shadow-md"
                  : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--brand-secondary)] hover:bg-[var(--surface-raised)]"
              )}
              aria-pressed={isSelected}
            >
              <span
                className={cn(
                  "flex-shrink-0 h-12 w-12 rounded-xl flex items-center justify-center",
                  isSelected
                    ? "bg-[var(--brand-primary)]/15"
                    : "bg-[var(--surface-raised)]",
                  goalColors[g.id]
                )}
              >
                {g.icon}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={cn(
                      "font-semibold",
                      isSelected
                        ? "text-[var(--brand-primary)]"
                        : "text-[var(--text-primary)]"
                    )}
                  >
                    {g.label}
                  </span>
                  <Badge variant="ghost" size="sm">
                    {g.minutes} min / day
                  </Badge>
                  <Badge variant="warning" size="sm">
                    +{g.xp} XP
                  </Badge>
                </div>
                <p className="text-sm text-[var(--text-muted)] mt-0.5">
                  {g.description}
                </p>
              </div>
              <div
                className={cn(
                  "flex-shrink-0 h-5 w-5 rounded-full border-2 transition-all",
                  isSelected
                    ? "border-[var(--brand-primary)] bg-[var(--brand-primary)]"
                    : "border-[var(--border)]"
                )}
              >
                {isSelected && (
                  <Check className="h-full w-full p-0.5 text-white" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex gap-3 justify-center">
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext} disabled={!selected} className="px-8">
          Continue
        </Button>
      </div>
    </div>
  );
}

// ── Step 4: Ready ─────────────────────────────────────────────────────────────

function StepReady({
  communities,
  goal,
  onStart,
}: {
  communities: CommunityId[];
  goal: GoalId | null;
  onStart: () => void | Promise<void>;
}) {
  const selectedCommunities = COMMUNITIES.filter((c) =>
    communities.includes(c.id)
  );
  const selectedGoal = GOALS.find((g) => g.id === goal);

  return (
    <div className="flex flex-col items-center text-center gap-6 px-4 max-w-md mx-auto">
      {/* Confetti-style celebration */}
      <div className="relative">
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 180, damping: 12 }}
          className="text-7xl"
          aria-hidden="true"
        >
          🎉
        </motion.div>
        {["✨", "🌟", "⭐"].map((star, i) => (
          <motion.span
            key={i}
            initial={{ scale: 0, x: 0, y: 0 }}
            animate={{
              scale: [0, 1.2, 1],
              x: [(i - 1) * 50],
              y: [-30 - i * 10],
            }}
            transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
            className="absolute top-0 left-1/2 text-2xl -translate-x-1/2"
            aria-hidden="true"
          >
            {star}
          </motion.span>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-2"
      >
        <h2 className="text-3xl font-bold text-[var(--text-primary)]">
          You're all set!
        </h2>
        <p className="text-[var(--text-secondary)] text-base">
          Your learning adventure across Sikkim begins now.
        </p>
      </motion.div>

      {/* Selected communities emoji row */}
      {selectedCommunities.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col items-center gap-2"
        >
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-widest font-semibold">
            Your communities
          </p>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {selectedCommunities.map((c) => (
              <span
                key={c.id}
                title={c.name}
                className="text-2xl"
                aria-label={c.name}
              >
                {c.emoji}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5 justify-center">
            {selectedCommunities.map((c) => (
              <Badge key={c.id} variant="ghost" size="sm">
                {c.name}
              </Badge>
            ))}
          </div>
        </motion.div>
      )}

      {/* Goal summary */}
      {selectedGoal && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-[var(--surface)] border border-[var(--border)]"
        >
          <span className="text-xl">{selectedGoal.icon}</span>
          <div className="text-left">
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              {selectedGoal.label} — {selectedGoal.minutes} min/day
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              +{selectedGoal.xp} XP daily goal
            </p>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Button size="lg" onClick={onStart} className="px-12">
          Start Learning 🚀
        </Button>
      </motion.div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [selectedCommunities, setSelectedCommunities] = useState<CommunityId[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<GoalId | null>(null);

  const TOTAL_STEPS = 4;

  function goTo(next: number) {
    setDirection(next > step ? 1 : -1);
    setStep(next);
  }

  function toggleCommunity(id: CommunityId) {
    setSelectedCommunities((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }

  const stepContent: Record<number, React.ReactNode> = {
    1: <StepWelcome onNext={() => goTo(2)} />,
    2: (
      <StepCommunities
        selected={selectedCommunities}
        onToggle={toggleCommunity}
        onNext={() => goTo(3)}
        onBack={() => goTo(1)}
      />
    ),
    3: (
      <StepGoal
        selected={selectedGoal}
        onSelect={setSelectedGoal}
        onNext={() => goTo(4)}
        onBack={() => goTo(2)}
      />
    ),
    4: (
      <StepReady
        communities={selectedCommunities}
        goal={selectedGoal}
        onStart={async () => {
          try {
            await updateMyCommunities(selectedCommunities as string[]);
          } catch {
            /* best-effort */
          }
          router.push("/home");
        }}
      />
    ),
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      {/* Progress header */}
      <header className="sticky top-0 z-10 bg-[var(--background)]/90 backdrop-blur-sm border-b border-[var(--border)]">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
          <span className="text-2xl flex-shrink-0">🏔️</span>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-[var(--text-muted)] font-medium">
                Step {step} of {TOTAL_STEPS}
              </span>
              <span className="text-xs text-[var(--text-muted)]">
                {Math.round((step / TOTAL_STEPS) * 100)}%
              </span>
            </div>
            <Progress
              value={step}
              max={TOTAL_STEPS}
              size="sm"
              color="brand"
            />
          </div>
        </div>
      </header>

      {/* Step dots */}
      <div className="flex items-center justify-center gap-2 pt-6">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "rounded-full transition-all duration-300",
              i + 1 === step
                ? "w-6 h-2 bg-[var(--brand-primary)]"
                : i + 1 < step
                ? "w-2 h-2 bg-[var(--brand-secondary)]"
                : "w-2 h-2 bg-[var(--border)]"
            )}
          />
        ))}
      </div>

      {/* Step content with slide animation */}
      <main className="flex-1 flex items-center justify-center py-10 px-4">
        <div className="w-full max-w-3xl overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            >
              {stepContent[step]}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
