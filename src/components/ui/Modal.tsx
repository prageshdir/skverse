"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  /** Whether clicking the backdrop closes the modal (default: true). */
  closeOnBackdrop?: boolean;
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  className,
  closeOnBackdrop = true,
}: ModalProps) {
  // Close on Escape key
  React.useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  // Prevent body scroll while open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? "modal-title" : undefined}
          aria-describedby={description ? "modal-desc" : undefined}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeOnBackdrop ? onClose : undefined}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            key="modal-panel"
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "relative z-10 w-full max-w-lg rounded-2xl",
              "bg-[var(--color-surface,#1a1a2e)] border border-[rgba(255,255,255,0.1)]",
              "shadow-2xl shadow-black/50 text-[var(--color-text,#f1f5f9)]",
              className
            )}
          >
            {/* Header */}
            {(title || description) && (
              <div className="flex items-start justify-between gap-4 p-5 pb-4 border-b border-[rgba(255,255,255,0.07)]">
                <div className="flex flex-col gap-1">
                  {title && (
                    <h2 id="modal-title" className="text-lg font-semibold leading-snug">
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p id="modal-desc" className="text-sm text-[var(--color-text-muted,#94a3b8)]">
                      {description}
                    </p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close modal"
                  className={cn(
                    "mt-0.5 flex-shrink-0 rounded-lg p-1.5",
                    "text-[var(--color-text-muted,#94a3b8)]",
                    "hover:bg-[rgba(255,255,255,0.08)] hover:text-[var(--color-text,#f1f5f9)]",
                    "transition-colors"
                  )}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Close button (no header) */}
            {!title && !description && (
              <button
                onClick={onClose}
                aria-label="Close modal"
                className={cn(
                  "absolute top-3 right-3 rounded-lg p-1.5",
                  "text-[var(--color-text-muted,#94a3b8)]",
                  "hover:bg-[rgba(255,255,255,0.08)] hover:text-[var(--color-text,#f1f5f9)]",
                  "transition-colors"
                )}
              >
                <X className="h-4 w-4" />
              </button>
            )}

            {/* Body */}
            <div className="p-5">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
