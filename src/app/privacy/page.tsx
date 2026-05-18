import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-24">
      <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-6">Privacy Policy</h1>
      <div className="prose prose-sm text-[var(--text-secondary)] space-y-4">
        <p>
          SikkimVerse respects your privacy. This policy explains what data we collect and how we
          use it to power your learning journey.
        </p>
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mt-6">Data We Collect</h2>
        <p>
          We collect your name, email address, and learning activity (XP, streaks, progress) to
          personalise your experience and preserve community language data.
        </p>
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mt-6">How We Use Data</h2>
        <p>
          Your data is used to provide the platform&apos;s features, improve the learning experience,
          and support community administrators. We do not sell your personal data.
        </p>
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mt-6">Data Storage</h2>
        <p>
          Data is stored securely using Supabase (PostgreSQL) with row-level security. You can
          request deletion of your account at any time by contacting support.
        </p>
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mt-6">Contact</h2>
        <p>For privacy concerns, email us at privacy@sikkimverse.com</p>
      </div>
      <Link href="/" className="mt-8 inline-block text-sm text-[var(--brand-primary)] hover:underline">
        ← Back to home
      </Link>
    </main>
  );
}
