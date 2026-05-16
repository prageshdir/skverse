"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Mic, Bot } from "lucide-react";
import { createTutorSession, sendTutorMessage } from "@/lib/api";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  suggestions?: string[];
}

type Language = "Bhutia" | "Lepcha" | "Limbu" | "Tamang";

// ─── Local fallback responses ─────────────────────────────────────────────────

const LOCAL_RESPONSES: { trigger: string[]; response: string; suggestions?: string[] }[] = [
  {
    trigger: ["hello", "hi", "tashi", "greet"],
    response:
      "**Tashi Delek!** 🙏 That's the traditional Bhutia greeting. In Bhutia culture, this phrase means 'may you have good luck and prosperity.' It's used for all occasions — from meeting someone on the street to celebrating festivals. Would you like to learn more Bhutia greetings?",
    suggestions: ["Teach me more greetings", "Tell me about Bhutia festivals", "How do I say goodbye?"],
  },
  {
    trigger: ["festival", "losar", "celebrate"],
    response:
      "The Bhutia people celebrate **Losar** — the Tibetan New Year — as their most important festival. It usually falls in February or March. Homes are decorated, butter lamps are lit, and traditional **Cham dances** are performed at monasteries. Families gather to share **Khabzey** (fried biscuits) and **Chang** (millet beer).",
    suggestions: ["Tell me about Cham dance", "What foods are eaten at Losar?", "Other Bhutia festivals"],
  },
  {
    trigger: ["food", "eat", "dish", "cuisine", "khabzey", "chang"],
    response:
      "Bhutia cuisine is deeply influenced by Tibetan cooking. Key dishes include **Thukpa** (noodle soup), **Momos** (steamed dumplings), and **Phapar ko roti** (buckwheat bread). **Butter tea** (Suja) is a staple drink, made with tea, butter, and salt. During festivals, **Khabzey** — decorative fried bread — is prepared in elaborate shapes.",
    suggestions: ["How do I make Thukpa?", "Tell me about Bhutia tea culture", "What is Suja?"],
  },
  {
    trigger: ["monastery", "prayer", "buddhist", "religion", "temple"],
    response:
      "The Bhutia community follows **Tibetan Buddhism**. Sikkim has over 200 monasteries — the oldest being **Yuksom monastery** (1641). The famous **Pemayangtse Monastery** in West Sikkim is a major Bhutia cultural center. Prayer flags flutter everywhere, and **mani stones** inscribed with mantras line mountain trails.",
    suggestions: ["Tell me about Pemayangtse", "What are prayer flags?", "Learn a Tibetan mantra"],
  },
  {
    trigger: ["script", "write", "letter", "tibetan", "uchen"],
    response:
      "Bhutia is written in **Tibetan Uchen script** — one of the most beautiful scripts in the world. It was developed in the 7th century by Thonmi Sambhota. The script reads left to right and has 30 consonants and 4 vowel marks. Key letters include **ཀ (Ka)**, **ཁ (Kha)**, and **ག (Ga)**. Want to try writing your first character?",
    suggestions: ["Teach me to write Ka", "What is Uchen script?", "How many letters are there?"],
  },
  {
    trigger: ["music", "song", "instrument", "dance"],
    response:
      "Bhutia music is deeply ceremonial. The **Dungchen** (giant horn) and **Rolmo** (cymbals) are used in monastery rituals. Traditional folk songs called **Nyungney** accompany festivals. The **Cham dance** is a masked ritual dance performed by monks — each mask represents a deity or demon from Buddhist mythology.",
    suggestions: ["Tell me about Cham dance masks", "What songs do Bhutia people sing?", "Teach me a word for music"],
  },
];

function getLocalResponse(text: string): { content: string; suggestions?: string[] } {
  const lower = text.toLowerCase();
  for (const item of LOCAL_RESPONSES) {
    if (item.trigger.some((t) => lower.includes(t))) {
      return { content: item.response, suggestions: item.suggestions };
    }
  }
  return {
    content:
      "**Interesting question!** 🙏 The Bhutia people have a rich cultural heritage spanning over 500 years in Sikkim. They are known for their **Buddhist traditions**, **monastery architecture**, and beautiful **Tibetan script**. Feel free to ask me about their festivals, food, music, or language!",
    suggestions: ["Tell me about festivals", "Teach me a greeting", "About Bhutia script"],
  };
}

// ─── Format bold text ──────────────────────────────────────────────────────────

function formatContent(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

// ─── Typing indicator ─────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
          className="h-2 w-2 rounded-full bg-[var(--text-muted)]"
        />
      ))}
    </div>
  );
}

// ─── Initial message ──────────────────────────────────────────────────────────

const INITIAL_MESSAGE: Message = {
  id: "init",
  role: "assistant",
  content:
    "**Tashi Delek!** 🙏 I'm Karma, your AI cultural guide for the Bhutia community of Sikkim. I can teach you about our language, festivals, food, music, and traditions. What would you like to explore today?",
  suggestions: [
    "Teach me a Bhutia greeting",
    "Tell me about Losar festival",
    "What foods do Bhutia people eat?",
    "Tell me about monasteries",
  ],
};

