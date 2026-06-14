export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-zinc-100 mb-4">Terms of Service</h1>
      <p className="text-zinc-500 text-sm mb-8">Last updated: June 2026</p>
      <div className="text-sm text-zinc-400 space-y-4">
        <p>
          By using Wallflow you agree to these terms. Wallflow provides a testimonial
          collection and display service on an &ldquo;as-is&rdquo; basis.
        </p>
        <h2 className="text-base font-bold text-zinc-100 mt-6">Acceptable use</h2>
        <p>
          You may not use Wallflow to collect or display false, misleading, or defamatory
          content. You are responsible for moderating testimonials submitted to your
          workspace.
        </p>
        <h2 className="text-base font-bold text-zinc-100 mt-6">Subscriptions</h2>
        <p>
          Pro subscriptions are billed monthly via Stripe. You may cancel at any time.
          Refunds are handled on a case-by-case basis.
        </p>
        <h2 className="text-base font-bold text-zinc-100 mt-6">Limitation of liability</h2>
        <p>
          Wallflow is not liable for any indirect, incidental, or consequential damages
          arising from your use of the service.
        </p>
        <h2 className="text-base font-bold text-zinc-100 mt-6">Contact</h2>
        <p>
          Questions?{" "}
          <a href="mailto:support@wallflow.app" className="text-indigo-400 hover:text-indigo-300 transition-colors">
            support@wallflow.app
          </a>
        </p>
      </div>
    </div>
  );
}
