import Link from 'next/link'
import { ArrowLeft, Film, ShieldCheck } from 'lucide-react'

export const metadata = {
  title: 'Terms of Service | MyFlix',
  description: 'Terms and Conditions for using MyFlix personalized streaming portals.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-zinc-200 selection:bg-primary selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="size-8 rounded-xl bg-gradient-to-tr from-primary to-red-500 flex items-center justify-center text-white shadow-md shadow-primary/30">
              <Film className="size-4" />
            </div>
            <span className="text-lg font-black tracking-wider uppercase text-white">
              My<span className="text-primary">Flix</span>
            </span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-8">
        <div className="space-y-3 border-b border-white/10 pb-8">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-red-300">
            <ShieldCheck className="size-3.5" />
            <span>Legal Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Terms of Service
          </h1>
          <p className="text-sm text-zinc-400">
            Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>

        <section className="space-y-4 text-sm sm:text-base leading-relaxed text-zinc-300">
          <h2 className="text-xl font-bold text-white">1. Acceptance of Terms</h2>
          <p>
            By accessing or using MyFlix (the &quot;Platform&quot;), creating a personalized stream, or completing a payment through our payment partners (including Cashfree Payments), you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use the Platform.
          </p>
        </section>

        <section className="space-y-4 text-sm sm:text-base leading-relaxed text-zinc-300">
          <h2 className="text-xl font-bold text-white">2. Nature of the Service</h2>
          <p>
            MyFlix provides digital software services enabling users to build, host, and share personalized multimedia gift streaming pages (the &quot;Stream&quot;). Each stream includes custom titles, photos, videos, music placeholders, and an optional 4-digit passcode editor studio.
          </p>
        </section>

        <section className="space-y-4 text-sm sm:text-base leading-relaxed text-zinc-300">
          <h2 className="text-xl font-bold text-white">3. User Content & Conduct</h2>
          <p>
            You retain ownership of any media, photos, audio, or text that you upload to your Stream. You represent and warrant that:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-zinc-400">
            <li>You have all necessary rights, permissions, and consent to display the uploaded media.</li>
            <li>Content does not violate any third-party copyrights, trademarks, or privacy rights.</li>
            <li>Content is not defamatory, obscene, pornographic, harassing, or otherwise unlawful.</li>
          </ul>
          <p>
            We reserve the right to remove any Stream or terminate access if content is determined to violate applicable laws or these terms.
          </p>
        </section>

        <section className="space-y-4 text-sm sm:text-base leading-relaxed text-zinc-300">
          <h2 className="text-xl font-bold text-white">4. Pricing, Payments & Access</h2>
          <p>
            MyFlix plans (Mini Reel, Premier Blockbuster, and VIP Box Set) are billed as one-time fees through secure payment aggregators (Cashfree). Access to your unique stream link and editor studio is activated immediately upon successful payment confirmation.
          </p>
        </section>

        <section className="space-y-4 text-sm sm:text-base leading-relaxed text-zinc-300">
          <h2 className="text-xl font-bold text-white">5. Account & Passcode Security</h2>
          <p>
            You are solely responsible for keeping your 4-digit creator passcode confidential. Anyone with access to your passcode may modify titles, photos, or settings on your stream page.
          </p>
        </section>

        <section className="space-y-4 text-sm sm:text-base leading-relaxed text-zinc-300">
          <h2 className="text-xl font-bold text-white">6. Limitation of Liability</h2>
          <p>
            The Platform is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind. Under no circumstances shall MyFlix or its operators be liable for indirect, incidental, or consequential damages resulting from your use of the service.
          </p>
        </section>

        <section className="space-y-4 text-sm sm:text-base leading-relaxed text-zinc-300 border-t border-white/10 pt-8">
          <h2 className="text-xl font-bold text-white">7. Contact Information</h2>
          <p>
            If you have questions regarding these Terms, please reach out to our team at{' '}
            <Link href="/contact" className="text-primary hover:underline font-medium">
              support@myflix.com
            </Link>.
          </p>
        </section>
      </main>
    </div>
  )
}
