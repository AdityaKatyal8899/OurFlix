import Link from 'next/link'
import { ArrowLeft, Film, Lock } from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy | MyFlix',
  description: 'Privacy Policy outlining data protection, storage, and customer rights on MyFlix.',
}

export default function PrivacyPage() {
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
            <Lock className="size-3.5" />
            <span>Privacy & Security</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Privacy Policy
          </h1>
          <p className="text-sm text-zinc-400">
            Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>

        <section className="space-y-4 text-sm sm:text-base leading-relaxed text-zinc-300">
          <h2 className="text-xl font-bold text-white">1. Information We Collect</h2>
          <p>
            When you create a memory stream on MyFlix, we collect the necessary information to provide and deliver your custom stream:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-zinc-400">
            <li><strong className="text-zinc-200">Account Details:</strong> Your custom slug, stream title, profile names, and 4-digit creator passcode.</li>
            <li><strong className="text-zinc-200">Uploaded Media:</strong> Images, photo stills, video links, or audio files you choose to upload to your personal stream. Media is securely stored in cloud storage (AWS S3).</li>
            <li><strong className="text-zinc-200">Payment & Transaction Data:</strong> When paying via Cashfree Payments, your payment processing is handled directly by Cashfree under PCI-DSS certified protocols. MyFlix does not store credit card, debit card, or UPI PIN numbers.</li>
          </ul>
        </section>

        <section className="space-y-4 text-sm sm:text-base leading-relaxed text-zinc-300">
          <h2 className="text-xl font-bold text-white">2. How We Use Your Information</h2>
          <p>We use your information exclusively for the following purposes:</p>
          <ul className="list-disc pl-6 space-y-2 text-zinc-400">
            <li>To render and serve your personalized streaming memory page.</li>
            <li>To verify passcode access and creator permissions.</li>
            <li>To process your one-time payment and provide automated transaction receipt and status notifications.</li>
            <li>To prevent fraud, abuse, and maintain platform security.</li>
          </ul>
        </section>

        <section className="space-y-4 text-sm sm:text-base leading-relaxed text-zinc-300">
          <h2 className="text-xl font-bold text-white">3. Information Sharing & Third Parties</h2>
          <p>
            We do not sell, rent, or trade your personal data or uploaded memories to advertisers or third-party brokers. We only share information with trusted infrastructure providers required to operate the service:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-zinc-400">
            <li><strong className="text-zinc-200">Payment Gateway:</strong> Cashfree Payments (for processing UPI, Cards, and Net Banking).</li>
            <li><strong className="text-zinc-200">Hosting & Storage:</strong> Cloud database (MongoDB Atlas) and media hosting (Amazon Web Services S3).</li>
          </ul>
        </section>

        <section className="space-y-4 text-sm sm:text-base leading-relaxed text-zinc-300">
          <h2 className="text-xl font-bold text-white">4. Data Retention & Deletion</h2>
          <p>
            Your stream remains active as long as you wish. You can edit or delete individual photos, rows, or memory items at any time through your in-place Creator Studio. If you wish to completely wipe your stream and associated media, you can contact us at any time.
          </p>
        </section>

        <section className="space-y-4 text-sm sm:text-base leading-relaxed text-zinc-300 border-t border-white/10 pt-8">
          <h2 className="text-xl font-bold text-white">5. Contact Our Privacy Team</h2>
          <p>
            If you have questions about our privacy practices or wish to request data removal, please reach out to{' '}
            <Link href="/contact" className="text-primary hover:underline font-medium">
              support@myflix.com
            </Link>.
          </p>
        </section>
      </main>
    </div>
  )
}
