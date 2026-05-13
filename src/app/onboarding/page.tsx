"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { COMMUNITIES } from "@/lib/communities";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";

const GOALS = [
  { id: "heritage", emoji: "🏛️", title: "Cultural Heritage", desc: "Learn to connect with my roots" },
  { id: "travel", emoji: "🌏", title: "Travel & Explore", desc: "Visit Sikkim and connect locally" },
  { id: "academic", emoji: "📚", title: "Academic Research", desc: "Study linguistics or culture" },
  { id: "community", emoji: "❤️", title: "Community Service", desc: "Help preserve the language" },
  { id: "curiosity", emoji: "✨", title: "Pure Curiosity", desc: "I'm just fascinated by this culture" },
  { id: "family", emoji: "👨‍👩‍👧", title: "Family Connection", desc: "Communicate with family members" },
];

const DAILY_GOALS = [
  { id: "casual", emoji: "🌿", title: "Casual", desc: "5 min/day", xp: 10 },
  { id: "regular", emoji: "🔥", title: "Regular", desc: "10 min/day", xp: 20 },
  { id: "serious", emoji: "⚡", title: "Serious", desc: "20 min/day", xp: 30 },
  { id: "intensive", emoji: "🚀", title: "Intensive", desc: "30+ min/day", xp: 50 },
];

const STEPS = ["Language", "Goal", "Daily Goal", "You're Ready"];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [selectedCommunity, setSelectedCommunity] = useState<string | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [selectedDailyGoal, setSelectedDailyGoal] = useState<string | null>("regular");

  const canNext =
    (step === 0 && selectedCommunity) ||
    (step === 1 && selectedGoal) ||
    (step === 2 && selectedDailyGoal) ||
    step === 3;

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            {STEPS.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    i < step
                      ? "bg-[var(--brand-primary)] text-white"
                      : i === step
                      ? "bg-[var(--brand-accent)] text-[#1a1410]"
                      : "bg-[var(--surface-raised)] text-[var(--text-muted)]"
                  }`}
                >
                  {i < step ? <Check size={14} /> : i + 1}
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`hidden sm:block h-px flex-1 w-12 transition-all ${i < step ? "bg-[var(--brand-primary)]" : "bg-[var(--border)]"}`} />
                )}
              </div>
            ))}
          </div>
          <div className="h-1.5 bg-[var(--surface-raised)] rounded-full overflow-hidden">
            <motion.div
              className="h-full gradient-brand rounded-full"
              animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step-0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <div className="text-4xl mb-3">🌄</div>
                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                  Which language calls to you?
                </h2>
                <p className="text-[var(--text-muted)]">
                  Choose the community you&apos;d like to explore first
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {COMMUNITIES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCommunity(c.id)}
                    className={`relative overflow-hidden rounded-2xl p-4 text-left transition-all duration-300 border-2 ${
                      selectedCommunity === c.id
                        ? "border-[var(--brand-accent)] shadow-lg scale-[1.02]"
                        : "border-[var(--border)] hover:border-[var(--text-muted)]"
                    }`}
                    style={{
                      background:
                        selectedCommunity === c.id ? c.colors.bg : "var(--surface)",
                    }}
                  >
                    {selectedCommunity === c.id && (
                      <div className="absolute inset-0 opacity-30" style={{ background: c.gradient }} />
                    )}
                    <div className="relative flex items-center gap-3">
                      <span className="text-3xl">{c.emoji}</span>
                      <div>
                        <div className={`font-bold text-base ${selectedCommunity === c.id ? "text-white" : "text-[var(--text-primary)]"}`}>
                          {c.name}
                        </div>
                        <div className={`text-xs ${selectedCommunity === c.id ? "text-white/70" : "text-[var(--text-muted)]"}`}>
                          {c.language} · {c.lessons} lessons
                        </div>
                      </div>
                      {selectedCommunity === c.id && (
                        <div className="ml-auto w-6 h-6 rounded-full bg-[var(--brand-accent)] flex items-center justify-center">
                          <Check size={12} className="text-[#1a1410]" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <div className="text-4xl mb-3">🎯</div>
                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                  Why are you learning?
                </h2>
                <p className="text-[var(--text-muted)]">Help us personalize your experience</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {GOALS.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setSelectedGoal(g.id)}
                    className={`flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                      selectedGoal === g.id
                        ? "border-[var(--brand-primary)] bg-[var(--brand-primary)]/5"
                        : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--text-muted)]"
                    }`}
                  >
                    <span className="text-2xl">{g.emoji}</span>
                    <div>
                      <div className="font-semibold text-sm text-[var(--text-primary)]">{g.title}</div>
                      <div className="text-xs text-[var(--text-muted)]">{g.desc}</div>
                    </div>
                    {selectedGoal === g.id && (
                      <div className="ml-auto w-5 h-5 rounded-full bg-[var(--brand-primary)] flex items-center justify-center shrink-0">
                        <Check size={11} className="text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <div className="text-4xl mb-3">⏱️</div>
                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                  Set a daily learning goal
                </h2>
                <p className="text-[var(--text-muted)]">Consistency beats intensity</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {DAILY_GOALS.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setSelectedDailyGoal(g.id)}
                    className={`flex flex-col items-center p-6 rounded-2xl border-2 transition-all duration-200 ${
                      selectedDailyGoal === g.id
                        ? "border-[var(--brand-accent)] bg-[var(--brand-accent)]/10 scale-[1.02]"
                        : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--text-muted)]"
                    }`}
                  >
                    <span className="text-4xl mb-3">{g.emoji}</span>
                    <div className="font-bold text-[var(--text-primary)]">{g.title}</div>
                    <div className="text-sm text-[var(--text-muted)] mt-1">{g.desc}</div>
                    <div className="mt-3 text-xs font-bold text-[var(--brand-accent)]">+{g.xp} XP/day</div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-8"
            >
              <motion.div
                className="text-7xl mb-6"
                animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                🎉
              </motion.div>
              <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-3">
                You&apos;re all set!
              </h2>
              <p className="text-[var(--text-muted)] text-lg mb-8 max-w-sm mx-auto">
                Your learning journey begins now. The mountains are calling.
              </p>
              <div className="bg-[var(--surface)] rounded-2xl p-6 border border-[var(--border)] mb-6 text-left max-w-xs mx-auto">
                <div className="text-sm font-semibold text-[var(--text-muted)] mb-3">YOUR SETUP</div>
                {[
                  ["Language", COMMUNITIES.find(c => c.id === selectedCommunity)?.name || ""],
                  ["Goal", GOALS.find(g => g.id === selectedGoal)?.title || ""],
                  ["Daily Goal", DAILY_GOALS.find(g => g.id === selectedDailyGoal)?.desc || ""],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0">
                    <span className="text-sm text-[var(--text-muted)]">{k}</span>
                    <span className="text-sm font-semibold text-[var(--text-primary)]">{v}</span>
                  </div>
                ))}
              </div>
              <Link href="/home">
                <Button size="xl" variant="accent" className="w-full max-w-xs mx-auto">
                  Begin Your Journey
                  <ArrowRight size={20} />
                </Button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        {step < 3 && (
          <div className="flex items-center justify-between mt-8">
            <Button
              variant="ghost"
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
            >
              <ArrowLeft size={16} />
              Back
            </Button>
            <Button
              onClick={() => setStep(step + 1)}
              disabled={!canNext}
            >
              {step < 2 ? "Continue" : "Finish Setup"}
              <ArrowRight size={16} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
