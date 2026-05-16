import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full font-medium tracking-wide",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--color-brand-start,#7c3aed)]/20 text-[var(--color-brand-start,#a78bfa)] border border-[var(--color-brand-start,#7c3aed)]/30",
        success:
          "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25",
        warning:
          "bg-amber-500/15 text-amber-400 border border-amber-500/25",
        error:
          "bg-red-500/15 text-red-400 border border-red-500/25",
        info:
          "bg-sky-500/15 text-sky-400 border border-sky-500/25",
        ghost:
          "bg-[rgba(255,255,255,0.06)] text-[var(--color-text-muted,#94a3b8)] border border-[rgba(255,255,255,0.08)]",
      },
      size: {
        sm: "px-2 py-0.5 text-[10px]",
        md: "px-2.5 py-0.5 text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
