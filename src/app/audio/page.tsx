"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import {
  Play, Pause, SkipForward, SkipBack, Mic, MicOff,
  Volume2, ChevronRight, CheckCircle2, RefreshCw, Zap
} from "lucide-react";

const AUDIO_LESSONS = [
  {
    id: 1,
    title: "Greetings",
    nativeText: "Tashi Delek",
    meaning: "Hello / Good luck / Auspicious greetings",
    phonetic: "ta-shi de-lek",
    community: "Bhutia",
    difficulty: "Beginner",
    done: false,
  },
  {
    id: 2,
    title: "Thank You",
    nativeText: "Drin Che",
    meaning: "Thank you (deeply)",
    phonetic: "drin che",
    community: "Bhutia",
    difficulty: "Beginner",
    done: false,
  },
  {
    id: 3,
    title: "Mountain",
    nativeText: "Kang-chen",
    meaning: "Great snow mountain",
    phonetic: "kang-chen",
    community: "Bhutia",
    difficulty: "Beginner",
    done: true,
  },
  {
    id: 4,
    title: "Forest",
    nativeText: "Nong-rong",
    meaning: "Deep forest, sacred grove",
    phonetic: "nong-rong",
    community: "Lepcha",
    difficulty: "Intermediate",
    done: false,
  },
  {
    id: 5,
    title: "River",
    nativeText: "Teesta",
    meaning: "The life-giving river",
    phonetic: "tees-ta",
    community: "Lepcha",
    difficulty: "Beginner",
    done: true,
  },
];

const WAVEFORM_BARS = 48;

function Waveform({ playing, color = "#c4401a" }: { playing: boolean; color?: string }) {
  return (
    <div className="flex items-center gap-0.5 h-12">
      {[...Array(WAVEFORM_BARS)].map((_, i) => {
        const h = 20 + Math.sin(i * 0.4) * 15 + Math.cos(i * 0.7) * 10;
        return (
          <motion.div
            key={i}
            className="rounded-full flex-shrink-0"
            style={{ width: 3, backgroundColor: color, opacity: playing ? 1 : 0.3 }}
            animate={playing ? { scaleY: [h / 40, (h + 10) / 40, h / 40] } : { scaleY: h / 40 }}
            transition={{ duration: 0.4 + i * 0.01, repeat: playing ? Infinity : 0, delay: i * 0.02 }}
          />
        );
      })}
    </div>
  );
}

