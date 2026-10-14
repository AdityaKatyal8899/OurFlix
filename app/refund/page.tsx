import Link from 'next/link'
import { ArrowLeft, Film, RefreshCcw } from 'lucide-react'

export const metadata = {
  title: 'Refund & Cancellation Policy | MyFlix',
  description: 'Refund, return, and cancellation terms for MyFlix personalized streaming portals.',
}

export default function RefundPage() {
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
            <RefreshCcw className="size-3.5" />
            <span>Customer Satisfaction</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Refund & Cancellation Policy
          </h1>
          <p className="text-sm text-zinc-400">
            Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>

        <section className="space-y-4 text-sm sm:text-base leading-relaxed text-zinc-300">
          <h2 className="text-xl font-bold text-white">1. Instant Digital Delivery</h2>
          <p>
            MyFlix provides digital software services and personalized web hosting. Upon completing payment via Cashfree, your custom URL slug and Creator Studio are provisioned and activated <strong className="text-white">instantly in real time</strong>.
          </p>
        </section>

        <section className="space-y-4 text-sm sm:text-base leading-relaxed text-zinc-300">
          <h2 className="text-xl font-bold text-white">2. Cancellation Policy</h2>
          <p>
            Since all MyFlix plans are <strong className="text-white">one-time flat payments</strong> (not monthly recurring subscriptions), there are no recurring billing cycles to cancel. You will never be billed automatically after your purchase.
          </p>
        </section>

        <section className="space-y-4 text-sm sm:text-base leading-relaxed text-zinc-300">
          <h2 className="text-xl font-bold text-white">3. Refund Eligibility</h2>
          <p>
            We take pride in delivering a delightful and memorable experience. You are entitled to a full refund under the following conditions:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-zinc-400">
            <li><strong className="text-zinc-200">Technical Delivery Failure:</strong> If payment was debited from your bank or UPI account but your stream was not unlocked or created due to a system error.</li>
            <li><strong className="text-zinc-200">Duplicate Charge:</strong> If you were accidentally charged more than once for the same custom slug.</li>
            <li><strong className="text-zinc-200">Defect Resolution:</strong> If you experience persistent technical defects on our platform that prevent you from editing or viewing your stream, and our support team is unable to resolve it within 48 hours.</li>
          </ul>
        </section>

        <section className="space-y-4 text-sm sm:text-base leading-relaxed text-zinc-300">
          <h2 className="text-xl font-bold text-white">4. Refund Request Process</h2>
          <p>
            To request a refund, please send an email to <strong className="text-white">support@myflix.com</strong> within <strong className="text-white">7 days</strong> of your transaction date with:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-zinc-400">
            <li>Your custom stream slug (e.g., <code className="text-red-300">myflix.domain/your-name</code>)</li>
            <li>Your Cashfree Order ID or transaction reference from your payment confirmation SMS / UPI receipt</li>
            <li>A brief description of the issue encountered</li>
          </ul>
        </section>

        <section className="space-y-4 text-sm sm:text-base leading-relaxed text-zinc-300">
          <h2 className="text-xl font-bold text-white">5. Refund Processing Timeline</h2>
          <p>
            Once approved, refunds are processed directly back to your original payment method (Bank Account, UPI, or Credit/Debit Card) via Cashfree within <strong className="text-white">5 to 7 business days</strong>, in accordance with standard Indian banking settlement cycles.
          </p>
        </section>

        <section className="space-y-4 text-sm sm:text-base leading-relaxed text-zinc-300 border-t border-white/10 pt-8">
          <h2 className="text-xl font-bold text-white">6. Contact Support</h2>
          <p>
            For any billing questions or assistance, please reach out to{' '}
            <Link href="/contact" className="text-primary hover:underline font-medium">
              support@myflix.com
            </Link>.
          </p>
        </section>
      </main>
    </div>
  )
}
