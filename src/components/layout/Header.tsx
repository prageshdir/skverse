"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { useAuth } from "@/lib/store";
import { cn } from "@/lib/utils";

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/");
  }

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
        href={isAuthenticated ? "/home" : "/"}
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

      {/* Right side */}
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
          {isAuthenticated && (
            <>
              <Link
                href="/home"
                className={cn(
                  "px-3 py-1.5 text-sm font-medium rounded-lg",
                  "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
                  "hover:bg-[var(--surface-raised)] transition-colors duration-150"
                )}
              >
                Dashboard
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
            </>
          )}
        </nav>

        <ThemeToggle />

        {isAuthenticated ? (
          <div className="flex items-center gap-2">
            <Link
              href="/profile"
              className={cn(
                "hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium",
                "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
                "hover:bg-[var(--surface-raised)] transition-colors"
              )}
            >
              <span className={cn(
                "flex items-center justify-center h-6 w-6 rounded-full text-xs font-bold",
                "gradient-brand text-white"
              )}>
                {user?.name?.[0]?.toUpperCase() ?? "U"}
              </span>
              <span>{user?.name?.split(" ")[0]}</span>
            </Link>
            <button
              onClick={handleLogout}
              className={cn(
                "hidden md:inline-flex px-3 py-1.5 text-sm font-medium rounded-lg",
                "text-[var(--text-muted)] hover:text-[var(--error)]",
                "hover:bg-[var(--surface-raised)] transition-colors"
              )}
            >
              Sign out
            </button>
          </div>
        ) : (
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
        )}
      </div>
    </header>
  );
}
