import { redirect } from 'next/navigation'
import { getCashfreeOrder } from '@/lib/cashfree'
import { stripe } from '@/lib/stripe'
import { connectToDatabase } from '@/lib/mongodb'
import { Site } from '@/models/Site'
import { slugBloomFilter } from '@/lib/bloom-filter'

export const dynamic = 'force-dynamic'

interface CallbackProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function PaymentCallbackPage({ searchParams }: CallbackProps) {
  const params = await searchParams
  const orderId = typeof params.order_id === 'string' ? params.order_id : undefined
  const sessionId = typeof params.session_id === 'string' ? params.session_id : undefined
  const rawSlug = typeof params.slug === 'string' ? params.slug : undefined

  // 1. Handle Cashfree Return
  if (orderId) {
    try {
      const cfOrder = await getCashfreeOrder(orderId)
      const slug = (cfOrder.order_tags?.slug || rawSlug || '').toLowerCase().trim()

      if (cfOrder.order_status === 'PAID') {
        const transactionId = cfOrder.cf_order_id || cfOrder.order_id
        const plan = (cfOrder.order_tags?.plan as 'mini' | 'premier' | 'vip') || 'premier'

        if (slug) {
          await connectToDatabase()
          await Site.findOneAndUpdate(
            { slug },
            {
              $set: {
                isPaid: true,
                plan,
                transactionId,
                cashfreeOrderId: cfOrder.order_id,
                paidAt: new Date(),
                paymentProvider: 'cashfree',
              },
            },
            { new: true }
          )
          slugBloomFilter.add(slug)
        }

        redirect(
          `/payment/success?slug=${encodeURIComponent(slug)}&order_id=${encodeURIComponent(
            orderId
          )}&amount=${encodeURIComponent(cfOrder.order_amount.toString())}`
        )
      } else {
        redirect(
          `/payment/failed?slug=${encodeURIComponent(slug)}&order_id=${encodeURIComponent(
            orderId
          )}&status=${encodeURIComponent(cfOrder.order_status)}`
        )
      }
    } catch (err: unknown) {
      // Check if it's a Next.js redirect exception
      if (err instanceof Error && err.message.includes('NEXT_REDIRECT')) {
        throw err
      }
      console.error('Error verifying Cashfree order in callback:', err)
      redirect(
        `/payment/failed?slug=${encodeURIComponent(rawSlug || '')}&order_id=${encodeURIComponent(
          orderId
        )}&status=ERROR`
      )
    }
  }

  // 2. Handle Stripe Return
  if (sessionId) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId)
      const slug = (session.metadata?.slug || rawSlug || '').toLowerCase().trim()

      if (session.payment_status === 'paid') {
        const transactionId =
          typeof session.payment_intent === 'string'
            ? session.payment_intent
            : session.id
        const plan = (session.metadata?.plan as 'mini' | 'premier' | 'vip') || 'premier'

        if (slug) {
          await connectToDatabase()
          await Site.findOneAndUpdate(
            { slug },
            {
              $set: {
                isPaid: true,
                plan,
                transactionId,
                stripeSessionId: session.id,
                paidAt: new Date(),
                paymentProvider: 'stripe',
              },
            },
            { new: true }
          )
          slugBloomFilter.add(slug)
        }

        const amount = session.amount_total ? (session.amount_total / 100).toString() : '99'
        redirect(
          `/payment/success?slug=${encodeURIComponent(slug)}&session_id=${encodeURIComponent(
            sessionId
          )}&amount=${encodeURIComponent(amount)}`
        )
      } else {
        redirect(
          `/payment/failed?slug=${encodeURIComponent(slug)}&session_id=${encodeURIComponent(
            sessionId
          )}`
        )
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes('NEXT_REDIRECT')) {
        throw err
      }
      console.error('Error verifying Stripe session in callback:', err)
      redirect(`/payment/failed?slug=${encodeURIComponent(rawSlug || '')}&status=ERROR`)
    }
  }

  // Fallback to home if no order or session ID
  redirect('/')
}
