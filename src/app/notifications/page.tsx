"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Flame,
  BookOpen,
  Zap,
  CheckCircle2,
  Users,
  Mic,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn, timeAgo } from "@/lib/utils";
import { getNotifications, markAllNotificationsRead } from "@/lib/api";
import type { Notification } from "@/lib/api";

// ─── Static fallback ──────────────────────────────────────────────────────────

const STATIC_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    type: "streak",
    title: "Keep your streak alive! 🔥",
    body: "You're on a 7-day streak. Don't break it — complete a lesson today!",
    read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: "n2",
    type: "lesson",
    title: "New lesson available",
    body: "A new Bhutia grammar lesson has been added: Past Tense Essentials.",
    read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
  },
  {
    id: "n3",
    type: "xp",
    title: "XP milestone reached! ⭐",
    body: "You've crossed 2,500 XP. You're now at Level 6 — keep it up!",
    read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  },
  {
    id: "n4",
    type: "contribution",
    title: "Your contribution was approved",
    body: "\"Morning Greeting Phrases\" has been approved and added to the Lepcha archive.",
    read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
  {
    id: "n5",
    type: "community",
    title: "Community update",
    body: "The Limbu community has reached a new preservation milestone: 58%.",
    read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "n6",
    type: "audio",
    title: "New audio content",
    body: "24 new audio recordings have been added to the Sherpa archive.",
    read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
  },
];

// ─── Icon map ─────────────────────────────────────────────────────────────────

const TYPE_ICONS: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  streak: { icon: Flame, color: "text-orange-400", bg: "bg-orange-500/15" },
  lesson: { icon: BookOpen, color: "text-blue-400", bg: "bg-blue-500/15" },
  xp: { icon: Zap, color: "text-amber-400", bg: "bg-amber-500/15" },
  contribution: { icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/15" },
  community: { icon: Users, color: "text-violet-400", bg: "bg-violet-500/15" },
  audio: { icon: Mic, color: "text-pink-400", bg: "bg-pink-500/15" },
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    getNotifications()
      .then((data) => setNotifications(data))
      .catch(() => setNotifications(STATIC_NOTIFICATIONS))
      .finally(() => setLoading(false));
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = async () => {
    setMarking(true);
    try {
      await markAllNotificationsRead();
    } catch {
      /* best-effort */
    } finally {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setMarking(false);
    }
  };

  const handleClickRow = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)]">
      <div className="max-w-2xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
              <Bell className="w-5 h-5 text-[var(--text-primary)]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Notifications</h1>
              {unreadCount > 0 && (
                <p className="text-sm text-[var(--text-muted)]">{unreadCount} unread</p>
              )}
            </div>
            {unreadCount > 0 && (
              <Badge variant="error" size="sm">{unreadCount}</Badge>
            )}
          </div>

          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              loading={marking}
              onClick={handleMarkAllRead}
            >
              Mark all read
            </Button>
          )}
        </div>

        {/* Notification list */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 animate-pulse h-20" />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center py-20 gap-3">
            <Bell className="w-10 h-10 text-[var(--text-muted)]" />
            <p className="text-[var(--text-muted)]">No notifications yet.</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            <div className="space-y-2">
              {notifications.map((n) => {
                const meta = TYPE_ICONS[n.type] ?? TYPE_ICONS["lesson"];
                const Icon = meta.icon;
                return (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => handleClickRow(n.id)}
                    className={cn(
                      "relative flex items-start gap-4 rounded-2xl border p-4 cursor-pointer transition-all",
                      n.read
                        ? "bg-[var(--surface)] border-[var(--border)] hover:bg-[var(--surface-raised)]"
                        : "bg-[var(--brand-soft)] border-[var(--brand-primary)]/20 hover:border-[var(--brand-primary)]/40"
                    )}
                  >
                    {/* Unread dot */}
                    {!n.read && (
                      <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[var(--brand-primary)]" />
                    )}

                    {/* Icon */}
                    <div className={cn("p-2.5 rounded-xl shrink-0", meta.bg)}>
                      <Icon className={cn("w-4 h-4", meta.color)} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pr-4">
                      <p className={cn(
                        "text-sm font-semibold mb-0.5",
                        n.read ? "text-[var(--text-secondary)]" : "text-[var(--text-primary)]"
                      )}>
                        {n.title}
                      </p>
                      <p className="text-sm text-[var(--text-muted)] leading-relaxed">{n.body}</p>
                      <p className="text-xs text-[var(--text-muted)] mt-1.5">{timeAgo(n.created_at)}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