export default function AudioPage() {
  const [activeLesson, setActiveLesson] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordingDone, setRecordingDone] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);

  const lesson = AUDIO_LESSONS[activeLesson];

  // Simulate playback progress
  useEffect(() => {
    if (!playing) return;
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { setPlaying(false); return 100; }
        return p + 2;
      });
    }, 80);
    return () => clearInterval(interval);
  }, [playing]);

  const handlePlay = () => {
    if (playing) { setPlaying(false); return; }
    setProgress(0);
    setPlaying(true);
  };

  const handleRecord = () => {
    if (recording) {
      setRecording(false);
      setRecordingDone(true);
      setTimeout(() => {
        const s = Math.floor(72 + Math.random() * 28);
        setScore(s);
      }, 800);
    } else {
      setRecordingDone(false);
      setScore(null);
      setRecording(true);
    }
  };

  const next = () => {
    setActiveLesson((i) => Math.min(i + 1, AUDIO_LESSONS.length - 1));
    setPlaying(false);
    setRecording(false);
    setRecordingDone(false);
    setScore(null);
    setProgress(0);
  };

  return (
    <div className="min-h-screen pt-16 pb-24 bg-[var(--background)]">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Volume2 size={24} className="text-emerald-500" />
            Audio Lessons
          </h1>
          <p className="text-[var(--text-muted)] text-sm mt-0.5">Listen, repeat, and master pronunciation</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Lesson list */}
          <div className="lg:col-span-2 space-y-2">
            {AUDIO_LESSONS.map((l, i) => (
              <button
                key={l.id}
                onClick={() => {
                  setActiveLesson(i);
                  setPlaying(false);
                  setRecording(false);
                  setRecordingDone(false);
                  setScore(null);
                  setProgress(0);
                }}
                className={`w-full flex items-center gap-3 p-4 rounded-2xl border text-left transition-all ${
                  i === activeLesson
                    ? "border-emerald-500/50 bg-emerald-500/5"
                    : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--text-muted)]"
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  l.done ? "bg-green-500/15" : i === activeLesson ? "bg-emerald-500/15" : "bg-[var(--surface-raised)]"
                }`}>
                  {l.done
                    ? <CheckCircle2 size={18} className="text-green-400" />
                    : <Volume2 size={18} className={i === activeLesson ? "text-emerald-400" : "text-[var(--text-muted)]"} />
                  }
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-[var(--text-primary)] truncate">{l.nativeText}</div>
                  <div className="text-xs text-[var(--text-muted)] truncate">{l.title} · {l.community}</div>
                </div>
                <Badge size="sm" className="shrink-0">{l.difficulty}</Badge>
              </button>
            ))}
          </div>

          {/* Player */}
          <div className="lg:col-span-3 space-y-4">
            {/* Main card */}
            <div className="bg-[var(--surface)] rounded-3xl border border-[var(--border)] overflow-hidden">
              {/* Visual header */}
              <div className="relative h-40 bg-gradient-to-br from-emerald-900 via-teal-800 to-emerald-700 flex items-center justify-center">
                <div className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: "repeating-linear-gradient(45deg, rgba(255,255,255,0.1) 0, rgba(255,255,255,0.1) 1px, transparent 0, transparent 50%)",
                    backgroundSize: "16px 16px",
                  }}
                />
                <div className="relative text-center">
                  <div className="text-5xl font-bold text-white/90 mb-1">{lesson.nativeText}</div>
                  <div className="text-emerald-300 text-sm">/{lesson.phonetic}/</div>
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-[var(--text-primary)]">{lesson.title}</h2>
                    <p className="text-sm text-[var(--text-muted)]">{lesson.meaning}</p>
                  </div>
                  <Badge variant="success">{lesson.community}</Badge>
                </div>

                {/* Waveform */}
                <div className="mb-4 px-2">
                  <Waveform playing={playing} color="#10b981" />
                  <Progress value={progress} size="sm" color="success" className="mt-2" animated={false} />
                </div>

                {/* Playback controls */}
                <div className="flex items-center justify-center gap-4 mb-4">
                  <button
                    onClick={() => setActiveLesson(Math.max(0, activeLesson - 1))}
                    className="w-10 h-10 rounded-full bg-[var(--surface-raised)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    <SkipBack size={18} />
                  </button>
                  <button
                    onClick={handlePlay}
                    className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-400 flex items-center justify-center text-white shadow-lg transition-all active:scale-95"
                  >
                    {playing ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
                  </button>
                  <button
                    onClick={next}
                    className="w-10 h-10 rounded-full bg-[var(--surface-raised)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    <SkipForward size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Pronunciation Practice */}
            <div className="bg-[var(--surface)] rounded-3xl border border-[var(--border)] p-5">
              <h3 className="font-bold text-[var(--text-primary)] mb-1">Your Turn</h3>
              <p className="text-sm text-[var(--text-muted)] mb-4">
                Press record, say <strong className="text-[var(--text-primary)]">"{lesson.nativeText}"</strong>, then compare
              </p>

              {/* User waveform */}
              <div className="mb-4">
                <Waveform playing={recording} color={recording ? "#ef4444" : "#6b7280"} />
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleRecord}
                  className={`flex-1 h-12 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                    recording
                      ? "bg-red-500 text-white animate-pulse"
                      : "bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--text-primary)] hover:border-red-400"
                  }`}
                >
                  {recording ? <MicOff size={18} /> : <Mic size={18} />}
                  {recording ? "Stop Recording" : "Record My Voice"}
                </button>
                {recordingDone && (
                  <button
                    onClick={() => { setRecordingDone(false); setScore(null); }}
                    className="h-12 w-12 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    <RefreshCw size={16} />
                  </button>
                )}
              </div>

              {/* Score */}
              <AnimatePresence>
                {score !== null && (
                  <motion.div
                    className={`mt-4 p-4 rounded-2xl ${score >= 80 ? "bg-green-500/10 border border-green-500/20" : "bg-amber-500/10 border border-amber-500/20"}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className={`font-bold ${score >= 80 ? "text-green-500" : "text-amber-500"}`}>
                          {score >= 80 ? "🎙️ Great pronunciation!" : "🎙️ Keep practising!"}
                        </div>
                        <div className="text-sm text-[var(--text-muted)] mt-0.5">Match score: {score}%</div>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Zap size={16} />+{score >= 80 ? 20 : 10} XP
                      </div>
                    </div>
                    <Progress value={score} className="mt-3" size="sm" color={score >= 80 ? "success" : "accent"} animated={false} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Next lesson */}
            {activeLesson < AUDIO_LESSONS.length - 1 && (
              <Button onClick={next} size="lg" className="w-full">
                Next Lesson
                <ChevronRight size={18} />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
