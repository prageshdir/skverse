"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { cn } from "@/lib/utils";

export function Header() {
  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 h-16",
        "bg-[var(--background)]/80 backdrop-blur-xl",
        "border-b border-[var(--border-subtle)]",
        "flex items-center justify-between px-6"
      )}
    >
      {/* Logo */}
      <Link
        href="/"
        className="flex items-center gap-2.5 group"
        aria-label="SikkimVerse home"
      >
        <span
          className={cn(
            "flex items-center justify-center h-8 w-8 rounded-lg text-base font-bold",
            "gradient-brand text-white select-none"
          )}
          aria-hidden="true"
        >
          S
        </span>
        <span className="text-sm font-semibold tracking-tight text-[var(--text-primary)]">
          SikkimVerse
        </span>
      </Link>

      {/* Right side controls */}
      <div className="flex items-center gap-3">
        <nav className="hidden md:flex items-center gap-1" aria-label="Primary navigation">
          <Link
            href="/communities"
            className={cn(
              "px-3 py-1.5 text-sm font-medium rounded-lg",
              "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
              "hover:bg-[var(--surface-raised)] transition-colors duration-150"
            )}
          >
            Communities
          </Link>
          <Link
            href="/learn/lepcha"
            className={cn(
              "px-3 py-1.5 text-sm font-medium rounded-lg",
              "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
              "hover:bg-[var(--surface-raised)] transition-colors duration-150"
            )}
          >
            Learn
          </Link>
        </nav>
        <ThemeToggle />
        <Link
          href="/auth?mode=signup"
          className={cn(
            "hidden md:inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg",
            "gradient-brand text-white",
            "hover:opacity-90 transition-opacity duration-150"
          )}
        >
          Get Started
        </Link>
      </div>
    </header>
  );
}
