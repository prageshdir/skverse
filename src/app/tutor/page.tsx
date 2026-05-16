"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Send, Mic, Bot, User, Sparkles, RefreshCw, BookOpen, Volume2, PenTool } from "lucide-react";

interface Message {
  id: number;
  role: "user" | "ai";
  text: string;
  timestamp: Date;
  suggestions?: string[];
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 1,
    role: "ai",
    text: "Tashi Delek! 🙏 I'm Karma, your AI cultural guide for Bhutia language and traditions. I can help you with pronunciation, cultural context, grammar, and folklore.\n\nWhat would you like to learn today?",
    timestamp: new Date(),
    suggestions: [
      "Teach me a greeting",
      "What does 'Tashi Delek' mean?",
      "Tell me a Bhutia story",
      "Help me with pronunciation",
    ],
  },
];

const AI_RESPONSES: Record<string, { text: string; suggestions?: string[] }> = {
  greeting: {
    text: "The most sacred Bhutia greeting is **Tashi Delek** (བཀྲ་ཤིས་བདེ་ལེགས). It literally means 'may all be auspicious and good.' 🙏\n\nWhen greeting elders, slightly bow your head and bring your hands together. This shows deep respect (*la-che*) in Bhutia culture.\n\nWould you like to practice the pronunciation?",
    suggestions: ["Practice pronunciation", "More greetings", "Learn farewell words", "Cultural etiquette"],
  },
  tashi: {
    text: "**Tashi Delek** comes from Tibetan Buddhist tradition:\n\n• **Tashi** (བཀྲ་ཤིས) = auspiciousness, good fortune\n• **Delek** (བདེ་ལེགས) = well-being, goodness\n\nIt's not just 'hello' — it carries a blessing. When you say it, you're wishing the person prosperity, health, and spiritual progress. Quite beautiful, isn't it? ✨",
    suggestions: ["More Bhutia vocabulary", "Buddhist influence on language", "Practice saying it", "Other blessings"],
  },
  story: {
    text: "Here's a beloved Bhutia folk tale:\n\n🏔️ **The Legend of Kanchenjunga**\n\nIn the beginning, the great mountain Kanchenjunga was not just a peak — it was a guardian deity (*Dzö-nga*) who protected the Bhutia people. Hunters would never climb above a certain height, for the god of the mountain demanded respect.\n\nOne day, a young man climbed higher than permitted. But instead of punishment, the mountain showed him the valley of eternal spring hidden beyond the clouds...\n\nWould you like to hear the full story, or learn the Bhutia words from it?",
    suggestions: ["Tell the full story", "Learn story vocabulary", "More folk tales", "Sacred mountains"],
  },
  pronunciation: {
    text: "Let me guide you through Bhutia pronunciation! 🎙️\n\nThe language uses **retroflex consonants** that don't exist in English. Here are the key sounds:\n\n• **'dr'** — tongue curves back (like Drin Che)\n• **'kh'** — aspirated K with breath\n• **'ng'** — nasal sound at the front of words\n\nTip: Bhutia is tonal — the same word with different pitch can mean different things! Let's start with something simple.",
    suggestions: ["Practice retroflex sounds", "Tonal examples", "Common mistakes", "Full pronunciation guide"],
  },
  default: {
    text: "That's a wonderful question! Bhutia culture has deep roots in Tibetan Buddhism and the Himalayan environment. Every word carries centuries of wisdom. 🌄\n\nLet me look that up for you and give you a culturally accurate answer. What aspect interests you most — the language itself, the cultural context, or the history?",
    suggestions: ["Cultural context", "Language history", "Buddhist influence", "Daily life vocabulary"],
  },
};

function getResponse(text: string): { text: string; suggestions?: string[] } {
  const t = text.toLowerCase();
  if (t.includes("greeting") || t.includes("hello")) return AI_RESPONSES.greeting;
  if (t.includes("tashi") || t.includes("mean")) return AI_RESPONSES.tashi;
  if (t.includes("story") || t.includes("tale")) return AI_RESPONSES.story;
  if (t.includes("pronunci") || t.includes("sound")) return AI_RESPONSES.pronunciation;
  return AI_RESPONSES.default;
}

