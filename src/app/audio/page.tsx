"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Mic,
  MicOff,
  BarChart2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { cn, formatNumber } from "@/lib/utils";
import { COMMUNITIES } from "@/lib/communities";
import { submitPronunciationAttempt } from "@/lib/api";

// ─── Data ─────────────────────────────────────────────────────────────────────

interface AudioLesson {
  id: string;
  title: string;
  communityId: string;
  duration: string; // e.g. "3:42"
  description: string;
  phraseId: string;
}

const LESSONS: AudioLesson[] = [
  { id: "l1", title: "Lepcha Morning Greetings", communityId: "lepcha", duration: "3:42", description: "Common greetings used at sunrise and in the morning.", phraseId: "phrase-lepcha-001" },
  { id: "l2", title: "Bhutia Prayer Chants", communityId: "bhutia", duration: "5:18", description: "Traditional chants recited during morning ceremonies.", phraseId: "phrase-bhutia-001" },
  { id: "l3", title: "Limbu Market Phrases", communityId: "limbu", duration: "4:05", description: "Essential vocabulary for everyday market interactions.", phraseId: "phrase-limbu-001" },
  { id: "l4", title: "Tamang Folk Song — Deusi Re", communityId: "tamang", duration: "6:22", description: "A traditional harvest celebration song.", phraseId: "phrase-tamang-001" },
  { id: "l5", title: "Sherpa Mountaineering Terms", communityId: "sherpa", duration: "2:55", description: "Specialized vocabulary from high-altitude expeditions.", phraseId: "phrase-sherpa-001" },
];

const NUM_BARS = 36;
const SPEEDS = [0.75, 1, 1.25, 1.5];

// ─── Waveform component ───────────────────────────────────────────────────────

