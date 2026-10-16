import Stripe from 'stripe'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder'

export const stripe = new Stripe(stripeSecretKey, {
  typescript: true,
})

export const PLAN_PRICING = {
  mini: {
    amountInPaise: 4900, // ₹49
    name: 'MyFlix Mini Reel (1 Year, 2 Rows, 20 Photos, 1 Clip)',
    priceFormatted: '₹49/yr',
  },
  premier: {
    amountInPaise: 9900, // ₹99
    name: 'MyFlix Premier Blockbuster (1 Year, 4 Rows, 45 Photos, 5 Clips)',
    priceFormatted: '₹99/yr',
  },
  vip: {
    amountInPaise: 19900, // ₹199
    name: 'MyFlix VIP Box Set (1 Year, 8 Rows, 100 Photos, 15 Clips)',
    priceFormatted: '₹199/yr',
  },
} as const

export type PlanKey = keyof typeof PLAN_PRICING
