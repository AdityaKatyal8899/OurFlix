import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { connectToDatabase } from '@/lib/mongodb'
import { Site } from '@/models/Site'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  let event: Stripe.Event

  try {
    if (webhookSecret && signature) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } else {
      // In sandbox/development when webhook secret is not configured
      event = JSON.parse(body) as Stripe.Event
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Invalid webhook signature'
    console.error('Stripe webhook verification failed:', message)
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 })
  }

  // Handle successful checkout
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const slug = session.metadata?.slug
    const plan = session.metadata?.plan || 'premier'
    const transactionId =
      typeof session.payment_intent === 'string'
        ? session.payment_intent
        : session.id

    if (slug) {
      await connectToDatabase()
      await Site.findOneAndUpdate(
        { slug: slug.toLowerCase() },
        {
          $set: {
            isPaid: true,
            plan,
            transactionId,
            stripeSessionId: session.id,
            paidAt: new Date(),
          },
        },
        { new: true }
      )
      console.log(`Payment confirmed for "${slug}". Transaction ID: ${transactionId}, Plan: ${plan}`)
    }
  }

  return NextResponse.json({ received: true })
}
