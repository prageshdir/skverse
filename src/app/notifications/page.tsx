"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getNotifications, markAllNotificationsRead } from "@/lib/api";
import { Bell, Zap, BookOpen, Users, CheckCircle2, Flame, Gift, Mic, Check } from "lucide-react";

const NOTIFICATIONS = [
  {
    id: 1,
    type: "streak",
    icon: Flame,
    iconBg: "bg-orange-500/10",
    iconColor: "text-orange-500",
    title: "7-Day Streak! 🔥",
    body: "You've been learning for 7 days in a row. Keep the fire burning!",
    time: "Just now",
    read: false,
    xp: 50,
  },
  {
    id: 2,
    type: "lesson",
    icon: BookOpen,
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-500",
    title: "New lesson available",
    body: "\"Formal Greetings\" in Bhutia is now unlocked. Start learning today.",
    time: "2h ago",
    read: false,
    xp: null,
  },
  {
    id: 3,
    type: "xp",
    icon: Zap,
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-500",
    title: "Daily goal reached! ⚡",
    body: "You earned 50 XP today. You're crushing your learning goals.",
    time: "5h ago",
    read: false,
    xp: 50,
  },
  {
    id: 4,
    type: "community",
    icon: Users,
    iconBg: "bg-violet-500/10",
    iconColor: "text-violet-500",
    title: "New community milestone",
    body: "The Lepcha community just crossed 3,000 learners. Be part of history!",
    time: "Yesterday",
    read: true,
    xp: null,
  },
  {
    id: 5,
    type: "contribution",
    icon: CheckCircle2,
    iconBg: "bg-green-500/10",
    iconColor: "text-green-500",
    title: "Contribution approved ✓",
    body: "Your audio recording \"Morning Greeting\" has been approved and added to the archive.",
    time: "2 days ago",
    read: true,
    xp: 80,
  },
  {
    id: 6,
    type: "gift",
    icon: Gift,
    iconBg: "bg-pink-500/10",
    iconColor: "text-pink-500",
    title: "Free trial ending soon",
    body: "Your 7-day trial ends in 2 days. Subscribe for ₹199/month to continue learning.",
    time: "3 days ago",
    read: true,
    xp: null,
    cta: "Subscribe Now",
    ctaHref: "/subscription",
  },
  {
    id: 7,
    type: "audio",
    icon: Mic,
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-500",
    title: "New audio story added",
    body: "\"The Legend of Kanchenjunga\" narrated by elder Dawa Bhutia is now in the archive.",
    time: "4 days ago",
    read: true,
    xp: null,
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    getNotifications()
      .then((data) => {
        const mapped = data.map((n) => ({
          id: parseInt(n.id) || Math.random(),
          type: n.type,
          icon: Bell,
          iconBg: "bg-blue-500/10",
          iconColor: "text-blue-500",
          title: n.title,
          body: n.body,
          time: new Date(n.created_at).toLocaleDateString(),
          read: n.read,
          xp: null as null,
        }));
        if (mapped.length > 0) setNotifications(mapped as typeof NOTIFICATIONS);
      })
      .catch(() => {});
  }, []);

  const markAllRead = async () => {
    try { await markAllNotificationsRead(); } catch {}
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: number) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

  return (
    <div className="min-h-screen pt-16 pb-24 bg-[var(--background)]">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Bell size={24} />
              Notifications
            </h1>
            {unreadCount > 0 && (
              <p className="text-sm text-[var(--text-muted)] mt-0.5">
                {unreadCount} unread
              </p>
            )}
          </div>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllRead}>
              <Check size={14} /> Mark all read
            </Button>
          )}
        </div>

        <div className="space-y-2">
          {notifications.map((n, i) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
            >
              <div
                className={`relative p-4 rounded-2xl border transition-all cursor-pointer ${
                  !n.read
                    ? "bg-[var(--brand-primary)]/5 border-[var(--brand-primary)]/20"
                    : "bg-[var(--surface)] border-[var(--border)]"
                }`}
                onClick={() => markRead(n.id)}
              >
                {/* Unread dot */}
                {!n.read && (
                  <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[var(--brand-primary)]" />
                )}

                <div className="flex gap-3">
                  <div className={`w-10 h-10 rounded-xl ${n.iconBg} flex items-center justify-center shrink-0`}>
                    <n.icon size={18} className={n.iconColor} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <span className={`text-sm font-semibold ${!n.read ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"}`}>
                        {n.title}
                      </span>
                      <span className="text-xs text-[var(--text-muted)] shrink-0">{n.time}</span>
                    </div>
                    <p className="text-sm text-[var(--text-muted)] mt-0.5 leading-relaxed">{n.body}</p>
                    <div className="flex items-center gap-2 mt-2">
                      {n.xp && (
                        <Badge variant="xp" size="sm">+{n.xp} XP</Badge>
                      )}
                      {n.cta && (
                        <a
                          href={n.ctaHref}
                          className="text-xs font-semibold text-[var(--brand-primary)] hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {n.cta} →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {notifications.every((n) => n.read) && (
          <motion.div
            className="text-center py-12 text-[var(--text-muted)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Bell size={40} className="mx-auto mb-3 opacity-30" />
            <p>You're all caught up!</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
