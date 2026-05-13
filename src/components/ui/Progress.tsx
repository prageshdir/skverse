"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  trackClassName?: string;
  barClassName?: string;
  animated?: boolean;
  label?: string;
  showValue?: boolean;
  size?: "sm" | "md" | "lg";
  color?: "brand" | "accent" | "success" | "community" | "xp";
}

const colorMap = {
  brand: "bg-[var(--brand-primary)]",
  accent: "bg-[var(--brand-accent)]",
  success: "bg-green-500",
  community: "bg-[var(--community-primary)]",
  xp: "bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-accent)]",
};

const sizeMap = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
};

export function Progress({
  value,
  max = 100,
  className,
  trackClassName,
  barClassName,
  animated = true,
  label,
  showValue,
  size = "md",
  color = "brand",
}: ProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn("w-full", className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && <span className="text-sm text-[var(--text-secondary)]">{label}</span>}
          {showValue && (
            <span className="text-sm font-semibold text-[var(--text-primary)]">
              {value}/{max}
            </span>
          )}
        </div>
      )}
      <div
        className={cn(
          "w-full rounded-full bg-[var(--surface-raised)] overflow-hidden",
          sizeMap[size],
          trackClassName
        )}
      >
        {animated ? (
          <motion.div
            className={cn("h-full rounded-full", colorMap[color], barClassName)}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
        ) : (
          <div
            className={cn("h-full rounded-full", colorMap[color], barClassName)}
            style={{ width: `${pct}%` }}
          />
        )}
      </div>
    </div>
  );
}
