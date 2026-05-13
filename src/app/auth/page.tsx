"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { COMMUNITIES } from "@/lib/communities";
import {
  Eye, EyeOff, Mail, Lock, User, ArrowRight, CheckCircle2
} from "lucide-react";

const BENEFITS = [
  "7-day free trial, no credit card needed",
  "Access all 6 community languages",
  "Learn at your own pace",
  "Earn XP and track progress",
];

function AuthPageInner() {
  const searchParams = useSearchParams();
  const defaultMode = searchParams.get("mode") === "signup" ? "signup" : "login";
  const [mode, setMode] = useState<"login" | "signup">(defaultMode);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    if (mode === "signup") {
      window.location.href = "/onboarding";
    } else {
      window.location.href = "/home";
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — Visual Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 gradient-sikkim" />
        <div className="absolute inset-0 bg-black/40" />

        {/* Floating community cards */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-80">
            {COMMUNITIES.slice(0, 4).map((c, i) => (
              <motion.div
                key={c.id}
                className="absolute glass rounded-2xl p-4 w-48"
                style={{
                  top: `${-20 + i * 30}%`,
                  left: `${-10 + (i % 2) * 70}%`,
                }}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5 }}
              >
                <div className="text-2xl mb-1">{c.emoji}</div>
                <div className="text-white font-semibold text-sm">{c.name}</div>
                <div className="text-white/60 text-xs">{c.language}</div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex flex-col justify-end p-12 text-white">
          <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center mb-4">
            <span className="font-bold">Sv</span>
          </div>
          <h2 className="text-3xl font-bold mb-3">Preserve Culture.<br />Learn Language.</h2>
          <p className="text-white/70 mb-6 leading-relaxed">
            Join thousands of learners keeping the Himalayan languages alive.
          </p>
          <div className="space-y-2">
            {BENEFITS.map((b, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-white/80">
                <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                {b}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Form Panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[var(--background)]">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo (mobile) */}
          <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-xl gradient-brand flex items-center justify-center">
              <span className="text-white font-bold text-sm">Sv</span>
            </div>
            <span className="font-bold text-lg text-[var(--text-primary)]">Sikkimverse</span>
          </Link>

          {/* Mode toggle */}
          <div className="flex bg-[var(--surface-raised)] rounded-2xl p-1 mb-8">
            {(["login", "signup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 capitalize ${
                  mode === m
                    ? "bg-[var(--surface)] text-[var(--text-primary)] shadow-sm"
                    : "text-[var(--text-muted)]"
                }`}
              >
                {m === "login" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">
                {mode === "login" ? "Welcome back" : "Start your journey"}
              </h1>
              <p className="text-[var(--text-muted)] text-sm mb-6">
                {mode === "login"
                  ? "Sign in to continue learning"
                  : "Create your free account to begin"}
              </p>

              {/* Social auth */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button className="flex items-center justify-center gap-2 h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--surface-raised)] transition-colors">
                  <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 002.38-5.88c0-.57-.05-.66-.15-1.18z"/><path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 01-7.18-2.54H1.83v2.07A8 8 0 008.98 17z"/><path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 010-3.04V5.41H1.83a8 8 0 000 7.18l2.67-2.07z"/><path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 001.83 5.4L4.5 7.49a4.77 4.77 0 014.48-3.3z"/></svg>
                  Google
                </button>
                <button className="flex items-center justify-center gap-2 h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--surface-raised)] transition-colors">
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.1.82-.26.82-.58 0-.28-.01-1.04-.015-2.04C5.67 21.5 4.97 19.17 4.97 19.17c-.55-1.4-1.34-1.78-1.34-1.78-1.1-.74.08-.73.08-.73 1.22.09 1.86 1.26 1.86 1.26 1.08 1.85 2.82 1.31 3.5 1 .11-.78.42-1.31.77-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 013-.4c1.02.005 2.04.14 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.65 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.81 1.1.81 2.22 0 1.6-.015 2.9-.015 3.29 0 .32.21.7.82.58A12 12 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                  GitHub
                </button>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-px bg-[var(--border)]" />
                <span className="text-xs text-[var(--text-muted)]">or continue with email</span>
                <div className="flex-1 h-px bg-[var(--border)]" />
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "signup" && (
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                    <input
                      type="text"
                      placeholder="Full name"
                      className="w-full h-12 pl-10 pr-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--brand-primary)] transition-colors"
                    />
                  </div>
                )}

                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                  <input
                    type="email"
                    placeholder="Email address"
                    className="w-full h-12 pl-10 pr-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--brand-primary)] transition-colors"
                  />
                </div>

                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="w-full h-12 pl-10 pr-12 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--brand-primary)] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {mode === "login" && (
                  <div className="text-right">
                    <Link href="#" className="text-xs text-[var(--brand-primary)] hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                )}

                <Button type="submit" size="lg" className="w-full" loading={loading}>
                  {mode === "login" ? "Sign In" : "Create Free Account"}
                  {!loading && <ArrowRight size={18} />}
                </Button>
              </form>

              {mode === "signup" && (
                <p className="text-center text-xs text-[var(--text-muted)] mt-4">
                  By signing up, you agree to our{" "}
                  <Link href="#" className="text-[var(--brand-primary)] hover:underline">Terms</Link>
                  {" "}and{" "}
                  <Link href="#" className="text-[var(--brand-primary)] hover:underline">Privacy Policy</Link>
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--background)]" />}>
      <AuthPageInner />
    </Suspense>
  );
}