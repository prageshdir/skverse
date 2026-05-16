"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Globe, BookOpen, Archive, User } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { label: "Home", href: "/home", icon: Home },
  { label: "Communities", href: "/communities", icon: Globe },
  { label: "Learn", href: "/learn/lepcha", icon: BookOpen },
  { label: "Archive", href: "/archive", icon: Archive },
  { label: "Profile", href: "/profile", icon: User },
] as const;

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobile navigation"
      className={cn(
        "fixed bottom-0 inset-x-0 z-40",
        "bg-[var(--color-bg,#0d0d1a)]/90 backdrop-blur-xl",
        "border-t border-[rgba(255,255,255,0.08)]",
        "pb-[env(safe-area-inset-bottom)]",
        "md:hidden"
      )}
    >
      <ul className="flex items-stretch" role="list">
        {TABS.map(({ label, href, icon: Icon }) => {
          // Active if the current path starts with the href
          // Special-case /learn/* so /learn/lepcha tab stays active on sub-routes
          const isActive =
            href === "/learn/lepcha"
              ? pathname.startsWith("/learn")
              : pathname === href || pathname.startsWith(href + "/");

          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-label={label}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-0.5",
                  "h-14 w-full text-[10px] font-medium transition-colors duration-150",
                  isActive
                    ? "text-[var(--color-brand-start,#a78bfa)]"
                    : "text-[var(--color-text-muted,#64748b)] hover:text-[var(--color-text,#cbd5e1)]"
                )}
              >
                {/* Animated active indicator pill */}
                {isActive && (
                  <motion.span
                    layoutId="mobile-nav-indicator"
                    className={cn(
                      "absolute top-0 inset-x-3 h-0.5 rounded-full",
                      "bg-gradient-to-r from-[var(--color-brand-start,#7c3aed)] to-[var(--color-brand-end,#4f46e5)]"
                    )}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}

                <Icon
                  className={cn(
                    "h-5 w-5 transition-transform duration-150",
                    isActive && "scale-110"
                  )}
                  aria-hidden="true"
                />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
