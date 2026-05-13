import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-[var(--surface-raised)] text-[var(--text-secondary)] border border-[var(--border)]",
        primary: "bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] border border-[var(--brand-primary)]/20",
        accent: "bg-[var(--brand-accent)]/15 text-[#7a5c00] dark:text-[var(--brand-accent)] border border-[var(--brand-accent)]/30",
        success: "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20",
        warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
        error: "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20",
        community: "bg-[var(--community-primary)]/15 text-[var(--community-primary)] border border-[var(--community-primary)]/25",
        xp: "bg-[var(--xp-gold)]/15 text-amber-600 dark:text-amber-400 border border-[var(--xp-gold)]/30 font-bold",
      },
      size: {
        sm: "text-xs px-2 py-0.5",
        md: "text-sm px-2.5 py-1",
        lg: "text-base px-3 py-1.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}
