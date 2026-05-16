import * as React from "react";
import { cn } from "@/lib/utils";

export interface ProgressProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  color?: "brand" | "xp" | "success";
  animated?: boolean;
  barClassName?: string;
  trackClassName?: string;
  className?: string;
}

const trackHeights: Record<NonNullable<ProgressProps["size"]>, string> = {
  sm: "h-1",
  md: "h-2",
  lg: "h-3",
};

const colorClasses: Record<NonNullable<ProgressProps["color"]>, string> = {
  brand: "bg-gradient-to-r from-[var(--color-brand-start,#7c3aed)] to-[var(--color-brand-end,#4f46e5)]",
  xp: "bg-gradient-to-r from-[#f59e0b] to-[#d97706]",
  success: "bg-gradient-to-r from-[#22c55e] to-[#16a34a]",
};

export function Progress({
  value,
  max = 100,
  size = "md",
  color = "brand",
  animated = false,
  barClassName,
  trackClassName,
  className,
}: ProgressProps) {
  const pct = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      className={cn(
        "w-full overflow-hidden rounded-full",
        "bg-[rgba(255,255,255,0.08)]",
        trackHeights[size],
        trackClassName,
        className
      )}
    >
      <div
        className={cn(
          "h-full rounded-full transition-all duration-500",
          colorClasses[color],
          animated && "animate-pulse",
          barClassName
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
