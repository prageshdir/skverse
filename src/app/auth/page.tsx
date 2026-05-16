"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { signInWithSupabase, signUpWithSupabase } from "@/lib/store";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { COMMUNITIES } from "@/lib/communities";

// ── Floating community emoji cards for the left panel ────────────────────────

const FLOATING_CARDS = COMMUNITIES.slice(0, 6).map((c, i) => ({
  emoji: c.emoji,
  name: c.name,
  delay: i * 0.4,
  x: [10, 20, 30, 20, 10][i % 5],
}));

function FloatingCard({
  emoji,
  name,
  delay,
  x,
}: {
  emoji: string;
  name: string;
  delay: number;
  x: number;
}) {
  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: [-8, 8, -8] }}
      transition={{
        duration: 4,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      style={{ left: `${x}%` }}
      className={cn(
        "absolute flex items-center gap-2 px-3 py-2 rounded-2xl",
        "bg-white/10 backdrop-blur-sm border border-white/20",
        "text-white text-sm font-medium shadow-lg",
        "whitespace-nowrap"
      )}
    >
      <span className="text-xl">{emoji}</span>
      <span className="text-white/90">{name}</span>
    </motion.div>
  );
}

// ── Left panel ────────────────────────────────────────────────────────────────

function LeftPanel() {
  const positions = [
    { top: "15%", left: "8%" },
    { top: "25%", left: "52%" },
    { top: "38%", left: "18%" },
    { top: "50%", left: "60%" },
    { top: "62%", left: "10%" },
    { top: "74%", left: "48%" },
  ];

  const benefits = [
    "Learn 10 endangered Himalayan languages",
    "Earn XP and streaks as you progress",
    "Contribute audio, text and stories",
    "Connect with indigenous communities",
    "AI-powered tutor available 24/7",
  ];

  return (
    <div className="hidden lg:flex flex-col justify-between h-full p-10 gradient-sikkim relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-96 h-96 rounded-full bg-[var(--brand-accent)]/20 blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 rounded-full bg-[var(--brand-primary)]/30 blur-3xl" />
      </div>

      {/* Logo / wordmark */}
      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <span className="text-4xl">🏔️</span>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Sikkimverse
            </h1>
            <p className="text-white/60 text-sm">Preserve · Learn · Thrive</p>
          </div>
        </div>
      </div>

      {/* Floating community cards */}
      <div className="relative flex-1 my-8">
        {FLOATING_CARDS.map((card, i) => (
          <div
            key={card.name}
            style={{ ...positions[i], position: "absolute" }}
          >
            <FloatingCard {...card} />
          </div>
        ))}
      </div>

      {/* Benefits list */}
      <div className="relative z-10 space-y-3">
        <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-4">
          Why join Sikkimverse
        </p>
        {benefits.map((b) => (
          <div key={b} className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-[var(--brand-accent)] flex-shrink-0 mt-0.5" />
            <span className="text-white/80 text-sm leading-snug">{b}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Auth form (inner, uses useSearchParams) ───────────────────────────────────

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultMode = searchParams.get("mode") === "signup" ? "signup" : "signin";

  const [mode, setMode] = useState<"signin" | "signup" | "forgot">(defaultMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const DEMO_ACCOUNTS = [
    { label: "Superadmin",        email: "admin@sikkimverse.com",       password: "Admin@12345"   },
    { label: "Community Admin",   email: "karma@bhutia.org",            password: "Bhutia@12345"  },
    { label: "Community Manager", email: "manager@sikkimverse.com",     password: "Manager@12345" },
    { label: "Contributor",       email: "contributor@sikkimverse.com", password: "Contrib@12345" },
    { label: "Learner",           email: "learner@sikkimverse.com",     password: "Learn@12345"   },
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "forgot") {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        });
        if (resetError) throw new Error(resetError.message);
        setResetSent(true);
      } else if (mode === "signup") {
        await signUpWithSupabase(email, password, name);
        router.push("/onboarding");
      } else {
        await signInWithSupabase(email, password);
        router.push("/home");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function fillDemo(acc: (typeof DEMO_ACCOUNTS)[0]) {
    setEmail(acc.email);
    setPassword(acc.password);
    setName("");
    setMode("signin");
  }

  return (
    <div className="flex flex-col justify-center h-full px-8 py-12 max-w-md mx-auto w-full">
      {/* Mobile logo */}
      <div className="flex items-center gap-2 mb-8 lg:hidden">
        <span className="text-3xl">🏔️</span>
        <span className="text-xl font-bold text-[var(--text-primary)]">
          Sikkimverse
        </span>
      </div>

      {/* Mode tabs */}
      {mode !== "forgot" && (
        <div className="flex rounded-2xl bg-[var(--surface-raised)] border border-[var(--border)] p-1 mb-8">
          {(["signin", "signup"] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(""); setResetSent(false); }}
              className={cn(
                "flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
                mode === m
                  ? "bg-[var(--surface)] text-[var(--text-primary)] shadow-sm"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              )}
            >
              {m === "signin" ? "Sign In" : "Create Account"}
            </button>
          ))}
        </div>
      )}

      {/* Heading */}
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="mb-6"
        >
          {mode === "forgot" && (
            <button
              onClick={() => { setMode("signin"); setError(""); setResetSent(false); }}
              className="text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] mb-3 flex items-center gap-1"
            >
              ← Back to sign in
            </button>
          )}
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">
            {mode === "signin" ? "Welcome back" : mode === "signup" ? "Join Sikkimverse" : "Reset password"}
          </h2>
          <p className="text-[var(--text-muted)] text-sm mt-1">
            {mode === "signin"
              ? "Sign in to continue your learning journey."
              : mode === "signup"
              ? "Start preserving and learning Himalayan languages."
              : "Enter your email and we'll send a reset link."}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Forgot password — reset sent confirmation */}
      {mode === "forgot" && resetSent && (
        <div className="rounded-2xl bg-green-500/10 border border-green-500/20 p-5 mb-6 text-center">
          <div className="text-2xl mb-2">📧</div>
          <p className="text-green-400 font-medium text-sm">Check your inbox</p>
          <p className="text-[var(--text-muted)] text-xs mt-1">
            We sent a password reset link to <strong>{email}</strong>
          </p>
        </div>
      )}

      {/* Social auth */}
      {mode !== "forgot" && <div className="flex gap-3 mb-5">
        <Link
          href="/auth/oauth/google"
          className={cn(
            "flex-1 flex items-center justify-center gap-2 h-11 rounded-xl text-sm font-medium",
            "border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)]",
            "hover:bg-[var(--surface-raised)] transition-colors"
          )}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 flex-shrink-0" aria-hidden="true">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Google
        </Link>
        <Link
          href="/auth/oauth/github"
          className={cn(
            "flex-1 flex items-center justify-center gap-2 h-11 rounded-xl text-sm font-medium",
            "border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)]",
            "hover:bg-[var(--surface-raised)] transition-colors"
          )}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 flex-shrink-0 fill-current" aria-hidden="true">
            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
          GitHub
        </Link>
      </div>}

      {/* Divider */}
      {mode !== "forgot" && (
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-[var(--border)]" />
          <span className="text-[var(--text-muted)] text-xs">or continue with email</span>
          <div className="flex-1 h-px bg-[var(--border)]" />
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <AnimatePresence>
          {mode === "signup" && (
            <motion.div
              key="name-field"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tashi Namgyal"
                required={mode === "signup"}
                className={cn(
                  "w-full h-11 px-4 rounded-xl text-sm",
                  "bg-[var(--surface)] border border-[var(--border)]",
                  "text-[var(--text-primary)] placeholder:text-[var(--text-muted)]",
                  "focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/40 focus:border-[var(--brand-primary)]",
                  "transition-colors"
                )}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            autoComplete="email"
            className={cn(
              "w-full h-11 px-4 rounded-xl text-sm",
              "bg-[var(--surface)] border border-[var(--border)]",
              "text-[var(--text-primary)] placeholder:text-[var(--text-muted)]",
              "focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/40 focus:border-[var(--brand-primary)]",
              "transition-colors"
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={mode === "signup" ? "Min. 8 characters" : "Your password"}
              required
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              className={cn(
                "w-full h-11 pl-4 pr-11 rounded-xl text-sm",
                "bg-[var(--surface)] border border-[var(--border)]",
                "text-[var(--text-primary)] placeholder:text-[var(--text-muted)]",
                "focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/40 focus:border-[var(--brand-primary)]",
                "transition-colors"
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-[var(--error)]/10 border border-[var(--error)]/25"
            >
              <AlertCircle className="h-4 w-4 text-[var(--error)] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[var(--error)]">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {mode === "signin" && (
          <div className="flex justify-end -mt-1">
            <button
              type="button"
              onClick={() => { setMode("forgot"); setError(""); setResetSent(false); }}
              className="text-xs text-[var(--text-muted)] hover:text-[var(--brand-primary)] transition-colors"
            >
              Forgot password?
            </button>
          </div>
        )}

        <Button
          type="submit"
          size="lg"
          loading={loading}
          disabled={mode === "forgot" && resetSent}
          className="w-full bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] text-white rounded-xl hover:brightness-110"
        >
          {mode === "signin" ? "Sign In" : mode === "signup" ? "Create Account" : "Send reset link"}
        </Button>
      </form>

      {/* Demo accounts */}
      {mode !== "forgot" && <div className="mt-6 rounded-2xl border border-[var(--border)] overflow-hidden">
        <button
          onClick={() => setShowDemo((v) => !v)}
          className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--surface-raised)] transition-colors"
        >
          <span>Demo accounts</span>
          {showDemo ? (
            <ChevronUp className="h-4 w-4 text-[var(--text-muted)]" />
          ) : (
            <ChevronDown className="h-4 w-4 text-[var(--text-muted)]" />
          )}
        </button>
        <AnimatePresence>
          {showDemo && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              className="overflow-hidden border-t border-[var(--border)]"
            >
              <div className="p-3 space-y-2">
                {DEMO_ACCOUNTS.map((acc) => (
                  <button
                    key={acc.email}
                    onClick={() => fillDemo(acc)}
                    className={cn(
                      "w-full text-left px-3 py-2.5 rounded-xl text-sm transition-colors",
                      "bg-[var(--surface-raised)] hover:bg-[var(--border)] border border-[var(--border-subtle)]"
                    )}
                  >
                    <span className="font-medium text-[var(--text-primary)]">
                      {acc.label}
                    </span>
                    <br />
                    <span className="text-[var(--text-muted)] text-xs">
                      {acc.email} / {acc.password}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>}

      <p className="text-center text-xs text-[var(--text-muted)] mt-6">
        By continuing you agree to our{" "}
        <Link href="/terms" className="underline hover:text-[var(--text-secondary)]">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline hover:text-[var(--text-secondary)]">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}

// ── Page (wraps form in Suspense for useSearchParams) ─────────────────────────

export default function AuthPage() {
  return (
    <div className="min-h-screen flex bg-[var(--background)]">
      {/* Left panel — 45% on large screens */}
      <div className="hidden lg:block lg:w-[45%] xl:w-[40%] min-h-screen">
        <LeftPanel />
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center bg-[var(--background)] overflow-y-auto">
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-64">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--brand-primary)] border-t-transparent" />
            </div>
          }
        >
          <AuthForm />
        </Suspense>
      </div>
    </div>
  );
}
