import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  Film,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Edit3,
  Calendar,
  Layers,
  ShieldCheck,
  Plus,
  LogOut,
  Clock,
  Tv,
} from 'lucide-react'
import { getSessionUser } from '@/lib/auth'
import { getSitesByUser } from '@/lib/site-service'
import {
  ProfileClientActions,
  ProfileShareHeader,
  WatchStreamHeaderButton,
} from './profile-client-actions'

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const user = await getSessionUser()

  // Protect route: require login to view profile
  if (!user) {
    redirect('/login?redirect=/profile')
  }

  // Fetch streams associated with this user
  const userSites = await getSitesByUser(user.email, user.googleId)

  return (
    <div className="min-h-screen w-full bg-[#141414] text-white selection:bg-primary selection:text-white font-sans relative overflow-x-hidden pb-20">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden transform-gpu">
        <div
          className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] sm:w-[900px] h-[500px] rounded-full opacity-50 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(229, 9, 20, 0.22) 0%, rgba(229, 9, 20, 0.06) 50%, transparent 72%)',
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
      </div>

      {/* Top Header */}
      <header className="relative z-20 sticky top-0 border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="size-8 rounded-xl bg-gradient-to-tr from-primary to-red-600 flex items-center justify-center text-white shadow-md shadow-primary/30 group-hover:scale-105 transition-transform">
              <Film className="size-4" />
            </div>
            <span className="text-lg font-black tracking-wider uppercase bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
              My<span className="text-primary">Flix</span>
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <WatchStreamHeaderButton />

            <Link
              href="/#plans"
              className="text-xs sm:text-sm font-medium text-zinc-300 hover:text-white transition-colors hidden md:block"
            >
              Explore Plans
            </Link>

            <Link
              href="/#create"
              className="flex items-center gap-1 text-xs sm:text-sm font-bold bg-primary hover:bg-primary/90 text-white px-3 py-1.5 rounded-xl shadow-md shadow-primary/25 transition-all"
            >
              <Plus className="size-3.5" />
              <span>New Stream</span>
            </Link>

            <a
              href="/api/auth/logout"
              id="profile-logout-btn"
              className="flex items-center gap-1 text-xs sm:text-sm font-medium text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-2.5 py-1.5 rounded-xl transition-all"
            >
              <LogOut className="size-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Profile Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 space-y-8">
        {/* User Profile Card */}
        <div className="rounded-3xl border border-white/15 bg-zinc-950/70 p-6 sm:p-8 shadow-2xl backdrop-blur-xl flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            {/* Google Avatar */}
            <div className="relative">
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.name || 'User'}
                  width={80}
                  height={80}
                  className="size-20 rounded-2xl object-cover border-2 border-primary/50 shadow-lg shadow-primary/20"
                />
              ) : (
                <div className="size-20 rounded-2xl bg-zinc-800 border-2 border-primary/50 flex items-center justify-center text-xl font-bold text-white">
                  {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 size-6 rounded-full bg-emerald-500 border-2 border-zinc-950 flex items-center justify-center text-white" title="Google Verified">
                <ShieldCheck className="size-3.5" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-white">{user.name || 'Creator'}</h1>
                <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400">
                  Google Account
                </span>
              </div>
              <p className="text-sm text-zinc-400">{user.email}</p>
              <p className="text-xs text-zinc-400 pt-1">
                Linked Streams: <span className="font-semibold text-white">{userSites.length}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {userSites.length > 0 && (
              <ProfileShareHeader
                email={user.email}
                firstSlug={userSites[0].slug}
              />
            )}
            <Link
              href="/#create"
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-primary to-red-600 hover:from-primary/95 hover:to-red-500 text-white font-bold text-xs sm:text-sm px-4 py-2.5 shadow-lg shadow-primary/30 transition-all"
            >
              <Plus className="size-4" />
              <span>Create Another Stream</span>
            </Link>
          </div>
        </div>

        {/* My Streams Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                <span>Your Memory Streams</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/10 text-zinc-300">
                  {userSites.length}
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400">
                Manage, edit, or launch your published personalized Netflix reels.
              </p>
            </div>
          </div>

          {userSites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {userSites.map((site) => {
                const daysRemaining = site.expiresAt
                  ? Math.max(0, Math.ceil((new Date(site.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
                  : 365

                const planName =
                  site.plan === 'vip'
                    ? 'VIP Box Set'
                    : site.plan === 'mini'
                    ? 'Mini Reel'
                    : 'Premier Blockbuster'

                return (
                  <div
                    key={site.slug}
                    className="rounded-2xl border border-white/10 bg-zinc-950/60 p-5 space-y-4 hover:border-white/20 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-primary/15 border border-primary/30 px-2.5 py-0.5 text-[10px] font-bold text-primary uppercase tracking-wider">
                          {planName}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                          <Clock className="size-3 text-amber-400" />
                          <span>{daysRemaining} days left</span>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                          {site.brandName || site.slug}
                        </h3>
                        <p className="text-xs text-primary font-mono mt-0.5">/{site.slug}</p>
                      </div>

                      <div className="grid grid-cols-3 gap-2 pt-1 border-t border-white/5 text-center text-xs">
                        <div className="rounded-lg bg-white/[0.02] p-2 border border-white/5">
                          <p className="text-[10px] text-zinc-400">Rows</p>
                          <p className="font-bold text-white mt-0.5">{site.categories?.length || 0}</p>
                        </div>
                        <div className="rounded-lg bg-white/[0.02] p-2 border border-white/5">
                          <p className="text-[10px] text-zinc-400">Photos</p>
                          <p className="font-bold text-white mt-0.5">
                            {site.mediaItems?.filter((m) => m.type !== 'video').length || 0}
                          </p>
                        </div>
                        <div className="rounded-lg bg-white/[0.02] p-2 border border-white/5">
                          <p className="text-[10px] text-zinc-400">Videos</p>
                          <p className="font-bold text-white mt-0.5">
                            {site.mediaItems?.filter((m) => m.type === 'video').length || 0}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="pt-2 border-t border-white/10 flex items-center gap-2">
                      <Link
                        href={`/${site.slug}?viewer=true`}
                        title="Experience stream as a recipient/guest viewer"
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs py-2.5 transition-all"
                      >
                        <ExternalLink className="size-3.5" />
                        <span>View as Guest</span>
                      </Link>

                      <Link
                        href={`/${site.slug}?creator=true`}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs py-2.5 transition-all shadow-md shadow-primary/20"
                      >
                        <Edit3 className="size-3.5" />
                        <span>Edit Studio</span>
                      </Link>

                      <ProfileClientActions slug={site.slug} title={site.brandName || site.slug} />
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-white/15 bg-zinc-950/40 p-10 sm:p-14 text-center space-y-4">
              <div className="size-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-zinc-400">
                <Tv className="size-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg sm:text-xl font-bold text-white">No Streams Created Yet</h3>
                <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
                  You haven&apos;t created any memory streams with this Google account yet. Choose a plan to launch your first stream in minutes.
                </p>
              </div>
              <Link
                href="/#create"
                className="inline-flex items-center gap-2 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-sm px-5 py-3 shadow-xl shadow-primary/30 transition-all hover:scale-105 active:scale-95"
              >
                <Sparkles className="size-4 text-amber-300" />
                <span>Create Your First Stream</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
