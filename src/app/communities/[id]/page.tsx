"use client";

import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { getCommunity, COMMUNITIES } from "@/lib/communities";
import { formatNumber } from "@/lib/utils";
import { BookOpen, Mic, PenTool, Bot, Users, Star, ArrowRight, Play, Heart } from "lucide-react";
import { notFound } from "next/navigation";

const LEARNING_PATHS = [
  { icon: BookOpen, title: "Language Basics", desc: "Greetings, numbers, daily phrases", lessons: 12, locked: false },
  { icon: PenTool, title: "Script & Writing", desc: "Learn the indigenous script stroke by stroke", lessons: 10, locked: false },
  { icon: Mic, title: "Pronunciation & Audio", desc: "Native speaker recordings & comparison", lessons: 8, locked: true },
  { icon: Bot, title: "AI Cultural Tutor", desc: "Conversation practice with cultural context", lessons: 6, locked: true },
];

export default function CommunityDetailPage() {
  const params = useParams();
  const community = getCommunity(params.id as string);

  if (!community) return notFound();

  return (
    <div
      className="min-h-screen pb-24"
      style={{ background: community.colors.bg }}
      data-community={community.id}
    >
      {/* Hero */}
      <div className="relative pt-16 overflow-hidden">
        <div
          className="absolute inset-0 opacity-60"
          style={{ background: community.gradient }}
        />
        {/* Pattern */}
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, ${community.colors.accent} 0, ${community.colors.accent} 1px, transparent 0, transparent 50%)`,
            backgroundSize: "24px 24px",
          }}
        />
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full">
            <path d="M0,80 C360,0 1080,80 1440,0 L1440,80 Z" fill={community.colors.bg} />
          </svg>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 pt-10 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-6xl mb-4">{community.emoji}</div>
            <h1 className="text-5xl font-bold text-white mb-2">{community.name}</h1>
            <p className="text-3xl font-medium mb-3" style={{ color: community.colors.accent }}>
              {community.nativeName}
            </p>
            <p className="text-white/70 text-lg italic mb-4">{community.tagline}</p>
            <p className="text-white/60 max-w-xl leading-relaxed mb-6">{community.description}</p>

            <div className="flex flex-wrap gap-3">
              <Link href={`/learn/${community.id}`}>
                <Button variant="accent" size="lg">
                  <Play size={18} />
                  Start Learning
                </Button>
              </Link>
              <Button variant="glass" size="lg">
                <Heart size={16} />
                Follow Community
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-4xl mx-auto px-4 -mt-4 mb-8">
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-3xl border"
          style={{
            background: community.colors.surface,
            borderColor: `${community.colors.accent}30`,
          }}
        >
          {[
            { label: "Native Speakers", value: formatNumber(community.speakers) },
            { label: "Active Learners", value: formatNumber(community.learners) },
            { label: "Lessons", value: community.lessons.toString() },
            { label: "Contributors", value: community.contributors.toString() },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-bold text-white">{value}</div>
              <div className="text-white/50 text-xs mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Learning Paths */}
      <div className="max-w-4xl mx-auto px-4 mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Learning Paths</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {LEARNING_PATHS.map((path, i) => (
            <motion.div
              key={path.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <div
                className={`relative p-5 rounded-2xl border transition-all duration-300 ${
                  path.locked
                    ? "opacity-60"
                    : "hover:border-opacity-60 cursor-pointer hover:-translate-y-0.5 hover:shadow-lg"
                }`}
                style={{
                  background: community.colors.surface,
                  borderColor: `${community.colors.accent}25`,
                }}
              >
                {path.locked && (
                  <div className="absolute top-3 right-3 text-white/40">🔒</div>
                )}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: `${community.colors.accent}20` }}
                >
                  <path.icon size={20} style={{ color: community.colors.accent }} />
                </div>
                <h3 className="font-bold text-white mb-1">{path.title}</h3>
                <p className="text-white/50 text-sm mb-3">{path.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/40">{path.lessons} lessons</span>
                  {!path.locked && (
                    <ArrowRight size={14} style={{ color: community.colors.accent }} />
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Cultural Heritage */}
      <div className="max-w-4xl mx-auto px-4 mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Cultural Heritage</h2>
        <div
          className="p-6 rounded-3xl border"
          style={{
            background: community.colors.surface,
            borderColor: `${community.colors.accent}25`,
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "Sacred Symbol", value: community.cultural.symbol },
              { label: "Traditional Pattern", value: community.cultural.pattern },
              { label: "Visual Element", value: community.cultural.element },
            ].map(({ label, value }) => (
              <div key={label}>
                <div
                  className="text-xs font-bold uppercase tracking-widest mb-2"
                  style={{ color: community.colors.accent }}
                >
                  {label}
                </div>
                <div className="text-white/80 text-sm">{value}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t" style={{ borderColor: `${community.colors.accent}20` }}>
            <div className="flex flex-wrap gap-2">
              {community.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1 rounded-full border"
                  style={{
                    color: community.colors.accent,
                    borderColor: `${community.colors.accent}40`,
                    background: `${community.colors.accent}10`,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Preservation Progress */}
      <div className="max-w-4xl mx-auto px-4">
        <div
          className="p-6 rounded-3xl border"
          style={{
            background: community.colors.surface,
            borderColor: `${community.colors.accent}25`,
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-white">Language Preservation Progress</h3>
            <span className="text-lg font-bold" style={{ color: community.colors.accent }}>
              {community.preservationLevel}%
            </span>
          </div>
          <Progress
            value={community.preservationLevel}
            size="lg"
            barClassName="bg-gradient-to-r from-white/40 to-white/80"
            trackClassName="bg-white/10"
          />
          <p className="text-white/40 text-xs mt-3">
            Together we can reach 100%. Every lesson you complete contributes to preservation.
          </p>
        </div>
      </div>
    </div>
  );
}