export default function TutorPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const [sessionId, setSessionId] = useState<string | null>(null);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = {
      id: messages.length + 1,
      role: "user",
      text: text.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const { createTutorSession, sendTutorMessage } = await import("@/lib/api");
      let sid = sessionId;
      if (!sid) {
        const session = await createTutorSession("bhutia", "Sikkimese");
        sid = session.id;
        setSessionId(sid);
      }
      const reply = await sendTutorMessage(sid, text.trim());
      const aiMsg: Message = {
        id: messages.length + 2,
        role: "ai",
        text: reply.content,
        timestamp: new Date(reply.created_at),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const response = getResponse(text);
      const aiMsg: Message = {
        id: messages.length + 2,
        role: "ai",
        text: response.text,
        timestamp: new Date(),
        suggestions: response.suggestions,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const formatText = (text: string) => {
    return text.split("\n").map((line, i) => {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <span key={i}>
          {parts.map((p, j) =>
            j % 2 === 1 ? <strong key={j} className="font-bold text-[var(--text-primary)]">{p}</strong> : p
          )}
          {i < text.split("\n").length - 1 && <br />}
        </span>
      );
    });
  };

  return (
    <div className="min-h-screen pt-16 flex flex-col bg-[var(--background)]">
      {/* Header */}
      <div className="border-b border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-xl px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl gradient-bhutia flex items-center justify-center text-white text-lg">
              🤖
            </div>
            <div>
              <h1 className="font-bold text-[var(--text-primary)] flex items-center gap-2">
                Karma AI
                <Badge variant="success" size="sm" className="font-normal">Online</Badge>
              </h1>
              <p className="text-xs text-[var(--text-muted)]">Bhutia Cultural & Language Guide</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="h-9 w-9 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
              <BookOpen size={16} />
            </button>
            <button className="h-9 w-9 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
              <Volume2 size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto pb-4">
        <div className="max-w-3xl mx-auto px-4 py-4 space-y-4">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-sm ${
                msg.role === "ai"
                  ? "gradient-bhutia text-white"
                  : "bg-[var(--brand-primary)] text-white"
              }`}>
                {msg.role === "ai" ? "🤖" : <User size={16} />}
              </div>

              {/* Bubble */}
              <div className={`max-w-[80%] space-y-2 ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col`}>
                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "ai"
                    ? "bg-[var(--surface)] border border-[var(--border)] text-[var(--text-secondary)] rounded-tl-sm"
                    : "bg-[var(--brand-primary)] text-white rounded-tr-sm"
                }`}>
                  {formatText(msg.text)}
                </div>

                {/* Suggestions */}
                {msg.suggestions && msg.role === "ai" && (
                  <div className="flex flex-wrap gap-2">
                    {msg.suggestions.map((s) => (
                      <button
                        key={s}
                        onClick={() => sendMessage(s)}
                        className="text-xs px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] transition-all"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}

                <span className="text-[10px] text-[var(--text-muted)]">
                  {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </motion.div>
          ))}

          {/* Typing indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                className="flex gap-3"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <div className="w-8 h-8 rounded-xl gradient-bhutia flex items-center justify-center text-sm shrink-0">🤖</div>
                <div className="px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-2xl rounded-tl-sm flex items-center gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full bg-[var(--text-muted)]"
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-xl px-4 py-3 pb-safe">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 bg-[var(--surface-raised)] border border-[var(--border)] rounded-2xl px-4 py-2.5 focus-within:border-[var(--brand-primary)] transition-colors">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about culture, language, or get help..."
                className="flex-1 bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none"
              />
            </div>
            <button className="h-11 w-11 rounded-2xl bg-[var(--surface-raised)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--brand-primary)] transition-all">
              <Mic size={18} />
            </button>
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isTyping}
              className="h-11 w-11 rounded-2xl bg-[var(--brand-primary)] flex items-center justify-center text-white disabled:opacity-40 hover:brightness-110 transition-all active:scale-95"
            >
              <Send size={18} />
            </button>
          </div>
          <p className="text-center text-[10px] text-[var(--text-muted)] mt-2">
            Karma AI · Trained on Bhutia cultural knowledge and language patterns
          </p>
        </div>
      </div>
    </div>
  );
}
