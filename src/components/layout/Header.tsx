"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/Button";
import { Search, Bell, User } from "lucide-react";
import { motion } from "framer-motion";

const NAV_LINKS = [
  { href: "/communities", label: "Communities" },
  { href: "/learn", label: "Learn" },
  { href: "/archive", label: "Archive" },
  { href: "/contribute", label: "Contribute" },
];

export function Header() {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  return (
    <motion.header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 h-16",
        isLanding
          ? "bg-transparent"
          : "bg-[var(--background)]/80 backdrop-blur-xl border-b border-[var(--border)]"
      )}
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl gradient-brand flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-sm">Sv</span>
          </div>
          <span className="font-bold text-lg text-[var(--text-primary)] tracking-tight">
            Sikkimverse
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                pathname.startsWith(link.href)
                  ? "bg-[var(--surface-raised)] text-[var(--text-primary)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)]"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <Link href="/search" className="hidden md:flex">
            <button className="h-9 w-9 rounded-xl flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--surface-raised)] hover:text-[var(--text-primary)] transition-colors">
              <Search size={18} />
            </button>
          </Link>
          <Link href="/notifications" className="hidden md:flex">
            <button className="relative h-9 w-9 rounded-xl flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--surface-raised)] hover:text-[var(--text-primary)] transition-colors">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--brand-primary)] rounded-full" />
            </button>
          </Link>
          <ThemeToggle />
          <Link href="/auth" className="hidden md:flex">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
