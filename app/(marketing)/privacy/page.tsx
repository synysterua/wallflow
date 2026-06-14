export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-zinc-100 mb-4">Privacy Policy</h1>
      <p className="text-zinc-500 text-sm mb-8">Last updated: June 2026</p>
      <div className="text-sm text-zinc-400 space-y-4">
        <p>
          Wallflow (&ldquo;we&rdquo;, &ldquo;us&rdquo;) operates the Wallflow testimonial
          platform. This page informs you of our policies regarding the collection, use,
          and disclosure of personal data.
        </p>
        <h2 className="text-base font-bold text-zinc-100 mt-6">Data we collect</h2>
        <p>
          We collect your email address when you register. For each workspace, we store
          testimonial content submitted by your customers, including names, titles, and
          ratings.
        </p>
        <h2 className="text-base font-bold text-zinc-100 mt-6">How we use data</h2>
        <p>
          Data is used solely to provide the Wallflow service. Testimonial content may be
          analyzed by Gemini AI (Google) for quality scoring purposes.
        </p>
        <h2 className="text-base font-bold text-zinc-100 mt-6">Contact</h2>
        <p>
          Questions? Email{" "}
          <a href="mailto:support@wallflow.app" className="text-indigo-400 hover:text-indigo-300 transition-colors">
            support@wallflow.app
          </a>
          .
        </p>
      </div>
    </div>
  );
}
