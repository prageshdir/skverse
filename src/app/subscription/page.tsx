"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Check, Zap, Shield, Heart, Globe, Star, ArrowRight } from "lucide-react";

const FEATURES_FREE = [
  "Access to 1 community language",
  "5 lessons per month",
  "Basic audio playback",
  "Community explorer",
];

const FEATURES_PRO = [
  "All 6 community languages",
  "Unlimited lessons & XP",
  "Full audio library & recording",
  "Script writing practice",
  "AI Cultural Tutor (Karma AI)",
  "Offline learning mode",
  "Ad-free experience",
  "Contribute to the archive",
  "Priority support",
  "Cultural certificates",
];

const FAQ = [
  {
    q: "What happens after my free trial?",
    a: "After your 7-day free trial ends, you'll be charged ₹199/month. You can cancel any time before the trial ends and you won't be charged.",
  },
  {
    q: "Can I cancel my subscription?",
    a: "Yes, you can cancel any time from your profile settings. Your access continues until the end of the billing period.",
  },
  {
    q: "Does my subscription help preserve languages?",
    a: "Absolutely. A portion of every subscription directly funds language documentation, community contributor payments, and archival work.",
  },
  {
    q: "Is there a family plan?",
    a: "We're working on family and institutional plans. Join the waitlist to be notified when they launch.",
  },
];

export default function SubscriptionPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    window.location.href = "/home";
  };

  return (
    <div className="min-h-screen pt-16 pb-24 bg-[var(--background)]">
      {/* Hero */}
      <div className="relative py-16 px-4 overflow-hidden text-center">
        <div className="absolute inset-0 gradient-sikkim opacity-85" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-4 bg-white/15 text-white border-white/25">
              🌄 7-Day Free Trial
            </Badge>
            <h1 className="text-4xl font-bold text-white mb-3">
              Preserve a Language.<br />Learn for Life.
            </h1>
            <p className="text-white/70 text-lg max-w-md mx-auto">
              Your subscription directly supports indigenous language preservation and community contributors.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-12">
        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Free */}
          <motion.div
            className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="mb-4">
              <h2 className="text-xl font-bold text-[var(--text-primary)]">Free</h2>
              <p className="text-[var(--text-muted)] text-sm mt-1">Explore the basics</p>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold text-[var(--text-primary)]">₹0</span>
              <span className="text-[var(--text-muted)] ml-2">/month</span>
            </div>
            <ul className="space-y-2.5 mb-6">
              {FEATURES_FREE.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                  <Check size={15} className="text-[var(--text-muted)] shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Button variant="secondary" size="lg" className="w-full">
              Current Plan
            </Button>
          </motion.div>

          {/* Pro */}
          <motion.div
            className="relative rounded-3xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Glow */}
            <div className="absolute -inset-0.5 gradient-brand rounded-3xl opacity-70 blur-sm" />
            <div className="relative bg-[var(--surface)] rounded-3xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">Pro</h2>
                  <p className="text-[var(--text-muted)] text-sm mt-1">Full cultural immersion</p>
                </div>
                <Badge variant="accent">Most Popular</Badge>
              </div>

              <div className="mb-1">
                <span className="text-4xl font-bold text-[var(--text-primary)]">₹199</span>
                <span className="text-[var(--text-muted)] ml-2">/month</span>
              </div>
              <p className="text-xs text-[var(--text-muted)] mb-6">
                7-day free trial · Cancel anytime
              </p>

              <ul className="space-y-2.5 mb-6">
                {FEATURES_PRO.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                    <Check size={15} className="text-[var(--brand-primary)] shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Button
                size="xl"
                className="w-full"
                onClick={handleSubscribe}
                loading={loading}
              >
                {!loading && <Zap size={18} />}
                Start Free Trial
              </Button>
              <p className="text-center text-xs text-[var(--text-muted)] mt-3">
                No credit card required for trial
              </p>
            </div>
          </motion.div>
        </div>

        {/* Impact message */}
        <motion.div
          className="relative rounded-3xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="absolute inset-0 gradient-brand opacity-90" />
          <div className="relative p-8 text-center">
            <Heart size={32} className="mx-auto mb-3 text-white" />
            <h3 className="text-2xl font-bold text-white mb-2">Your Subscription Matters</h3>
            <p className="text-white/80 text-base max-w-lg mx-auto leading-relaxed">
              Every ₹199 you pay funds language documentation sessions, pays community contributors
              for audio recordings, and keeps the archive free for elders and students.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-6 text-white/70 text-sm">
              <div className="flex items-center gap-2">
                <Globe size={16} />
                <span>6 languages preserved</span>
              </div>
              <div className="flex items-center gap-2">
                <Star size={16} />
                <span>1,200+ contributors paid</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield size={16} />
                <span>Endorsed by Sikkim Govt</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* FAQ */}
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <motion.div
                key={i}
                className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] overflow-hidden"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-semibold text-sm text-[var(--text-primary)]">{item.q}</span>
                  <span className={`text-[var(--text-muted)] transition-transform ${openFaq === i ? "rotate-45" : ""}`}>
                    +
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-sm text-[var(--text-muted)] leading-relaxed border-t border-[var(--border)] pt-4">
                    {item.a}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <Button size="xl" onClick={handleSubscribe} loading={loading}>
            {!loading && <ArrowRight size={20} />}
            Start Your Free Trial
          </Button>
          <p className="text-[var(--text-muted)] text-sm mt-3">
            Already subscribed? <Link href="/home" className="text-[var(--brand-primary)] hover:underline">Go to your dashboard</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
