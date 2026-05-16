"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const THEMES = ["system", "light", "dark"] as const;
type Theme = (typeof THEMES)[number];

const ICONS: Record<Theme, React.ComponentType<{ className?: string }>> = {
  system: Monitor,
  light: Sun,
  dark: Moon,
};

const LABELS: Record<Theme, string> = {
  system: "System theme",
  light: "Light theme",
  dark: "Dark theme",
};

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <button
        className={cn(
          "h-9 w-9 rounded-lg flex items-center justify-center",
          "bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.1)]",
          className
        )}
        aria-label="Toggle theme"
        disabled
      />
    );
  }

  const current = (theme as Theme) ?? "system";
  const currentIndex = THEMES.indexOf(current);
  const nextTheme = THEMES[(currentIndex + 1) % THEMES.length];
  const Icon = ICONS[current];

  return (
    <button
      onClick={() => setTheme(nextTheme)}
      aria-label={`Current: ${LABELS[current]}. Click to switch to ${LABELS[nextTheme]}`}
      className={cn(
        "h-9 w-9 rounded-lg flex items-center justify-center",
        "bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.1)]",
        "text-[var(--color-text-muted,#94a3b8)]",
        "hover:bg-[rgba(255,255,255,0.1)] hover:text-[var(--color-text,#f1f5f9)]",
        "transition-colors duration-200",
        className
      )}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