const LANGUAGES: Language[] = ["Bhutia", "Lepcha", "Limbu", "Tamang"];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TutorPage() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("Bhutia");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  async function sendMessage(text: string) {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      let currentSessionId = sessionId;

      if (!currentSessionId) {
        const session = await createTutorSession("bhutia", "Sikkimese");
        currentSessionId = session.id;
        setSessionId(currentSessionId);
      }

      const reply = await sendTutorMessage(currentSessionId, text);
      const aiMsg: Message = {
        id: reply.id,
        role: "assistant",
        content: reply.content,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      // Fallback to local responses
      await new Promise((r) => setTimeout(r, 800 + Math.random() * 600));
      const local = getLocalResponse(text);
      const aiMsg: Message = {
        id: `a-${Date.now()}`,
        role: "assistant",
        content: local.content,
        suggestions: local.suggestions,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setIsTyping(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col bg-[var(--background)]">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-[var(--border)] bg-[var(--surface)] px-4 py-4">
        <div className="mx-auto flex max-w-3xl items-center gap-4">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="gradient-bhutia flex h-12 w-12 items-center justify-center rounded-2xl shadow-lg">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-[var(--surface)] bg-emerald-400" />
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-[var(--text-primary)]">Karma AI</h1>
              <Badge variant="success" size="sm">Online</Badge>
            </div>
            <p className="text-xs text-[var(--text-muted)]">Bhutia Cultural Guide</p>
          </div>

          {/* Language selector */}
          <div className="hidden gap-1.5 sm:flex">
            {LANGUAGES.map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={cn(
                  "rounded-lg px-3 py-1 text-xs font-medium transition-all",
                  selectedLanguage === lang
                    ? `gradient-${lang.toLowerCase()} text-white shadow-sm`
                    : "border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--brand-primary)]/40"
                )}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide"
      >
        <div className="mx-auto max-w-3xl space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={cn(
                  "flex",
                  msg.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "flex flex-col gap-2",
                    msg.role === "user" ? "items-end" : "items-start"
                  )}
                >
                  {/* Avatar for AI */}
                  {msg.role === "assistant" && (
                    <div className="flex items-end gap-2">
                      <div className="gradient-bhutia flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-xl">
                        <Bot className="h-3.5 w-3.5 text-white" />
                      </div>
                      <div
                        className={cn(
                          "max-w-sm rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed",
                          "bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)]",
                          "shadow-sm"
                        )}
                      >
                        {formatContent(msg.content)}
                      </div>
                    </div>
                  )}

                  {/* User bubble */}
                  {msg.role === "user" && (
                    <div
                      className={cn(
                        "max-w-sm rounded-2xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed",
                        "bg-[var(--brand-primary)] text-white shadow-sm"
                      )}
                    >
                      {msg.content}
                    </div>
                  )}

                  {/* Suggestions */}
                  {msg.role === "assistant" && msg.suggestions && (
                    <div className="ml-9 flex flex-wrap gap-1.5">
                      {msg.suggestions.map((s) => (
                        <button
                          key={s}
                          onClick={() => sendMessage(s)}
                          className={cn(
                            "rounded-full border border-[var(--border)] bg-[var(--surface)]",
                            "px-3 py-1 text-xs text-[var(--text-secondary)]",
                            "hover:border-[var(--brand-primary)]/50 hover:text-[var(--text-primary)]",
                            "transition-all"
                          )}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-end gap-2"
            >
              <div className="gradient-bhutia flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-xl">
                <Bot className="h-3.5 w-3.5 text-white" />
              </div>
              <div className="rounded-2xl rounded-tl-sm border border-[var(--border)] bg-[var(--surface)] shadow-sm">
                <TypingIndicator />
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Input bar */}
      <div className="flex-shrink-0 border-t border-[var(--border)] bg-[var(--surface)] px-4 py-3">
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-3xl items-center gap-2"
        >
          <button
            type="button"
            className={cn(
              "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl",
              "border border-[var(--border)] text-[var(--text-muted)]",
              "hover:border-[var(--brand-primary)]/40 hover:text-[var(--text-primary)]",
              "transition-colors"
            )}
          >
            <Mic className="h-4 w-4" />
          </button>

          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about Bhutia culture, language, or traditions..."
            disabled={isTyping}
            className={cn(
              "flex-1 rounded-xl border border-[var(--border)] bg-[var(--background)]",
              "px-4 py-2.5 text-sm text-[var(--text-primary)]",
              "placeholder:text-[var(--text-muted)] focus:outline-none",
              "focus:ring-2 focus:ring-[var(--brand-primary)]/40",
              "disabled:opacity-50"
            )}
          />

          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className={cn(
              "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl",
              "bg-[var(--brand-primary)] text-white shadow-sm",
              "hover:brightness-110 active:scale-[0.97]",
              "disabled:opacity-50 disabled:pointer-events-none",
              "transition-all"
            )}
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
