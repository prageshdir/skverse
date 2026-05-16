"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setHasSession(!!data.session);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) { setError("Passwords do not match"); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters"); return; }

    setStatus("loading");
    setError("");

    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setError(updateError.message);
      setStatus("error");
    } else {
      setStatus("done");
      setTimeout(() => router.push("/home"), 2000);
    }
  }

  if (!hasSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="text-center">
          <p className="text-[var(--text-muted)] mb-4">Invalid or expired reset link.</p>
          <a href="/auth" className="text-[var(--primary)] underline">Return to sign in</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-4xl">🏔️</span>
          <h1 className="text-2xl font-bold mt-3 text-[var(--text-primary)]">Set new password</h1>
          <p className="text-[var(--text-muted)] mt-1">Choose a strong password for your account</p>
        </div>

        {status === "done" ? (
          <div className="rounded-2xl bg-green-500/10 border border-green-500/20 p-6 text-center">
            <div className="text-3xl mb-2">✓</div>
            <p className="text-green-400 font-medium">Password updated! Redirecting…</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                New password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                placeholder="Min. 8 characters"
                className={cn(
                  "w-full px-4 py-3 rounded-xl text-sm",
                  "bg-[var(--surface)] border border-[var(--border)]",
                  "text-[var(--text-primary)] placeholder:text-[var(--text-muted)]",
                  "focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40"
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                Confirm password
              </label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                placeholder="Repeat password"
                className={cn(
                  "w-full px-4 py-3 rounded-xl text-sm",
                  "bg-[var(--surface)] border border-[var(--border)]",
                  "text-[var(--text-primary)] placeholder:text-[var(--text-muted)]",
                  "focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40"
                )}
              />
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-500/10 rounded-lg px-3 py-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className={cn(
                "w-full py-3 rounded-xl font-semibold text-white transition-all",
                "bg-gradient-to-r from-amber-500 to-orange-500",
                "hover:opacity-90 active:scale-[0.98]",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {status === "loading" ? "Updating…" : "Update password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
