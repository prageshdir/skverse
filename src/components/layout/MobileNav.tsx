"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Home, BookOpen, Globe, Archive, User } from "lucide-react";

const NAV_ITEMS = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/learn", label: "Learn", icon: BookOpen },
  { href: "/communities", label: "Explore", icon: Globe },
  { href: "/archive", label: "Archive", icon: Archive },
  { href: "/profile", label: "Profile", icon: User },
];

export function MobileNav() {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  if (isLanding) return null;

  return (
    <motion.nav
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
      initial={{ y: 80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="bg-[var(--surface)]/90 backdrop-blur-xl border-t border-[var(--border)] pb-safe">
        <div className="flex items-center justify-around px-2 pt-2 pb-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname.startsWith(href) || (href === "/home" && pathname === "/home");
            return (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center gap-1 min-w-[56px] py-1 px-2 rounded-2xl transition-colors"
              >
                <div className="relative">
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 -m-1.5 rounded-xl bg-[var(--brand-primary)]/10"
                        layoutId="nav-indicator"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </AnimatePresence>
                  <Icon
                    size={22}
                    className={cn(
                      "relative z-10 transition-colors duration-200",
                      isActive
                        ? "text-[var(--brand-primary)]"
                        : "text-[var(--text-muted)]"
                    )}
                    strokeWidth={isActive ? 2.5 : 1.8}
                  />
                </div>
                <span
                  className={cn(
                    "text-[10px] font-medium transition-colors duration-200",
                    isActive ? "text-[var(--brand-primary)]" : "text-[var(--text-muted)]"
                  )}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}
