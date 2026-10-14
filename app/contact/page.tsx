import Link from 'next/link'
import { ArrowLeft, Film, Mail, MessageSquare, Clock, MapPin, Sparkles } from 'lucide-react'

export const metadata = {
  title: 'Contact Us | MyFlix Support',
  description: 'Get in touch with the MyFlix team for support, custom requests, or billing inquiries.',
}

export default function ContactPage() {
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-10">
        <div className="space-y-3 border-b border-white/10 pb-8">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-red-300">
            <MessageSquare className="size-3.5" />
            <span>Customer Care</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Contact Us
          </h1>
          <p className="text-sm text-zinc-400 max-w-xl">
            Have a question about your stream, need help setting up your memories, or have an inquiry regarding Cashfree billing? We are here to help.
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-6 rounded-2xl border border-white/10 bg-zinc-950/70 space-y-3">
            <div className="size-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary">
              <Mail className="size-5" />
            </div>
            <h2 className="text-lg font-bold text-white">Email Support</h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              For support, slug transfers, order issues, or refund inquiries, write to our dedicated support mailbox.
            </p>
            <a
              href="mailto:support@myflix.com"
              className="inline-block text-sm font-bold text-primary hover:underline pt-1"
            >
              support@myflix.com
            </a>
          </div>

          <div className="p-6 rounded-2xl border border-white/10 bg-zinc-950/70 space-y-3">
            <div className="size-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Clock className="size-5" />
            </div>
            <h2 className="text-lg font-bold text-white">Response Time</h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              We aim to respond to all inquiries within <strong className="text-zinc-200">24 to 48 hours</strong>, Monday through Saturday (IST).
            </p>
            <span className="inline-block text-xs font-semibold text-zinc-300 pt-1">
              Mon - Sat: 10:00 AM - 7:00 PM IST
            </span>
          </div>

          <div className="p-6 rounded-2xl border border-white/10 bg-zinc-950/70 space-y-3">
            <div className="size-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <MapPin className="size-5" />
            </div>
            <h2 className="text-lg font-bold text-white">Operating Location</h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              MyFlix Studio is designed and developed digitally in India, serving creators worldwide.
            </p>
            <span className="inline-block text-xs font-medium text-zinc-300 pt-1">
              India
            </span>
          </div>

          <div className="p-6 rounded-2xl border border-white/10 bg-zinc-950/70 space-y-3">
            <div className="size-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sparkles className="size-5" />
            </div>
            <h2 className="text-lg font-bold text-white">Custom Stream Requests</h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Looking for a custom wedding anniversary or milestone birthday portal with custom background scoring? Reach out anytime!
            </p>
            <a
              href="mailto:support@myflix.com?subject=Custom%20Stream%20Request"
              className="inline-block text-xs font-semibold text-emerald-400 hover:underline pt-1"
            >
              Request Custom Build &rarr;
            </a>
          </div>
        </div>

        {/* Quick Help Section */}
        <div className="p-6 rounded-2xl border border-white/10 bg-zinc-900/40 space-y-2">
          <h3 className="text-sm font-bold text-white">Already have an active stream?</h3>
          <p className="text-xs text-zinc-400">
            Remember, you can edit your photos, titles, and PIN directly by unlocking your page with your 4-digit secret passcode.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
            >
              <span>Go to MyFlix Creator Login</span>
              <ArrowLeft className="size-3 rotate-180" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
