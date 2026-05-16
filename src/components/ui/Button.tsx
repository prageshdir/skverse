"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 rounded-xl font-semibold",
    "transition-all duration-200 focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-[var(--color-brand,#7c3aed)] focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "bg-gradient-to-r from-[var(--color-brand-start,#7c3aed)] to-[var(--color-brand-end,#4f46e5)]",
          "text-white shadow-lg shadow-[#7c3aed]/30",
          "hover:brightness-110 active:scale-[0.97]",
        ].join(" "),
        secondary: [
          "bg-[var(--color-surface,rgba(255,255,255,0.05))] text-[var(--color-text,#f1f5f9)]",
          "border border-[rgba(255,255,255,0.1)]",
          "hover:bg-[rgba(255,255,255,0.08)] active:scale-[0.97]",
        ].join(" "),
        ghost: [
          "bg-transparent text-[var(--color-text-muted,#94a3b8)]",
          "hover:bg-[var(--color-surface,rgba(255,255,255,0.05))]",
          "hover:text-[var(--color-text,#f1f5f9)] active:scale-[0.97]",
        ].join(" "),
        accent: [
          "bg-gradient-to-r from-[#f59e0b] to-[#d97706]",
          "text-[#1a1100] font-bold shadow-lg shadow-amber-500/25",
          "hover:brightness-110 active:scale-[0.97]",
        ].join(" "),
        glass: [
          "bg-[rgba(255,255,255,0.07)] backdrop-blur-md",
          "border border-[rgba(255,255,255,0.12)] text-[var(--color-text,#f1f5f9)]",
          "hover:bg-[rgba(255,255,255,0.12)] active:scale-[0.97]",
        ].join(" "),
        danger: [
          "bg-gradient-to-r from-[#dc2626] to-[#b91c1c]",
          "text-white shadow-lg shadow-red-600/25",
          "hover:brightness-110 active:scale-[0.97]",
        ].join(" "),
      },
      size: {
        sm: "h-8 px-3 text-xs rounded-lg",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  /** Merge props onto the direct child element instead of rendering a <button>. */
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      loading,
      asChild = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const classes = cn(buttonVariants({ variant, size }), className);

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(
        children as React.ReactElement<React.HTMLAttributes<HTMLElement>>,
        {
          className: cn(
            classes,
            (children as React.ReactElement<React.HTMLAttributes<HTMLElement>>)
              .props.className
          ),
          ...props,
        }
      );
    }

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <span
              className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
              aria-hidden="true"
            />
            <span>{children}</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
