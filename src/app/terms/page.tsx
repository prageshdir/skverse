import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-24">
      <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-6">Terms of Service</h1>
      <div className="prose prose-sm text-[var(--text-secondary)] space-y-4">
        <p>
          Welcome to SikkimVerse. By using this platform, you agree to these terms. SikkimVerse is a
          cultural learning platform dedicated to preserving and celebrating the languages and heritage
          of Sikkim&apos;s communities.
        </p>
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mt-6">Use of the Platform</h2>
        <p>
          You agree to use SikkimVerse only for lawful purposes and in a manner that respects our
          communities and their cultural heritage. Content contributions must be authentic and
          respectful.
        </p>
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mt-6">Content</h2>
        <p>
          All cultural content on SikkimVerse belongs to the respective communities. Contributors
          grant SikkimVerse a non-exclusive license to display their contributions on the platform.
        </p>
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mt-6">Contact</h2>
        <p>For questions, reach us at support@sikkimverse.com</p>
      </div>
      <Link href="/" className="mt-8 inline-block text-sm text-[var(--brand-primary)] hover:underline">
        ← Back to home
      </Link>
    </main>
  );
}
