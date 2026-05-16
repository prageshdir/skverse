"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, X, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

// ─── Plan config ──────────────────────────────────────────────────────────────

interface Plan {
  id: string;
  name: string;
  monthlyPrice: number | null;
  yearlyPrice: number | null;
  description: string;
  highlighted: boolean;
  badge?: string;
  features: { text: string; included: boolean }[];
  cta: string;
}

const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: "Start your language journey at no cost",
    highlighted: false,
    features: [
      { text: "Basic learning lessons", included: true },
      { text: "Access to 2 communities", included: true },
      { text: "Limited archive access", included: true },
      { text: "XP & streak tracking", included: true },
      { text: "All 10 communities", included: false },
      { text: "Full archive", included: false },
      { text: "AI language tutor", included: false },
      { text: "Pronunciation lab", included: false },
      { text: "Offline mode", included: false },
      { text: "Download content", included: false },
      { text: "Priority support", included: false },
      { text: "Community contributor badge", included: false },
    ],
    cta: "Get Started Free",
  },
  {
    id: "pro",
    name: "Pro",
    monthlyPrice: 199,
    yearlyPrice: 1499,
    description: "For dedicated learners and language enthusiasts",
    highlighted: true,
    badge: "Most Popular",
    features: [
      { text: "Basic learning lessons", included: true },
      { text: "Access to 2 communities", included: true },
      { text: "Limited archive access", included: true },
      { text: "XP & streak tracking", included: true },
      { text: "All 10 communities", included: true },
      { text: "Full archive", included: true },
      { text: "AI language tutor", included: true },
      { text: "Pronunciation lab", included: true },
      { text: "Offline mode", included: false },
      { text: "Download content", included: false },
      { text: "Priority support", included: false },
      { text: "Community contributor badge", included: false },
    ],
    cta: "Start Pro",
  },
  {
    id: "scholar",
    name: "Scholar",
    monthlyPrice: 499,
    yearlyPrice: 3999,
    description: "For researchers, teachers, and community leaders",
    highlighted: false,
    badge: "Full Access",
    features: [
      { text: "Basic learning lessons", included: true },
      { text: "Access to 2 communities", included: true },
      { text: "Limited archive access", included: true },
      { text: "XP & streak tracking", included: true },
      { text: "All 10 communities", included: true },
      { text: "Full archive", included: true },
      { text: "AI language tutor", included: true },
      { text: "Pronunciation lab", included: true },
      { text: "Offline mode", included: true },
      { text: "Download content", included: true },
      { text: "Priority support", included: true },
      { text: "Community contributor badge", included: true },
    ],
    cta: "Start Scholar",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SubscriptionPage() {
  const [yearly, setYearly] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)]">
      <div className="max-w-5xl mx-auto px-4 py-16">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--text-secondary)] mb-4">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Language preservation starts here
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
            Choose your plan
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-xl mx-auto">
            Every subscription helps preserve the 10 indigenous languages of Sikkim for future generations.
          </p>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={cn("text-sm font-medium", !yearly ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]")}>
              Monthly
            </span>
            <button
              onClick={() => setYearly((v) => !v)}
              className={cn(
                "relative w-12 h-6 rounded-full transition-colors",
                yearly ? "bg-[var(--brand-primary)]" : "bg-[var(--border)]"
              )}
            >
              <span
                className={cn(
                  "absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all",
                  yearly ? "left-7" : "left-1"
                )}
              />
            </button>
            <span className={cn("text-sm font-medium flex items-center gap-2", yearly ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]")}>
              Yearly
              {yearly && (
                <Badge variant="success" size="sm">Save 37%</Badge>
              )}
            </span>
          </div>
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {PLANS.map((plan, i) => {
            const price = yearly ? plan.yearlyPrice : plan.monthlyPrice;
            const period = yearly ? "/year" : "/month";

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Card
                  className={cn(
                    "relative p-6 flex flex-col",
                    plan.highlighted && "border-[var(--brand-primary)]/60 ring-1 ring-[var(--brand-primary)]/40 scale-[1.02]"
                  )}
                >
                  {plan.badge && (
                    <div className={cn(
                      "absolute -top-3 left-1/2 -translate-x-1/2",
                    )}>
                      <Badge variant={plan.highlighted ? "default" : "ghost"}>
                        {plan.badge}
                      </Badge>
                    </div>
                  )}

                  <h2 className="text-xl font-bold text-[var(--text-primary)] mt-2">{plan.name}</h2>
                  <p className="text-sm text-[var(--text-secondary)] mt-1 mb-6">{plan.description}</p>

                  {/* Price */}
                  <div className="mb-6">
                    {price === 0 ? (
                      <p className="text-4xl font-bold text-[var(--text-primary)]">Free</p>
                    ) : (
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-medium text-[var(--text-muted)]">₹</span>
                        <span className="text-4xl font-bold text-[var(--text-primary)]">
                          {price?.toLocaleString()}
                        </span>
                        <span className="text-sm text-[var(--text-muted)]">{period}</span>
                      </div>
                    )}
                    {yearly && price !== 0 && (
                      <p className="text-xs text-emerald-400 mt-1">
                        Save ₹{(((plan.monthlyPrice ?? 0) * 12) - (plan.yearlyPrice ?? 0)).toLocaleString()} per year
                      </p>
                    )}
                  </div>

                  {/* CTA */}
                  <Link href={`/auth?mode=signup&plan=${plan.id}`} className="block mb-6">
                    <Button
                      className="w-full"
                      variant={plan.highlighted ? "default" : "secondary"}
                      size="lg"
                    >
                      {plan.cta}
                    </Button>
                  </Link>

                  {/* Features */}
                  <ul className="space-y-2.5 flex-1">
                    {plan.features.map((f, fi) => (
                      <li key={fi} className="flex items-start gap-2.5 text-sm">
                        {f.included ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <X className="w-4 h-4 text-[var(--text-muted)] shrink-0 mt-0.5" />
                        )}
                        <span className={f.included ? "text-[var(--text-secondary)]" : "text-[var(--text-muted)] line-through"}>
                          {f.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Footer note */}
        <p className="text-center text-sm text-[var(--text-muted)] mt-10">
          All plans include a 7-day free trial. Cancel any time. Your subscription helps fund language preservation efforts.
        </p>
      </div>
    </div>
  );
}