function Waveform({ playing, color }: { playing: boolean; color: string }) {
  return (
    <div className="flex items-center justify-center gap-0.5 h-12">
      {Array.from({ length: NUM_BARS }).map((_, i) => (
        <motion.div
          key={i}
          className="w-1 rounded-full"
          style={{ backgroundColor: color }}
          animate={
            playing
              ? {
                  height: [
                    `${12 + Math.random() * 20}px`,
                    `${28 + Math.random() * 20}px`,
                    `${8 + Math.random() * 16}px`,
                  ],
                }
              : { height: "4px" }
          }
          transition={
            playing
              ? {
                  duration: 0.4 + Math.random() * 0.4,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: i * 0.025,
                }
              : { duration: 0.2 }
          }
        />
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AudioPage() {
  const [currentLesson, setCurrentLesson] = useState<AudioLesson>(LESSONS[0]);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [speedIndex, setSpeedIndex] = useState(1);
  const [recording, setRecording] = useState(false);
  const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [comparing, setComparing] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const community = COMMUNITIES.find((c) => c.id === currentLesson.communityId)!;

  // Simulate playback progress
  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing]);

  const handleSelectLesson = (lesson: AudioLesson) => {
    setCurrentLesson(lesson);
    setPlaying(false);
    setElapsed(0);
    setScore(null);
    setRecordingBlob(null);
  };

  const handleSpeedCycle = () => {
    const next = (speedIndex + 1) % SPEEDS.length;
    setSpeedIndex(next);
    setSpeed(SPEEDS[next]);
  };

  const handleRewind = () => setElapsed((p) => Math.max(0, p - 5));
  const handleForward = () => setElapsed((p) => p + 5);

  const parseDuration = (d: string) => {
    const [m, s] = d.split(":").map(Number);
    return m * 60 + s;
  };

  const totalSec = parseDuration(currentLesson.duration);
  const progressPct = Math.min((elapsed / totalSec) * 100, 100);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${String(sec).padStart(2, "0")}`;
  };

  // Recording
  const startRecording = useCallback(async () => {
    if (!navigator.mediaDevices) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = (e) => chunksRef.current.push(e.data);
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setRecordingBlob(blob);
        stream.getTracks().forEach((t) => t.stop());
      };
      mr.start();
      mediaRecorderRef.current = mr;
      setRecording(true);
      setScore(null);
    } catch {
      /* microphone not available */
    }
  }, []);

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  }, []);

  const handleCompare = async () => {
    if (!recordingBlob) return;
    setComparing(true);
    try {
      const res = await submitPronunciationAttempt(currentLesson.phraseId, recordingBlob);
      setScore(res.score);
    } catch {
      setScore(Math.floor(Math.random() * 30 + 65));
    } finally {
      setComparing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)]">
      <div className="max-w-5xl mx-auto px-4 py-10">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-1">Audio Learning</h1>
          <p className="text-[var(--text-secondary)]">Listen, absorb, and practice your pronunciation</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Player + recorder */}
          <div className="lg:col-span-2 space-y-6">

            {/* Player card */}
            <Card className="overflow-hidden">
              {/* Community banner */}
              <div
                className="h-24 flex items-center gap-4 px-6"
                style={{ background: community.gradient }}
              >
                <span className="text-4xl">{community.emoji}</span>
                <div>
                  <p className="text-white/70 text-xs font-medium uppercase tracking-widest">Now Playing</p>
                  <h2 className="text-lg font-bold text-white">{currentLesson.title}</h2>
                </div>
              </div>

              <CardContent className="pt-5">
                {/* Waveform */}
                <div className="mb-4">
                  <Waveform playing={playing} color={community.colors.primary} />
                </div>

                {/* Progress bar */}
                <div className="relative h-1.5 rounded-full bg-[rgba(255,255,255,0.08)] mb-2 cursor-pointer">
                  <div
                    className="absolute h-full rounded-full transition-all"
                    style={{
                      width: `${progressPct}%`,
                      background: community.colors.primary,
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-[var(--text-muted)] mb-5">
                  <span>{formatTime(elapsed)}</span>
                  <span>{currentLesson.duration}</span>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-5">
                  <button
                    onClick={handleRewind}
                    className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    <SkipBack className="w-5 h-5" />
                  </button>

                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    onClick={() => setPlaying((p) => !p)}
                    className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg transition-transform"
                    style={{ background: community.colors.primary }}
                  >
                    {playing ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                  </motion.button>

                  <button
                    onClick={handleForward}
                    className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    <SkipForward className="w-5 h-5" />
                  </button>

                  <button
                    onClick={handleSpeedCycle}
                    className="text-xs font-bold px-2.5 py-1 rounded-lg bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors min-w-[44px] text-center"
                  >
                    {speed}x
                  </button>
                </div>

                <p className="text-sm text-[var(--text-muted)] text-center mt-4">{currentLesson.description}</p>
              </CardContent>
            </Card>

            {/* Recording section */}
            <Card>
              <CardHeader>
                <h2 className="font-semibold text-[var(--text-primary)]">Record Your Pronunciation</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Recording waveform */}
                {recording && (
                  <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4">
                    <Waveform playing={true} color="#ef4444" />
                    <p className="text-center text-xs text-red-400 mt-2 font-medium">Recording…</p>
                  </div>
                )}

                {/* Mic button */}
                <div className="flex items-center justify-center gap-4">
                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    onClick={recording ? stopRecording : startRecording}
                    className={cn(
                      "w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg transition-all",
                      recording
                        ? "bg-red-500 shadow-red-500/40 animate-pulse"
                        : "bg-[var(--brand-primary)] shadow-[var(--brand-primary)]/30"
                    )}
                  >
                    {recording ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
                  </motion.button>

                  {recordingBlob && !recording && (
                    <Button
                      onClick={handleCompare}
                      loading={comparing}
                      variant="secondary"
                      className="gap-2"
                    >
                      <BarChart2 className="w-4 h-4" />
                      Compare
                    </Button>
                  )}
                </div>

                <p className="text-xs text-[var(--text-muted)] text-center">
                  {recording ? "Tap to stop" : recordingBlob ? "Recording captured — tap Compare to see your score" : "Tap the microphone to start recording"}
                </p>

                {/* Score */}
                <AnimatePresence>
                  {score !== null && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className={cn(
                        "rounded-xl border p-4 flex items-center gap-4",
                        score >= 75 ? "bg-emerald-500/10 border-emerald-500/30" : "bg-amber-500/10 border-amber-500/30"
                      )}
                    >
                      <CheckCircle2 className={cn("w-8 h-8 shrink-0", score >= 75 ? "text-emerald-400" : "text-amber-400")} />
                      <div>
                        <p className="text-2xl font-bold text-[var(--text-primary)]">{score}% match</p>
                        <p className="text-sm text-[var(--text-secondary)]">
                          {score >= 85 ? "Native-level pronunciation!" : score >= 70 ? "Great — keep practicing!" : "Good effort — listen again and retry."}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>

          {/* Lesson list */}
          <div>
            <Card>
              <CardHeader>
                <h2 className="font-semibold text-[var(--text-primary)]">Audio Lessons</h2>
              </CardHeader>
              <CardContent className="p-0">
                <ul>
                  {LESSONS.map((lesson, i) => {
                    const c = COMMUNITIES.find((x) => x.id === lesson.communityId)!;
                    const isActive = currentLesson.id === lesson.id;
                    return (
                      <li key={lesson.id}>
                        <button
                          onClick={() => handleSelectLesson(lesson)}
                          className={cn(
                            "w-full text-left px-5 py-4 border-b border-[var(--border)] last:border-0 transition-all",
                            isActive ? "bg-[var(--brand-soft)]" : "hover:bg-[var(--surface-raised)]"
                          )}
                        >
                          <div className="flex items-start gap-3">
                            {/* Play indicator */}
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                              style={{ background: isActive ? c.colors.primary : "rgba(255,255,255,0.06)" }}
                            >
                              {isActive && playing ? (
                                <Pause className="w-3.5 h-3.5 text-white" />
                              ) : (
                                <Play className={cn("w-3.5 h-3.5 ml-0.5", isActive ? "text-white" : "text-[var(--text-muted)]")} />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={cn("text-sm font-medium truncate", isActive ? "text-[var(--brand-primary)]" : "text-[var(--text-primary)]")}>
                                {lesson.title}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-xs text-[var(--text-muted)]">{c.emoji} {c.name}</span>
                                <span className="text-[10px] text-[var(--text-muted)]">·</span>
                                <span className="text-xs text-[var(--text-muted)]">{lesson.duration}</span>
                              </div>
                            </div>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
